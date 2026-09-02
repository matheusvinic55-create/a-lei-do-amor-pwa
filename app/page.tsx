"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { mainCast, supportingCast, type CastMember } from "./cast";

type TabId = "inicio" | "sinopse" | "resumos" | "trilha" | "elenco";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const tabs: Array<{ id: TabId; label: string; index: string }> = [
  { id: "inicio", label: "Início", index: "01" },
  { id: "sinopse", label: "Sinopse", index: "02" },
  { id: "resumos", label: "Resumos", index: "03" },
  { id: "trilha", label: "Trilha sonora", index: "04" },
  { id: "elenco", label: "Elenco", index: "05" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("inicio");
  const [menuOpen, setMenuOpen] = useState(false);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const registerServiceWorker = () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js").catch(() => undefined);
      }
    };

    const captureInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("load", registerServiceWorker);
    window.addEventListener("beforeinstallprompt", captureInstallPrompt);

    return () => {
      window.removeEventListener("load", registerServiceWorker);
      window.removeEventListener("beforeinstallprompt", captureInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const selectTab = (tab: TabId) => {
    setActiveTab(tab);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const installApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <div className="app-shell">
      <div className="ambient-lights" aria-hidden="true" />

      <header className={activeTab === "inicio" ? "site-header" : "site-header site-header--inner"}>
        <div className="header-menu-brand">
          <button
            className="menu-trigger"
            type="button"
            ref={menuButtonRef}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-label="Abrir menu"
            onClick={() => setMenuOpen(true)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
          <strong className="header-menu-label">MENU</strong>
        </div>
      </header>

      {menuOpen && (
        <div className="menu-layer">
          <button
            className="menu-scrim"
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
          />

          <aside className="menu-drawer" role="dialog" aria-modal="true" aria-label="Menu principal">
            <div className="drawer-header">
              <div className="drawer-brand">
                <span aria-hidden="true">✦</span>
                <strong>A LEI DO AMOR</strong>
              </div>
              <button
                className="drawer-close"
                type="button"
                ref={closeButtonRef}
                aria-label="Fechar menu"
                onClick={() => {
                  setMenuOpen(false);
                  menuButtonRef.current?.focus();
                }}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="drawer-rule" />
            <p className="drawer-kicker">Escolha um caminho</p>

            <nav className="drawer-nav" aria-label="Seções da novela">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={activeTab === tab.id ? "drawer-link drawer-link--active" : "drawer-link"}
                  type="button"
                  aria-current={activeTab === tab.id ? "page" : undefined}
                  onClick={() => selectTab(tab.id)}
                >
                  <span className="drawer-dot" aria-hidden="true" />
                  <span>{tab.label}</span>
                  <small>{tab.index}</small>
                  <i aria-hidden="true">→</i>
                </button>
              ))}
            </nav>

            <div className="drawer-rule drawer-rule--footer" />
            <p className="drawer-signature">O tempo passa. O amor permanece.</p>

            <div className="drawer-opening-art" aria-hidden="true">
              <svg viewBox="0 0 420 380" preserveAspectRatio="xMidYMax slice">
                <defs>
                  <linearGradient id="thread-orange" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#ff9a45" />
                    <stop offset=".52" stopColor="#ed632f" />
                    <stop offset="1" stopColor="#ba3028" />
                  </linearGradient>
                  <linearGradient id="thread-red" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ff7b36" />
                    <stop offset="1" stopColor="#a9232b" />
                  </linearGradient>
                </defs>

                <g className="opening-threads opening-threads--behind">
                  <path d="M-28 302 C48 260 91 276 139 215 S241 116 448 152" />
                  <path d="M-12 350 C78 294 126 330 184 258 S293 154 446 190" />
                  <path d="M16 390 C74 310 130 346 175 273 S270 103 410 118" />
                </g>

                <image
                  className="opening-tree-sketches"
                  href="/menu-tree-sketches.webp"
                  x="-18"
                  y="-8"
                  width="456"
                  height="400"
                  preserveAspectRatio="xMidYMax slice"
                />

                <g className="opening-threads opening-threads--front">
                  <path d="M-30 315 C34 304 58 293 81 269 C99 250 91 232 68 234 C43 236 45 258 73 272 C112 291 153 244 185 219 S278 166 450 220" />
                  <path d="M-18 344 C77 360 119 309 155 286 C194 261 225 278 259 247 C298 211 337 185 443 204" />
                  <path d="M-25 369 C50 337 103 370 143 323 C181 278 201 214 246 190 C286 168 324 179 445 238" />
                  <path d="M119 388 C151 330 190 322 222 284 C252 249 256 222 276 205 C296 188 312 194 323 211 C337 234 309 252 285 240 C258 225 254 199 271 176 C296 143 344 137 430 164" />
                </g>
              </svg>
            </div>

            {installPrompt && (
              <button className="drawer-install" type="button" onClick={installApp}>
                Instalar A Lei do Amor
              </button>
            )}
          </aside>
        </div>
      )}

      <main
        className={activeTab === "inicio" ? "content-stage content-stage--home" : "content-stage"}
        id={`panel-${activeTab}`}
        tabIndex={-1}
        key={activeTab}
      >
        {activeTab === "inicio" && <Inicio onNavigate={selectTab} />}
        {activeTab === "sinopse" && <Sinopse />}
        {activeTab === "resumos" && <Resumos />}
        {activeTab === "trilha" && <Trilha />}
        {activeTab === "elenco" && <Elenco />}
      </main>

      <footer className="site-footer">
        <span>✦ A Lei do Amor</span>
        <span>O tempo passa. O amor permanece.</span>
      </footer>
    </div>
  );
}

function Inicio({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-visual" aria-hidden="true">
          <Image
            className="hero-background"
            src="/home-hero-background.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            unoptimized
          />
        </div>

        <div className="hero-threadwork" aria-hidden="true">
          <svg viewBox="0 0 430 850" preserveAspectRatio="none">
            <path className="hero-thread hero-thread--crimson" d="M-28 296 C48 266 92 314 154 282 S275 224 462 277" />
            <path className="hero-thread hero-thread--orange" d="M-30 354 C57 310 114 363 166 329 C222 292 273 304 461 372" />
            <path className="hero-thread hero-thread--wine" d="M-35 406 C59 373 104 433 167 390 C221 352 244 316 297 331 C339 343 347 381 321 394 C290 409 264 374 279 349 C307 301 370 317 462 336" />
            <circle cx="67" cy="323" r="3" />
          </svg>
        </div>

        <div className="hero-copy">
          <p className="eyebrow"><span /> Um amor atravessa o tempo</p>
          <h1 className="hero-title">
            <span>A LEI</span>
            <em>do</em>
            <span>AMOR</span>
          </h1>
          <p className="hero-intro">
            Entre reflexos, reencontros e segredos, dois corações descobrem
            que algumas histórias nunca deixam de brilhar.
          </p>
          <div className="hero-actions">
            <button className="primary-action" onClick={() => onNavigate("resumos")}>
              Entrar nesta história <span>→</span>
            </button>
          </div>
        </div>

      </section>

      <div className="home-transition-stitch" aria-hidden="true">
        <svg viewBox="0 0 430 34" preserveAspectRatio="none">
          <defs>
            <linearGradient id="home-stitch-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#9f2942" />
              <stop offset=".5" stopColor="#c22246" />
              <stop offset="1" stopColor="#df7a42" />
            </linearGradient>
          </defs>
          <path d="M-18 21 C38 5 82 27 137 16 S232 5 286 18 S374 28 448 10" />
        </svg>
      </div>

      <section className="home-editorial" id="historia">
        <div className="editorial-railway" aria-hidden="true">
          <svg viewBox="0 0 720 150" preserveAspectRatio="xMidYMid meet">
            <defs>
              <symbol id="editorial-train" viewBox="0 0 150 52">
                <path d="M3 40h13l7-9h17V14h42v26h17l9-9h13l10 9h16" />
                <path d="M30 14V8h27v6M39 8V3h10v5M82 20h18v20M87 20v-9h10v9" />
                <path d="M17 40h113M22 47h104M4 47h10M135 47h10" />
                <circle cx="31" cy="42" r="7" />
                <circle cx="92" cy="42" r="7" />
                <circle cx="63" cy="42" r="4.5" />
                <path d="M127 31l14-8v17M20 24h20M49 22h23M49 29h23" />
                <path d="M91 9c2-4 6-4 8 0M103 7c2-4 7-4 10 0" />
              </symbol>
            </defs>

            <g className="editorial-rails editorial-rails--upper">
              <path d="M4 60 C166 55 304 65 716 59" />
              <path d="M4 68 C176 63 322 72 716 67" />
              <path className="editorial-sleepers" d="M4 72 C176 67 322 76 716 71" />
            </g>
            <g className="editorial-rails editorial-rails--lower">
              <path d="M4 122 C156 116 329 128 716 121" />
              <path d="M4 130 C174 124 348 136 716 129" />
              <path className="editorial-sleepers" d="M4 134 C174 128 348 140 716 133" />
            </g>

            <g className="editorial-train-sketch">
              <use href="#editorial-train" x="54" y="8" width="166" height="57" />
              <path className="editorial-smoke" d="M153 10 C164 1 176 16 188 6 C197-1 205 5 211 1" />
            </g>
            <g className="editorial-train-sketch" transform="translate(666 73) scale(-1 1)">
              <use href="#editorial-train" width="166" height="57" />
              <path className="editorial-smoke" d="M99 3 C111-5 121 10 134 1 C142-5 151 1 158-3" />
            </g>
          </svg>
        </div>

        <div className="editorial-heading">
          <p className="section-kicker">Duas décadas. Um mesmo sentimento.</p>
          <h2>Há amores que o tempo não apaga.</h2>
        </div>
        <p>
          Helô e Pedro descobrem que algumas histórias podem ser interrompidas,
          mas nunca verdadeiramente encerradas. Quando a cidade volta a cruzar
          seus caminhos, passado e presente se refletem como luzes no vidro.
        </p>
        <button className="editorial-link" type="button" onClick={() => onNavigate("sinopse")}>
          Conheça a trama <span aria-hidden="true">→</span>
        </button>
      </section>
    </>
  );
}

function Sinopse() {
  return (
    <section className="section-page synopsis-page">
      <header className="synopsis-heading">
        <div className="synopsis-heading-main">
          <span className="section-index">02</span>
          <div>
            <p className="section-kicker">A história</p>
            <h1>Sinopse</h1>
          </div>
        </div>
        <p>Uma trama sobre escolhas, poder e a força de um sentimento que se recusa a desaparecer.</p>
      </header>

      <div className="synopsis-premise">
        <span>O ponto de partida</span>
        <strong>O tempo separa. <em>O amor reencontra.</em></strong>
      </div>

      <div className="synopsis-layout">
        <article className="story-card glass-card">
          <div className="story-stitch" aria-hidden="true">
            <svg viewBox="0 0 360 22" preserveAspectRatio="none">
              <path d="M2 12 C28 2 48 20 75 12 S122 3 151 13 S202 20 230 10 S282 3 309 13 S340 18 358 9" />
            </svg>
          </div>
          <p className="dropcap-text">
            <span>H</span>elô e Pedro vivem um amor arrebatador na juventude,
            mas uma armação da poderosa família Leitão muda o rumo de suas vidas.
            Vinte anos depois, o reencontro dos dois em São Dimas reacende um
            sentimento que parecia pertencer apenas ao passado.
          </p>
          <p>
            Agora mais maduros e cercados por novas relações, ambições e segredos,
            eles precisam encarar as marcas do tempo e descobrir se o amor pode ser
            maior do que tudo aquilo que um dia os separou.
          </p>
        </article>

        <aside className="quote-card">
          <span className="quote-mark">“</span>
          <blockquote>O amor muda de forma, atravessa a cidade e sempre encontra uma luz para voltar.</blockquote>
          <small>A essência da trama</small>
        </aside>
      </div>

      <section className="story-threads" aria-labelledby="story-threads-title">
        <header>
          <p className="section-kicker">Fios da história</p>
          <h2 id="story-threads-title">O que move a trama</h2>
        </header>
        <div className="story-pillars">
          <article><span>01</span><div><h3>Reencontro</h3><p>Um sentimento interrompido ganha uma nova chance.</p></div></article>
          <article><span>02</span><div><h3>Segredos</h3><p>O passado retorna em reflexos que ninguém consegue esconder.</p></div></article>
          <article><span>03</span><div><h3>Escolhas</h3><p>Cada coração precisa decidir qual caminho deseja iluminar.</p></div></article>
        </div>
      </section>
    </section>
  );
}

const chapters08to21 = [
  {
    number: "08",
    date: "11 de outubro de 2016",
    title: "Depois do atentado",
    summary:
      "As consequências do atentado atingem Pedro e a família Leitão. Enquanto tenta amparar Elio, Pedro começa a reunir pistas sobre o crime. Helô permanece por perto, e a tensão em São Dimas se espalha entre os núcleos da cidade.",
  },
  {
    number: "09",
    date: "12 de outubro de 2016",
    title: "Suspeitas à flor da pele",
    summary:
      "Tião reage à reaproximação entre Helô e Pedro, enquanto Pedro divide com Zuza suas desconfianças sobre Magnólia. Elio se aproxima de Isabela e transforma a dor em acusação, fazendo o clima na família Leitão ficar ainda mais tenso.",
  },
  {
    number: "10",
    date: "13 de outubro de 2016",
    title: "Entre ameaças e escolhas",
    summary:
      "A acusação de Elio provoca uma discussão com Tiago. Magnólia recebe uma proposta que altera o cenário político de São Dimas, e Pedro percebe que está sendo seguido. Helô e Pedro se entregam ao reencontro, mas Tião não aceita perder o controle.",
  },
  {
    number: "11",
    date: "14 de outubro de 2016",
    title: "Um despertar delicado",
    summary:
      "Tião e Helô entram em conflito, enquanto novas suspeitas surgem em torno das relações entre Magnólia, Ciro e a família Leitão. Fausto desperta, e o estado dele mobiliza Pedro, a imprensa e todos que esperam por respostas.",
  },
  {
    number: "12",
    date: "15 de outubro de 2016",
    title: "Segredos em movimento",
    summary:
      "Elio registra um encontro que pode mexer com a política local, enquanto Tião trabalha nos bastidores. Uma notícia muda a disputa pela prefeitura de São Dimas, e Pedro encontra um aposento escondido na empresa de Fausto.",
  },
  {
    number: "13",
    date: "17 de outubro de 2016",
    title: "A sala secreta",
    summary:
      "Pedro examina os documentos que encontrou e passa a desconfiar ainda mais das intenções ao seu redor. Magnólia e Tião se enfrentam, enquanto Helô celebra a aproximação entre Pedro e Edu. Os conflitos de São Dimas ganham novos contornos.",
  },
  {
    number: "14",
    date: "18 de outubro de 2016",
    title: "Frentes abertas",
    summary:
      "Pedro questiona Tião sobre sua ligação com Ciro, e os dois se enfrentam. Jéssica é desmascarada, novas informações voltam a cercar o atentado e Helô coloca seu casamento em discussão diante da família.",
  },
  {
    number: "15",
    date: "19 de outubro de 2016",
    title: "Novos rastros",
    summary:
      "Helô confronta Tião e procura Pedro, enquanto Magnólia nega conhecer o empresário. Ana Luiza ajuda Elio a criar um blog jornalístico, e Isabela ouve uma conversa de Venturini e Arlindo que pode trazer novas pistas sobre o atentado.",
  },
  {
    number: "16",
    date: "20 de outubro de 2016",
    title: "Ciro sob pressão",
    summary:
      "Tião mente para Helô e usa o estado de Letícia para tentar afastá-la de Pedro. Enquanto isso, Pedro mostra a Ciro o dossiê que encontrou, descobre celulares descartáveis em sua gaveta e o expulsa de casa.",
  },
  {
    number: "17",
    date: "21 de outubro de 2016",
    title: "Um anúncio indesejado",
    summary:
      "Helô decide se afastar de Pedro, e Tião pressiona Tiago para que se case com Letícia. Isabela conta a Elio o que ouviu sobre o atentado, Pedro passa a suspeitar de Ciro e Tião anuncia o casamento de Letícia e Tiago à imprensa.",
  },
  {
    number: "18",
    date: "22 de outubro de 2016",
    title: "O noivado em jogo",
    summary:
      "Tiago se revolta com os planos para o casamento, enquanto Isabela fica abalada e se aproxima de Elio. Helô afirma que Tiago não será obrigado a se casar, mas Tião e Letícia seguem acertando os detalhes da festa de noivado.",
  },
  {
    number: "19",
    date: "24 de outubro de 2016",
    title: "Encontros sob vigilância",
    summary:
      "Pedro questiona Tião sobre o noivado. Zelito envia uma mensagem do celular de Isabela para Tiago, que se encontra com ela sob a vigilância de Valdir. Magnólia acerta o retorno de Ciro, e Isabela decide trabalhar na festa de noivado.",
  },
  {
    number: "20",
    date: "25 de outubro de 2016",
    title: "A festa desanda",
    summary:
      "Tiago entrega a aliança a Letícia, mas a presença de Isabela abala a festa. Ana Luiza filma Venturini e Luciane, Tiago se embriaga e Helô segue Jéssica ao vê-la levar o rapaz embora, até que ela e Pedro flagram os dois juntos.",
  },
  {
    number: "21",
    date: "26 de outubro de 2016",
    title: "Quem é Isabela?",
    summary:
      "Helô se preocupa com os sentimentos de Tiago e enfrenta Tião para proteger Edu. Pedro tenta descobrir quem é Isabela, Letícia acusa Jéssica de roubo, os auditores chegam à tecelagem e Helô questiona Tiago sobre seu envolvimento com a jovem.",
  },
] as const;

function Resumos() {
  return (
    <section className="section-page summaries-page">
      <header className="summaries-heading">
        <div className="summaries-heading-main">
          <span className="section-index">03</span>
          <div>
            <p className="section-kicker">Capítulo a capítulo</p>
            <h1>Resumos</h1>
          </div>
        </div>
        <p>Os capítulos 08 a 21, reunidos para seguir acompanhando a história.</p>
      </header>

      <div className="summaries-phase">
        <div>
          <span>Primeira fase</span>
          <strong>Capítulos 08–21</strong>
        </div>
        <p>Toque em um capítulo para abrir o resumo.</p>
      </div>

      <div className="chapter-list">
        {chapters08to21.map((chapter) => (
          <details className="chapter-item" key={chapter.number}>
            <summary>
              <span className="chapter-number">{chapter.number}</span>
              <span className="chapter-meta">
                <small>{chapter.date}</small>
                <strong>{chapter.title}</strong>
              </span>
              <span className="chapter-open" aria-hidden="true">+</span>
            </summary>
            <div className="chapter-content">
              <div className="chapter-stitch" aria-hidden="true">
                <svg viewBox="0 0 360 22" preserveAspectRatio="none">
                  <path d="M2 12 C28 2 48 20 75 12 S122 3 151 13 S202 20 230 10 S282 3 309 13 S340 18 358 9" />
                </svg>
              </div>
              <p>{chapter.summary}</p>
              <div className="chapter-ticket-footer">
                <span>Capítulo {chapter.number}</span>
                <svg viewBox="0 0 88 34" fill="none" aria-hidden="true">
                  <path d="M4 25h9l4-5h10V10h23v15h11l5-5h8l6 5h5" />
                  <path d="M21 10V6h16v4M26 6V3h7v3M50 14h11v11M54 14V9h6v5" />
                  <path d="M13 25h64M17 30h62M6 30h6M82 30h4" />
                  <circle cx="25" cy="27" r="5" />
                  <circle cx="66" cy="27" r="5" />
                  <circle cx="44" cy="27" r="3" />
                  <path d="M74 20l8-4v9M17 17h10M35 16h9M35 21h9" />
                </svg>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

const soundtrackVolumeOne = [
  { title: "Bachianas Brasileiras nº 2 (O Trenzinho do Caipira)", artist: "Ney Matogrosso" },
  { title: "Blue", artist: "BluBell" },
  { title: "No meu país", artist: "Zélia Duncan (part. Xande de Pilares)" },
  { title: "Step by Step", artist: "New Kids on the Block" },
  { title: "Meu recado", artist: "Alice Caymmi" },
  { title: "Lovesong", artist: "Edson Cordeiro" },
  { title: "Chuva no mar", artist: "Carminho (part. Marisa Monte)" },
  { title: "Estado de poesia", artist: "Chico César" },
  { title: "What's Up?", artist: "4 Non Blondes" },
  { title: "Levanta", artist: "Renata Jambeiro" },
  { title: "Folgado", artist: "Marília Mendonça" },
  { title: "Partículas do amor", artist: "Márcia Castro" },
  { title: "Por enquanto", artist: "Cássia Eller" },
  { title: "The Rip Tide", artist: "Beirut" },
] as const;

function Trilha() {
  return (
    <section className="section-page soundtrack-page">
      <header className="soundtrack-heading">
        <div className="soundtrack-heading-main">
          <span className="section-index">04</span>
          <div>
            <p className="section-kicker">Música & emoção</p>
            <h1>Trilha Sonora</h1>
          </div>
        </div>
        <p>As canções reunidas no primeiro volume da trilha oficial da novela.</p>
      </header>

      <div className="soundtrack-intro soundtrack-intro--volume-one">
        <Image
          className="soundtrack-cast-image"
          src="/soundtrack-cast.webp"
          alt=""
          width={840}
          height={913}
          sizes="(max-width: 699px) 78vw, 430px"
          aria-hidden="true"
        />

        <div className="soundtrack-intro-copy">
          <p>Trilha oficial</p>
          <h2>Um disco para atravessar o tempo.</h2>
          <span>14 faixas · Volume 1</span>
        </div>

        <svg className="soundtrack-thread-art" viewBox="0 0 620 230" fill="none" aria-hidden="true">
          <path className="soundtrack-thread soundtrack-thread--red" d="M-30 92C75 38 132 148 230 96S386 44 476 112s151 30 194-2" />
          <path className="soundtrack-thread soundtrack-thread--orange" d="M-34 142C68 184 140 64 251 137s173 50 248-7 118-38 165-1" />
          <path className="soundtrack-thread soundtrack-thread--rose" d="M18 202C124 120 206 215 310 158s194-35 330 36" />
        </svg>
      </div>

      <div className="soundtrack-catalog-heading">
        <div>
          <p className="section-kicker">A Lei do Amor · Vol. 1</p>
          <h2>Faixas do CD</h2>
        </div>
        <span>{soundtrackVolumeOne.length} canções</span>
      </div>

      <ol className="soundtrack-list">
        {soundtrackVolumeOne.map((track, index) => {
          const youtubeQuery = encodeURIComponent(`${track.title} ${track.artist}`);

          return (
            <li key={track.title}>
              <a
                className="soundtrack-item"
                href={`https://www.youtube.com/results?search_query=${youtubeQuery}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Ouvir ${track.title}, de ${track.artist}, no YouTube`}
              >
                <span className="soundtrack-number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{track.title}</h3>
                  <p>{track.artist}</p>
                </div>
                <span className="soundtrack-youtube" aria-hidden="true">▶</span>
              </a>
            </li>
          );
        })}
      </ol>

      <p className="soundtrack-source">Seleção conforme a contracapa de A Lei do Amor — Vol. 1.</p>
    </section>
  );
}

function Elenco() {
  const [selectedCharacter, setSelectedCharacter] = useState<CastMember | null>(null);
  const profileTriggerRef = useRef<HTMLButtonElement | null>(null);

  const openProfile = (person: CastMember, trigger: HTMLButtonElement) => {
    profileTriggerRef.current = trigger;
    setSelectedCharacter(person);
  };

  const closeProfile = () => {
    setSelectedCharacter(null);
    window.requestAnimationFrame(() => profileTriggerRef.current?.focus());
  };

  return (
    <section className="section-page cast-page">
      <SectionHeading
        index="05"
        kicker="Personagens"
        title="Elenco"
        description="Rostos, histórias e sentimentos que dão vida ao universo de A Lei do Amor — agora reunidos em imagens da própria trama."
      />

      <div className="cast-shelf-heading">
        <div>
          <p className="section-kicker">Núcleo principal</p>
          <h2>Os rostos no centro da história</h2>
        </div>
        <span>{mainCast.length} personagens em destaque</span>
      </div>

      <div className="cast-grid cast-grid--main">
        {mainCast.map((person, index) => (
          <CastCard
            person={person}
            index={index}
            key={person.slug}
            onSelect={openProfile}
          />
        ))}
      </div>

      <details className="cast-drawer">
        <summary>
          <div className="drawer-title">
            <p className="section-kicker">Elenco completo</p>
            <strong>Ver todos os outros personagens</strong>
            <small>Abra a gaveta para conhecer cada rosto da trama.</small>
          </div>
          <div className="drawer-action" aria-hidden="true">
            <span>{supportingCast.length}</span>
            <i>⌄</i>
          </div>
        </summary>

        <div className="drawer-body">
          <div className="cast-grid cast-grid--supporting">
            {supportingCast.map((person, index) => (
              <CastCard
                compact
                person={person}
                index={index + mainCast.length}
                key={person.slug}
                onSelect={openProfile}
              />
            ))}
          </div>

          <p className="cast-credit">
            Retratos do elenco: <span>Gshow / Globo</span>.
          </p>
        </div>
      </details>

      {selectedCharacter && (
        <CharacterNote person={selectedCharacter} onClose={closeProfile} />
      )}
    </section>
  );
}

function CharacterNote({
  person,
  onClose,
}: {
  person: CastMember;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements?.length) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const titleId = `character-note-${person.slug}`;
  const descriptionId = `${titleId}-context`;

  return createPortal(
    <div className="character-note-layer">
      <button
        className="character-note-scrim"
        type="button"
        aria-label="Fechar bilhete da personagem"
        onClick={onClose}
      />

      <article
        className="character-note"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <header className="character-note-header">
          <p>{person.actor}</p>
          <button
            className="character-note-close"
            type="button"
            ref={closeRef}
            aria-label="Fechar e voltar ao elenco"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="character-note-stitch" aria-hidden="true">
          <svg viewBox="0 0 360 30" preserveAspectRatio="none">
            <defs>
              <linearGradient id="note-thread" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#b92f2d" />
                <stop offset=".5" stopColor="#ef6733" />
                <stop offset="1" stopColor="#f29a46" />
              </linearGradient>
            </defs>
            <path d="M2 17 C30 3 55 29 86 18 C115 8 137 6 166 19 C196 32 218 3 248 10 C276 16 281 29 307 25 C330 21 337 7 358 12" />
            <path d="M2 22 C35 12 54 25 79 24 C111 23 129 11 158 14 C188 17 211 27 239 23 C269 19 292 8 318 12 C337 15 347 21 358 18" />
          </svg>
        </div>
        <p className="character-note-kicker">Um bilhete sobre</p>
        <h2 id={titleId}>{person.character}</h2>
        <p className="character-note-context" id={descriptionId}>{person.context}</p>
        <div className="character-note-footer-art" aria-hidden="true">
          <span />
          <svg className="character-note-train" viewBox="0 0 96 38" fill="none">
            <path d="M4 28.5h9l4-5.5h11V11h24v17.5h11.5L69 23h8l6 5.5h9" />
            <path d="M22 11V6h17v5M27 6V2.5h7V6M52 15h11v13.5M55 15V9h6v6" />
            <path d="M13 28.5h67M17 33.5h64M5 33.5h7M85 33.5h7" />
            <circle cx="25" cy="30" r="5.5" />
            <circle cx="68" cy="30" r="5.5" />
            <circle cx="45" cy="30" r="3.5" />
            <path d="M78 23l8-5v10.5M18 18h10M36 17h9M36 22h9" />
            <path d="M57 7c1.5-2 3.8-2 5.2 0M66 6c1.7-2.5 4.4-2.5 6.1 0" />
          </svg>
          <span />
        </div>
      </article>
    </div>,
    document.body,
  );
}

function CastCard({
  person,
  index,
  compact = false,
  onSelect,
}: {
  person: CastMember;
  index: number;
  compact?: boolean;
  onSelect: (person: CastMember, trigger: HTMLButtonElement) => void;
}) {
  return (
    <article className={compact ? "cast-card cast-card--compact" : "cast-card"}>
      <button
        className="cast-card-link"
        type="button"
        aria-haspopup="dialog"
        aria-label={`Conheça ${person.character}, personagem de ${person.actor}`}
        onClick={(event) => onSelect(person, event.currentTarget)}
      >
        <div className="cast-portrait">
          <Image
            src={person.image}
            alt={`${person.character}, interpretado por ${person.actor}, em A Lei do Amor`}
            width={340}
            height={190}
            loading={compact || index > 3 ? "lazy" : "eager"}
            decoding="async"
            unoptimized
          />
          <span className="portrait-shine" aria-hidden="true" />
          <small>{String(index + 1).padStart(2, "0")}</small>
        </div>
        <div className="cast-info">
          <p>{person.actor}</p>
          <h2>{person.character}</h2>
          <span>
            Conheça a personagem <i aria-hidden="true">↗</i>
          </span>
        </div>
      </button>
    </article>
  );
}

function SectionHeading({
  index,
  kicker,
  title,
  description,
}: {
  index: string;
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <header className="section-heading">
      <div className="section-index">{index}</div>
      <div>
        <p className="section-kicker">{kicker}</p>
        <h1>{title}</h1>
      </div>
      <p className="section-description">{description}</p>
    </header>
  );
}
