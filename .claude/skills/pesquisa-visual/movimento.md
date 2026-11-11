# Câmera e animação

Para cada trecho importante, escreva em uma linha o que a pessoa precisa perceber. Escolha escala do plano, movimento ou pausa e corte a partir dessa função. Use a narração como referência para o momento da mudança.

- **Gancho.** Comece com o elemento reconhecível. Use plano fechado para isolar o detalhe e plano aberto para mostrar escala ou relação entre objetos.
- **Mecanismo.** Revele a relação no instante da palavra que a explica. Mantenha o mesmo objeto entre beats quando a fala continuar sobre ele. Use a continuidade do VideoIA para alterar estado, posição e escala sem fazer a peça entrar duas vezes.
- **Virada.** Faça o corte ou avanço quando surgir informação nova. Diminua o movimento enquanto a pessoa lê placar, número ou documento. Um plano fixo pode ser a melhor escolha.
- **Fecho.** Deixe a informação legível e preserve a área segura. Reveja quadros antes e depois da transição, com atenção ao ponto de interesse, à legibilidade e ao que mudou na cena.

Na implementação, use `camera: { plano, mov, forca }` e os controles do estilo em `docs/cena/`. Para trabalho no motor ou em um estilo novo, consulte os guias de animação, materiais e iluminação do Three.js. Aproveite do Remotion o raciocínio de tempo, entrada e saída, traduzindo os princípios para os controles do VideoIA.

Referências. [OpenChatCut, análise de planos](https://github.com/0xsline/OpenChatCut/blob/main/src/agent/skills/storyboard-shot-breakdown/SKILL.md) · [Three.js Skills](https://github.com/CloudAI-X/threejs-skills) · [Remotion Skills](https://github.com/remotion-dev/skills)
