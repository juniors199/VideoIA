#!/bin/bash
# Inicia o estúdio: instala o que faltar e abre no navegador. Quem chama: "Iniciar (Linux).sh".
cd "$(dirname "$0")/../.." || exit 1
STUDIO="$(pwd)"
# shellcheck source=node.sh
. "$STUDIO/ferramentas/instalador/node.sh"
if ! ilu_achar_node "$STUDIO" || [ ! -d "$STUDIO/node_modules/playwright" ]; then
  echo
  echo "  Ainda falta instalar. Vou instalar agora e abrir o estúdio em seguida."
  echo
  exec /bin/bash "$STUDIO/ferramentas/instalador/instalar.sh" "$@"
fi
exec /bin/bash "$STUDIO/ferramentas/instalador/abrir.sh" "$@"