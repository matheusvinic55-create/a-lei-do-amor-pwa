export type Suit = "copas" | "paus" | "espadas" | "ouros";
export type TarotCardData = {
  id: string;
  number: number | null;
  numeral: string;
  name: string;
  image: string;
  arcana: "major" | "minor";
  suit?: Suit;
  rank?: number | "valete" | "cavaleiro" | "rainha" | "rei";
  meaning: string;
  interpretation: string;
  past: string;
  future: string;
  invitation: string;
};

// Textos autorais: leituras simbólicas, nunca previsões de acontecimentos.
// A interface depende deste contrato, não da quantidade ou do tipo de arcano.
const majors: Array<[string, string, string, string, string, string, string]> = [
  ["O Louco", "—", "Liberdade · Começos · Descoberta", "Há espaço para experimentar um caminho diferente. Leve sua curiosidade, sem abandonar o cuidado com seus próprios passos.", "Que começo ou mudança de rumo trouxe você até aqui? Observe o que essa experiência ensinou sobre liberdade.", "Um caminho diferente pode se abrir quando você permite experimentar. Dê um passo possível, sem exigir todas as respostas.", "acolher o novo sem perder de vista seus limites"],
  ["O Mago", "I", "Iniciativa · Habilidade · Possibilidade", "Olhe para os recursos que já estão nas suas mãos. Uma pequena iniciativa pode dar forma ao que ainda é apenas vontade.", "Lembre uma ocasião em que sua iniciativa fez diferença. Que habilidade daquele tempo ainda pode servir ao presente?", "Uma ideia pode ganhar forma com prática e presença. Escolha por onde começar e permita-se aprender fazendo.", "transformar uma intenção em um gesto concreto"],
  ["A Papisa", "II", "Escuta · Intuição · Maturação", "Nem tudo precisa ser respondido agora. Um momento de silêncio pode ajudar a distinguir a própria voz do ruído ao redor.", "Talvez alguma percepção tenha ficado guardada. Revisite o que você sentiu, com carinho e sem cobrar respostas antigas.", "Dar tempo à compreensão pode revelar nuances. Observe antes de decidir e combine sua intuição com o que consegue perceber.", "escutar com calma o que ainda está amadurecendo"],
  ["A Imperatriz", "III", "Expressão · Criatividade · Fertilidade", "Uma ideia pede espaço para florescer. Cuide do que você cria e encontre uma forma simples de expressar o que sente.", "Reconheça aquilo que cresceu com seu cuidado. Que ideia, relação ou expressão pessoal ajudou a construir sua história?", "A criatividade pode encontrar passagem quando recebe atenção. Cultive uma ideia com gestos pequenos e constantes.", "dar voz ao que deseja criar e nutrir"],
  ["O Imperador", "IIII", "Estrutura · Estabilidade · Limites", "Acolhimento também pode vir de uma base firme. Organize o que está ao seu alcance e perceba quais limites protegem seu espaço.", "Olhe para as bases que sustentaram você. Quais regras trouxeram segurança e quais já podem ser revistas?", "Uma estrutura simples pode apoiar os próximos passos. Construa estabilidade sem exigir controle sobre tudo.", "criar uma base segura para aquilo que importa"],
  ["O Papa", "V", "Sabedoria · Valores · Orientação", "Uma conversa com alguém de confiança pode ampliar seu olhar. Escute o que faz sentido e preserve sua própria consciência.", "Que ensinamento acompanha você até hoje? Reconheça o que recebeu e o que aprendeu a compreender à sua maneira.", "Trocas respeitosas podem oferecer orientação. Permita-se aprender sem entregar a outra pessoa a decisão sobre seu caminho.", "buscar orientação sem se afastar dos seus valores"],
  ["O Enamorado", "VI", "Escolha · Afeto · Encontro", "Observe o que seu coração deseja e o que suas escolhas alimentam. Você pode dar tempo a uma decisão importante.", "Uma escolha afetiva pode ter deixado marcas. Olhe para ela sem julgamento e reconheça as necessidades que existiam ali.", "Novas escolhas podem pedir alinhamento entre desejo e valores. Procure relações e caminhos em que você possa ser inteiro.", "aproximar suas escolhas daquilo que tem valor afetivo"],
  ["O Carro", "VII", "Direção · Movimento · Autonomia", "Reúna sua energia em uma direção possível. Avançar não exige pressa: um passo consciente já é movimento.", "Recorde um momento em que você assumiu a direção. O que impulsionou a caminhada e o que merece um ritmo diferente?", "O movimento pode ganhar consistência com um destino claro. Ajuste a rota sempre que precisar, sem confundir pausa com fracasso.", "escolher uma direção e avançar no seu próprio ritmo"],
  ["A Justiça", "VIII", "Equilíbrio · Clareza · Responsabilidade", "Procure olhar a situação com honestidade e gentileza. O equilíbrio pede considerar tanto suas necessidades quanto as consequências das escolhas.", "Que decisão ainda pede compreensão? Reveja o contexto e reconheça o que cabia a você, sem assumir o peso de tudo.", "Escolhas mais claras podem nascer de uma avaliação serena. Antes de decidir, observe fatos, limites e reciprocidade.", "equilibrar suas necessidades com escolhas conscientes"],
  ["O Eremita", "VIIII", "Recolhimento · Tempo · Discernimento", "Diminua um pouco o ruído e ilumine apenas o próximo passo. Sua experiência pode oferecer companhia nesse momento de escuta.", "Um período de recolhimento pode ter trazido aprendizado. O que você descobriu quando precisou caminhar mais devagar?", "Uma pausa pode ajudar a reconhecer a direção desejada. Reserve espaço para refletir e para receber companhia quando quiser.", "respeitar seu tempo e iluminar um passo de cada vez"],
  ["A Roda da Fortuna", "X", "Ciclos · Mudança · Adaptação", "Perceba o que está mudando e o que volta a se repetir. Nem tudo depende de você, mas sua resposta pode encontrar flexibilidade.", "Observe os ciclos que se repetiram na sua história. Há algum aprendizado que permita responder de outra maneira agora?", "As circunstâncias podem mudar, abrindo espaço para ajustes. Cuide daquilo que depende de você e acolha o movimento da vida.", "reconhecer os ciclos e abrir espaço para uma resposta nova"],
  ["A Força", "XI", "Coragem · Delicadeza · Domínio de si", "A firmeza pode caminhar junto da ternura. Acolha sua intensidade e escolha uma maneira cuidadosa de dar direção a ela.", "Reconheça a coragem que você precisou reunir. Ela também esteve nos momentos em que você pediu apoio ou agiu com delicadeza.", "A constância pode ajudar mais que a pressão. Enfrente o próximo desafio com firmeza, preservando a gentileza consigo.", "conduzir sua intensidade com coragem e delicadeza"],
  ["O Enforcado", "XII", "Pausa · Perspectiva · Entrega", "Talvez a situação peça um novo ponto de vista. Faça uma pausa onde for possível e perceba o que deixa de exigir tanta força.", "Uma espera pode ter mudado sua maneira de enxergar. O que ficou mais claro quando o movimento precisou parar?", "Mudar a perspectiva pode revelar uma alternativa. Permita-se rever expectativas e distinguir espera de abandono de si.", "olhar a situação por outro ângulo antes de agir"],
  ["Arcano sem Nome", "XIII", "Transformação · Desapego · Renovação", "Observe o que perdeu o sentido e pode ser deixado para trás. A transformação simbólica abre espaço para outras formas de viver.", "Que encerramento ajudou a transformar sua história? Reconheça as perdas e também o espaço que se abriu depois delas.", "Um processo de renovação pode pedir desapego. Você pode escolher o que levar adiante e o que encerrar com respeito.", "soltar o que já não nutre e acolher a renovação"],
  ["A Temperança", "XIIII", "Harmonia · Integração · Paciência", "Experimente um ritmo mais amável. Pequenos ajustes podem aproximar partes da sua vida que pareciam não conversar.", "Lembre o que ajudou você a recuperar o equilíbrio. Que cuidado ou troca trouxe serenidade em um período difícil?", "A harmonia pode crescer aos poucos, por meio de ajustes. Busque diálogo e cuide do ritmo que consegue sustentar.", "encontrar um ritmo que una cuidado e continuidade"],
  ["O Diabo", "XV", "Desejo · Vínculos · Consciência", "Olhe para seus desejos sem julgamento. Perceba o que traz vitalidade e o que parece prender, para escolher com mais liberdade.", "Que vínculo ou desejo exerceu grande influência sobre você? Reconhecer essa força pode ajudar a compreender escolhas antigas.", "Conhecer melhor seus desejos pode ampliar sua liberdade. Observe os acordos e hábitos que deseja manter ou renegociar.", "reconhecer seus desejos e escolher os vínculos que alimenta"],
  ["A Torre", "XVI", "Revelação · Abertura · Reestruturação", "Uma certeza pode merecer ser revista. Crie espaço para uma compreensão mais honesta e cuide das bases que realmente sustentam você.", "Alguma mudança de perspectiva abalou antigas certezas? Observe o que pôde ser reconstruído a partir dessa descoberta.", "Rever uma estrutura pode abrir possibilidades. Se algo precisar mudar, procure apoio e faça os ajustes ao seu alcance.", "rever antigas certezas e preservar suas bases de apoio"],
  ["A Estrela", "XVII", "Esperança · Autenticidade · Confiança", "Aproxime-se do que faz você respirar com mais leveza. Um cuidado sincero pode renovar a confiança no seu próprio caminho.", "Que gesto ou encontro devolveu esperança a você? Guarde a lembrança daquilo que ajudou sua confiança a florescer.", "A esperança pode se fortalecer com cuidado e autenticidade. Alimente o que faz sentido sem exigir garantias do caminho.", "nutrir a esperança com gestos sinceros de cuidado"],
  ["A Lua", "XVIII", "Sensibilidade · Imaginação · Mistério", "Acolha o que sente, mesmo quando ainda não sabe explicar. Dê tempo à clareza e procure distinguir impressões, receios e fatos.", "Uma memória pode carregar sentimentos que ainda ecoam. Escute o que ela desperta sem tomar toda impressão como verdade.", "Um período de incerteza pode pedir escuta e observação. Espere mais clareza antes de transformar uma impressão em decisão.", "acolher sua sensibilidade e dar tempo à clareza"],
  ["O Sol", "XVIIII", "Vitalidade · Clareza · Partilha", "Perceba os encontros e gestos que aquecem seu dia. Há valor em dividir uma alegria e permitir que as coisas sejam um pouco mais simples.", "Recorde uma experiência de alegria ou entendimento. O que ela ensinou sobre companhia, confiança e espontaneidade?", "A clareza pode crescer por meio de encontros sinceros. Abra espaço para partilhar e reconhecer as pequenas alegrias.", "valorizar a clareza e os encontros que trazem vitalidade"],
  ["O Julgamento", "XX", "Despertar · Chamado · Recomeço", "Algo pode estar pedindo uma resposta mais consciente. Escute o que deseja retomar e permita-se reconhecer uma nova compreensão.", "Que percepção mudou sua maneira de se compreender? Relembre o que despertou você para uma necessidade antes esquecida.", "Uma nova compreensão pode inspirar um recomeço. Reavalie o que deseja retomar e responda com liberdade, sem cobranças antigas.", "escutar o que desperta em você e responder com consciência"],
  ["O Mundo", "XXI", "Integração · Realização · Pertencimento", "Reconheça o caminho percorrido e o que ganhou forma. Você pode celebrar uma conquista sem precisar ter tudo resolvido.", "Olhe para um ciclo que se completou. Que experiências ajudaram você a perceber suas capacidades e seu lugar no mundo?", "O que você cultiva pode encontrar uma forma mais integrada. Valorize cada conclusão e permaneça aberto a novos aprendizados.", "reconhecer suas conquistas e integrar o que aprendeu"],
];

export const deck: TarotCardData[] = majors.map(([name, numeral, meaning, interpretation, past, future, invitation], index) => ({
  id: `major-${String(index).padStart(2, "0")}`,
  number: index === 0 ? null : index,
  numeral, name, meaning, interpretation, past, future, invitation,
  image: `/mileide/cards/${String(index).padStart(2, "0")}.webp`,
  arcana: "major",
}));

export type SpreadId = "day" | "timeline" | "advice";
export const spreads: Array<{ id: SpreadId; name: string; subtitle: string; positions: string[] }> = [
  { id: "day", name: "Carta do Dia", subtitle: "Uma carta. Um encontro com o agora.", positions: ["Sua carta do dia"] },
  { id: "timeline", name: "Passado · Presente · Futuro", subtitle: "Três cartas para contemplar seu caminho.", positions: ["Passado", "Presente", "Futuro"] },
  { id: "advice", name: "Conselho da Mileide", subtitle: "Três cartas, uma conversa com a intuição.", positions: ["O que pede atenção", "O que pode ajudar", "Um caminho possível"] },
];

export function interpret(card: TarotCardData, spread: SpreadId, position: number) {
  if (spread === "timeline") return position === 0 ? card.past : position === 2 ? card.future : card.interpretation;
  if (spread === "advice" && position === 2) return card.future;
  return card.interpretation;
}

export function mileideAdvice(cards: TarotCardData[]) {
  if (cards.length !== 3) return "";
  const [first, second, third] = cards;
  return `${first.name} abre esta conversa ao convidar você a ${first.invitation}. Para acolher esse movimento, ${second.name} sugere ${second.invitation}. Juntas, essas duas imagens encontram em ${third.name} um caminho para ${third.invitation}. Leve consigo o que tocar seu coração; o próximo passo continua sendo seu.`;
}

export function shuffleDeck(): TarotCardData[] {
  const shuffled = [...deck];
  const random = new Uint32Array(1);
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Rejection sampling avoids modulo bias; never mutates the deck data.
    const limit = Math.floor(0x100000000 / (i + 1)) * (i + 1);
    do { crypto.getRandomValues(random); } while (random[0] >= limit);
    const j = random[0] % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
