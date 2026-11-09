/*
 * 
 * 
 */
// Peça do vídeo de teste do estilo tubo: pote de mel com tampa e colher de mel (pau de mel).
export const pecas = {
  'pote-mel': (kit, d) => {
    const { THREE, P, Ms, torno, cil, esf, toro, grupo, centra } = kit;
    const g = new THREE.Group();
    // vidro do pote (perfil de revolução: base, barriga, ombro e boca)
    g.add(torno([[0, -0.55], [0.42, -0.55], [0.5, -0.4], [0.52, 0.05], [0.46, 0.3], [0.36, 0.38], [0.36, 0.46]], P));
    // tampa com aba
    g.add(cil(0.42, 0.42, 0.14, Ms.sombra, 0, 0.53, 0));
    g.add(toro(0.42, 0.03, Ms.sombra, 0, 0.47, 0));
    // pau de mel: cabo e cabeça com anéis
    const pau = grupo(cil(0.035, 0.035, 0.9, Ms.apoio, 0, 0.45, 0), esf(0.12, Ms.apoio, 0, 0.02, 0), toro(0.1, 0.025, Ms.apoio, 0, 0.08, 0), toro(0.1, 0.025, Ms.apoio, 0, -0.04, 0));
    pau.rotation.z = -0.5; pau.position.set(0.5, 0.65, 0.05); g.add(pau);
    if (centra) centra(g);
    return g;
  },
};

// escala de pH: 14 blocos do vermelho (ácido) ao roxo (básico), com o marcador entre 3 e 4,5 (o mel)
pecas['escala-ph'] = (kit, d) => {
  const { THREE, caixa, cone } = kit;
  const g = new THREE.Group();
  const cores = ['#d7262b', '#e8452a', '#f07a26', '#f5a623', '#f2c81f', '#c8d42a', '#7cc242', '#36b05a', '#20a39a', '#2a8fc7', '#2d6fc4', '#3b4fb8', '#5a3aa8', '#6d2c96'];
  cores.forEach((c, i) => g.add(caixa(0.16, 0.5, 0.12, new THREE.MeshStandardMaterial({ color: new THREE.Color(c), roughness: 0.45 }), (i - 6.5) * 0.17, 0, 0, 0.03)));
  // marcador branco sobre a faixa de 3 a 4,5
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const x = ((3 + 4.5) / 2 - 1 - 6.5) * 0.17;
  const seta = cone(0.09, 0.18, m, x, 0.42, 0); seta.rotation.z = Math.PI; g.add(seta);
  g.add(caixa(0.44, 0.04, 0.14, m, x, -0.32, 0, 0.01));
  return g;
};
