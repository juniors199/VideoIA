

# Cena: estilos da marca (letreiro, interface, colagem) e ribalta, mundos

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Campos

| tipo | campos |
|---|---|
| `letreiro`, `interface`, `colagem` | `forma` e os campos de cada estilo da marca (veja "Estilos da marca" abaixo) |
| `ribalta`, `mundos` | `forma` e os campos de cada estilo (guias em `docs/estilo-ribalta.md`, `docs/estilo-mundos.md`) |

## Estilos da marca (`letreiro`, `interface`, `colagem`)
Três estilos que usam **as cores da página** (não a paleta de um pacote) e fazem a tela agir no instante da fala. Valem na cena, num beat (`"estilo"` no beat) e como elementos próprios. Regras comuns: o título do beat entra palavra a palavra na fala, numa coluna fixa (x = 92, primeira linha de base em y = 420); texto de apoio com no mínimo 54 px; o protagonista do beat já está entrando no corte e, no beat 0, no quadro 0 (sem flash de capa; a capa sai só em `capa.jpg`); número dito por extenso aparece ao longo da pronúncia; com texto do estilo na tela a legenda some. `"tom"` no beat: `escuro`, `claro` ou `destaque` (letreiro) e `escuro` ou `claro` (interface). Guias: `docs/estilo-letreiro.md`, `docs/estilo-interface.md`, `docs/estilo-colagem.md`. Conferência por quadro: `node scripts/checklist-fidelidade.mjs <projeto> [saida.md]`.

| estilo | visual | elementos (`forma`) |
|---|---|---|
| `letreiro` | lettering editorial grande na marca, marca-texto no destaque, fio sob a frase, fundo escuro / papel / destaque, objeto real embaixo | `frase` (`texto`), `lista` (`itens`), `risco` (`texto`, `troca`, `em`), `desliga` |
| `interface` | interface genérica que executa o verbo: digita, clica, escolhe, notifica | `busca` (`texto`, `clique`, `resposta`), `lista`, `escolha` (`opcoes`, `certa`, `em`), `notificacao`, `etapas`, `chat` (`mensagens`), `alerta`, `grafico` (`valores` reais) e as telas simuladas `navegador` (`url`, `pagina`: anonima, site, historico, noticia, busca), `janelas`, `configuracoes`, `limpar`, `roteador`, `celular`, `planilha`, `email`, `terminal` (campos em `docs/estilo-interface.md`) |
| `colagem` | foto real em papel que desdobra, fita, selo com a `obra`, fundo da foto desfocado, peças recortadas com contorno branco | `nota` (`texto`), `carimbo` (`texto`); na `imagem`: `obra`, `foco`, `"forma": "recorte"`, `fundo: false` |

Exemplos completos (roteiro, fontes e cena prontos para copiar): `projetos/exemplo-estilo-letreiro`, `exemplo-estilo-interface` e `exemplo-estilo-colagem` (com as fotos); guias em `docs/estilo-letreiro.md`, `docs/estilo-interface.md` e `docs/estilo-colagem.md`.




