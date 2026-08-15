export type CastMember = {
  slug: string;
  character: string;
  actor: string;
  image: string;
  context: string;
};

type CastDirectoryEntry = Omit<CastMember, "context">;

const castDirectory: readonly CastDirectoryEntry[] = [
  { slug: "magnolia-costa-leitao", character: "Magnólia Costa Leitão", actor: "Vera Holtz", image: "/cast/magnolia-costa-leitao.jpg" },
  { slug: "sebastiao-bezerra-tiao", character: "Sebastião Bezerra (Tião)", actor: "José Mayer", image: "/cast/sebastiao-bezerra-tiao.jpg" },
  { slug: "tiago-leitao", character: "Tiago Leitão", actor: "Humberto Carrão", image: "/cast/tiago-leitao.jpg" },
  { slug: "pedro-guedes-leitao", character: "Pedro Guedes Leitão", actor: "Reynaldo Gianecchini", image: "/cast/pedro-guedes-leitao.jpg" },
  { slug: "heloisa-martins", character: "Heloísa Martins", actor: "Cláudia Abreu", image: "/cast/heloisa-martins.jpg" },
  { slug: "leticia-siqueira-bezerra", character: "Letícia Siqueira Bezerra", actor: "Isabella Santoni", image: "/cast/leticia-siqueira-bezerra.jpg" },
  { slug: "ciro-noronha", character: "Ciro Noronha", actor: "Thiago Lacerda", image: "/cast/ciro-noronha.jpg" },
  { slug: "marina", character: "Marina", actor: "Alice Wegmann", image: "/cast/marina.jpg" },
  { slug: "isabela-dias", character: "Isabela Dias", actor: "Alice Wegmann", image: "/cast/isabela-dias.jpg" },
  { slug: "salete", character: "Salete", actor: "Claudia Raia", image: "/cast/salete.jpg" },
  { slug: "luciane-leitao", character: "Luciane Leitão", actor: "Grazi Massafera", image: "/cast/luciane-leitao.jpg" },
  { slug: "vitoria-costa-leitao", character: "Vitória Costa Leitão", actor: "Camila Morgado", image: "/cast/vitoria-costa-leitao.jpg" },
  { slug: "jessica", character: "Jéssica", actor: "Marcella Rica", image: "/cast/jessica.jpg" },
  { slug: "fausto-leitao", character: "Fausto Leitão", actor: "Tarcísio Meira", image: "/cast/fausto-leitao.jpg" },
  { slug: "ana-luiza-leitao", character: "Ana Luiza Leitão", actor: "Bianca Müller", image: "/cast/ana-luiza-leitao.jpg" },
  { slug: "elio-bataglia", character: "Elio Bataglia", actor: "João Campos", image: "/cast/elio-bataglia.jpg" },
  { slug: "antonio-ferrari", character: "Antonio Ferrari", actor: "Pierre Baitelli", image: "/cast/antonio-ferrari.jpg" },
  { slug: "gustavo", character: "Gustavo", actor: "Daniel Rocha", image: "/cast/gustavo.jpg" },
  { slug: "hercules-costa-leitao", character: "Hércules Costa Leitão", actor: "Danilo Granghéia", image: "/cast/hercules-costa-leitao.jpg" },
  { slug: "aline-oliveira", character: "Aline Oliveira", actor: "Arianne Botelho", image: "/cast/aline-oliveira.jpg" },
  { slug: "flavia-cardoso", character: "Flavia Cardoso", actor: "Maria Flor", image: "/cast/flavia-cardoso.jpg" },
  { slug: "camila-costa-leitao", character: "Camila Costa Leitão", actor: "Bruna Hamú", image: "/cast/camila-costa-leitao.jpg" },
  { slug: "elisabeth-beltrao-tavares", character: "Elisabeth Beltrão Tavares", actor: "Regiane Alves", image: "/cast/elisabeth-beltrao-tavares.jpg" },
  { slug: "bruno-pessoa", character: "Bruno Pessoa", actor: "Armando Babaioff", image: "/cast/bruno-pessoa.jpg" },
  { slug: "augusto-tavares", character: "Augusto Tavares", actor: "Ricardo Tozzi", image: "/cast/augusto-tavares.jpg" },
  { slug: "ruty-raquel", character: "Ruty Raquel", actor: "Titina Medeiros", image: "/cast/ruty-raquel.jpg" },
  { slug: "suzana-rivera", character: "Suzana Rivera", actor: "Regina Duarte", image: "/cast/suzana-rivera.jpg" },
  { slug: "cesar-venturini", character: "César Venturini", actor: "Otávio Augusto", image: "/cast/cesar-venturini.jpg" },
  { slug: "zelito", character: "Zelito", actor: "Dan Ferreira", image: "/cast/zelito.jpg" },
  { slug: "fininho", character: "Fininho", actor: "Hugo Resende", image: "/cast/fininho.jpg" },
  { slug: "robinson-rocha", character: "Robinson Rocha", actor: "Gabriel Chadan", image: "/cast/robinson-rocha.jpg" },
  { slug: "mileide-rocha", character: "Mileide Rocha", actor: "Heloisa Périssé", image: "/cast/mileide-rocha.jpg" },
  { slug: "gigi-ferrari", character: "Gigi Ferrari", actor: "Mila Moreira", image: "/cast/gigi-ferrari.jpg" },
  { slug: "yara-garcia", character: "Yara Garcia", actor: "Emanuelle Araújo", image: "/cast/yara-garcia.jpg" },
  { slug: "zuleika-pessoa-zuza", character: "Zuleika Pessoa (Zuza)", actor: "Ana Rosa", image: "/cast/zuleika-pessoa-zuza.jpg" },
  { slug: "candida-martins", character: "Cândida Martins", actor: "Denise Fraga", image: "/cast/candida-martins.jpg" },
  { slug: "delegado-celso", character: "Delegado Celso", actor: "Marcelo Várzea", image: "/cast/delegado-celso.jpg" },
  { slug: "jorge-martins", character: "Jorge Martins", actor: "Daniel Ribeiro", image: "/cast/jorge-martins.jpg" },
  { slug: "misael-de-oliveira", character: "Misael de Oliveira", actor: "Tuca Andrada", image: "/cast/misael-de-oliveira.jpg" },
  { slug: "eduardo-siqueira-bezerra", character: "Eduardo Siqueira Bezerra", actor: "Matheus Fagundes", image: "/cast/eduardo-siqueira-bezerra.jpg" },
  { slug: "carmem-da-silva-leitao", character: "Carmem da Silva Leitão", actor: "Bianca Salgueiro", image: "/cast/carmem-da-silva-leitao.jpg" },
  { slug: "gledson-rocha", character: "Gledson Rocha", actor: "Raphael Ghanem", image: "/cast/gledson-rocha.jpg" },
  { slug: "wesley", character: "Wesley", actor: "Gil Coelho", image: "/cast/wesley.jpg" },
  { slug: "juninho", character: "Juninho", actor: "André Luiz Frambach", image: "/cast/juninho.jpg" },
  { slug: "leila-de-oliveira", character: "Leila de Oliveira", actor: "Bia Montez", image: "/cast/leila-de-oliveira.jpg" },
  { slug: "pascoal-ferreto", character: "Pascoal Ferreto", actor: "Rafael Primot", image: "/cast/pascoal-ferreto.jpg" },
  { slug: "vanessa", character: "Vanessa", actor: "Amanda Mirásci", image: "/cast/vanessa.jpg" },
  { slug: "deputado-arlindo-nacib", character: "Deputado Arlindo Nacib", actor: "Maurício Machado", image: "/cast/deputado-arlindo-nacib.jpg" },
  { slug: "marcos-dos-santos-marcao", character: "Marcos dos Santos (Marcão)", actor: "Paulo Lessa", image: "/cast/marcos-dos-santos-marcao.jpg" },
  { slug: "olavo", character: "Olavo", actor: "Tato Gabus Mendes", image: "/cast/olavo.jpg" },
  { slug: "padre-paulo", character: "Padre Paulo", actor: "César Mello", image: "/cast/padre-paulo.jpg" },
  { slug: "rodney", character: "Rodney", actor: "Gustavo Merighi", image: "/cast/rodney.jpg" },
  { slug: "suely", character: "Suely", actor: "Priscila Camargo", image: "/cast/suely.jpg" },
  { slug: "david", character: "David", actor: "Rafael Lozano", image: "/cast/david.jpg" },
  { slug: "keila", character: "Keila", actor: "Carolina Lopez", image: "/cast/keila.jpg" },
  { slug: "ramiro-dos-santos", character: "Ramiro dos Santos", actor: "Jorge Lucas", image: "/cast/ramiro-dos-santos.jpg" },
  { slug: "rita-oliveira", character: "Rita Oliveira", actor: "Marjorie Bernardes", image: "/cast/rita-oliveira.jpg" },
  { slug: "sansao", character: "Sansão", actor: "Arlindo Lopes", image: "/cast/sansao.jpg" },
  { slug: "santa-de-jesus", character: "Santa de Jesus", actor: "Carmen Frenzel", image: "/cast/santa-de-jesus.jpg" },
  { slug: "xanaia", character: "Xanaia", actor: "Bella Piero", image: "/cast/xanaia.jpg" },
];

const characterContexts: Readonly<Record<string, string>> = {
  "magnolia-costa-leitao":
    "Matriarca da família Leitão, Magnólia é admirada em São Dimas por sua presença acolhedora e sua atuação social. Dentro de casa, tem personalidade forte e procura manter a família, a reputação e o poder sempre sob controle.",
  "sebastiao-bezerra-tiao":
    "Empresário autodidata de origem humilde, Tião construiu uma trajetória marcada por inteligência, estratégia e disciplina. Casado com Helô e pai de Letícia e Eduardo, costuma agir de forma reservada e calculada.",
  "tiago-leitao":
    "Neto de Fausto e Magnólia, Tiago cresceu cercado pelas expectativas da família Leitão e trabalha nos negócios do grupo. Namora Letícia quando um encontro inesperado com Isabela o faz questionar certezas que pareciam consolidadas.",
  "pedro-guedes-leitao":
    "Filho de Fausto, Pedro é arquiteto, firme e independente, além de guardar um vínculo afetivo profundo com Zuza, que o criou. Depois de muito tempo longe de São Dimas, retorna à cidade e reencontra pessoas e perguntas de seu passado.",
  "heloisa-martins":
    "Filha de Jorge e Cândida, Helô aprendeu cedo a enfrentar dificuldades sem abrir mão da franqueza e da dignidade. Na fase adulta, dirige uma galeria de arte, é mãe de Letícia e Eduardo e carrega a memória de seu primeiro amor por Pedro.",
  "leticia-siqueira-bezerra":
    "Filha de Helô e Tião, Letícia é sensível, intensa e muito ligada à família. Ao início da fase adulta da trama, recupera a rotina após um período delicado de saúde e tenta proteger seu relacionamento com Tiago.",
  "ciro-noronha":
    "De origem humilde e trajetória cercada de mistério, Ciro se aproxima dos Leitão por meio de Hércules e conquista espaço nos negócios da família. Casado com Vitória, é ambicioso, inteligente e nem sempre revela o que sente.",
  marina:
    "Uma jovem fisioterapeuta que chega a São Paulo em busca de trabalho e desperta curiosidade por sua forte semelhança com Isabela. Sua presença é envolvida por perguntas que a própria narrativa apresenta aos poucos — e que este perfil preserva.",
  "isabela-dias":
    "Estudiosa e reservada, Isabela trabalha em eventos para pagar o cursinho e sonha em estudar Medicina. Divide a vida com os amigos Flávia e Zelito e não se deixa impressionar facilmente quando Tiago se aproxima.",
  salete:
    "Dona de um movimentado posto de gasolina em São Dimas, Salete é expansiva, prática e dona de grande espírito empreendedor. É mãe de Jéssica e mãe adotiva de Flávia, conduzindo a família e o negócio com afeto e pulso firme.",
  "luciane-leitao":
    "Solar, espontânea e divertida, Luciane é casada com Hércules e ocupa seu espaço na família Leitão sem apagar a própria personalidade. Seu jeito direto e seu gosto exuberante contrastam com as formalidades do núcleo mais poderoso da cidade.",
  "vitoria-costa-leitao":
    "Filha de Fausto e Magnólia, Vitória é uma mulher sensível que procura acolhimento em meio às pressões da família. Casada com Ciro, ainda guarda lembranças importantes da história que viveu com Augusto na juventude.",
  jessica:
    "Filha biológica de Salete, Jéssica é amiga de Camila e deseja uma vida de conforto e prestígio. Namora Antônio no início de sua trajetória e costuma colocar suas ambições acima das expectativas da mãe.",
  "fausto-leitao":
    "Empresário e figura política central de São Dimas, Fausto comanda a tecelagem que sustenta boa parte da cidade. É pai de Pedro, Hércules e Vitória, e carrega decisões antigas que afetam suas relações familiares.",
  "ana-luiza-leitao":
    "Caçula de Hércules e Carmem, Ana Luiza é inteligente, questionadora e apaixonada por cinema. Sonha em ser documentarista e observa a própria família com uma câmera atenta a tudo o que os adultos preferem não discutir.",
  "elio-bataglia":
    "Jornalista ágil e idealista, Elio foi criado com grande afeto pela tia Suzana. Curioso e comprometido com a verdade, acompanha de perto os acontecimentos de São Dimas e não se intimida diante das famílias mais influentes.",
  "antonio-ferrari":
    "Filho de Gigi e Olavo, Antônio escolhe estudar Direito enquanto tenta compreender melhor a ausência do pai em sua formação. Charmoso, direto e de bom coração, inicia a trama adulta namorando Jéssica.",
  gustavo:
    "Gustavo chega ao posto de Salete como um funcionário discreto e de poucas palavras. Seu jeito misterioso chama a atenção da dona do negócio, enquanto ele procura encontrar seu lugar em São Dimas.",
  "hercules-costa-leitao":
    "Filho de Fausto e Magnólia, Hércules tem ambições políticas e busca corresponder ao peso do sobrenome Leitão. É casado com Luciane e pai de Tiago, Camila e Ana Luiza.",
  "aline-oliveira":
    "Filha mais velha de Yara e Misael, Aline trabalha como secretária de Magnólia e deseja ascender socialmente. Impulsiva e ambiciosa, nutre uma forte admiração por Tiago e costuma entrar em choque com os valores da família.",
  "flavia-cardoso":
    "Filha adotiva de Salete, Flávia é DJ, afetuosa e dona de uma sensatez que equilibra o grupo de amigos. Divide apartamento com Isabela e Zelito e ajuda a mãe no posto quando necessário.",
  "camila-costa-leitao":
    "Filha de Hércules e Carmem, Camila cresceu cercada pelo conforto e pelo prestígio da família Leitão. Consumista e preocupada com aparências, ainda precisa descobrir o que existe para além de seu círculo privilegiado.",
  "elisabeth-beltrao-tavares":
    "Socióloga e esposa de Augusto, Elisabeth se afastou de São Dimas para estudar no exterior depois de se frustrar com os limites da vida pública. Sua história começa marcada pela distância e por questões pendentes no casamento.",
  "bruno-pessoa":
    "Filho de Zuza, Bruno é um neurologista bem-sucedido que concluiu parte de sua formação no exterior com apoio de Magnólia. Ao voltar ao Brasil, passa a morar na pensão da mãe e se aproxima profissionalmente da família Leitão.",
  "augusto-tavares":
    "Prefeito de São Dimas, Augusto é um idealista pragmático, interessado em justiça social e na transformação da cidade. Foi o primeiro amor de Vitória e inicia a fase adulta casado com Elisabeth, que está no exterior.",
  "ruty-raquel":
    "Irmã de Mileide, Ruty Raquel é massagista no spa de Gigi. Doce, romântica e dona de um humor involuntário, acredita que talvez tenha esperado demais pelo amor, mas mantém uma visão generosa das pessoas.",
  "suzana-rivera":
    "Suzana é uma mulher simples e dedicada que criou o sobrinho Elio como filho. Contratada como secretária no universo dos Leitão, torna-se uma presença importante entre Magnólia e Fausto sem perder sua consciência sobre certo e errado.",
  "cesar-venturini":
    "Político experiente, César Venturini acompanha a ascensão pública de Fausto desde os primeiros passos. Na fase adulta, atua como senador e circula pelo núcleo de poder de São Dimas com grande habilidade para articulações.",
  zelito:
    "Barman na noite paulistana, Zelito também faz trabalhos ocasionais em produções publicitárias. É amigo e companheiro de apartamento de Flávia e Isabela, formando com elas um núcleo jovem e independente.",
  fininho:
    "Fininho é uma figura ligada ao mundo do crime que cruza o caminho de Jéssica. Sua aproximação traz risco e tensão para uma jovem atraída por promessas de dinheiro e status.",
  "robinson-rocha":
    "Filho de Mileide e irmão de Gledson, Robinson prefere uma vida tranquila às tentativas da mãe de transformá-lo em celebridade. Trabalha no posto de Salete e usa o bom humor para lidar com as diferenças sociais de São Dimas.",
  "mileide-rocha":
    "Expansiva e carismática, Mileide trabalha com esoterismo e confia tanto na intuição quanto em sua leitura afiada das pessoas. É mãe de Gledson e Robinson e uma presença conhecida em São Dimas.",
  "gigi-ferrari":
    "Ex-modelo, Gigi foi mentora de Helô e se tornou sua grande amiga e madrinha de Letícia. Sofisticada e experiente, dirige um spa em São Paulo e é mãe de Antônio.",
  "yara-garcia":
    "Sensata e afetuosa, Yara é o braço direito de Helô na galeria. Casada com Misael e mãe de Aline, Juninho e Rita, procura manter a família unida com firmeza e cuidado.",
  "zuleika-pessoa-zuza":
    "Antiga babá de Pedro, Zuza é uma referência materna para ele e uma mulher doce, firme e acolhedora. Mãe de Bruno, transforma sua chácara na Pensão Palácio, ponto de encontro de vários personagens.",
  "candida-martins":
    "Mãe de Helô e esposa de Jorge, Cândida enfrenta a pobreza e uma doença séria com fé, serenidade e enorme amor pela família. Sua força silenciosa é uma das bases emocionais da primeira fase.",
  "delegado-celso":
    "Responsável pela delegacia de São Dimas, Celso conduz investigações que atingem o centro político e empresarial da cidade. Tem postura objetiva e precisa trabalhar sob a pressão dos nomes mais influentes da região.",
  "jorge-martins":
    "Pai de Helô e marido de Cândida, Jorge é um ex-funcionário da tecelagem Leitão que enfrenta o desemprego e o alcoolismo. Ama a família, mas sua fragilidade torna ainda mais difícil o momento vivido por todos.",
  "misael-de-oliveira":
    "Contramestre da fábrica de Fausto, Misael é um homem humilde, franco e dedicado à família. Casado com Yara, é pai de Aline, Juninho e Rita e valoriza uma vida simples guiada por afeto e justiça.",
  "eduardo-siqueira-bezerra":
    "Filho de Helô e Tião, Eduardo é inteligente, bem-humorado e especialmente próximo da mãe. Afetuoso e simples, oferece leveza a uma casa marcada por personalidades muito fortes.",
  "carmem-da-silva-leitao":
    "Na primeira fase, Carmem é balconista de farmácia, esposa de Hércules e mãe de Tiago, Camila e Ana Luiza. De origem simples, tenta proteger os filhos enquanto aprende a enfrentar o poder da família Leitão.",
  "gledson-rocha":
    "Filho de Mileide e irmão de Robinson, Gledson acompanha moda e celebridades com entusiasmo. Afetuoso com a mãe, encontra espaço para seu talento ao trabalhar como stylist de Luciane.",
  wesley:
    "Frentista no posto de Salete, Wesley encara com dedicação a rotina de trabalho e os desafios de criar um filho sozinho. É uma presença responsável e próxima do cotidiano popular de São Dimas.",
  juninho:
    "Filho de Yara e Misael, Juninho é ponderado, responsável e muito protetor com a irmã mais nova, Rita. Costuma observar com senso crítico as escolhas da irmã mais velha, Aline.",
  "leila-de-oliveira":
    "Prima de Misael, Leila trabalha na casa de Magnólia e conhece de perto a rotina dos Leitão. Direta e corajosa, não costuma esconder o que pensa, mesmo diante dos patrões.",
  "pascoal-ferreto":
    "Pascoal é um profissional de marketing político contratado para construir campanhas e discursos públicos. Sua atuação o coloca ao lado de Venturini e de outros nomes influentes de São Dimas.",
  vanessa:
    "Vanessa entra no núcleo empresarial como secretária de Tião. Profissional e discreta, acompanha de perto uma rotina em que negócios, poder e assuntos pessoais frequentemente se misturam.",
  "deputado-arlindo-nacib":
    "Arlindo Nacib é um deputado inserido no mesmo círculo político de Fausto e Venturini. Experiente nas articulações de bastidor, representa uma das conexões entre os negócios privados e a vida pública de São Dimas.",
  "marcos-dos-santos-marcao":
    "Filho de Ramiro, Marcão é um rapaz trabalhador e de bom coração que atua na Tecelagem Costa Leitão. Conhece Aline desde a adolescência e mantém por ela um sentimento que não depende de dinheiro ou posição social.",
  olavo:
    "Advogado renomado, Olavo gosta de viajar, velejar e aproveitar a vida fora dos tribunais. É pai de Antônio e mantém com Gigi uma relação formada por uma história antiga e uma paternidade descoberta tardiamente.",
  "padre-paulo":
    "Pároco da igreja de São Dimas, Padre Paulo participa ativamente da vida comunitária e de iniciativas filantrópicas. Admira Magnólia e a enxerga como uma grande benfeitora da cidade.",
  rodney:
    "Rodney trabalha como frentista no posto de Salete e é conhecido pelo jeito forte, simpático e um pouco atrapalhado. Recém-casado com Keila, precisa equilibrar a vida doméstica com sua tendência a flertar.",
  suely:
    "Secretária de Fausto e Ciro, Suely é sensível, dedicada e atenta ao clima do ambiente de trabalho. Ocupa uma posição que lhe permite perceber muito do que acontece nos bastidores da família e da empresa.",
  david:
    "Diretor de Operações de Tião, David é inteligente, ambicioso e bem-humorado, sem abrir mão de seus princípios. Enteado de Olavo, circula entre o núcleo empresarial e o grupo jovem da trama.",
  keila:
    "Secretária de Augusto na prefeitura, Keila acompanha o ritmo e as pressões da administração de São Dimas. É casada com Rodney e procura organizar uma vida a dois tão agitada quanto o cotidiano do posto de Salete.",
  "ramiro-dos-santos":
    "Antigo companheiro de trabalho de Tião, Ramiro tornou-se seu chofer e interlocutor de confiança. Viúvo e pai de Marcão, vive na Pensão Palácio e guarda profunda gratidão pelo amigo.",
  "rita-oliveira":
    "Caçula de Yara e Misael, Rita nasceu com uma condição pulmonar que exige atenção especial. Cercada pelo cuidado dos pais e do irmão Juninho, é um elo de ternura dentro da família Oliveira.",
  sansao:
    "Especialista em terapias alternativas, Sansão sonha com uma vida de recolhimento e espiritualidade. Enquanto isso, assume a criação da sobrinha adotiva Xanaia e mora com ela na Pensão Palácio.",
  "santa-de-jesus":
    "Cozinheira da família Leitão, Santa conhece o cotidiano da casa e acompanha de perto seus diferentes temperamentos. Leal e trabalhadora, faz parte da estrutura doméstica que sustenta o núcleo familiar.",
  xanaia:
    "Adolescente criada pelo tio adotivo Sansão, Xanaia mora na Pensão Palácio. Bem-humorada, debochada e extremamente franca, costuma dizer o que pensa sem se intimidar com ninguém.",
};

export const castMembers: readonly CastMember[] = castDirectory.map((person) => ({
  ...person,
  context: characterContexts[person.slug],
}));

const featuredCharacters = [
  "heloisa-martins",
  "pedro-guedes-leitao",
  "magnolia-costa-leitao",
  "sebastiao-bezerra-tiao",
  "tiago-leitao",
  "leticia-siqueira-bezerra",
  "salete",
  "ciro-noronha",
] as const;

const featuredSet = new Set<string>(featuredCharacters);

export const mainCast = featuredCharacters.map((slug) =>
  castMembers.find((person) => person.slug === slug)!,
);

export const supportingCast = castMembers.filter(
  (person) => !featuredSet.has(person.slug),
);
