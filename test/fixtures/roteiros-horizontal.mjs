/** Bateria de roteiros do lote C do formato horizontal (0.6.42): cada um exercita um tipo de conteúdo. Sem rede (nenhuma pessoa nomeada). */
const S = (estilo, corpo) => `STATUS: bateria do formato horizontal. Estilo: ${estilo}. Orientação: horizontal. CTA: simples.\n${corpo}\n`;
export const CORPOS = {
  curto: 'Você acha que o cérebro usa só dez por cento? Isso é mito.\n\nOs exames de imagem mostram atividade em quase todo o cérebro.\n\nSegue a página pra ver a próxima.',
  longo: 'Você acha que o cérebro usa só dez por cento? Isso é mito.\n\nOs exames de imagem mostram atividade em quase todas as regiões do cérebro ao longo de um dia.\n\nO cérebro pesa cerca de um quilo e meio, só dois por cento do corpo, mas gasta vinte por cento da energia.\n\nDurante o sono, ele limpa resíduos e organiza as memórias do dia.\n\nQuando você aprende uma habilidade nova, as conexões entre os neurônios mudam de forma e ficam mais fortes.\n\nPor isso treinar um pouco todo dia vale mais do que treinar muito de uma vez.\n\nSegue a página pra ver a próxima.',
  numeroGrande: 'O Brasil tem 215 milhões de pessoas.\n\nUm salário mínimo de R$ 1.412 paga menos da metade da cesta básica em algumas capitais.\n\nSão 4 em cada 10 brasileiros sem reserva de emergência.\n\nSegue a página pra ver a próxima.',
  lista: 'Três passos para começar.\n\nUm: escolha o tema.\n\nDois: escreva o roteiro curto.\n\nTrês: grave a narração e publique.\n\nSegue a página pra ver a próxima.',
  marca: 'O Claude Code lê a pasta do projeto e escreve o código com você.\n\nO Nubank e o Pix mudaram o jeito de pagar no Brasil.\n\nComenta ILUSTRANDO que eu te mando o guia.',
  pessoaSemFoto: 'Uma pessoa comum, sem fama nenhuma, mudou de vida em seis meses.\n\nEla trocou três horas de TV por uma hora de estudo por dia.\n\nO resultado apareceu no trabalho e no bolso.\n\nSegue a página pra ver a próxima.',
  fraseLonga: 'Existe uma diferença enorme entre saber que uma coisa importa e agir todos os dias como se ela importasse de verdade, mesmo quando ninguém está olhando e nada parece mudar.\n\nA constância vence o talento quando o talento descansa.\n\nSegue a página pra ver a próxima.',
  soNumeros: '10% a 20% e 30%.\n\n1 2 3 4 5.\n\n2026, 2027 e 2028.\n\n100 por cento.\n\nSegue.',
};
export const NOMES = Object.keys(CORPOS);
/** o roteiro completo (com a linha STATUS) de um estilo */
export const roteiroDe = (estilo, nome = 'curto') => S(estilo, CORPOS[nome]);
export const ESTILOS_LOTE_C = ['smooth', 'smooth-estrategia', 'smooth-historia', 'smooth-produto', 'smooth-tipografia', 'smooth-vinheta', 'anatomia', 'fino', 'linhas', 'moderno', 'tubo', 'alternativo'];
