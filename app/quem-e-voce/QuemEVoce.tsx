"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { characters, questions, scoreQuiz, type QuizResult } from "./quiz";
import "./quiz.css";

type Phase = "intro" | "questions" | "revealing" | "result";
type Stored = { version: 1; phase: "intro" | "questions" | "result"; answers: (number | null)[]; step: number; result: QuizResult | null };
const STORAGE_KEY = "a-lei-do-amor:quem-e-voce:v1";
const emptyAnswers = () => Array<number | null>(questions.length).fill(null);

export default function QuemEVoce() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<(number | null)[]>(emptyAnswers);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [shareMessage, setShareMessage] = useState("");
  const [ready, setReady] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const restoreTimer = setTimeout(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") as Stored | null;
      if (saved?.version === 1 && Array.isArray(saved.answers) && saved.answers.length === questions.length &&
        saved.answers.every((answer) => answer === null || (Number.isInteger(answer) && answer >= 0 && answer <= 3))) {
        setAnswers(saved.answers);
        if (saved.phase === "result" && saved.result && characters.some((person) => person.id === saved.result?.characterId) &&
          saved.answers.every((answer) => answer !== null)) {
          // Recalcular impede que dados locais antigos ou alterados mostrem um resultado incoerente.
          const fresh = scoreQuiz(saved.answers as number[]);
          setResult({ characterId: fresh.characterId, percentage: fresh.percentage, completedAt: saved.result.completedAt });
          setPhase("result");
        } else if (saved.phase === "questions") {
          const firstMissing = saved.answers.findIndex((answer) => answer === null);
          setStep(firstMissing < 0 ? questions.length - 1 : Math.min(Math.max(0, saved.step || 0), firstMissing));
          setPhase("questions");
        }
      }
    } catch { /* Armazenamento desabilitado: quiz continua normalmente. */ }
    setReady(true);
    }, 0);
    return () => {
      clearTimeout(restoreTimer);
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      if (revealTimer.current) clearTimeout(revealTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!ready || phase === "revealing") return;
    try {
      const stored: Stored = { version: 1, phase, answers, step, result };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch { /* Armazenamento é opcional. */ }
  }, [answers, phase, ready, result, step]);

  function restart() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (revealTimer.current) clearTimeout(revealTimer.current);
    setAnswers(emptyAnswers());
    setStep(0);
    setResult(null);
    setSelected(null);
    setShareMessage("");
    setPhase("questions");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function answer(option: number) {
    if (selected !== null) return;
    const next = [...answers];
    next[step] = option;
    setAnswers(next);
    setSelected(option);
    advanceTimer.current = setTimeout(() => {
      setSelected(null);
      if (step < questions.length - 1) {
        setStep(step + 1);
      } else {
        const finished = scoreQuiz(next as number[]);
        setResult({ characterId: finished.characterId, percentage: finished.percentage, completedAt: finished.completedAt });
        setPhase("revealing");
        revealTimer.current = setTimeout(() => setPhase("result"), 850);
      }
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 320);
  }

  function back() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setSelected(null);
    setStep((current) => Math.max(0, current - 1));
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  async function share(name: string) {
    const message = `Fiz o teste Quem É Você? de A Lei do Amor e meu personagem é ${name}! ❤️`;
    const data = { title: "Quem É Você? · A Lei do Amor", text: message, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(data);
        setShareMessage("");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${message} ${data.url}`);
        setShareMessage("Resultado copiado para compartilhar!");
      } else {
        setShareMessage(message);
      }
    } catch (error) {
      if ((error as DOMException).name !== "AbortError") setShareMessage(message);
    }
  }

  const person = result && characters.find((character) => character.id === result.characterId);
  const completed = person && answers.every((answer) => answer !== null)
    ? scoreQuiz(answers as number[])
    : null;

  return (
    <section className="section-page quiz-page" aria-labelledby="quiz-title">
      <header className="section-heading quiz-heading">
        <div className="section-index">07</div>
        <div>
          <p className="section-kicker">Um encontro com você mesmo</p>
          <h1 id="quiz-title">Quem é você<span>?</span></h1>
        </div>
        <p className="section-description">Qual personagem de A Lei do Amor mais combina com você?</p>
      </header>

      {!ready ? <div className="quiz-loading" role="status">Abrindo o quiz…</div> : (
        <div className="quiz-frame">
          {phase === "intro" && (
            <div className="quiz-intro quiz-animate">
              <span className="quiz-ornament" aria-hidden="true">✦</span>
              <p className="quiz-eyebrow">A LEI DO AMOR · UM TESTE DE PERSONALIDADE</p>
              <h2>Uma história.<br /><em>Quinze maneiras de viver.</em></h2>
              <p>Todo mundo tem um pouco de alguém de A Lei do Amor… Descubra qual personagem mais combina com a sua personalidade.</p>
              <button className="quiz-primary" type="button" onClick={restart}>COMEÇAR O QUIZ <span aria-hidden="true">↗</span></button>
              <small>10 perguntas <span aria-hidden="true">•</span> aproximadamente 2 minutos</small>
            </div>
          )}

          {phase === "questions" && (
            <div className="quiz-question quiz-animate" key={step}>
              <div className="quiz-progress-top"><span>Pergunta {step + 1} de {questions.length}</span><span>{String(step + 1).padStart(2, "0")} / 10</span></div>
              <div className="quiz-progress" role="progressbar" aria-label="Progresso do quiz" aria-valuenow={step + 1} aria-valuemin={0} aria-valuemax={10}>
                <span style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
              </div>
              <p className="quiz-eyebrow">ESCOLHA O QUE MAIS COMBINA COM VOCÊ</p>
              <h2>{questions[step].title}</h2>
              <div className="quiz-options">
                {questions[step].options.map((option, index) => (
                  <button className={`quiz-option${selected === index || (selected === null && answers[step] === index) ? " quiz-option--selected" : ""}`}
                    type="button" key={index} disabled={selected !== null} aria-pressed={selected === index || (selected === null && answers[step] === index)} onClick={() => answer(index)}>
                    <span>{"ABCD"[index]}</span><span>{option.text}</span><i aria-hidden="true">↗</i>
                  </button>
                ))}
              </div>
              {step > 0 && <button className="quiz-back" type="button" onClick={back}>← Voltar à pergunta anterior</button>}
            </div>
          )}

          {phase === "revealing" && <div className="quiz-revealing" role="status"><span aria-hidden="true">✦</span><p>Descobrindo quem você seria em A Lei do Amor…</p></div>}

          {phase === "result" && person && result && completed && (
            <div className="quiz-result quiz-animate">
              <div className="quiz-result-portrait">
                <Image src={person.image} alt={`Retrato de ${person.name}`} fill sizes="(max-width: 700px) 100vw, 420px" unoptimized className="quiz-result-photo" />
                <span className="quiz-result-stamp">A LEI DO AMOR <span aria-hidden="true">✦</span> QUEM É VOCÊ?</span>
              </div>
              <div className="quiz-result-content">
                <p className="quiz-eyebrow">O SEU RESULTADO</p>
                <span className="quiz-result-pretitle">VOCÊ É…</span>
                <h2>{person.name}</h2>
                <div className="quiz-percentage"><strong>{result.percentage}%</strong><span>de compatibilidade</span></div>
                <p>{person.portrait}</p>
                <p>Nas suas respostas, você mostra que {questions[completed.bestQuestions[0]].options[answers[completed.bestQuestions[0]]!].insight} e que {questions[completed.bestQuestions[1]].options[answers[completed.bestQuestions[1]]!].insight}. É essa mistura de escolhas que aproxima seu jeito do de {person.name}.</p>
                <div className="quiz-tags" aria-label="Características">{person.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="quiz-result-actions">
                  <button type="button" className="quiz-primary" onClick={restart}>REFAZER QUIZ <span aria-hidden="true">↗</span></button>
                  <button type="button" className="quiz-secondary" onClick={() => share(person.name)}>COMPARTILHAR RESULTADO</button>
                </div>
                {shareMessage && <p className="quiz-share-message" role="status">{shareMessage}</p>}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
