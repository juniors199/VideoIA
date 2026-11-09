/*
 * 
 * 
 */
/**
 * Cenários do tom "série" do estilo novela (drama interativo moderno, referências 05 e 06) e os de guerra de trincheira da
 * prévia (servem a qualquer história da Primeira Guerra). Mesmo contrato dos clássicos (ver classico.js).
 * Cores de material e de cenário, registradas em test/fixtures/cor-da-marca-excecoes.json.
 */
export default {
  'sala-sofa': {
    nome: 'Sala com sofá', tom: 'serie', temas: ['sofa', 'sala', 'casa', 'acordar', 'acordou', 'dormiu', 'celular', 'apartamento'],
    ambiente: { fundo: ['#9AA0A8', '#5E6268'] }, luz: { tipo: 'janela', cor: '#FFF0DA', forca: 0.9 }, nevoa: null, particulas: { poeira: 0.25 },
    props: [
      { tipo: 'parede', p: 0.3, cor: '#9EA4AC', forma: 'lisa', y1: 1500 }, { tipo: 'janela', p: 0.32, x: 900, y: 120, l: 380, a: 900, forma: 'reta', vista: 'cidade', moldura: '#E8E2D6', grade: false },
      { tipo: 'quadro', p: 0.33, x: 300, y: 260, l: 330, a: 250, tema: 'paisagem' }, { tipo: 'relogio', p: 0.33, x: 110, y: 560, r: 52 },
      { tipo: 'sofa', p: 0.55, x: 540, y: 1360, l: 1200, cor: '#6E8A72', almofada: '#E8D8A8' }, { tipo: 'chao', p: 0.7, y: 1360, forma: 'tabua', cor: '#8A6448' },
      { tipo: 'mesa', p: 1.15, x: 540, y: 1600, l: 1700, toalha: false, cor: '#6A4A34', alt: 60, frente: true, itens: [{ tipo: 'celular', x: 780, escala: 0.9, hora: '06:47' }] },
    ],
    palco: { chao: 1640, escala: 0.95, xs: [540, 760] }, clima: 'vivo', camera: 'empurra', acabamento: { manchas: 0.2, vinheta: 0.6, bloom: 0.25, dof: 0.85 },
  },
  'sala-tv': {
    nome: 'Sala com a TV ligada', tom: 'serie', temas: ['tv', 'televisao', 'noticia', 'canais', 'jornal', 'urgente', 'reportagem'],
    ambiente: { fundo: ['#A4A8AE', '#6A6E74'] }, luz: { tipo: 'interior', cor: '#E8F0FF', forca: 0.85 }, nevoa: null, particulas: { poeira: 0.2 },
    props: [
      { tipo: 'parede', p: 0.3, cor: '#A8ACB2', forma: 'lisa', y1: 1450 }, { tipo: 'relogio', p: 0.32, x: 160, y: 300, r: 58 },
      { tipo: 'estante', p: 0.33, x: 620, y: 230, l: 520, a: 140, itens: 'livros', cor: '#7A5A3A' },
      { tipo: 'tv', p: 0.4, x: 540, y: 1000, l: 560 }, { tipo: 'planta', p: 0.42, x: 870, y: 1080, a: 300 },
      { tipo: 'mesa', p: 0.45, x: 540, y: 1080, l: 760, toalha: false, cor: '#7A5A3E', alt: 340 }, { tipo: 'chao', p: 0.7, y: 1420, forma: 'tabua', cor: '#8A6A4E' },
    ],
    palco: { chao: 1700, escala: 0.9, xs: [540] }, clima: 'vivo', camera: 'empurra', acabamento: { manchas: 0.2, vinheta: 0.6, bloom: 0.25, dof: 0.6 },
  },
  'espaco-globo': {
    nome: 'Globo no escuro (o mundo inteiro)', tom: 'ambos', temas: ['mundo', 'planeta', 'terra', 'paises', 'todos', 'bilhoes', 'milhoes', 'populacao', 'global'],
    ambiente: { fundo: ['#0E1626', '#05080E'] }, luz: { tipo: 'noite', cor: '#9EC0FF', forca: 0.8 }, nevoa: null, particulas: { poeira: 0.1 },
    props: [{ tipo: 'ceu', p: 0.05, cores: ['#0C1424', '#141E34', '#06090F'] }, { tipo: 'estrelas', p: 0.08, n: 220, y0: -900, y1: 2600 }, { tipo: 'globo', p: 0.5, x: 540, y: 1080, r: 340 }],
    palco: { chao: 1650, escala: 0.6, xs: [540] }, clima: 'solene', camera: 'empurra', acabamento: { manchas: 0.1, vinheta: 0.7, bloom: 0.45, dof: 0.2 },
  },
  'rua-cidade': {
    nome: 'Rua de bairro com fios', tom: 'serie', temas: ['rua', 'bairro', 'cidade', 'esquina', 'caminhao', 'calcada', 'favela', 'comunidade'],
    ambiente: { fundo: ['#B8C4C8', '#7A766E'] }, luz: { tipo: 'dia', cor: '#FFF2DC', forca: 0.95 }, nevoa: { cor: '#DDE2E2', alfa: 0.2, altura: 0.3 }, particulas: { poeira: 0.3 },
    props: [
      { tipo: 'ceu', p: 0.1, cores: ['#9EB4C4', '#DCE0DC'] }, { tipo: 'casario', p: 0.45, y: 1320, semente: 9, cores: ['#C9B49A', '#B8A890', '#D8C8B0', '#A8988A'] },
      { tipo: 'poste', p: 0.55, x: 140, y: 1330, a: 900 }, { tipo: 'chao', p: 0.8, y: 1320, forma: 'asfalto', cor: '#6A6A6E' },
    ],
    palco: { chao: 1680, escala: 0.75, xs: [540, 380] }, clima: 'vivo', camera: 'empurra', acabamento: { manchas: 0.2, vinheta: 0.55, bloom: 0.2, dof: 0.6 },
  },
  estrada: {
    nome: 'Estrada entre morros', tom: 'serie', temas: ['estrada', 'rodovia', 'viatura', 'viaturas', 'fuga', 'caminhao', 'viagem', 'fronteira'],
    ambiente: { fundo: ['#8EA8BC', '#5E6A52'] }, luz: { tipo: 'tarde', cor: '#FFE2B8', forca: 0.9 }, nevoa: { cor: '#E8E2D8', alfa: 0.3, altura: 0.35 }, particulas: { poeira: 0.3 },
    props: [{ tipo: 'ceu', p: 0.08, cores: ['#7E9CB8', '#DCD2C0'] }, { tipo: 'colinas', p: 0.3, y: 1000, cor: '#6E8A5A', n: 2 }, { tipo: 'campo', p: 0.5, y: 1100, cor: '#7A9A5E' }, { tipo: 'estrada', p: 0.7, y: 1100 }],
    palco: { chao: 1700, escala: 0.6, xs: [540] }, clima: 'vivo', camera: 'empurra', acabamento: { manchas: 0.2, vinheta: 0.55, bloom: 0.2, dof: 0.3 },
  },
  'banheiro-espelho': {
    nome: 'Banheiro com espelho', tom: 'serie', temas: ['espelho', 'banheiro', 'barba', 'disfarce', 'peruca', 'rosto', 'cabelo'],
    ambiente: { fundo: ['#C8D8D2', '#8AA49C'] }, luz: { tipo: 'interior', cor: '#F0FFF8', forca: 0.9 }, nevoa: null, particulas: { poeira: 0.15 },
    props: [{ tipo: 'parede', p: 0.3, cor: '#C4D6CE', forma: 'ladrilho', y1: 1500 }, { tipo: 'janela', p: 0.32, x: 540, y: 200, l: 640, a: 820, forma: 'reta', vista: 'ceu', moldura: '#E8E8E4', grade: false, luz: false }, { tipo: 'chao', p: 0.7, y: 1500, forma: 'ladrilho', cor: '#D8DCD8' }],
    palco: { chao: 1700, escala: 0.95, xs: [540] }, clima: 'calmo', camera: 'empurra', acabamento: { manchas: 0.15, vinheta: 0.5, bloom: 0.25, dof: 0.6 },
  },
  calcadao: {
    nome: 'Calçadão à beira-mar', tom: 'serie', temas: ['praia', 'calcadao', 'orla', 'copacabana', 'multidao', 'gente', 'pessoas', 'mar'],
    ambiente: { fundo: ['#A8C8DC', '#D8D0BE'] }, luz: { tipo: 'dia', cor: '#FFF4DC', forca: 1 }, nevoa: null, particulas: { poeira: 0.2 },
    props: [{ tipo: 'ceu', p: 0.1, cores: ['#8CB8DA', '#E2E6E2'] }, { tipo: 'predios', p: 0.3, y: 1000, cor: '#C8C0B2', noite: false }, { tipo: 'arvores', p: 0.45, lista: [[100, 1100, 520], [980, 1120, 560]], forma: 'redonda', cor: '#4E7A3E' }, { tipo: 'chao', p: 0.8, y: 1100, forma: 'calcadao', cor: '#ECE8E0' }],
    palco: { chao: 1640, escala: 0.82, xs: [540, 240, 840] }, clima: 'vivo', camera: 'empurra', acabamento: { manchas: 0.15, vinheta: 0.5, bloom: 0.2, dof: 0.6 },
  },
  'cabana-mato': {
    nome: 'Cabana no meio do mato', tom: 'serie', temas: ['cabana', 'mato', 'floresta', 'esconderijo', 'escondido', 'cacador', 'sitio'],
    ambiente: { fundo: ['#B8C8B0', '#5E7A52'] }, luz: { tipo: 'dia', cor: '#F4FFE8', forca: 0.85 }, nevoa: { cor: '#E8F0E4', alfa: 0.35, altura: 0.5 }, particulas: { poeira: 0.3 },
    props: [{ tipo: 'ceu', p: 0.08, cores: ['#C8D8CC', '#E8ECE0'] }, { tipo: 'arvores', p: 0.3, lista: Array.from({ length: 9 }, (_, i) => [-80 + i * 150, 1150, 700 + (i % 3) * 120]), forma: 'pinheiro', cor: '#3E5E3A' }, { tipo: 'casa', p: 0.5, x: 540, y: 1300, l: 560, a: 380, cor: '#8A7A64', janelas: 1, andares: 1, telhado: '#5A4A3A' }, { tipo: 'campo', p: 0.7, y: 1300, cor: '#5E8A4A' }, { tipo: 'neblina', p: 0.75, y: 1250, a: 420, alfa: 0.4 }],
    palco: { chao: 1650, escala: 0.7, xs: [540] }, clima: 'calmo', camera: 'empurra', acabamento: { manchas: 0.2, vinheta: 0.55, bloom: 0.25, dof: 0.5 },
  },
  'interior-madeira': {
    nome: 'Interior de madeira com o rádio', tom: 'serie', temas: ['radio', 'anuncio', 'madrugada', 'esperou', 'cabana', 'dentro', 'sardinha'],
    ambiente: { fundo: ['#8A6A4A', '#4A3424'] }, luz: { tipo: 'vela', cor: '#FFDCA8', forca: 0.9 }, nevoa: null, particulas: { poeira: 0.4 },
    props: [{ tipo: 'parede', p: 0.3, cor: '#8A6A4A', forma: 'madeira', y1: 1450 }, { tipo: 'chao', p: 0.7, y: 1450, forma: 'tabua', cor: '#6A4A30' }, { tipo: 'mesa', p: 1.1, x: 540, y: 1480, l: 1500, toalha: false, cor: '#6A4428', alt: 400, frente: true, itens: [{ tipo: 'radio', x: 760, escala: 0.9 }, { tipo: 'caneca', x: 260, escala: 0.9 }] }],
    palco: { chao: 1760, escala: 0.88, xs: [380] }, clima: 'calmo', camera: 'empurra', acabamento: { manchas: 0.25, vinheta: 0.6, bloom: 0.3, dof: 0.75 },
  },
  onibus: {
    nome: 'Ônibus noturno por dentro', tom: 'serie', temas: ['onibus', 'banco', 'passageiro', 'viagem', 'noturno', 'ponto', 'metro'],
    ambiente: { fundo: ['#2E3038', '#1A1C22'] }, luz: { tipo: 'noite', cor: '#D8E8FF', forca: 0.8 }, nevoa: null, particulas: { poeira: 0.2 },
    props: [{ tipo: 'onibus', p: 0.5, cor: '#2E5A62' }],
    palco: { chao: 1700, escala: 0.85, xs: [540, 760] }, clima: 'solene', camera: 'empurra', acabamento: { manchas: 0.15, vinheta: 0.7, bloom: 0.3, dof: 0.7 },
  },
  'trilhos-noite': {
    nome: 'Trilhos do trem à noite', tom: 'serie', temas: ['trilho', 'trilhos', 'trem', 'ferrovia', 'noite', 'parque', 'fugiu'],
    ambiente: { fundo: ['#1E2638', '#0C1018'] }, luz: { tipo: 'noite', cor: '#C8D8FF', forca: 0.75 }, nevoa: { cor: '#8A9AB8', alfa: 0.25, altura: 0.4 }, particulas: { poeira: 0.2 },
    props: [{ tipo: 'ceu', p: 0.06, cores: ['#0E1424', '#26304A'] }, { tipo: 'estrelas', p: 0.08, n: 90, y0: -900, y1: 900 }, { tipo: 'arvores', p: 0.3, lista: Array.from({ length: 8 }, (_, i) => [-100 + i * 170, 1120, 520]), forma: 'pinheiro', cor: '#1E2E26' }, { tipo: 'trilhos', p: 0.7, y: 1100 }, { tipo: 'poste', p: 0.5, x: 860, y: 1180, a: 760 }],
    palco: { chao: 1700, escala: 0.75, xs: [540] }, clima: 'solene', camera: 'empurra', acabamento: { manchas: 0.15, vinheta: 0.75, bloom: 0.4, dof: 0.5 },
  },
  'escada-predio': {
    nome: 'Escada de serviço do prédio', tom: 'serie', temas: ['escada', 'andar', 'predio', 'subiu', 'subir', 'apartamento', 'servico'],
    ambiente: { fundo: ['#C9C2A8', '#5A5A50'] }, luz: { tipo: 'interior', cor: '#FFF0D0', forca: 0.8 }, nevoa: null, particulas: { poeira: 0.4 },
    props: [{ tipo: 'escada', p: 0.6, andar: 4 }],
    palco: { chao: 1560, escala: 0.75, xs: [540] }, clima: 'solene', camera: 'empurra', acabamento: { manchas: 0.25, vinheta: 0.7, bloom: 0.25, dof: 0.5 },
  },
  'cidade-noite': {
    nome: 'Cidade à noite vista do alto', tom: 'serie', temas: ['cidade', 'noite', 'drones', 'luzes', 'avenidas', 'metropole', 'capital'],
    ambiente: { fundo: ['#141A2A', '#05070C'] }, luz: { tipo: 'noite', cor: '#FFD8A0', forca: 0.8 }, nevoa: { cor: '#3A4A6A', alfa: 0.3, altura: 0.6 }, particulas: { poeira: 0.1 },
    props: [{ tipo: 'ceu', p: 0.06, cores: ['#0A0E18', '#1E2638'] }, { tipo: 'estrelas', p: 0.08, n: 70, y0: -900, y1: 700 }, { tipo: 'predios', p: 0.4, y: 1100, cor: '#1E2436' }, { tipo: 'predios', p: 0.6, y: 1600, cor: '#262C40', semente: 7 }],
    palco: { chao: 1800, escala: 0.5, xs: [540] }, clima: 'solene', camera: 'pedestal', acabamento: { manchas: 0.1, vinheta: 0.75, bloom: 0.5, dof: 0.3 },
  },
  'porta-corredor': {
    nome: 'Corredor com a porta do apartamento', tom: 'serie', temas: ['porta', 'corredor', 'batidas', 'bateu', 'entrou', 'cozinha', 'abriu'],
    ambiente: { fundo: ['#D8D2C0', '#7A7464'] }, luz: { tipo: 'interior', cor: '#FFF2D8', forca: 0.85 }, nevoa: null, particulas: { poeira: 0.3 },
    props: [{ tipo: 'parede', p: 0.3, cor: '#D6CFBC', forma: 'lisa', y1: 1500, rodape: '#6A5A44' }, { tipo: 'porta', p: 0.4, x: 760, y: 1500, l: 300, a: 760, cor: '#5A5A60' }, { tipo: 'chao', p: 0.7, y: 1500, forma: 'ladrilho', cor: '#A89A84' }],
    palco: { chao: 1720, escala: 0.9, xs: [380] }, clima: 'solene', camera: 'empurra', acabamento: { manchas: 0.2, vinheta: 0.65, bloom: 0.2, dof: 0.7 },
  },
  // ── guerra de trincheira (a prévia: a trégua de Natal de 1914) ──
  'trincheira-noite': {
    nome: 'Trincheira à noite (sacos de areia e velas)', tom: 'ambos', temas: ['trincheira', 'trincheiras', 'guerra', 'soldado', 'soldados', 'combate', 'velas', 'cantaram'],
    ambiente: { fundo: ['#1C2236', '#0E1220'] }, luz: { tipo: 'noite', cor: '#C8D4F0', forca: 0.8 }, nevoa: { cor: '#5A6A8A', alfa: 0.25, altura: 0.35 }, particulas: { poeira: 0.2, faiscas: 0.15 },
    props: [
      { tipo: 'ceu', p: 0.05, cores: ['#0B1020', '#1A2440', '#2E3A58'] }, { tipo: 'estrelas', p: 0.07, n: 240, y0: -900, y1: 900 }, { tipo: 'lua', p: 0.1, x: 820, y: 260, r: 50 },
      { tipo: 'trincheira', p: 0.55, y: 1450, a: 820, cor: '#5E5244', saco: '#9A8A6A', escadaX: 860 },
      { tipo: 'objetos', p: 0.56, lista: [{ objeto: 'arvore-natal', x: 250, y: 610, escala: 0.75 }, { objeto: 'vela', x: 520, y: 600, escala: 0.6, seed: 2 }, { objeto: 'vela', x: 700, y: 605, escala: 0.6, seed: 5 }, { objeto: 'lanterna', x: 120, y: 1440, escala: 0.9 }] },
      { tipo: 'chao', p: 0.8, y: 1450, forma: 'lama', cor: '#4A3E32' },
    ],
    palco: { chao: 1700, escala: 0.92, xs: [300, 560, 800] }, clima: 'solene', camera: 'empurra', acabamento: { manchas: 0.35, vinheta: 0.6, bloom: 0.35, dof: 0.7 },
  },
  'terra-de-ninguem': {
    nome: 'Terra de ninguém (geada, arame e crateras)', tom: 'ambos', temas: ['ninguem', 'batalha', 'campo de batalha', 'arame', 'cratera', 'encontraram', 'atravessaram'],
    ambiente: { fundo: ['#B8C0C8', '#8A8478'] }, luz: { tipo: 'amanhecer', cor: '#FFE8D0', forca: 0.9 }, nevoa: { cor: '#E8ECEE', alfa: 0.35, altura: 0.45 }, particulas: { poeira: 0.15, neve: 0.15 },
    props: [
      { tipo: 'ceu', p: 0.06, cores: ['#9AA8BC', '#D8D2CC', '#F2DCC4'] }, { tipo: 'sol', p: 0.08, x: 300, y: 820, r: 70, cor: '#FFE8C8' },
      { tipo: 'trincheira', p: 0.3, y: 980, a: 120, cor: '#6A5E50', saco: '#A89A7E', escadaMao: false },
      { tipo: 'arvores', p: 0.32, lista: [[180, 960, 360], [880, 960, 300]], forma: 'seca' },
      { tipo: 'chao', p: 0.6, y: 980, forma: 'neve', cor: '#C8C4BA' },
      { tipo: 'cratera', p: 0.65, x: 180, y: 1300, l: 300, cor: '#7A6E60' }, { tipo: 'cratera', p: 0.7, x: 900, y: 1500, l: 380, cor: '#7A6E60' },
      { tipo: 'arame', p: 0.62, y: 1130 }, { tipo: 'neblina', p: 0.7, y: 1050, a: 360, alfa: 0.35 },
    ],
    palco: { chao: 1680, escala: 0.82, xs: [330, 750, 540] }, clima: 'calmo', camera: 'travelling', acabamento: { manchas: 0.35, vinheta: 0.4, bloom: 0.3, dof: 0.6 },
  },
};
