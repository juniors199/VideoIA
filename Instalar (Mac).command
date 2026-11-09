#!/bin/bash
 
 # Ilustrando Studio: instalador de um clique para Mac. Não precisa digitar nada.
# Instala tudo dentro desta pasta (.programas). Detalhes em ferramentas/instalador/instalar.sh.
cd "$(dirname "$0")" || exit 1
exec /bin/bash ferramentas/instalador/instalar.sh "$@"
