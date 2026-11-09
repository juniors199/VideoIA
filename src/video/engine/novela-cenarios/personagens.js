/*
 * 
 * 
 */
/**
 * Personagens e poses do estilo "novela" (porte de 04/11/2026; análise em produto/estilos-reels/NOVELA-REFERENCIAS-2026-11-04.md).
 * Registrados no MECANISMO COMUM dos estilos (cenarios-estilo.js, `registrarPersonagens`), só com dados: o desenhista
 * (estilo-novela-personagem.js) lê roupa, cabelo, barba, idade e acessórios e desenha a figura vetorial pintada das
 * referências (cabeça grande, corpo alongado, gradiente macio, sem contorno, sombra de contato). O projeto traz os seus em
 * pecas.js: `export const personagensEstilo = { novela: { 'meu-id': {...} } }` e `export const posesEstilo = { novela: {...} }`.
 *
 * Exceção do dono (04/11/2026, só neste estilo): pessoa citada pelo NOME aparece ILUSTRADA, no mesmo traço (personagem com
 * `rotulo`, a etiqueta do nome); a foto real só quando o usuário pede (`fotoReal: true` na forma `retrato`). Abaixo, papéis sem
 * nome e figuras históricas comuns (papa, imperador, inventor), que o projeto ajusta ou amplia pelo pecas.js.
 *
 * Campos de um personagem (cores "#rrggbb"):
 *   nome, temas (palavras da fala que o chamam), tom ('classico' | 'serie' | 'ambos'), corpo (CORPOS), roupa, roupa2 (detalhe),
 *   calca, sapato, pele, cabelo, penteado (PENTEADOS), barba (BARBAS), olhos, idade ('jovem' | 'adulto' | 'idoso'),
 *   acessorios (ACESSORIOS), aureola (bool), altura (0,8 a 1,15), largura (0,85 a 1,2), pose (id de pose).
 */
import { registrarPersonagens } from '../cenarios-estilo.js';

export const CORPOS = ['habito', 'batina', 'vestido', 'tunica', 'camiseta', 'jaqueta', 'uniforme', 'terno', 'manto'];
export const PENTEADOS = ['solideu', 'louros', 'veu', 'tonsura', 'curto', 'topete', 'longo', 'coque', 'careca', 'touca', 'barrete', 'capuz', 'quepe', 'capacete', 'elmo', 'coroa', 'chapeu', 'lenco'];
export const BARBAS = ['nenhuma', 'curta', 'cheia', 'longa', 'bigode'];
export const ACESSORIOS = ['oculos', 'mozeta', 'cinto-corda', 'rosario', 'escapulario', 'avental', 'gola', 'listras', 'cinto', 'botoes', 'mochila', 'cruz-peito', 'gravata', 'faixa', 'estola', 'manto-ombro'];
export const EXPRESSOES = ['neutra', 'sorriso', 'triste', 'surpresa', 'brava', 'fechados', 'preocupada'];

/**
 * Poses: ângulos em graus por junta (contrato comum: tronco, cabeca, bracoE, bracoD, pernaE, pernaD).
 * Braço: [ombro, cotovelo]: ombro 0 = pendurado; positivo abre para fora do corpo; cotovelo positivo dobra o antebraço para
 * cima e para dentro (para o peito). Perna: [quadril, joelho]. `maos`: abertas, juntas, punho, apontando, segurando, bencao.
 * `ciclo` (andar, acenar, falar) anima a pose sozinha; `sentado` e `ajoelhado` encurtam a figura.
 */
export const POSES_NOVELA = {
  'de-pe': { nome: 'De pé', juntas: { tronco: [0], cabeca: [0], bracoE: [6, 14], bracoD: [6, 14] }, maos: 'abertas' },
  falando: { nome: 'Falando (a mão aberta sobe)', juntas: { tronco: [0], cabeca: [-3], bracoE: [6, 12], bracoD: [18, 118] }, maos: 'abertas', ciclo: 'falar' },
  apontando: { nome: 'Apontando', juntas: { tronco: [2], cabeca: [4], bracoE: [6, 12], bracoD: [78, 8] }, maos: 'apontando' },
  rezando: { nome: 'Rezando (mãos juntas no peito)', juntas: { tronco: [0], cabeca: [5], bracoE: [12, 148], bracoD: [12, 148] }, maos: 'juntas', olhos: 'fechados' },
  acenando: { nome: 'Acenando', juntas: { tronco: [-2], cabeca: [-4], bracoE: [6, 12], bracoD: [150, 30] }, maos: 'abertas', ciclo: 'acenar' },
  'bracos-abertos': { nome: 'Braços abertos', juntas: { tronco: [0], cabeca: [-6], bracoE: [62, 18], bracoD: [62, 18] }, maos: 'abertas' },
  segurando: { nome: 'Segurando um objeto no peito', juntas: { tronco: [0], cabeca: [6], bracoE: [16, 112], bracoD: [16, 112] }, maos: 'segurando' },
  pensativo: { nome: 'Pensativo (mão no queixo)', juntas: { tronco: [0], cabeca: [7], bracoE: [14, 120], bracoD: [10, 158] }, maos: 'punho' },
  abencoando: { nome: 'Abençoando (dois dedos)', juntas: { tronco: [0], cabeca: [-2], bracoE: [6, 14], bracoD: [36, 128] }, maos: 'bencao' },
  surpreso: { nome: 'Surpreso (mãos ao rosto)', juntas: { tronco: [-3], cabeca: [-6], bracoE: [26, 150], bracoD: [26, 150] }, maos: 'abertas', expr: 'surpresa' },
  caminhando: { nome: 'Caminhando', juntas: { tronco: [2], cabeca: [0], bracoE: [8, 16], bracoD: [8, 16], pernaE: [0, 0], pernaD: [0, 0] }, maos: 'abertas', ciclo: 'andar' },
  sentado: { nome: 'Sentado', juntas: { tronco: [0], cabeca: [3], bracoE: [12, 70], bracoD: [12, 70], pernaE: [80, 85], pernaD: [80, 85] }, maos: 'abertas', sentado: true },
  ajoelhado: { nome: 'Ajoelhado rezando', juntas: { tronco: [4], cabeca: [8], bracoE: [12, 148], bracoD: [12, 148], pernaE: [10, 90], pernaD: [10, 90] }, maos: 'juntas', ajoelhado: true, olhos: 'fechados' },
  'bracos-cruzados': { nome: 'Braços cruzados', juntas: { tronco: [0], cabeca: [-2], bracoE: [16, 132], bracoD: [16, 132] }, maos: 'punho', cruzados: true },
  'mao-no-peito': { nome: 'Mão no peito', juntas: { tronco: [0], cabeca: [4], bracoE: [6, 12], bracoD: [14, 140] }, maos: 'abertas' },
  cumprimentando: { nome: 'Cumprimentando (a mão estendida para o outro)', juntas: { tronco: [-2], cabeca: [-3], bracoE: [6, 12], bracoD: [20, 4] }, maos: 'abertas', expr: 'sorriso' }, // a mão vai até o meio entre dois atores a ~260 px (o aperto de mão), na altura do quadril
  cansado: { nome: 'Cansado (cabeça baixa)', juntas: { tronco: [6], cabeca: [14], bracoE: [4, 8], bracoD: [4, 8] }, maos: 'abertas', expr: 'triste' },
  // 05/11/2026 (melhorias do Novela): a ação da fala no corpo. Tocar (o corpo inclina, a mão desce e vai para a frente, na barra do
  // manto de quem está ao lado) e virar para trás (ombros giram, cabeça procura quem tocou)
  tocando: { nome: 'Tocando (o corpo inclina e a mão estende para baixo e para a frente)', juntas: { tronco: [10], cabeca: [12], bracoE: [8, 20], bracoD: [46, 4] }, maos: 'abertas', expr: 'preocupada' },
  virando: { nome: 'Virando para trás (ombros e cabeça procuram quem tocou)', juntas: { tronco: [-5], cabeca: [-9], bracoE: [12, 18], bracoD: [16, 34] }, maos: 'abertas', expr: 'surpresa' },
  'mao-no-ombro': { nome: 'Mão no ombro de quem está ao lado (a mão sobe e vai para o lado)', juntas: { tronco: [-2], cabeca: [6], bracoE: [8, 16], bracoD: [74, 28] }, maos: 'abertas', expr: 'sorriso' },
  'olhando-maos': { nome: 'Olhando as próprias mãos (cabeça baixa, mãos à frente)', juntas: { tronco: [6], cabeca: [16], bracoE: [16, 96], bracoD: [16, 96] }, maos: 'abertas', expr: 'triste' },
  'mao-na-boca': { nome: 'Mão na boca (o silêncio, não chamar)', juntas: { tronco: [2], cabeca: [4], bracoE: [6, 14], bracoD: [18, 156] }, maos: 'punho', expr: 'preocupada' },
  // 06/11/2026 (v4 do Reel da cura, o dono: "representar melhor ainda o que é falado"): a rejeição, a barreira e a dúvida no corpo
  afastando: { nome: 'Afastando-se (o corpo recua, as mãos sobem na frente, evitando o toque)', juntas: { tronco: [-8], cabeca: [-5], bracoE: [26, 74], bracoD: [30, 66] }, maos: 'abertas', expr: 'preocupada' },
  impedindo: { nome: 'Impedindo a passagem (o braço estendido de lado, a palma aberta)', juntas: { tronco: [-2], cabeca: [-3], bracoE: [6, 14], bracoD: [84, 2] }, maos: 'abertas', expr: 'brava' },
  'sem-entender': { nome: 'Sem entender (as mãos abertas para os lados, cabeça inclinada: "quem?")', juntas: { tronco: [0], cabeca: [-8], bracoE: [46, 22], bracoD: [46, 22] }, maos: 'abertas', expr: 'surpresa' },
  curada: { nome: 'Curada (mãos abertas no peito, rosto para o alto)', juntas: { tronco: [-3], cabeca: [-10], bracoE: [20, 128], bracoD: [20, 128] }, maos: 'abertas', expr: 'sorriso', olhos: 'fechados' },
};

/** cores de pele, cabelo e tecido por papel (as referências usam tons de terra, preto do hábito, azul-petróleo e vermelho escuro) */
const PELE = { clara: '#F2C9AE', media: '#E2AE8A', morena: '#C68A64', escura: '#8E5B3E' };
export const PERSONAGENS_NOVELA = {
  // ── tom clássico (hagiografia ilustrada: referências 01 a 04) ──
  monge: { nome: 'Monge', temas: ['monge', 'monges', 'frade', 'frei', 'irmao', 'mosteiro'], tom: 'classico', corpo: 'habito', roupa: '#7A5638', roupa2: '#5E4029', pele: PELE.media, cabelo: '#4A3524', penteado: 'tonsura', barba: 'curta', olhos: '#4A3020', idade: 'adulto', acessorios: ['cinto-corda', 'escapulario'], pose: 'de-pe' },
  'monge-idoso': { nome: 'Monge idoso', temas: ['abade', 'ancia', 'velho monge'], tom: 'classico', corpo: 'habito', roupa: '#24232B', roupa2: '#17161D', pele: PELE.clara, cabelo: '#E9E6E0', penteado: 'careca', barba: 'longa', olhos: '#4A3A30', idade: 'idoso', acessorios: ['escapulario'], aureola: false, pose: 'de-pe' },
  freira: { nome: 'Freira', temas: ['freira', 'freiras', 'irma', 'irmas', 'religiosa', 'convento', 'madre'], tom: 'classico', corpo: 'habito', roupa: '#7B5A40', roupa2: '#5F442F', pele: PELE.clara, cabelo: '#1E1C26', penteado: 'veu', barba: 'nenhuma', olhos: '#5A4636', idade: 'adulto', acessorios: ['rosario', 'escapulario'], pose: 'de-pe' },
  'freira-cinza': { nome: 'Freira de hábito cinza', temas: ['clarissa', 'clarissas', 'claustro'], tom: 'classico', corpo: 'habito', roupa: '#7E7A62', roupa2: '#646048', pele: PELE.clara, cabelo: '#24222A', penteado: 'veu', barba: 'nenhuma', olhos: '#4E4034', idade: 'adulto', acessorios: ['cinto-corda', 'rosario'], pose: 'de-pe' },
  padre: { nome: 'Padre', temas: ['padre', 'sacerdote', 'confessor', 'confissao', 'paroco', 'bispo'], tom: 'classico', corpo: 'batina', roupa: '#1E1E26', roupa2: '#ECE8E0', pele: PELE.clara, cabelo: '#E4E1DA', penteado: 'barrete', barba: 'cheia', olhos: '#3E3A36', idade: 'idoso', acessorios: ['gola'], pose: 'de-pe' },
  camponesa: { nome: 'Mulher do povo', temas: ['mulher', 'senhora', 'moca', 'camponesa', 'aldea', 'mae', 'esposa', 'vizinha'], tom: 'classico', corpo: 'vestido', roupa: '#1F6070', roupa2: '#EFE8D8', pele: PELE.clara, cabelo: '#5A3A24', penteado: 'touca', barba: 'nenhuma', olhos: '#4A3426', idade: 'adulto', acessorios: ['avental', 'gola'], pose: 'de-pe' },
  campones: { nome: 'Homem do povo', temas: ['homem', 'campones', 'aldeao', 'pai', 'marido', 'trabalhador', 'pescador', 'pastor'], tom: 'classico', corpo: 'tunica', roupa: '#7C5A3A', roupa2: '#C9B48E', calca: '#4E4A40', sapato: '#3A2A1E', pele: PELE.media, cabelo: '#3E2C1E', penteado: 'curto', barba: 'curta', olhos: '#3E2C20', idade: 'adulto', acessorios: ['cinto'], pose: 'de-pe' },
  'soldado-antigo': { nome: 'Soldado medieval', temas: ['invasor', 'invasores', 'armado', 'armados', 'guarda', 'cavaleiro', 'mercenario'], tom: 'classico', corpo: 'tunica', roupa: '#7A2E28', roupa2: '#8A8E94', calca: '#4C4A44', sapato: '#3A2A1E', pele: PELE.media, cabelo: '#3A2A1E', penteado: 'elmo', barba: 'cheia', olhos: '#3A2A1E', idade: 'adulto', acessorios: ['cinto'], pose: 'de-pe' },
  rei: { nome: 'Rei', temas: ['rei', 'imperador', 'monarca', 'principe', 'soberano'], tom: 'classico', corpo: 'manto', roupa: '#6E1E2A', roupa2: '#EFE6D2', pele: PELE.clara, cabelo: '#8A6A44', penteado: 'coroa', barba: 'cheia', olhos: '#3E3226', idade: 'adulto', acessorios: ['faixa'], pose: 'de-pe' },
  rainha: { nome: 'Rainha', temas: ['rainha', 'imperatriz', 'princesa', 'dama'], tom: 'classico', corpo: 'vestido', roupa: '#2E3E72', roupa2: '#EFE6D2', pele: PELE.clara, cabelo: '#6A4426', penteado: 'coroa', barba: 'nenhuma', olhos: '#3E3226', idade: 'adulto', acessorios: ['gola'], pose: 'de-pe' },
  crianca: { nome: 'Criança', temas: ['crianca', 'criancas', 'menino', 'menina', 'filho', 'filha', 'garoto'], tom: 'ambos', corpo: 'tunica', roupa: '#8A6A3E', roupa2: '#D8C8A8', calca: '#5A5244', sapato: '#3A2A1E', pele: PELE.media, cabelo: '#5A3A24', penteado: 'curto', barba: 'nenhuma', olhos: '#4A3426', idade: 'jovem', altura: 0.72, pose: 'de-pe' },
  // ── soldados de 1914 (a prévia; servem a qualquer história de guerra de trincheira) ──
  'soldado-britanico': { nome: 'Soldado britânico (1914)', temas: ['britanico', 'britanicos', 'ingles', 'ingleses', 'soldado', 'soldados', 'tropas', 'aliados'], tom: 'ambos', corpo: 'uniforme', roupa: '#7A6C46', roupa2: '#5C5034', calca: '#6E6240', sapato: '#3A2C20', pele: PELE.clara, cabelo: '#5A3E28', penteado: 'quepe', barba: 'bigode', olhos: '#3E3228', idade: 'adulto', acessorios: ['cinto', 'botoes'], pose: 'de-pe' },
  'soldado-alemao': { nome: 'Soldado alemão (1914)', temas: ['alemao', 'alemaes', 'germanico', 'inimigo'], tom: 'ambos', corpo: 'uniforme', roupa: '#6E7466', roupa2: '#565C50', calca: '#62685C', sapato: '#2E2A26', pele: PELE.clara, cabelo: '#C9A46A', penteado: 'capacete', barba: 'nenhuma', olhos: '#3C4A58', idade: 'adulto', acessorios: ['cinto', 'botoes'], pose: 'de-pe' },
  oficial: { nome: 'Oficial de comando', temas: ['comandante', 'comandantes', 'general', 'generais', 'oficial', 'oficiais', 'governo', 'governos', 'ministro'], tom: 'ambos', corpo: 'uniforme', roupa: '#4E4A3A', roupa2: '#3A3628', calca: '#4A4636', sapato: '#221E1A', pele: PELE.clara, cabelo: '#9A9A96', penteado: 'quepe', barba: 'bigode', olhos: '#3A3632', idade: 'idoso', acessorios: ['cinto', 'botoes', 'faixa'], pose: 'bracos-cruzados' },
  // ── figuras históricas (a pessoa citada pelo nome, ilustrada: dê o nome no ator com "rotulo") ──
  papa: { nome: 'Papa', temas: ['papa', 'pontifice', 'santo padre', 'vaticano'], tom: 'ambos', corpo: 'batina', roupa: '#F2EFE8', roupa2: '#E4DED2', pele: PELE.clara, cabelo: '#4A4038', penteado: 'solideu', barba: 'nenhuma', olhos: '#3E3832', idade: 'adulto', acessorios: ['mozeta', 'cruz-peito', 'oculos', 'gola'], pose: 'de-pe' },
  imperador: { nome: 'Imperador romano', temas: ['imperador', 'cesar', 'roma', 'romano', 'senado'], tom: 'classico', corpo: 'manto', roupa: '#6A2A5E', roupa2: '#EFE6D2', pele: PELE.media, cabelo: '#3A2A1E', penteado: 'louros', barba: 'nenhuma', olhos: '#3A2A1E', idade: 'adulto', acessorios: ['faixa'], pose: 'de-pe' },
  inventor: { nome: 'Inventor (século 19)', temas: ['inventor', 'inventou', 'invencao', 'cientista', 'engenheiro', 'patente'], tom: 'ambos', corpo: 'terno', roupa: '#3A3430', roupa2: '#E8E2D6', calca: '#2E2A26', sapato: '#1E1A16', pele: PELE.clara, cabelo: '#8A8A86', penteado: 'curto', barba: 'cheia', olhos: '#3A3632', idade: 'idoso', acessorios: ['gravata'], pose: 'pensativo' },
  // ── relatos bíblicos (fila de misticismo, 05/11/2026): túnica longa, manto no ombro, cabeça coberta ──
  jesus: { nome: 'Jesus', identidade: true, temas: ['jesus', 'cristo', 'mestre', 'nazare', 'senhor'], tom: 'classico', corpo: 'habito', roupa: '#EEE6D4', roupa2: '#A8443A', pele: PELE.morena, cabelo: '#4A3020', penteado: 'longo', barba: 'cheia', olhos: '#3A2418', idade: 'adulto', acessorios: ['manto-ombro'], pose: 'de-pe', sorriso: 0.55 },
  'mulher-biblica': { nome: 'Mulher (tempo bíblico)', identidade: true, temas: ['mulher do fluxo', 'samaritana', 'viuva', 'galileia', 'impura'], tom: 'classico', corpo: 'vestido', roupa: '#5E6E8A', roupa2: '#E6DCC6', pele: PELE.morena, cabelo: '#3A2618', penteado: 'capuz', barba: 'nenhuma', olhos: '#3A2418', idade: 'adulto', acessorios: ['manto-ombro'], pose: 'de-pe' },
  discipulo: { nome: 'Discípulo', identidade: true, temas: ['discipulo', 'discipulos', 'apostolo', 'apostolos', 'pedro', 'joao'], tom: 'classico', corpo: 'habito', roupa: '#8A6E4E', roupa2: '#4E6E86', pele: PELE.media, cabelo: '#3A2A1E', penteado: 'curto', barba: 'cheia', olhos: '#3A2A1E', idade: 'adulto', acessorios: ['manto-ombro'], pose: 'de-pe' },
  'povo-biblico': { nome: 'Homem do povo (tempo bíblico, lenço na cabeça)', temas: ['multidao', 'povo', 'gente', 'pessoas'], tom: 'classico', corpo: 'habito', variaRoupa: ['#A88A62', '#8E7456', '#6E6A5C', '#9A6A4A', '#B8A07A'], roupa: '#A88A62', roupa2: '#EDE6D6', pele: PELE.morena, cabelo: '#2E2218', penteado: 'lenco', barba: 'cheia', olhos: '#2E2218', idade: 'adulto', pose: 'de-pe' },
  'povo-biblica': { nome: 'Mulher do povo (tempo bíblico, cabeça coberta)', temas: ['mulheres'], tom: 'classico', corpo: 'vestido', variaRoupa: ['#9A5A44', '#6A5A7A', '#7A6A3E', '#8A4A3A', '#5A6A6A'], roupa: '#9A5A44', roupa2: '#E6DCC6', pele: PELE.morena, cabelo: '#2E2218', penteado: 'capuz', barba: 'nenhuma', olhos: '#2E2218', idade: 'adulto', pose: 'de-pe' },
  // ── tom série (drama interativo moderno: referências 05 e 06) ──
  rapaz: { nome: 'Rapaz', temas: ['rapaz', 'jovem', 'cara', 'voce', 'ele'], tom: 'serie', corpo: 'camiseta', roupa: '#8E1F2A', roupa2: '#1C1A1E', calca: '#E8E6E2', sapato: '#ECE9E4', pele: PELE.media, cabelo: '#4A3022', penteado: 'topete', barba: 'cheia', olhos: '#3E2A1E', idade: 'jovem', acessorios: ['listras'], pose: 'de-pe' },
  moca: { nome: 'Moça', temas: ['moca', 'garota', 'ela', 'amiga', 'irma'], tom: 'serie', corpo: 'jaqueta', roupa: '#6E2A5E', roupa2: '#2A2830', calca: '#2E3446', sapato: '#2A2626', pele: PELE.morena, cabelo: '#3A2618', penteado: 'longo', barba: 'nenhuma', olhos: '#3A2418', idade: 'jovem', pose: 'de-pe' },
  'mulher-serie': { nome: 'Mulher (série)', temas: ['mulher', 'mae', 'senhora', 'vizinha'], tom: 'serie', corpo: 'jaqueta', roupa: '#C79AA8', roupa2: '#2A2830', calca: '#E2E0DC', sapato: '#ECE9E4', pele: PELE.clara, cabelo: '#4E3422', penteado: 'longo', barba: 'nenhuma', olhos: '#3E2A1E', idade: 'adulto', pose: 'de-pe' },
  policial: { nome: 'Policial', temas: ['policial', 'policia', 'viatura', 'agente', 'detetive', 'investigador'], tom: 'serie', corpo: 'uniforme', roupa: '#22324A', roupa2: '#18243A', calca: '#1E2A3E', sapato: '#141414', pele: PELE.morena, cabelo: '#1E1A16', penteado: 'quepe', barba: 'nenhuma', olhos: '#2E2218', idade: 'adulto', acessorios: ['cinto', 'botoes'], pose: 'bracos-cruzados' },
  executivo: { nome: 'Homem de terno', temas: ['empresario', 'executivo', 'chefe', 'patrao', 'dono', 'banqueiro', 'advogado', 'politico'], tom: 'ambos', corpo: 'terno', roupa: '#2A2E3A', roupa2: '#E8E6E2', calca: '#262A34', sapato: '#161616', pele: PELE.clara, cabelo: '#2E2620', penteado: 'curto', barba: 'nenhuma', olhos: '#3A2E26', idade: 'adulto', acessorios: ['gravata'], pose: 'de-pe' },
  idosa: { nome: 'Senhora idosa', temas: ['avo', 'idosa', 'velhinha', 'senhora'], tom: 'ambos', corpo: 'vestido', roupa: '#5A4A6A', roupa2: '#E6E0D6', pele: PELE.clara, cabelo: '#E6E3DE', penteado: 'coque', barba: 'nenhuma', olhos: '#4A4036', idade: 'idoso', acessorios: ['gola'], pose: 'de-pe' },
  medico: { nome: 'Médico', temas: ['medico', 'medica', 'doutor', 'cientista', 'hospital', 'enfermeiro'], tom: 'ambos', corpo: 'terno', roupa: '#F0EEEA', roupa2: '#3A6A8A', calca: '#3A3E48', sapato: '#1E1E1E', pele: PELE.morena, cabelo: '#2A1E16', penteado: 'curto', barba: 'nenhuma', olhos: '#2E2218', idade: 'adulto', acessorios: ['gravata'], pose: 'de-pe' },
};

registrarPersonagens('novela', PERSONAGENS_NOVELA, POSES_NOVELA);
