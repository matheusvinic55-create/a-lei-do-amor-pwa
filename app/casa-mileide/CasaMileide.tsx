"use client";

import Image from "next/image";
import { type CSSProperties, type PointerEvent as ReactPointerEvent, useCallback, useEffect, useReducer, useRef, useState } from "react";
import PortalScene, { type Journey } from "./PortalScene";
import { deck, interpret, mileideAdvice, shuffleDeck, spreads, type SpreadId, type TarotCardData } from "./deck";
import "./mileide.css";
import "./portal.css";

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
  return <div className="mileide-table-choices" role="group" aria-label="Escolha sua tiragem">
    {spreads.map((spread, index) => <button className="mileide-table-choice" type="button" key={spread.id} onClick={() => onSelect(spread.id)} aria-label={`${spread.name}. ${spread.subtitle}`}>
      <span className="mileide-choice-deck" aria-hidden="true"><i/><i/><span><Moon triple={index !== 0}/></span></span>
      <span className="mileide-choice-name">{spread.name}</span>
      <small>{spread.positions.length === 1 ? "UMA CARTA" : "TRÊS CARTAS"}</small>
    </button>)}
  </div>;
}

function TarotCard({ card, revealed }: { card: TarotCardData; revealed: boolean }) {
  return <div className={`mileide-card${revealed ? " mileide-card--revealed" : ""}`}>
    {revealed ? <Image key="front" className="mileide-card-front" src={card.image} width={480} height={855} alt={`${card.numeral} — ${card.name}, Tarô de Marselha`} unoptimized /> : <Image key="back" src="/mileide/card-back.svg" width={240} height={440} alt="Carta ainda fechada" unoptimized />}
  </div>;
}

function CardSwiper({ cards, selected, count, onPick, onReshuffle }: { cards: TarotCardData[]; selected: number; count: number; onPick: (card: TarotCardData) => void; onReshuffle: () => void }) {
  const [queue, setQueue] = useState(cards);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [leaving, setLeaving] = useState<"left" | "right" | null>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const timer = useRef<number | null>(null);
  const active = queue[0];

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const finish = useCallback((direction: "left" | "right") => {
    if (!active || leaving) return;
    setLeaving(direction);
    timer.current = window.setTimeout(() => {
      if (direction === "right") {
        onPick(active);
        setQueue(current => current.slice(1));
      } else {
        setQueue(current => current.length > 1 ? [...current.slice(1), current[0]] : current);
      }
      setDrag({ x: 0, y: 0 });
      setLeaving(null);
      timer.current = null;
    }, 240);
  }, [active, leaving, onPick]);

  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (leaving) return;
    origin.current = { x: event.clientX, y: event.clientY };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const pointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!origin.current || leaving) return;
    setDrag({ x: event.clientX - origin.current.x, y: event.clientY - origin.current.y });
  };

  const pointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!origin.current) return;
    origin.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (drag.x >= 72) finish("right");
    else if (drag.x <= -72) finish("left");
    else setDrag({ x: 0, y: 0 });
  };

  if (!active) return null;
  const style = {
    "--swipe-x": `${drag.x}px`,
    "--swipe-y": `${drag.y * .22}px`,
    "--swipe-rotate": `${drag.x / 24}deg`,
    "--choose-opacity": Math.min(Math.max(drag.x / 85, 0), 1),
    "--pass-opacity": Math.min(Math.max(-drag.x / 85, 0), 1),
  } as CSSProperties;

  return <div className="mileide-swipe-picker">
    <div className="mileide-swipe-toolbar">
      <div className="mileide-choice-progress" aria-label={`${selected} cartas escolhidas`}>
        {Array.from({ length: count }, (_, index) => <span key={index} className={index < selected ? "is-filled" : index === selected ? "is-current" : ""} aria-hidden="true">{index < selected ? "✓" : index + 1}</span>)}
      </div>
      <button className="mileide-reshuffle" type="button" onClick={onReshuffle} aria-label="Embaralhar novamente"><span aria-hidden="true">↻</span></button>
    </div>
    <div className="mileide-swipe-stage" aria-live="polite">
      {queue.slice(1, 3).reverse().map((card, index) => <div className={`mileide-swipe-card mileide-swipe-card--behind mileide-swipe-card--${2 - index}`} key={card.id} aria-hidden="true">
        <Image src="/mileide/card-back.svg" width={240} height={440} alt="" unoptimized draggable={false}/>
      </div>)}
      <div
        className={`mileide-swipe-card mileide-swipe-card--active${dragging ? " is-dragging" : ""}${leaving ? ` is-leaving-${leaving}` : ""}`}
        style={style}
        role="button"
        tabIndex={0}
        aria-label="Carta fechada. Arraste para a direita para escolher ou para a esquerda para passar."
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerEnd}
        onPointerCancel={pointerEnd}
        onKeyDown={event => {
          if (event.key === "ArrowLeft") finish("left");
          if (["ArrowRight", "Enter", " "].includes(event.key)) { event.preventDefault(); finish("right"); }
        }}
      >
        <Image src="/mileide/card-back.svg" width={240} height={440} alt="" unoptimized draggable={false}/>
        <span className="mileide-swipe-stamp mileide-swipe-stamp--pass" aria-hidden="true">PASSAR</span>
        <span className="mileide-swipe-stamp mileide-swipe-stamp--choose" aria-hidden="true">ESCOLHER</span>
      </div>
    </div>
    <div className="mileide-swipe-actions">
      <button type="button" className="mileide-swipe-action mileide-swipe-action--pass" onClick={() => finish("left")} aria-label="Passar esta carta"><span aria-hidden="true">←</span> Passar</button>
      <button type="button" className="mileide-swipe-action mileide-swipe-action--choose" onClick={() => finish("right")} aria-label="Escolher esta carta">Escolher <span aria-hidden="true">✦</span></button>
    </div>
  </div>;
}

function ReadingResult({ state }: { state: State }) {
  const spread = spreads.find(item => item.id === state.spread)!;
  const [page, setPage] = useState(0);
  const hasAdvice = state.spread === "advice";
  const pages = state.selected.length + (hasAdvice ? 1 : 0);
  const current = state.phase === "result" ? Math.min(page, pages - 1) : Math.max(0, state.revealed - 1);
  const adviceOpen = hasAdvice && current === state.selected.length;
  const card = state.selected[Math.min(current, state.selected.length - 1)];
  const revealed = current < state.revealed;

  return <div className="mileide-reading mileide-reading--compact">
    {state.phase === "result" && pages > 1 && <nav className="mileide-reading-tabs" aria-label="Partes da leitura">
      {state.selected.map((_, index) => <button key={spread.positions[index]} type="button" className={current === index ? "is-active" : ""} onClick={() => setPage(index)} aria-label={`Ver ${spread.positions[index]}`}>{index + 1}</button>)}
      {hasAdvice && <button type="button" className={adviceOpen ? "is-active" : ""} onClick={() => setPage(state.selected.length)} aria-label="Ver conselho da Mileide">✦</button>}
    </nav>}
    {adviceOpen ? <aside className="mileide-compact-advice">
      <Moon/><p className="mileide-kicker">As cartas conversam</p><h3>Conselho da Mileide</h3><p>{mileideAdvice(state.selected)}</p><span className="mileide-signature">Com carinho, Mileide</span>
    </aside> : card && <article className={`mileide-compact-reading${revealed ? " is-open" : ""}`}>
      <div className="mileide-compact-card">
        <p className="mileide-position">{spread.positions[current]}</p>
        <TarotCard card={card} revealed={revealed}/>
      </div>
      {revealed && <div className="mileide-card-copy">
        <span className="mileide-card-number">{card.number === null ? "Arcano sem número" : `Arcano ${card.numeral}`}</span>
        <h3>{card.name}</h3><p className="mileide-meaning">{card.meaning}</p>
        <p>{interpret(card, state.spread, current)}</p>
      </div>}
    </article>}
  </div>;
}

export default function CasaMileide() {
  const [state, dispatch] = useReducer(reducer, initial);
  const [journey, setJourney] = useState<Journey>("outside");
  const [ready, setReady] = useState(false);
  const [about, setAbout] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const roomHeadingRef = useRef<HTMLHeadingElement>(null);
  const enterRef = useRef<HTMLButtonElement>(null);
  const aboutRef = useRef<HTMLHeadingElement>(null);
  const readingRef = useRef<HTMLElement>(null);
  const roomRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const firstRender = useRef(true);
  const spread = spreads.find(item => item.id === state.spread)!;
  const busy = ["shuffling", "loading", "revealing"].includes(state.phase);
  const hasReading = ["selected", "loading", "revealing", "result", "error"].includes(state.phase);
  const remaining = spread.positions.length - state.selected.length;
  const panelOpen = state.phase !== "welcome" || about;
  const onReady = useCallback(() => setReady(true), []);
  const onArrive = useCallback(() => setJourney(current => current === "crossing" ? "inside" : current), []);
  const closePanel = useCallback(() => { setAbout(false); dispatch({ type: "reset" }); }, []);

  useEffect(() => {
    if (journey === "inside") roomHeadingRef.current?.focus({ preventScroll: true });
  }, [journey]);

  useEffect(() => {
    if (about) aboutRef.current?.focus({ preventScroll: true });
  }, [about]);

  useEffect(() => {
    if (panelOpen) return;
    openerRef.current?.focus({ preventScroll: true });
  }, [panelOpen]);

  useEffect(() => {
    if (!panelOpen) return;
    const escape = (event: KeyboardEvent) => {
      // The app menu owns Escape while its existing drawer is open.
      if (event.key === "Escape" && !document.querySelector('.menu-trigger[aria-expanded="true"]')) closePanel();
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [panelOpen, closePanel]);

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    if (!["welcome", "prepare", "choosing", "selected"].includes(state.phase)) return;
    const timer = window.setTimeout(() => {
      headingRef.current?.focus({ preventScroll: true });
      readingRef.current?.scrollTo({ top: 0, behavior: "instant" });
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
  const title = spread.name;
  const status = state.phase === "choosing" ? `Escolha ${remaining} ${remaining === 1 ? "carta" : "cartas"}.` : state.phase === "shuffling" ? "Embaralhando… Respire e concentre-se." : state.phase === "loading" ? "Preparando suas cartas…" : state.phase === "revealing" ? `Revelando carta ${state.revealed + 1} de ${state.selected.length}…` : state.phase === "selected" ? "Suas cartas estão sobre a mesa." : state.phase === "result" ? "Sua leitura está completa." : "";

  return <section ref={roomRef} className="mileide-house mileide-portal-house" data-journey={journey} data-panel={panelOpen || undefined} aria-labelledby="mileide-title">
    <PortalScene journey={journey} paused={panelOpen} active={busy || state.phase === "selected"} onReady={onReady} onArrive={onArrive}/>
    <header className="mileide-portal-heading">
      <h1 id="mileide-title"><span>Casa da</span> Mileide</h1>
    </header>

    {journey !== "inside" && <div className="mileide-threshold" inert={journey === "crossing"}>
      <button ref={enterRef} className="mileide-enter" type="button" disabled={!ready || journey === "crossing"} onClick={() => setJourney("crossing")}>
        <span>{!ready ? "Abrindo o portal…" : "Entrar na Casa"}</span>
      </button>
      <span className="mileide-threshold-note">Um encontro com as cartas</span>
    </div>}
    <p className="mileide-journey-status" role="status" aria-live="polite">{journey === "crossing" ? "Atravessando o portal…" : journey === "inside" ? "Você chegou à Casa da Mileide." : ready ? "O portal está à sua espera." : "Preparando a Casa da Mileide…"}</p>

    {journey === "inside" && <>
      <div className="mileide-room-welcome" hidden={panelOpen}>
        <h2 ref={roomHeadingRef} tabIndex={-1}>Sente-se, meu bem.</h2>
        <p>Vamos ouvir o que as cartas têm a dizer.</p>
      </div>
      <div className="mileide-room-options" hidden={panelOpen}>
        <p className="mileide-kicker">Toque em uma tiragem</p>
        <SpreadSelector onSelect={spread => { openerRef.current = document.activeElement as HTMLElement; dispatch({ type: "spread", spread }); }}/>
      </div>
      <nav className="mileide-room-tools" aria-label="Casa da Mileide" hidden={panelOpen}>
        <button type="button" onClick={() => { openerRef.current = null; setJourney("outside"); window.requestAnimationFrame(() => enterRef.current?.focus({ preventScroll: true })); }}><span aria-hidden="true">↶</span> Voltar ao portal</button>
        <button type="button" onClick={() => { openerRef.current = document.activeElement as HTMLElement; setAbout(true); }}><span aria-hidden="true">✧</span> Sobre este baralho</button>
      </nav>
    </>}

    {journey === "inside" && state.phase !== "welcome" && <section ref={readingRef} className={`mileide-table mileide-reading-surface${busy ? " mileide-table--active" : ""}`} aria-labelledby="mileide-table-title">
      <button className="mileide-close-reading" type="button" onClick={closePanel} aria-label="Fechar tiragem e voltar à mesa">×</button>
      <div className="mileide-table-ornament" aria-hidden="true"><span/><Moon/><span/></div>
      <p className="mileide-kicker">Tarô de Marselha</p>
      <h2 id="mileide-table-title" ref={headingRef} tabIndex={-1}>{title}</h2>

      {["prepare", "shuffling"].includes(state.phase) && <div className="mileide-ritual">
        <p>Pense no que deseja acolher nesta consulta.</p>
        <div className={`mileide-deck${state.phase === "shuffling" ? " mileide-deck--shuffling" : ""}`} aria-hidden="true">
          {[0,1,2].map(i => <Image key={i} src="/mileide/card-back.svg" width={240} height={440} alt="" unoptimized/>)}
        </div>
        <button className="mileide-button" type="button" disabled={busy} onClick={shuffle}>{busy ? "Embaralhando…" : "Embaralhar"}<span aria-hidden="true">✧</span></button>
      </div>}

      <p className="mileide-status" role="status" aria-live="polite" aria-atomic="true">{status}</p>

      {state.phase === "choosing" && <>
        <p className="mileide-pick-hint">Arraste: esquerda para passar, direita para escolher.</p>
        <CardSwiper key={state.shuffled.map(card => card.id).join("-")} cards={state.shuffled} selected={state.selected.length} count={spread.positions.length} onPick={card => dispatch({ type: "pick", card })} onReshuffle={shuffle}/>
      </>}

      {hasReading && <>
        {state.phase === "selected" && <button className="mileide-button" type="button" onClick={() => dispatch({ type: "load" })}>Revelar {state.selected.length === 1 ? "minha carta" : "minhas cartas"}<span aria-hidden="true">✧</span></button>}
        {state.phase === "error" && <div className="mileide-error" role="alert"><p>Não consegui abrir as imagens agora. Suas escolhas continuam guardadas nesta mesa.</p><button className="mileide-button" type="button" onClick={() => dispatch({ type: "load" })}>Tentar novamente</button></div>}
        {["loading", "revealing", "result"].includes(state.phase) && <ReadingResult state={state}/>}
      </>}

      {state.phase === "result" && <div className="mileide-finish mileide-finish--compact"><button className="mileide-button" type="button" onClick={() => dispatch({ type: "reset" })}>Nova tiragem<span aria-hidden="true">↺</span></button></div>}
      {!['result', 'choosing'].includes(state.phase) && <button className="mileide-text-button" type="button" onClick={closePanel}>Escolher outra tiragem</button>}
      <p className="mileide-table-footnote">{deck.length} Arcanos Maiores · Uma leitura simbólica</p>
    </section>}
    {journey === "inside" && about && <section className="mileide-credits mileide-reading-surface mileide-about-surface" aria-labelledby="mileide-about-title">
      <button className="mileide-close-reading" type="button" onClick={closePanel} aria-label="Fechar informações e voltar à mesa">×</button>
      <p className="mileide-kicker">As cartas desta casa</p><h2 id="mileide-about-title" ref={aboutRef} tabIndex={-1}>Sobre este baralho</h2>
      <p>Tarô de Marselha de Nicolas Conver (1760), reprodução de Tarot World Project / Reality Publishing (2020). Ilustrações preservadas com seus nomes originais; leitura em português. O Louco não tem número e o arcano XIII é apresentado como Arcano sem Nome. Nesta mesa, as cartas são lidas na posição normal.</p><p>Imagens de Tarot World Project, disponíveis no <a href="https://commons.wikimedia.org/wiki/Category:Tarot_de_Marseille_-_Nicolas_Conver_1760" target="_blank" rel="noreferrer">Wikimedia Commons</a>, sob <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>. Redimensionadas e convertidas para WebP, mantidas sob a mesma licença. <a href="/mileide/cards/sources.json" target="_blank" rel="noreferrer">Fontes de cada carta</a>. Textos de reflexão e verso criados para a Casa da Mileide.</p>
      <button className="mileide-text-button" type="button" onClick={closePanel}>Voltar à mesa</button>
    </section>}
  </section>;
}
