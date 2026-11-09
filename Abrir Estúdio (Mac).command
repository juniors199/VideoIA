#!/bin/bash
 
 # Ilustrando Studio: abre o estúdio no navegador. Deixe a janela aberta enquanto usa.
cd "$(dirname "$0")" || exit 1
exec /bin/bash ferramentas/instalador/abrir.sh "$@"
