/* Estudio de videos: APIs de Configurar IA e chat embutido. */
import {
  situacao,
  gravarEscolha,
  gravarChaveCursor,
  rodarChat,
  cancelarChat,
  NOMES,
} from '../assistentes.mjs';

function getIa(ctx, { res }) {
  return ctx.json(res, situacao(ctx.raiz));
}

const rotasPost = {
  async '/api/ia'(ctx, corpo) {
    if (corpo && typeof corpo.chave === 'string' && !corpo.id) {
      const r = gravarChaveCursor(corpo.chave, ctx.raiz);
      return r.erro ? [r, 400] : [r];
    }
    const id = String(corpo?.id || '').trim();
    if (corpo && typeof corpo.chave === 'string' && id === 'cursor') {
      const k = gravarChaveCursor(corpo.chave, ctx.raiz);
      if (k.erro) return [k, 400];
    }
    const r = gravarEscolha(id, ctx.raiz);
    return r.erro ? [r, 400] : [r];
  },

  async '/api/ia/chave'(ctx, corpo) {
    const r = gravarChaveCursor(corpo?.chave ?? '', ctx.raiz);
    return r.erro ? [r, 400] : [r];
  },

  async '/api/ia/chat'(ctx, corpo) {
    const msg = String(corpo?.mensagem || '').trim();
    if (!msg) {
      return [{ erro: { causa: 'Escreva uma mensagem.', acao: 'Digite o que você quer (um vídeo, um carrossel, uma correção).' } }, 400];
    }
    if (msg.length > 20000) {
      return [{ erro: { causa: 'Mensagem longa demais.', acao: 'Encurte o pedido.' } }, 400];
    }
    const st = situacao(ctx.raiz);
    if (!st.conectado || !st.escolhido) {
      return [{ erro: { causa: 'Nenhuma IA conectada.', acao: 'Em Configurações > Configurar IA, escolha Claude, Codex ou Cursor e clique em Conectar.' } }, 400];
    }
    if (ctx.job && !ctx.job.fim) {
      return [{ erro: { causa: `Espere terminar: ${ctx.job.titulo.toLowerCase()} ainda está em andamento.`, acao: 'Cancele o chat ou espere a tarefa atual acabar.' } }, 409];
    }
    const sinal = {};
    ctx.chatSinal = sinal;
    const nome = NOMES[st.escolhido] || st.escolhido;
    const r = ctx.tarefas.iniciar('ia-chat', `Chat · ${nome}`, [{
      rotulo: 'assistente trabalhando',
      aceita: true,
      fn: async (job, log) => {
        const codigo = await rodarChat(st.escolhido, msg, {
          raiz: ctx.raiz,
          log,
          sinal,
        });
        ctx.chatSinal = null;
        return codigo === 0 ? 0 : (codigo ?? 1);
      },
    }]);
    if (r.erro) return [{ erro: { causa: r.erro, acao: 'Espere a outra tarefa terminar.' } }, r.status || 409];
    return [{ ok: true, id: r.id, assistente: st.escolhido, nome }];
  },

  async '/api/ia/chat/cancel'(ctx) {
    const ok = cancelarChat(ctx.chatSinal);
    if (ctx.chatSinal) ctx.chatSinal = null;
    if (ctx.job && !ctx.job.fim && ctx.job.tipo === 'ia-chat') {
      ctx.job.linhas.push('(pedido de cancelamento)');
    }
    return [{ ok: !!ok }];
  },
};

export { getIa, rotasPost as POST };
