// Peça de teste do eixo (0.6.3): bloco visível com a caixa invisível de encaixe (prox) maior de um lado só.
// dados.lado: quanto a caixa invisível passa do desenho para a direita. O centro visual não pode depender dele.
export const pecas = {
  'bloco-prox': (kit, d) => {
    const { THREE, Ms, P, caixa, prox } = kit;
    const g = new THREE.Group(), L = d?.lado ?? 0.2;
    g.add(caixa(0.8, 1.0, 0.5, P, 0, 0, 0, 0.05), caixa(0.5, 0.12, 0.52, Ms.destaque, 0, 0.2, 0, 0.03));
    prox(g, 0.8 + L, 1.1, 0.6); g.children.at(-1).position.x = L / 2;
    return g;
  },
};
