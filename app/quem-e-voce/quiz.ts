// Perfis editoriais baseados nos contextos do elenco em app/cast.ts.
// Valores de -2 a 2: independência, cuidado, franqueza, estratégia,
// ambição, prestígio, justiça, lealdade, família, sociabilidade, romance e curiosidade.
export const traits = ["independencia", "cuidado", "franqueza", "estrategia", "ambicao", "prestigio", "justica", "lealdade", "familia", "sociabilidade", "romance", "curiosidade"] as const;
export type Trait = (typeof traits)[number];
export type Signals = Partial<Record<Trait, number>>;
export type Option = { text: string; insight: string; signals: Signals };
export type Question = { title: string; options: readonly [Option, Option, Option, Option] };
export type Character = { id: string; name: string; image: string; tags: readonly string[]; portrait: string; profile: Record<Trait, number> };

const p = (values: readonly number[]): Record<Trait, number> =>
  Object.fromEntries(traits.map((trait, index) => [trait, values[index]])) as Record<Trait, number>;

export const characters: readonly Character[] = [
  { id: "ana-luiza", name: "Ana Luísa", image: "/cast/ana-luiza-leitao.jpg", tags: ["Questionadora", "Criativa", "Observadora", "Independente"], portrait: "Você enxerga detalhes que os outros deixam passar e gosta de fazer perguntas antes de aceitar uma versão pronta. Como Ana Luísa, seu olhar criativo ajuda a enxergar a própria família por ângulos inesperados.", profile: p([2,0,0,1,0,-1,2,0,0,-1,-1,2]) },
  { id: "tiago", name: "Tiago", image: "/cast/tiago-leitao.jpg", tags: ["Intenso", "Dividido", "Afetivo", "Determinado"], portrait: "Você sente o peso das expectativas alheias, mas seus sentimentos também pedem espaço. Como Tiago, pode se surpreender quando um encontro muda as certezas que pareciam definidas.", profile: p([0,1,0,-1,1,0,0,0,1,0,2,0]) },
  { id: "isabela", name: "Isabela", image: "/cast/isabela-dias.jpg", tags: ["Estudiosa", "Reservada", "Independente", "Focada"], portrait: "Você confia no próprio esforço e não se deixa impressionar facilmente. Como Isabela, prefere construir seu caminho com estudo, independência e objetivos bem definidos.", profile: p([2,0,-1,2,2,-2,0,1,-1,-2,-1,1]) },
  { id: "pedro", name: "Pedro", image: "/cast/pedro-guedes-leitao.jpg", tags: ["Firme", "Independente", "Afetivo", "Corajoso"], portrait: "Você precisa de liberdade para decidir sua vida e tem coragem de revisitar questões antigas. Como Pedro, mantém laços afetivos profundos sem abrir mão de seguir o próprio caminho.", profile: p([2,1,2,0,0,-2,1,2,0,-1,1,0]) },
  { id: "helo", name: "Helô", image: "/cast/heloisa-martins.jpg", tags: ["Franca", "Forte", "Leal", "Sensível"], portrait: "Você enfrenta dificuldades de frente, com franqueza e dignidade. Como Helô, protege quem ama e preserva sua própria voz mesmo quando os sentimentos tornam tudo mais difícil.", profile: p([1,2,2,0,0,-1,2,2,2,0,1,0]) },
  { id: "magnolia", name: "Magnólia", image: "/cast/magnolia-costa-leitao.jpg", tags: ["Influente", "Estratégica", "Protetora", "Controladora"], portrait: "Você percebe a força dos bastidores e gosta de manter o rumo da família e de seus projetos sob controle. Como Magnólia, combina presença acolhedora com habilidade para exercer influência.", profile: p([-1,0,-1,2,2,2,-2,0,2,2,-1,-1]) },
  { id: "tiao", name: "Tião", image: "/cast/sebastiao-bezerra-tiao.jpg", tags: ["Disciplinado", "Reservado", "Estratégico", "Ambicioso"], portrait: "Você planeja antes de agir e valoriza tudo o que conquistou pelo próprio trabalho. Como Tião, tem disciplina para subir na vida e prefere guardar suas cartas até saber o próximo passo.", profile: p([1,-2,-2,2,2,1,-1,0,0,-2,-2,0]) },
  { id: "salete", name: "Salete", image: "/cast/salete.jpg", tags: ["Empreendedora", "Expansiva", "Prática", "Protetora"], portrait: "Você resolve problemas com iniciativa e não espera que as coisas se ajeitem sozinhas. Como Salete, põe energia no trabalho e cuida dos seus com afeto e pulso firme.", profile: p([1,2,2,-1,2,-1,0,2,2,2,-1,-1]) },
  { id: "jessica", name: "Jéssica", image: "/cast/jessica.jpg", tags: ["Ambiciosa", "Ousada", "Sociável", "Apaixonada"], portrait: "Você gosta de imaginar uma vida maior e se sente atraído por novas possibilidades de conforto e prestígio. Como Jéssica, pode deixar a vontade de conquistar espaço falar mais alto que as expectativas da família.", profile: p([1,-1,1,-2,2,2,-1,-1,-2,2,1,-1]) },
  { id: "vitoria", name: "Vitória", image: "/cast/vitoria-costa-leitao.jpg", tags: ["Sensível", "Afetiva", "Reflexiva", "Romântica"], portrait: "Você procura acolhimento quando as pressões ao redor apertam. Como Vitória, guarda vínculos afetivos importantes e leva a sério as histórias que deixaram marcas no coração.", profile: p([-1,2,-2,0,-2,0,0,1,1,-1,2,-1]) },
  { id: "luciane", name: "Luciane", image: "/cast/luciane-leitao.jpg", tags: ["Solar", "Espontânea", "Divertida", "Direta"], portrait: "Você chega com leveza, humor e uma personalidade que não desaparece diante das formalidades. Como Luciane, prefere ser você mesmo e fazer sua presença ser sentida.", profile: p([1,1,2,-2,0,1,0,0,1,2,0,-1]) },
  { id: "elio", name: "Élio", image: "/cast/elio-bataglia.jpg", tags: ["Curioso", "Idealista", "Corajoso", "Observador"], portrait: "Você quer entender o que aconteceu de verdade, mesmo quando isso incomoda pessoas influentes. Como Élio, põe a curiosidade e o senso de justiça a serviço da busca por respostas.", profile: p([1,0,0,1,0,-2,2,1,0,0,-1,2]) },
  { id: "antonio", name: "Antônio", image: "/cast/antonio-ferrari.jpg", tags: ["Charmoso", "Direto", "Justo", "Afetuoso"], portrait: "Você prefere falar com clareza e fazer o que considera correto, sem perder o coração. Como Antônio, concilia um jeito charmoso com perguntas sinceras sobre os vínculos da família.", profile: p([0,1,2,0,0,0,2,1,0,2,1,0]) },
  { id: "flavia", name: "Flávia", image: "/cast/flavia-cardoso.jpg", tags: ["Sensata", "Criativa", "Leal", "Acolhedora"], portrait: "Você sabe criar seu próprio ritmo e costuma ser um ponto de equilíbrio entre amigos. Como Flávia, tem um lado criativo e independente, mas também aparece para ajudar quando a família precisa.", profile: p([1,2,-1,0,0,-2,1,2,1,1,0,1]) },
  { id: "camila", name: "Camila", image: "/cast/camila-costa-leitao.jpg", tags: ["Estilosa", "Sociável", "Consumista", "Confiante"], portrait: "Você repara no estilo, no conforto e na maneira como se apresenta ao mundo. Como Camila, conhece o ambiente privilegiado à sua volta e ainda pode descobrir novos horizontes além dele.", profile: p([-1,-1,0,-1,0,2,-1,0,1,2,0,-2]) },
];

const o = (text: string, insight: string, signals: Signals): Option => ({ text, insight, signals });

export const questions: readonly Question[] = [
  { title: "Quando alguém mexe com quem você ama, você…", options: [
    o("Chamo a pessoa para conversar com franqueza.", "conversa com franqueza para proteger quem ama", { cuidado: 2, franqueza: 2, familia: 1 }),
    o("Entro na frente, sem pensar duas vezes.", "age rápido quando alguém querido precisa de você", { cuidado: 2, franqueza: 2, estrategia: -2 }),
    o("Observo o que aconteceu e escolho a hora certa de agir.", "observa antes de tomar uma atitude", { estrategia: 2, franqueza: -2, curiosidade: 1 }),
    o("Defendo os meus e não deixo ninguém decidir por mim.", "defende seus laços sem abrir mão da própria voz", { familia: 2, independencia: 2, lealdade: 1 }),
  ] },
  { title: "Um amigo te conta um segredo delicado. O que você faz?", options: [
    o("Escuto com carinho e guardo comigo.", "acolhe as confidências de quem confia em você", { cuidado: 2, lealdade: 2, franqueza: -1 }),
    o("Faço perguntas para entender a história toda.", "procura os fatos antes de chegar a uma conclusão", { curiosidade: 2, justica: 2, estrategia: 1 }),
    o("Tento levantar o astral e oferecer ajuda prática.", "oferece companhia e uma solução concreta", { sociabilidade: 2, cuidado: 1, franqueza: 1 }),
    o("Ajudo a pensar num plano antes que a situação piore.", "planeja com calma quando um amigo precisa de ajuda", { estrategia: 2, lealdade: 1, ambicao: 1 }),
  ] },
  { title: "Surge a chance de liderar algo importante. O que mais te atrai?", options: [
    o("A liberdade de fazer tudo do meu jeito.", "valoriza a liberdade para escolher seu caminho", { independencia: 2, ambicao: 1, prestigio: -1 }),
    o("A chance de crescer e conquistar reconhecimento.", "busca crescer e ser reconhecido pelo que faz", { ambicao: 2, prestigio: 2 }),
    o("Poder melhorar a vida de pessoas próximas.", "pensa em como uma conquista pode ajudar sua gente", { cuidado: 2, familia: 2, ambicao: 1 }),
    o("Aprender algo novo e enxergar mais longe.", "encontra motivação em aprender e descobrir", { curiosidade: 2, independencia: 1, justica: 1 }),
  ] },
  { title: "Numa reunião de família cheia de opiniões, você…", options: [
    o("Falo o que penso, mesmo que incomode.", "defende suas ideias em voz alta", { franqueza: 2, independencia: 1, familia: 1 }),
    o("Tento acolher e aproximar todo mundo.", "procura manter as pessoas próximas", { cuidado: 2, familia: 2, lealdade: 1 }),
    o("Escuto em silêncio; assim entendo melhor o jogo.", "lê o ambiente antes de se posicionar", { estrategia: 2, franqueza: -2, curiosidade: 1 }),
    o("Quebro o clima com humor e sigo sendo eu mesmo.", "leva leveza mesmo aos encontros mais tensos", { sociabilidade: 2, estrategia: -2, independencia: 1 }),
  ] },
  { title: "Quando o assunto é amor, qual frase parece mais sua?", options: [
    o("Quero viver uma história intensa, mesmo sem garantias.", "se entrega à intensidade de uma relação", { romance: 2, estrategia: -2, cuidado: 1 }),
    o("Preciso confiar e sentir que estamos do mesmo lado.", "valoriza confiança e compromisso no amor", { lealdade: 2, cuidado: 2, familia: 1 }),
    o("Gosto de alguém, mas preciso do meu espaço.", "mantém seu espaço mesmo quando se apaixona", { independencia: 2, romance: 1, familia: -1 }),
    o("Prefiro construir algo com calma e segurança.", "prefere conhecer a pessoa antes de se envolver", { estrategia: 2, romance: -1, franqueza: -1 }),
  ] },
  { title: "Se o dinheiro de repente sobrasse, você primeiro…", options: [
    o("Investiria para ter tranquilidade lá na frente.", "pensa no futuro antes de gastar", { estrategia: 2, ambicao: 2, sociabilidade: -1 }),
    o("Realizaria um sonho de quem está comigo.", "divide as conquistas com quem ama", { familia: 2, cuidado: 2, prestigio: -1 }),
    o("Me daria um presente e aproveitaria a vida.", "gosta de celebrar suas conquistas", { prestigio: 2, sociabilidade: 2, estrategia: -1 }),
    o("Financiaria uma ideia capaz de mudar alguma coisa.", "investe em ideias com um propósito", { justica: 2, curiosidade: 2, ambicao: 1 }),
  ] },
  { title: "Uma pessoa poderosa comete uma injustiça. Denunciar pode te custar algo. E agora?", options: [
    o("Reúno provas e conto a verdade.", "busca provas para fazer a verdade aparecer", { justica: 2, curiosidade: 2, estrategia: 1 }),
    o("Enfrento quem fez isso de cara limpa.", "não foge de um confronto quando acha necessário", { justica: 2, franqueza: 2, estrategia: -1 }),
    o("Resolvo discretamente para proteger os meus.", "protege os seus e evita expô-los", { familia: 2, estrategia: 2, franqueza: -2 }),
    o("Calculo os riscos antes de escolher um lado.", "avalia o que pode perder antes de agir", { estrategia: 2, justica: -1, ambicao: 1 }),
  ] },
  { title: "Num lugar novo, onde você se sente mais à vontade?", options: [
    o("No meio da conversa, fazendo novas amizades.", "se anima ao conhecer gente nova", { sociabilidade: 2, franqueza: 1, cuidado: 1 }),
    o("Explorando sozinho até achar meu canto.", "gosta de explorar no seu próprio ritmo", { independencia: 2, sociabilidade: -2, curiosidade: 1 }),
    o("Entendendo quem é quem antes de me abrir.", "prefere observar as pessoas antes de se abrir", { estrategia: 2, sociabilidade: -2, franqueza: -1 }),
    o("Perto de alguém conhecido, vendo o que acontece.", "se sente melhor perto de uma pessoa de confiança", { familia: 2, cuidado: 1, romance: 1 }),
  ] },
  { title: "O ciúme ou uma traição abalam sua confiança. Como você reage?", options: [
    o("Converso para entender e talvez perdoar.", "tenta entender antes de decidir sobre o perdão", { cuidado: 2, lealdade: 2, curiosidade: 1 }),
    o("Deixo claro meu limite e sigo meu caminho.", "coloca limites e escolhe seu próprio rumo", { independencia: 2, franqueza: 2, familia: -1 }),
    o("Sinto vontade de dar o troco, mas penso antes de agir.", "prefere pensar antes de agir quando sente vontade de revidar", { estrategia: 2, franqueza: -2, cuidado: -1 }),
    o("Mostro o que senti; não consigo fingir normalidade.", "expressa o que sente quando se decepciona", { romance: 2, franqueza: 2, estrategia: -2 }),
  ] },
  { title: "Se tivesse que recomeçar amanhã, o que levaria com você?", options: [
    o("Meu plano e minha disposição para conquistar tudo de novo.", "confia na disciplina para começar outra vez", { estrategia: 2, ambicao: 2, independencia: 1 }),
    o("As pessoas queridas; o resto eu reconstruo.", "coloca as pessoas queridas no centro do recomeço", { familia: 2, cuidado: 2, lealdade: 1 }),
    o("Minha curiosidade e a liberdade de experimentar.", "transforma mudanças em descobertas", { independencia: 2, curiosidade: 2, familia: -1 }),
    o("Meu brilho e a vontade de viver coisas boas.", "recomeça sem perder o gosto pela vida", { sociabilidade: 2, prestigio: 2, estrategia: -1 }),
  ] },
];

export type QuizResult = { characterId: string; percentage: number; completedAt: string };

function optionFits(character: Character, question: Question): number[] {
  const raw = question.options.map((option) =>
    Object.entries(option.signals).reduce((sum, [trait, signal]) => sum + character.profile[trait as Trait] * signal, 0),
  );
  const min = Math.min(...raw);
  const max = Math.max(...raw);
  return raw.map((value) => max === min ? 0.5 : (value - min) / (max - min));
}

// Média e dispersão exatas com as quatro escolhas equiprováveis por pergunta.
// Corrigem a vantagem que um perfil teria só por ter mais alternativas compatíveis.
const distributions = new Map(characters.map((character) => {
  const fits = questions.map((question) => optionFits(character, question));
  const mean = fits.reduce((sum, values) => sum + values.reduce((s, n) => s + n, 0) / 4, 0);
  const variance = fits.reduce((sum, values) => {
    const average = values.reduce((s, n) => s + n, 0) / 4;
    return sum + values.reduce((s, n) => s + (n - average) ** 2, 0) / 4;
  }, 0);
  return [character.id, { mean, deviation: Math.sqrt(variance) }] as const;
}));

export function scoreQuiz(answers: readonly number[]): QuizResult & { scores: Record<string, number>; bestQuestions: readonly number[] } {
  if (answers.length !== questions.length || answers.some((answer) => !Number.isInteger(answer) || answer < 0 || answer > 3)) {
    throw new Error("O quiz precisa de dez respostas válidas.");
  }

  const scores: Record<string, number> = {};
  const matches = new Map<string, number[]>();
  for (const character of characters) {
    const questionScores = questions.map((question, index) => optionFits(character, question)[answers[index]]);
    matches.set(character.id, questionScores);
    scores[character.id] = questionScores.reduce((total, value) => total + value, 0);
  }

  // Empate: comparar primeiro as escolhas com melhor encaixe; a ordem fixa do elenco é o último critério.
  const standardized = (id: string) => (scores[id] - distributions.get(id)!.mean) / distributions.get(id)!.deviation;
  const ranked = [...characters].sort((a, b) =>
    standardized(b.id) - standardized(a.id) ||
    [...matches.get(b.id)!].sort((x, y) => y - x).slice(0, 3).reduce((s, v) => s + v, 0) -
    [...matches.get(a.id)!].sort((x, y) => y - x).slice(0, 3).reduce((s, v) => s + v, 0),
  );
  const winner = ranked[0];
  const fit = scores[winner.id] / questions.length;
  const match = matches.get(winner.id)!;
  const bestIn = (from: number, to: number) => Array.from({ length: to - from }, (_, i) => i + from)
    .sort((a, b) => match[b] - match[a] || a - b)[0];

  return {
    characterId: winner.id,
    // 55% = nenhum encaixe; 98% = encaixe máximo em todas as perguntas.
    percentage: Math.round(55 + 43 * fit),
    completedAt: new Date().toISOString(),
    scores,
    bestQuestions: [bestIn(0, 5), bestIn(5, 10)],
  };
}
