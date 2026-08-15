"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
        <button
          className="mini-brand"
          onClick={() => selectTab("inicio")}
          aria-label="Ir para o início"
        >
          <span className="brand-spark" aria-hidden="true">✦</span>
          <span>
            <strong>A LEI DO AMOR</strong>
            <small>ROMANCE · CIDADE · DESTINO</small>
          </span>
        </button>

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
        <span>Projeto não oficial inspirado na obra</span>
      </footer>
    </div>
  );
}

function Inicio({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  const continueStory = () => {
    document.getElementById("historia")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section className="hero-section">
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-beam hero-beam--one" />
          <div className="hero-beam hero-beam--two" />
          <div className="hero-orbit hero-orbit--one" />
          <div className="hero-orbit hero-orbit--two" />
          <div className="hero-city-grid" />
          <div className="hero-skyline">
            <span /><span /><span /><span /><span /><span />
          </div>
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
            <button className="primary-action" onClick={continueStory}>
              Entrar nesta história <span>↓</span>
            </button>
          </div>
        </div>

        <button className="hero-side-link" type="button" onClick={() => onNavigate("sinopse")}>
          <span>Sinopse</span><i aria-hidden="true">›</i>
        </button>
      </section>

      <section className="home-editorial" id="historia">
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
      <SectionHeading
        index="02"
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
        index="03"
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
        index="04"
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
        <CharacterProfile person={selectedCharacter} onClose={closeProfile} />
      )}
    </section>
  );
}

function CharacterProfile({
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

  const titleId = `character-profile-${person.slug}`;
  const descriptionId = `${titleId}-context`;

  return (
    <div className="character-profile-layer">
      <button
        className="character-profile-scrim"
        type="button"
        aria-label="Fechar perfil da personagem"
        onClick={onClose}
      />

      <section
        className="character-profile"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <header className="character-profile-toolbar">
          <button
            className="character-profile-back"
            type="button"
            ref={closeRef}
            onClick={onClose}
          >
            <span aria-hidden="true">←</span>
            Voltar ao elenco
          </button>
          <span className="character-profile-status">
            <i aria-hidden="true">✦</i> Sem spoilers
          </span>
        </header>

        <div className="character-profile-scroll">
          <div className="character-profile-portrait">
            <Image
              src={person.image}
              alt={`${person.character}, interpretado por ${person.actor}, em A Lei do Amor`}
              width={900}
              height={675}
              sizes="(max-width: 760px) 100vw, 52vw"
              decoding="async"
              priority
              unoptimized
            />
            <span className="character-profile-glow" aria-hidden="true" />
          </div>

          <div className="character-profile-copy">
            <p className="character-profile-actor">{person.actor}</p>
            <h2 id={titleId}>{person.character}</h2>
            <p className="character-profile-kicker">Contexto inicial da personagem</p>

            <div className="character-profile-context" id={descriptionId}>
              <span>Quem é</span>
              <p>{person.context}</p>
            </div>

            <p className="character-profile-note">
              Esta apresentação mostra apenas o ponto de partida da personagem.
              Os acontecimentos e revelações da novela ficam preservados.
            </p>

            <button className="character-profile-return" type="button" onClick={onClose}>
              Voltar ao elenco <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
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
        aria-label={`Conheça ${person.character}, personagem de ${person.actor}, sem spoilers`}
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
