/**
 * Estúdio open-source em modo único (produção).
 * Sem ativação, sem servidor de licenças, sem marca d'água, sem modo "dev".
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { ATUALIZACOES_URL } from './links.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
/** Sempre produção: quem baixa recebe o mesmo comportamento. */
const PACOTE = true;
const PREFIXO_LICENCA = 'ILU1-';
const PREFIXO_ATIVACAO = 'ATV1-';
const VITALICIA = 'vitalicia';
const MESES_INCLUSOS = 12;

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

function maquina() {
  return sha(['ilu-oss', os.platform(), os.arch(), os.hostname()].join('|')).slice(0, 32);
}

function maquinaAntiga() {
  return maquina();
}

function nomeMaquina() {
  return `${os.hostname()} (${{ darwin: 'Mac', win32: 'Windows', linux: 'Linux' }[os.platform()] || os.platform()})`.slice(0, 60);
}

function servidores() {
  return [];
}

function servidor() {
  return null;
}

function lerChave() {
  return null;
}

function lerComprovante() {
  return null;
}

async function estado() {
  return {
    ativa: true,
    situacao: 'open-source',
    mensagem: 'estúdio open-source em produção: sem licença',
  };
}

async function ativar() {
  return { id: 'open-source', maquinas: 1, max: 1, email: null };
}

async function desativar() {
  return { liberada: true, maquinas: 0, max: 1 };
}

function direitoAtualizacoes() {
  return { tipo: VITALICIA, ate: null };
}

function cobre() {
  return true;
}

function dataBR(e) {
  const [a, t, o] = String(e).slice(0, 10).split('-');
  return `${o}/${t}/${a}`;
}

function somarMeses(e, a) {
  const [t, o, i] = String(e).slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(t, o - 1 + a, i)).toISOString().slice(0, 10);
}

function linkAtualizacoes(e = ATUALIZACOES_URL) {
  return /^https?:\/\//.test(e || '') ? e : null;
}

function textoAtualizacoes() {
  return 'atualizações livres (open-source)';
}

export {
  MESES_INCLUSOS,
  PACOTE,
  PREFIXO_ATIVACAO,
  PREFIXO_LICENCA,
  VITALICIA,
  ativar,
  cobre,
  dataBR,
  desativar,
  direitoAtualizacoes,
  estado,
  lerChave,
  lerComprovante,
  linkAtualizacoes,
  maquina,
  maquinaAntiga,
  nomeMaquina,
  servidor,
  servidores,
  somarMeses,
  textoAtualizacoes,
  RAIZ,
};
