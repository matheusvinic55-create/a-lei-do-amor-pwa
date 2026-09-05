"use client";

import Image from "next/image";
import { useEffect, useReducer, useRef } from "react";
import CrystalBall from "./CrystalBall";
import { deck, interpret, mileideAdvice, shuffleDeck, spreads, type SpreadId, type TarotCardData } from "./deck";
import "./mileide.css";

type Phase = "welcome" | "prepare" | "shuffling" | "choosing" | "selected" | "loading" | "revealing" | "result" | "error";
type State = { phase: Phase; spread: SpreadId; shuffled: TarotCardData[]; selected: TarotCardData[]; revealed: number };
type Action = { type: "reset" } | { type: "spread"; spread: SpreadId } | { type: "shuffle"; cards: TarotCardData[] } | { type: "shuffled" } | { type: "pick"; card: TarotCardData } | { type: "load" } | { type: "loaded" } | { type: "error" } | { type: "reveal" };
const initial: State = { phase: "welcome", spread: "day", shuffled: [], selected: [], revealed: 0 };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "reset": return initial;
    case "spread": return state.phase === "welcome" ? { ...initial, spread: action.spread, phase: "prepare" } : state;
    case "shuffle": return ["prepare", "choosing"].includes(state.phase) ? { ...state, phase: "shuffling", shuffled: action.cards, selected: [], revealed: 0 } : state;
    case "shuffled": return state.phase === "shuffling" ? { ...state, phase: "choosing" } : state;
    case "pick": {
      if (state.phase !== "choosing" || state.selected.some(card => card.id === action.card.id)) return state;
      const selected = [...state.selected, action.card];
      const count = spreads.find(spread => spread.id === state.spread)!.positions.length;
      return { ...state, selected, phase: selected.length === count ? "selected" : "choosing" };
    }
    case "load": return ["selected", "error"].includes(state.phase) ? { ...state, phase: "loading" } : state;
    case "loaded": return state.phase === "loading" ? { ...state, phase: "revealing" } : state;
    case "error": return state.phase === "loading" ? { ...state, phase: "error" } : state;
    case "reveal": {
      if (state.phase !== "revealing") return state;
      const revealed = Math.min(state.revealed + 1, state.selected.length);
      return { ...state, revealed, phase: revealed === state.selected.length ? "result" : "revealing" };
    }
  }
}

function Moon({ triple = false }: { triple?: boolean }) {
  return <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
    {triple ? <><rect x="2" y="8" width="9" height="17" rx="1.5" transform="rotate(-12 2 8)" stroke="currentColor"/><rect x="12" y="5" width="9" height="20" rx="1.5" stroke="currentColor"/><rect x="23" y="8" width="8" height="17" rx="1.5" transform="rotate(12 23 8)" stroke="currentColor"/></> : <><path d="M23.5 22A11 11 0 0 1 13 5a11 11 0 1 0 10.5 17Z" stroke="currentColor"/><path d="m24 4 1.3 3.7L29 9l-3.7 1.3L24 14l-1.3-3.7L19 9l3.7-1.3Z" stroke="currentColor"/></>}
  </svg>;
}

function SpreadSelector({ onSelect }: { onSelect: (spread: SpreadId) => void }) {
  return <div className="mileide-spreads">
    {spreads.map((spread, index) => <button className="mileide-spread" type="button" key={spread.id} onClick={() => onSelect(spread.id)}>
      <span className="mileide-spread-symbol"><Moon triple={index !== 0}/></span>
      <span><small>{spread.positions.length === 1 ? "UMA CARTA" : "TRÊS CARTAS"}</small><strong>{spread.name}</strong><span>{spread.subtitle}</span></span>
      <span className="mileide-spread-arrow" aria-hidden="true">→</span>
    </button>)}
  </div>;
}

function TarotCard({ card, revealed }: { card: TarotCardData; revealed: boolean }) {
  return <div className={`mileide-card${revealed ? " mileide-card--revealed" : ""}`}>
    {revealed ? <Image key="front" className="mileide-card-front" src={card.image} width={480} height={855} alt={`${card.numeral} — ${card.name}, Tarô de Marselha`} unoptimized /> : <Image key="back" src="/mileide/card-back.svg" width={240} height={440} alt="Carta ainda fechada" unoptimized />}
  </div>;
}

function ReadingResult({ state }: { state: State }) {
  const spread = spreads.find(item => item.id === state.spread)!;
  return <div className="mileide-reading">
    {state.selected.map((card, index) => {
      const revealed = index < state.revealed;
      return <article className={`mileide-reading-card${revealed ? " mileide-reading-card--open" : ""}`} key={card.id}>
        <p className="mileide-position">{spread.positions[index]}</p>
        <TarotCard card={card} revealed={revealed}/>
        {revealed && <div className="mileide-card-copy">
          <span className="mileide-card-number">{card.number === null ? "Arcano sem número" : `Arcano ${card.numeral}`}</span>
          <h3>{card.name}</h3><p className="mileide-meaning">{card.meaning}</p>
          <p>{interpret(card, state.spread, index)}</p>
        </div>}
      </article>;
    })}
    {state.phase === "result" && state.spread === "advice" && <aside className="mileide-advice">
      <Moon/><p className="mileide-kicker">As cartas conversam</p><h3>Conselho da Mileide</h3><p>{mileideAdvice(state.selected)}</p><span className="mileide-signature">Com carinho, Mileide</span>
    </aside>}
  </div>;
}

export default function CasaMileide() {
  const [state, dispatch] = useReducer(reducer, initial);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const spread = spreads.find(item => item.id === state.spread)!;
  const busy = ["shuffling", "loading", "revealing"].includes(state.phase);
  const hasReading = ["selected", "loading", "revealing", "result", "error"].includes(state.phase);
  const remaining = spread.positions.length - state.selected.length;

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    if (!["welcome", "prepare", "choosing", "selected"].includes(state.phase)) return;
    const timer = window.setTimeout(() => {
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }, 30);
    return () => window.clearTimeout(timer);
  }, [state.phase]);

  useEffect(() => {
    if (state.phase !== "shuffling" && state.phase !== "revealing") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => dispatch({ type: state.phase === "shuffling" ? "shuffled" : "reveal" }), reduced ? 30 : state.phase === "shuffling" ? 850 : 650);
    return () => window.clearTimeout(timer);
  }, [state.phase, state.revealed]);

  useEffect(() => {
    if (state.phase !== "loading") return;
    let cancelled = false;
    const images: HTMLImageElement[] = [];
    const timeout = window.setTimeout(() => { if (!cancelled) dispatch({ type: "error" }); }, 15000);
    Promise.all(state.selected.map(card => new Promise<void>((resolve, reject) => {
      const image = new window.Image();
      images.push(image);
      image.onload = () => image.naturalWidth > 0 ? resolve() : reject(new Error("Empty image"));
      image.onerror = () => reject(new Error("Card unavailable"));
      image.src = card.image;
    }))).then(() => { if (!cancelled) dispatch({ type: "loaded" }); }).catch(() => { if (!cancelled) dispatch({ type: "error" }); });
    return () => { cancelled = true; window.clearTimeout(timeout); images.forEach(image => { image.onload = null; image.onerror = null; }); };
  }, [state.phase, state.selected]);

  const shuffle = () => dispatch({ type: "shuffle", cards: shuffleDeck() });
  const title = state.phase === "welcome" ? "A mesa está à sua espera" : spread.name;
  const status = state.phase === "choosing" ? `Escolha ${remaining} ${remaining === 1 ? "carta" : "cartas"}.` : state.phase === "shuffling" ? "Embaralhando… Respire e concentre-se." : state.phase === "loading" ? "Preparando suas cartas…" : state.phase === "revealing" ? `Revelando carta ${state.revealed + 1} de ${state.selected.length}…` : state.phase === "selected" ? "Suas cartas estão sobre a mesa." : state.phase === "result" ? "Sua leitura está completa." : "";

  return <section className="mileide-house" aria-labelledby="mileide-title">
    <div className="mileide-dust" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ left: `${9 + i * 10}%`, top: `${110 + (i * 71) % 460}px`, animationDelay: `${i * -.8}s` }}/>)}</div>
    <header className="mileide-welcome">
      <p className="mileide-kicker">Uma porta se abre em São Dimas</p>
      <h1 id="mileide-title"><span>Casa da</span> Mileide</h1>
      <p>Entre, concentre-se e escolha sua tiragem.</p>
    </header>
    <CrystalBall active={busy || state.phase === "selected"}/>
    <div className="mileide-host"><Image src="/cast/mileide-rocha.jpg" alt="Mileide" width={40} height={40} unoptimized/><p>“Sente-se, meu bem.<br/><em>Vamos ouvir o que as cartas têm a dizer.”</em></p></div>

    <section className={`mileide-table${busy ? " mileide-table--active" : ""}`} aria-labelledby="mileide-table-title">
      <div className="mileide-table-ornament" aria-hidden="true"><span/><Moon/><span/></div>
      <p className="mileide-kicker">Tarô de Marselha</p>
      <h2 id="mileide-table-title" ref={headingRef} tabIndex={-1}>{title}</h2>
      {state.phase === "welcome" && <><p className="mileide-table-intro">Um instante de silêncio. Um espaço para você.</p><SpreadSelector onSelect={spread => dispatch({ type: "spread", spread })}/></>}

      {["prepare", "shuffling"].includes(state.phase) && <div className="mileide-ritual">
        <p>Pense no que deseja acolher nesta consulta.</p>
        <div className={`mileide-deck${state.phase === "shuffling" ? " mileide-deck--shuffling" : ""}`} aria-hidden="true">
          {[0,1,2].map(i => <Image key={i} src="/mileide/card-back.svg" width={240} height={440} alt="" unoptimized/>)}
        </div>
        <button className="mileide-button" type="button" disabled={busy} onClick={shuffle}>{busy ? "Embaralhando…" : "Embaralhar"}<span aria-hidden="true">✧</span></button>
      </div>}

      <p className="mileide-status" role="status" aria-live="polite" aria-atomic="true">{status}</p>

      {state.phase === "choosing" && <>
        <p className="mileide-pick-hint">Toque nas cartas que chamarem sua atenção.</p>
        <div className="mileide-card-grid" role="group" aria-label={`Escolha ${spread.positions.length} cartas fechadas`}>
          {state.shuffled.map((card, index) => {
            const selectedIndex = state.selected.findIndex(item => item.id === card.id);
            const selected = selectedIndex >= 0;
            return <button key={card.id} type="button" className={`mileide-pick${selected ? " mileide-pick--selected" : ""}`} aria-label={selected ? `Carta ${index + 1} selecionada para ${spread.positions[selectedIndex]}` : `Escolher carta fechada ${index + 1}`} aria-pressed={selected} aria-disabled={selected} onClick={() => dispatch({ type: "pick", card })}>
              <Image src="/mileide/card-back.svg" width={240} height={440} alt="" unoptimized/>
              {selected && <span className="mileide-pick-order" aria-hidden="true">{selectedIndex + 1}</span>}
            </button>;
          })}
        </div>
        <button className="mileide-text-button" type="button" onClick={shuffle}>Embaralhar novamente</button>
      </>}

      {hasReading && <>
        {state.phase === "selected" && <button className="mileide-button" type="button" onClick={() => dispatch({ type: "load" })}>Revelar {state.selected.length === 1 ? "minha carta" : "minhas cartas"}<span aria-hidden="true">✧</span></button>}
        {state.phase === "error" && <div className="mileide-error" role="alert"><p>Não consegui abrir as imagens agora. Suas escolhas continuam guardadas nesta mesa.</p><button className="mileide-button" type="button" onClick={() => dispatch({ type: "load" })}>Tentar novamente</button></div>}
        <ReadingResult state={state}/>
      </>}

      {state.phase === "result" && <div className="mileide-finish"><p>As cartas oferecem símbolos.<br/>Seu caminho permanece aberto.</p><button className="mileide-button" type="button" onClick={() => dispatch({ type: "reset" })}>Nova tiragem<span aria-hidden="true">↺</span></button></div>}
      {state.phase !== "welcome" && state.phase !== "result" && <button className="mileide-text-button" type="button" onClick={() => dispatch({ type: "reset" })}>Escolher outra tiragem</button>}
      <p className="mileide-table-footnote">{deck.length} Arcanos Maiores · Uma leitura simbólica</p>
    </section>
    <details className="mileide-credits"><summary>Sobre este baralho</summary><p>Tarô de Marselha de Nicolas Conver (1760), reprodução de Tarot World Project / Reality Publishing (2020). Ilustrações preservadas com seus nomes originais; leitura em português. O Louco não tem número e o arcano XIII é apresentado como Arcano sem Nome. Nesta mesa, as cartas são lidas na posição normal.</p><p>Imagens de Tarot World Project, disponíveis no <a href="https://commons.wikimedia.org/wiki/Category:Tarot_de_Marseille_-_Nicolas_Conver_1760" target="_blank" rel="noreferrer">Wikimedia Commons</a>, sob <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>. Redimensionadas e convertidas para WebP, mantidas sob a mesma licença. <a href="/mileide/cards/sources.json" target="_blank" rel="noreferrer">Fontes de cada carta</a>. Textos de reflexão e verso criados para a Casa da Mileide.</p></details>
  </section>;
}
