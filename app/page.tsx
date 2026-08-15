"use client";

import { useEffect, useRef, useState } from "react";

type TabId = "inicio" | "sinopse" | "resumos" | "trilha" | "elenco";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const tabs: Array<{ id: TabId; label: string; shortLabel: string }> = [
  { id: "inicio", label: "Início", shortLabel: "Início" },
  { id: "sinopse", label: "Sinopse", shortLabel: "Sinopse" },
  { id: "resumos", label: "Resumos", shortLabel: "Resumos" },
  { id: "trilha", label: "Trilha Sonora", shortLabel: "Trilha" },
  { id: "elenco", label: "Elenco", shortLabel: "Elenco" },
];

const cast = [
  { character: "Helô", actor: "Cláudia Abreu", initials: "CA", tone: "pearl" },
  { character: "Pedro", actor: "Reynaldo Gianecchini", initials: "RG", tone: "graphite" },
  { character: "Magnólia", actor: "Vera Holtz", initials: "VH", tone: "silver" },
  { character: "Fausto", actor: "Tarcísio Meira", initials: "TM", tone: "midnight" },
  { character: "Letícia", actor: "Isabella Santoni", initials: "IS", tone: "mist" },
  { character: "Tiago", actor: "Humberto Carrão", initials: "HC", tone: "steel" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("inicio");
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const navRef = useRef<HTMLElement>(null);

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

  const selectTab = (tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;

    if (!direction) return;
    event.preventDefault();
    const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
    selectTab(tabs[nextIndex].id);
    navRef.current
      ?.querySelector<HTMLButtonElement>(`[data-tab="${tabs[nextIndex].id}"]`)
      ?.focus();
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

      <header className="site-header">
        <button className="mini-brand" onClick={() => selectTab("inicio")} aria-label="Ir para o início">
          <span className="brand-spark">✦</span>
          <span>
            <strong>A LEI</strong>
            <small>DO AMOR</small>
          </span>
        </button>

        <nav className="tab-nav" role="tablist" aria-label="Seções da novela" ref={navRef}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "tab-button active" : "tab-button"}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              data-tab={tab.id}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => selectTab(tab.id)}
              onKeyDown={handleTabKeyDown}
            >
              <span className="full-label">{tab.label}</span>
              <span className="short-label">{tab.shortLabel}</span>
            </button>
          ))}
        </nav>

        {installPrompt && (
          <button className="install-button" onClick={installApp}>
            Instalar app
          </button>
        )}
      </header>

      <main
        className="content-stage"
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
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
        <span>Projeto não oficial inspirado na obra</span>
      </footer>
    </div>
  );
}

function Inicio({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Romance · Cidade · Destino</p>
          <h1 className="hero-title">
            <span>A LEI</span>
            <em>do</em>
            <span>AMOR</span>
          </h1>
          <p className="hero-tagline">Um amor urbano, elegante e luminoso.</p>
          <p className="hero-intro">
            Entre reflexos, reencontros e segredos, o amor atravessa o tempo
            e ilumina até os caminhos mais improváveis.
          </p>
          <div className="hero-actions">
            <button className="primary-action" onClick={() => onNavigate("sinopse")}>
              Conheça a história <span>→</span>
            </button>
            <button className="text-action" onClick={() => onNavigate("elenco")}>
              Ver elenco
            </button>
          </div>
        </div>

        <div className="urban-art" aria-hidden="true">
          <div className="halo halo-one" />
          <div className="halo halo-two" />
          <div className="love-orbit"><span>✦</span></div>
          <div className="city-grid" />
          <div className="skyline">
            <span className="building b1" />
            <span className="building b2" />
            <span className="building b3" />
            <span className="building b4" />
            <span className="building b5" />
          </div>
          <div className="reflection" />
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span>Explore</span><i />
        </div>
      </section>

      <section className="home-editorial">
        <div className="editorial-number">20</div>
        <div>
          <p className="section-kicker">Duas décadas. Um mesmo sentimento.</p>
          <h2>Há amores que o tempo não apaga.</h2>
        </div>
        <p>
          Helô e Pedro descobrem que algumas histórias podem ser interrompidas,
          mas nunca verdadeiramente encerradas. Quando a cidade volta a cruzar
          seus caminhos, passado e presente se refletem como luzes no vidro.
        </p>
      </section>
    </>
  );
}

function Sinopse() {
  return (
    <section className="section-page synopsis-page">
      <SectionHeading
        index="01"
        kicker="A história"
        title="O tempo separa. O amor reencontra."
        description="Uma trama sobre escolhas, poder e a força de um sentimento que se recusa a desaparecer."
      />

      <div className="synopsis-layout">
        <article className="story-card glass-card">
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
          <div className="quote-line" />
          <small>A essência da trama</small>
        </aside>
      </div>

      <div className="story-pillars">
        <article><span>01</span><h3>Reencontro</h3><p>Um sentimento interrompido ganha uma nova chance.</p></article>
        <article><span>02</span><h3>Segredos</h3><p>O passado retorna em reflexos que ninguém consegue esconder.</p></article>
        <article><span>03</span><h3>Escolhas</h3><p>Cada coração precisa decidir qual caminho deseja iluminar.</p></article>
      </div>
    </section>
  );
}

function Resumos() {
  return (
    <section className="section-page">
      <SectionHeading
        index="02"
        kicker="Capítulo a capítulo"
        title="Resumos"
        description="Acompanhe os encontros, revelações e reviravoltas que movem esta história."
      />

      <div className="coming-card glass-card summaries-placeholder">
        <div className="placeholder-icon calendar-icon" aria-hidden="true">
          <span>EM</span><strong>BREVE</strong>
        </div>
        <div className="coming-copy">
          <p className="section-kicker">Em preparação</p>
          <h2>Os resumos dos capítulos serão adicionados em breve.</h2>
          <p>Esta área já está pronta para receber os capítulos, datas e principais acontecimentos da novela.</p>
        </div>
        <div className="chapter-preview" aria-hidden="true">
          {["Capítulo 01", "Capítulo 02", "Capítulo 03"].map((chapter, index) => (
            <div key={chapter}><span>{chapter}</span><i style={{ width: `${84 - index * 14}%` }} /></div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trilha() {
  return (
    <section className="section-page">
      <SectionHeading
        index="03"
        kicker="Música & emoção"
        title="Trilha Sonora"
        description="Canções que transformam encontros em memória e dão ritmo ao coração da cidade."
      />

      <div className="soundtrack-stage glass-card">
        <div className="record-art" aria-hidden="true">
          <div className="record"><span>AL</span></div>
          <div className="record-glow" />
        </div>
        <div className="coming-copy soundtrack-copy">
          <p className="section-kicker">Playlist oficial</p>
          <h2>A trilha sonora da novela será adicionada em breve.</h2>
          <p>A estrutura está pronta para receber músicas, intérpretes e momentos marcantes de cada faixa.</p>
          <div className="track-list" aria-hidden="true">
            {[1, 2, 3].map((track) => (
              <div key={track}><span>0{track}</span><i /><button tabIndex={-1}>▷</button></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Elenco() {
  return (
    <section className="section-page">
      <SectionHeading
        index="04"
        kicker="Personagens"
        title="Elenco"
        description="Rostos, histórias e sentimentos que dão vida ao universo de A Lei do Amor."
      />

      <div className="cast-grid">
        {cast.map((person, index) => (
          <article className="cast-card" key={person.character}>
            <div className={`cast-portrait ${person.tone}`}>
              <span className="portrait-shine" />
              <span className="portrait-initials">{person.initials}</span>
              <small>{String(index + 1).padStart(2, "0")}</small>
            </div>
            <div className="cast-info">
              <p>{person.actor}</p>
              <h2>{person.character}</h2>
              <span>Conheça a personagem <i>→</i></span>
            </div>
          </article>
        ))}
      </div>
    </section>
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
