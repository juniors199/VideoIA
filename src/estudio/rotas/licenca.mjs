/** Rotas legadas de licença: o estúdio é open-source e não ativa mais. */
import path from 'node:path';

const POST = {
  async '/api/licenca/ativar'() {
    return [{ ok: true, id: 'open-source', maquinas: 1, max: 1, openSource: true }];
  },
  async '/api/licenca/desativar'() {
    return [{ ok: true, liberada: true, openSource: true }];
  },
  async '/api/licenca/conferir'() {
    return [{ ativa: true, mensagem: 'estúdio open-source: sem licença de ativação' }];
  },
};

function termos(ctx, { res }) {
  res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
  res.end('Este estúdio é open-source. Não há termos de ativação comercial.\n');
  return true;
}

export { POST, termos };
