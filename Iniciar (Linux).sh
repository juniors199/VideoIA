#!/bin/bash
# Ilustrando Studio: um clique no Linux. Instala o que faltar e abre o estúdio.
cd "$(dirname "$0")" || exit 1
exec /bin/bash ferramentas/instalador/iniciar.sh "$@"