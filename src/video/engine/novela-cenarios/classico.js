/*
 * 
 * 
 */
/**
 * Cenários do tom "clássico" do estilo novela (hagiografia e história ilustrada, referências 01 a 04), só com dados no
 * contrato comum. Cada um: nome, temas, ambiente.fundo (1 a 3 cores), luz, nevoa, particulas, props (camadas de fundo para a
 * frente, cada uma com `p`: profundidade da paralaxe, 0 = longe, 1 = o plano dos personagens, maior que 1 = primeiro plano),
 * palco (onde os personagens pisam: `chao` y, `escala`, `xs` posições), clima, camera e acabamento (0 a 1).
 * Cores de material e de cenário (céu, pedra, madeira, tecido), registradas em test/fixtures/cor-da-marca-excecoes.json.
 */
export default {
  'montanha-gruta': {
    nome: 'Montanha com a gruta (eremita)', tom: 'classico', temas: ['gruta', 'caverna', 'montanha', 'solidao', 'eremita', 'monte', 'retiro', 'deserto'],
    ambiente: { fundo: ['#7EA6CF', '#C9D7DF', '#E6DBC2'] }, luz: { tipo: 'dia', cor: '#FFF4DC', forca: 1 }, nevoa: { cor: '#F2EEE2', alfa: 0.25, altura: 0.3 }, particulas: { poeira: 0.3, faiscas: 0.2 },
    props: [
      { tipo: 'ceu', p: 0.1, cores: ['#5E8FC4', '#9EC0DC', '#E9E2CC'] }, { tipo: 'nuvens', p: 0.15, y: 160, n: 5, faixa: 260 },
      { tipo: 'montanha', p: 0.55, x: 560, y: 1180, l: 1500, a: 1080, cor: '#DCCBA8', musgo: '#86B654' },
      { tipo: 'gruta', p: 0.6, x: 560, y: 1010, l: 330, a: 430, cor: '#7A5032' },
      { tipo: 'colinas', p: 0.8, y: 1240, cor: '#86BC54', n: 2 }, { tipo: 'campo', p: 0.9, y: 1380, cor: '#7FB650' },
      { tipo: 'caminho', p: 0.9, pontos: [[620, 2300], [880, 1900], [380, 1640], [700, 1380], [560, 1010]], largura: 40, cor: '#EBDDB4' },
      { tipo: 'arvores', p: 0.85, lista: [[90, 1330, 150], [1000, 1290, 130], [180, 1700, 210]], forma: 'redonda' },
    ],
    palco: { chao: 1010, escala: 0.34, xs: [560, 470, 650] }, clima: 'solene', camera: 'empurra', acabamento: { manchas: 0.5, vinheta: 0.2, bloom: 0.25, dof: 0.6 },
  },
  'igreja-praca': {
    nome: 'Igreja na praça verde', tom: 'classico', temas: ['igreja', 'mosteiro', 'abadia', 'paroquia', 'comunidade', 'missa', 'vila'],
    ambiente: { fundo: ['#8FB6D8', '#D6E2E6', '#E8DFC6'] }, luz: { tipo: 'dia', cor: '#FFF4DC', forca: 1 }, nevoa: { cor: '#F4F0E4', alfa: 0.2, altura: 0.25 }, particulas: { poeira: 0.25 },
    props: [
      { tipo: 'ceu', p: 0.1, cores: ['#7FAAD2', '#BCD3E2', '#EEE6D0'] }, { tipo: 'nuvens', p: 0.15, y: 220, n: 4 },
      { tipo: 'colinas', p: 0.4, y: 1000, cor: '#9CC46A', n: 2 }, { tipo: 'arvores', p: 0.5, lista: [[60, 1100, 380], [1030, 1110, 360]], forma: 'cipreste', cor: '#3E6A3A' },
      { tipo: 'igreja', p: 0.7, x: 470, y: 1300, escala: 0.95 }, { tipo: 'chao', p: 0.9, y: 1300, forma: 'pedra', cor: '#D9CBAE' },
      { tipo: 'campo', p: 1.15, y: 1760, cor: '#86BC54', flores: '#F2D8E0', frente: true },
    ],
    palco: { chao: 1500, escala: 0.5, xs: [300, 420, 560, 700, 820] }, clima: 'calmo', camera: 'empurra', acabamento: { manchas: 0.45, vinheta: 0.2, bloom: 0.2, dof: 0.5 },
  },
  refeitorio: {
    nome: 'Refeitório (mesa longa)', tom: 'classico', temas: ['mesa', 'refeitorio', 'jantar', 'ceia', 'refeicao', 'vinho', 'taca', 'comer', 'banquete'],
    ambiente: { fundo: ['#EFE6D2', '#E2D6BC'] }, luz: { tipo: 'interior', cor: '#FFF0D2', forca: 0.9 }, nevoa: null, particulas: { poeira: 0.4, faiscas: 0.15 },
    props: [
      { tipo: 'parede', p: 0.3, cor: '#EFE5CF', forma: 'reboco', y1: 1500, rodape: '#9A7A56' },
      { tipo: 'quadro', p: 0.35, x: 300, y: 260, l: 320, a: 420, tema: 'santo', arco: true },
      { tipo: 'estandarte', p: 0.4, x: 760, y: 380, l: 200, a: 640 }, { tipo: 'porta', p: 0.4, x: 960, y: 1460, l: 220, a: 520, forma: 'arco', cor: '#8A5A34' },
      { tipo: 'cruz', p: 0.38, x: 560, y: 210, a: 150 },
      { tipo: 'chao', p: 0.7, y: 1500, forma: 'tabua', cor: '#B8784A' },
      { tipo: 'mesa', p: 1.1, x: 540, y: 1440, l: 1700, frente: true, itens: [{ tipo: 'pao', x: 180 }, { tipo: 'taca', x: 360 }, { tipo: 'taca', x: 640 }, { tipo: 'livro', x: 820 }, { tipo: 'pao', x: 960 }] },
    ],
    palco: { chao: 1720, escala: 0.82, xs: [180, 400, 620, 860] }, clima: 'solene', camera: 'empurra', acabamento: { manchas: 0.5, vinheta: 0.25, bloom: 0.2, dof: 0.7 },
  },
  'claustro-tijolo': {
    nome: 'Claustro de tijolo com janelas em arco', tom: 'classico', temas: ['convento', 'claustro', 'corredor', 'freira', 'irma', 'clausura', 'casa'],
    ambiente: { fundo: ['#EDE3CF', '#D8C8AE'] }, luz: { tipo: 'janela', cor: '#FFF2D8', forca: 1 }, nevoa: null, particulas: { poeira: 0.45 },
    props: [
      { tipo: 'parede', p: 0.3, cor: '#ECE2CC', forma: 'reboco', y1: 1480 },
      { tipo: 'janela', p: 0.35, x: 130, y: 330, l: 300, a: 900, vista: 'jardim', moldura: '#9A7A5A', grade: true },
      { tipo: 'janela', p: 0.35, x: 950, y: 330, l: 300, a: 900, vista: 'jardim', moldura: '#9A7A5A', grade: true },
      { tipo: 'cruz', p: 0.36, x: 540, y: 440, a: 220 },
      { tipo: 'chao', p: 0.75, y: 1480, forma: 'tijolo', cor: '#B05E3E' },
    ],
    palco: { chao: 1700, escala: 0.95, xs: [330, 750, 540] }, clima: 'calmo', camera: 'empurra', acabamento: { manchas: 0.55, vinheta: 0.3, bloom: 0.2, dof: 0.8 },
  },
  'oficina-estante': {
    nome: 'Rouparia com estante e balcão', tom: 'classico', temas: ['servico', 'servicos', 'trabalho', 'roupa', 'lavar', 'tarefa', 'oficina', 'loja', 'balcao'],
    ambiente: { fundo: ['#E6DAC2', '#C8B494'] }, luz: { tipo: 'janela', cor: '#FFF0D2', forca: 0.95 }, nevoa: null, particulas: { poeira: 0.5 },
    props: [
      { tipo: 'parede', p: 0.3, cor: '#E8DCC2', forma: 'reboco', y1: 1500 },
      { tipo: 'estante', p: 0.35, x: 360, y: 220, l: 760, a: 1260, itens: 'tecidos' },
      { tipo: 'janela', p: 0.36, x: 930, y: 520, l: 260, a: 520, vista: 'jardim', moldura: '#8A6A4A' },
      { tipo: 'cruz', p: 0.36, x: 860, y: 260, a: 160 },
      { tipo: 'chao', p: 0.7, y: 1500, forma: 'tabua', cor: '#A8744A' },
      { tipo: 'mesa', p: 1.1, x: 540, y: 1460, l: 1600, toalha: false, cor: '#8A5A34', alt: 420, frente: true, itens: [{ tipo: 'cesta', x: 380, escala: 0.9 }, { tipo: 'cesta', x: 900, escala: 0.75 }] },
    ],
    palco: { chao: 1760, escala: 0.9, xs: [380, 740] }, clima: 'calmo', camera: 'empurra', acabamento: { manchas: 0.5, vinheta: 0.3, bloom: 0.15, dof: 0.75 },
  },
  'sala-lareira': {
    nome: 'Sala da lareira', tom: 'classico', temas: ['lareira', 'fogo', 'frio', 'inverno', 'noite', 'conversa', 'sala'],
    ambiente: { fundo: ['#D8C8A8', '#8A6A4A'] }, luz: { tipo: 'vela', cor: '#FFD9A0', forca: 1 }, nevoa: null, particulas: { poeira: 0.3, faiscas: 0.5 },
    props: [
      { tipo: 'parede', p: 0.3, cor: '#D9CBAE', forma: 'reboco', y1: 1450 }, { tipo: 'cruz', p: 0.32, x: 540, y: 230, a: 170 },
      { tipo: 'lareira', p: 0.4, x: 540, y: 1300, l: 620, a: 560 },
      { tipo: 'chao', p: 0.7, y: 1450, forma: 'tabua', cor: '#8A5A38' },
      { tipo: 'mesa', p: 1.1, x: 540, y: 1520, l: 1600, toalha: false, cor: '#7A4E2E', alt: 400, frente: true, itens: [{ tipo: 'vela', x: 200, escala: 0.8 }, { tipo: 'livro', x: 880 }] },
    ],
    palco: { chao: 1780, escala: 0.85, xs: [330, 750] }, clima: 'calmo', camera: 'empurra', acabamento: { manchas: 0.45, vinheta: 0.45, bloom: 0.35, dof: 0.75 },
  },
  'rua-antiga': {
    nome: 'Rua antiga de casas de reboco', tom: 'classico', temas: ['rua', 'bairro', 'cidade', 'vizinhos', 'praca', 'mercado', 'aldeia', 'espalhar'],
    ambiente: { fundo: ['#E8D9BC', '#BFA88A'] }, luz: { tipo: 'dia', cor: '#FFF2D6', forca: 1 }, nevoa: null, particulas: { poeira: 0.4, penas: 0 },
    props: [
      { tipo: 'ceu', p: 0.1, cores: ['#A8C8E0', '#E6E4D8'] },
      { tipo: 'casario', p: 0.45, y: 1360, flores: true, semente: 5 },
      { tipo: 'chao', p: 0.8, y: 1360, forma: 'pedra', cor: '#B8AE9C' },
    ],
    palco: { chao: 1720, escala: 0.85, xs: [540, 360, 740] }, clima: 'vivo', camera: 'travelling', acabamento: { manchas: 0.55, vinheta: 0.3, bloom: 0.15, dof: 0.6 },
  },
  'vila-galileia': {
    nome: 'Rua de terra de uma vila antiga (muro de adobe, oliveiras e colinas)', tom: 'classico', temas: ['jesus', 'multidao', 'galileia', 'vila', 'discipulos', 'vestes', 'impura', 'cura'],
    ambiente: { fundo: ['#EBD6B0', '#C9A97E'] }, luz: { tipo: 'tarde', cor: '#FFE4B8', forca: 1 }, nevoa: { cor: '#F2E2C4', alfa: 0.22, altura: 0.45 }, particulas: { poeira: 0.6 },
    props: [
      { tipo: 'ceu', p: 0.08, cores: ['#9EC0D6', '#E8DCC4', '#F2D8AE'] },
      { tipo: 'colinas', p: 0.22, y: 820, cor: '#B49A6A', n: 2 },
      { tipo: 'arvores', p: 0.32, lista: [[120, 860, 300], [420, 840, 260], [700, 850, 280], [980, 870, 320]], forma: 'oliveira', cor: '#7A8A52' },
      { tipo: 'casa', p: 0.42, x: 250, y: 1080, l: 420, a: 300, cor: '#E2CBA2', janelas: 1, andares: 1, porta: true, telhado: '#D4BA8E' },
      { tipo: 'casa', p: 0.42, x: 820, y: 1060, l: 380, a: 340, cor: '#D9C096', janelas: 2, andares: 1, porta: false, telhado: '#C9AE82' },
      { tipo: 'muro', p: 0.5, y: 1240, a: 260, cor: '#CDB088' },
      { tipo: 'chao', p: 0.8, y: 1240, forma: 'terra', cor: '#C4A278' },
    ],
    palco: { chao: 1700, escala: 0.82, xs: [540, 320, 760] }, clima: 'solene', camera: 'travelling', acabamento: { manchas: 0.55, vinheta: 0.32, bloom: 0.15, dof: 0.6 },
  },
  'telhados-cidade': {
    nome: 'Telhados da cidade (vista do alto)', tom: 'classico', temas: ['telhados', 'cidade', 'lugares', 'espalhou', 'vento', 'vista', 'longe'],
    ambiente: { fundo: ['#B9D0DD', '#E8D6B4'] }, luz: { tipo: 'tarde', cor: '#FFE6BC', forca: 1 }, nevoa: { cor: '#F2E6D0', alfa: 0.25, altura: 0.5 }, particulas: { poeira: 0.3, penas: 0.6 },
    props: [
      { tipo: 'ceu', p: 0.08, cores: ['#94B8D2', '#D9E0DC', '#F2DFC0'] }, { tipo: 'colinas', p: 0.25, y: 760, cor: '#8EAE6A', n: 2 },
      { tipo: 'arvores', p: 0.3, lista: [[150, 760, 220], [430, 740, 200], [820, 770, 240]], forma: 'pinheiro-manso', cor: '#5E7E44' },
      { tipo: 'telhados', p: 0.7, y: 980, filas: 6 },
    ],
    palco: { chao: 1700, escala: 0.6, xs: [540] }, clima: 'vivo', camera: 'pedestal', acabamento: { manchas: 0.5, vinheta: 0.25, bloom: 0.25, dof: 0.3 },
  },
  'sala-simples': {
    nome: 'Sala simples (confessionário, cela)', tom: 'classico', temas: ['confessou', 'confissao', 'cela', 'quarto', 'conselho', 'penitencia', 'conversa', 'casa'],
    ambiente: { fundo: ['#ECE2CC', '#CDBB9A'] }, luz: { tipo: 'janela', cor: '#FFF2D8', forca: 0.95 }, nevoa: null, particulas: { poeira: 0.4 },
    props: [
      { tipo: 'parede', p: 0.3, cor: '#EDE3CC', forma: 'reboco', y1: 1500, rodape: '#B89A70' },
      { tipo: 'janela', p: 0.34, x: 820, y: 300, l: 220, a: 360, vista: 'ceu', moldura: '#A88A62' },
      { tipo: 'cadeira', p: 0.6, x: 300, y: 1560, escala: 1.25 },
      { tipo: 'chao', p: 0.75, y: 1500, forma: 'ladrilho', cor: '#B56A46' },
    ],
    palco: { chao: 1700, escala: 0.95, xs: [330, 760] }, clima: 'calmo', camera: 'empurra', acabamento: { manchas: 0.55, vinheta: 0.3, bloom: 0.15, dof: 0.8 },
  },
  'muro-patio': {
    nome: 'Pátio murado (muro de pedra e escada)', tom: 'classico', temas: ['muro', 'muros', 'patio', 'invasores', 'escalaram', 'cerco', 'ataque', 'guerra', 'castelo'],
    ambiente: { fundo: ['#9EC0D8', '#D8C8A0'] }, luz: { tipo: 'dia', cor: '#FFF2D6', forca: 1 }, nevoa: null, particulas: { poeira: 0.5 },
    props: [
      { tipo: 'ceu', p: 0.1, cores: ['#7FA8CC', '#C8D8DC'] }, { tipo: 'arvores', p: 0.35, lista: [[160, 760, 420], [520, 740, 380], [930, 770, 440]], forma: 'redonda', cor: '#5E8A3E' },
      { tipo: 'muro', p: 0.5, y: 1180, a: 520, cor: '#CDB894' },
      { tipo: 'objetos', p: 0.55, lista: [] },
      { tipo: 'chao', p: 0.8, y: 1180, forma: 'terra', cor: '#C2A27A' },
    ],
    palco: { chao: 1640, escala: 0.8, xs: [300, 540, 780] }, clima: 'solene', camera: 'travelling', acabamento: { manchas: 0.55, vinheta: 0.3, bloom: 0.1, dof: 0.6 },
  },
  'campo-aereo': {
    nome: 'Vista aérea do convento e dos olivais', tom: 'classico', temas: ['assis', 'regiao', 'vale', 'olivais', 'fazenda', 'aldeia', 'campo', 'terra'],
    ambiente: { fundo: ['#6E9A52', '#4E7A3A'] }, luz: { tipo: 'dia', cor: '#FFF4DC', forca: 1 }, nevoa: { cor: '#EEF0E2', alfa: 0.2, altura: 0.25 }, particulas: { poeira: 0.1 },
    props: [
      { tipo: 'campo', p: 0.4, y: -900, cor: '#6E9C4E' },
      { tipo: 'arvores', p: 0.45, lista: Array.from({ length: 42 }, (_, i) => [((i * 197) % 1300) - 110, -200 + ((i * 131) % 2200), 90]), forma: 'oliveira', cor: '#5E8A3E' },
      { tipo: 'casa', p: 0.55, x: 420, y: 980, l: 460, a: 260, cor: '#E8D9BC', janelas: 3, andares: 1, porta: false, telhado: '#B5583E' },
      { tipo: 'casa', p: 0.55, x: 720, y: 860, l: 260, a: 200, cor: '#EFE2C6', janelas: 2, andares: 1, porta: false, telhado: '#A84E36' },
    ],
    palco: { chao: 1600, escala: 0.3, xs: [540] }, clima: 'calmo', camera: 'pedestal', acabamento: { manchas: 0.45, vinheta: 0.2, bloom: 0.1, dof: 0.2 },
  },
  'capela-altar': {
    nome: 'Capela com o altar', tom: 'classico', temas: ['altar', 'eucaristia', 'capela', 'oracao', 'rezou', 'rezar', 'sacrario', 'templo', 'fe'],
    ambiente: { fundo: ['#E8DEC8', '#C9B898'] }, luz: { tipo: 'interior', cor: '#FFF0D2', forca: 1 }, nevoa: null, particulas: { poeira: 0.4, faiscas: 0.3 },
    props: [
      { tipo: 'parede', p: 0.3, cor: '#E6DCC6', forma: 'pedra', y1: 1450 }, { tipo: 'arco', p: 0.32, x: 540, y: 1450, l: 760, a: 1200, cor: '#C9B48E' },
      { tipo: 'raios', p: 0.33, x: 540, y: -200, n: 6, alfa: 0.16 }, { tipo: 'cruz', p: 0.34, x: 540, y: 300, a: 240 },
      { tipo: 'chao', p: 0.7, y: 1450, forma: 'ladrilho', cor: '#C8B494' },
      { tipo: 'altar', p: 0.8, x: 540, y: 1560, l: 420 },
    ],
    palco: { chao: 1720, escala: 0.82, xs: [250, 830, 540] }, clima: 'solene', camera: 'empurra', acabamento: { manchas: 0.5, vinheta: 0.35, bloom: 0.3, dof: 0.7 },
  },
  'arco-pedra': {
    nome: 'Arco de pedra aberto para o pátio', tom: 'classico', temas: ['entrada', 'porta', 'portao', 'saida', 'fora', 'diante', 'perigo', 'chegaram'],
    ambiente: { fundo: ['#C9B48E', '#8A7A60'] }, luz: { tipo: 'dia', cor: '#FFF0D2', forca: 0.95 }, nevoa: null, particulas: { poeira: 0.45 },
    props: [
      { tipo: 'ceu', p: 0.1, cores: ['#86AECF', '#D2DCDC'] }, { tipo: 'muro', p: 0.25, y: 1050, a: 360, cor: '#D2BC94' }, { tipo: 'chao', p: 0.3, y: 1050, forma: 'terra', cor: '#C8A87C' },
      { tipo: 'arco', p: 0.55, x: 540, y: 1600, l: 820, a: 1250, cor: '#BCA580', espessura: 110 },
      { tipo: 'chao', p: 0.8, y: 1600, forma: 'pedra', cor: '#A89878' },
    ],
    palco: { chao: 1760, escala: 0.85, xs: [300, 540, 780] }, clima: 'solene', camera: 'empurra', acabamento: { manchas: 0.55, vinheta: 0.35, bloom: 0.15, dof: 0.7 },
  },
  'gabinete': {
    nome: 'Gabinete (comando, governo, escritório antigo)', tom: 'ambos', temas: ['governo', 'governos', 'comandante', 'comandantes', 'general', 'ordem', 'proibiram', 'decidiram', 'decisao', 'lei', 'carta', 'escreveu', 'escritorio', 'ministro', 'rei'],
    ambiente: { fundo: ['#5A4A3A', '#2E241C'] }, luz: { tipo: 'vela', cor: '#FFDCA0', forca: 0.9 }, nevoa: null, particulas: { poeira: 0.35 },
    props: [
      { tipo: 'parede', p: 0.3, cor: '#5E4A38', forma: 'madeira', y1: 1450 },
      { tipo: 'mapa-parede', p: 0.34, x: 540, y: 330, l: 700, a: 470 },
      { tipo: 'cortina', p: 0.36, x: -60, y: -300, l: 260, a: 2000, cor: '#5A2A26' }, { tipo: 'cortina', p: 0.36, x: 880, y: -300, l: 260, a: 2000, cor: '#5A2A26' },
      { tipo: 'chao', p: 0.7, y: 1450, forma: 'tabua', cor: '#5A3A24' },
      { tipo: 'escrivaninha', p: 1.1, x: 540, y: 1480, l: 1100, frente: true, itens: [{ tipo: 'relogio-bolso', x: 300, escala: 0.6 }, { tipo: 'carta', x: 640, escala: 0.8 }] },
    ],
    palco: { chao: 1760, escala: 0.88, xs: [360, 720] }, clima: 'solene', camera: 'empurra', acabamento: { manchas: 0.4, vinheta: 0.55, bloom: 0.25, dof: 0.75 },
  },
  'livro-mesa': {
    nome: 'Mesa de madeira (o livro, a carta)', tom: 'ambos', temas: ['livro', 'processo', 'biografia', 'testemunho', 'escrito', 'registro', 'documento', 'diario', 'carta'],
    ambiente: { fundo: ['#6A4428', '#3E2618'] }, luz: { tipo: 'vela', cor: '#FFE0B0', forca: 0.95 }, nevoa: null, particulas: { poeira: 0.3 },
    props: [{ tipo: 'parede', p: 0.4, cor: '#6E4628', forma: 'madeira', y1: 3000 }],
    palco: { chao: 1700, escala: 0.9, xs: [540] }, clima: 'calmo', camera: 'empurra', acabamento: { manchas: 0.4, vinheta: 0.5, bloom: 0.2, dof: 0.5 },
  },
};
