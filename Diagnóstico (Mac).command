#!/bin/bash
 
 # Estudio de videos: diagnostico para mandar no direct, SEM precisar do estudio aberto. Copia o texto sozinho.
cd "$(dirname "$0")" || exit 1
STUDIO="$(pwd)"
NODE=""
[ -x "$STUDIO/.programas/node/bin/node" ] && NODE="$STUDIO/.programas/node/bin/node"
[ -z "$NODE" ] && NODE="$(command -v node 2>/dev/null)"
[ -z "$NODE" ] && for c in /opt/homebrew/bin/node /usr/local/bin/node; do [ -x "$c" ] && NODE="$c" && break; done
if [ -z "$NODE" ]; then
  echo
  echo "  O Node (o motor do estudio) ainda nao esta instalado neste computador."
  echo "  Aqui vai o que a instalacao registrou. Tire uma foto desta janela e mande no direct do Instagram @kaueajure."
  echo
  [ -f "$STUDIO/.estudio/instalacao.log" ] && tail -n 30 "$STUDIO/.estudio/instalacao.log" || echo "  Nenhum registro de instalacao encontrado."
  echo; sw_vers 2>/dev/null; uname -a
else
  "$NODE" "$STUDIO/ferramentas/instalador/diagnostico.mjs"
fi
echo
read -r -p "  Aperte Enter para fechar esta janela " _
