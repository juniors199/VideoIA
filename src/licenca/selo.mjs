/**
 * Open-source: sem selo de rastreio e sem marca d'água de ativação.
 * Mantém as exportações usadas por vídeo, carrossel e identidade.
 */
const TEXTO_MARCA = null;

function textoSelo() {
  return null;
}

async function prepararSelo() {
  return { ativo: false, marcaDagua: false, motivos: [], texto: null };
}

function avisoSelo() {
  return null;
}

async function gerarMarcaDagua() {
  return null;
}

async function selarVideo() {
  return { selado: false };
}

function selarImagem() {
  return false;
}

export {
  TEXTO_MARCA,
  avisoSelo,
  gerarMarcaDagua,
  prepararSelo,
  selarImagem,
  selarVideo,
  textoSelo,
};
