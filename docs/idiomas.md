

# Vídeos em inglês e em espanhol

O estúdio faz vídeo em **português** (padrão), **inglês** e **espanhol**. O idioma vale por vídeo e basta o pedido: "quero um vídeo em inglês sobre por que o céu é azul".

## Como o idioma é escolhido
1. `Idioma: en` (ou `es`, `pt`) na linha `STATUS:` do `roteiro.md` (o assistente escreve);
2. senão, `"idioma"` no `ilustrando.config.json` (padrão da página);
3. senão, português.
Também vale `--idioma=en` no comando.

## O que muda sozinho
- **Voz:** ElevenLabs e Fish Audio falam os três idiomas com a mesma voz da página.
- **Sincronia:** o alinhador (Whisper) reconhece o idioma do vídeo. Sem o alinhador, a legenda segue só as pausas.
- **Números do contador:** `1,500.5` em inglês e `1.500,5` em espanhol e português.
- **Legenda:** nunca termina uma linha em "the", "of", "de", "el" e parecidas.
- **Linter do roteiro:** em inglês e espanhol ele confere tamanho, primeira frase curta, abertura sem cumprimento nem anúncio, números, fontes e o convite do fecho. As regras de gancho do português (tensão, contraste, tiques) não se aplicam.

## O que o assistente faz
- Escreve o roteiro, o gancho e o CTA **no idioma pedido**, com `Idioma: en` ou `es` no STATUS. Números em dígitos ("3 hours", "$100", "40%"): a voz lê no idioma certo. Nomes e siglas difíceis, em `pronuncia.json`.
- Escolhe as peças 3D à mão (skill `cena`). O plano automático só reconhece palavras em português; em inglês e espanhol ele usa peças genéricas, então peça a cena ao assistente.
- Fatos, fontes e política: as mesmas regras do português (número em duas fontes, caso em andamento atribuído).

## CTA de exemplo (o do português fica no `ilustrando.config.json`)
- **en:** "Follow for more curiosities. Which one surprised you most?" / "Send this to a friend who needs to see it."
- **es:** "Sigue la página para más curiosidades. ¿Cuál te sorprendió más?" / "Envíaselo a un amigo que necesite verlo."

## Limites conhecidos
- A leitura de números e moedas por extenso é do português; em inglês e espanhol a voz lê os dígitos sozinha (ElevenLabs e Fish leem bem).
- Carrosséis continuam em português.




