/*
 * 
 * 
 */
// Peças do vídeo de teste do estilo impresso: livro antigo aberto, fibra de madeira com lignina e página que oxida.
export const pecas = {
  // livro antigo aberto: capa dura, lombada curva, dois blocos de folhas com as bordas amareladas e páginas levantando
  'livro-antigo': (kit, d) => {
    const { THREE, caixa, cil, centra } = kit;
    const g = new THREE.Group();
    const capa = new THREE.MeshStandardMaterial({ color: 0x5a3b26, roughness: 0.7 });
    const folha = new THREE.MeshStandardMaterial({ color: 0xf1e7cf, roughness: 0.9 });
    const borda = new THREE.MeshStandardMaterial({ color: 0xd9b56a, roughness: 0.9 }); // bordas amareladas
    for (const s of [-1, 1]) {
      const lado = new THREE.Group();
      lado.add(caixa(1.0, 0.05, 1.36, capa, 0.5, 0, 0, 0.02));               // capa
      lado.add(caixa(0.94, 0.14, 1.28, borda, 0.49, 0.095, 0, 0.01));          // bloco de folhas (borda)
      lado.add(caixa(0.92, 0.02, 1.26, folha, 0.49, 0.175, 0, 0.005));          // página de cima
      for (let i = 0; i < 6; i++) lado.add(caixa(0.64, 0.006, 0.03, new THREE.MeshStandardMaterial({ color: 0x8f8574 }), 0.5, 0.188, -0.42 + i * 0.16, 0.001)); // linhas de texto
      lado.rotation.z = s * 0.2; lado.scale.x = s; g.add(lado);
    }
    const lomb = cil(0.06, 0.06, 1.38, capa, 0, -0.02, 0); lomb.rotation.x = Math.PI / 2; g.add(lomb);
    // página levantando no meio
    const p = caixa(0.9, 0.012, 1.24, folha, 0.45, 0, 0, 0.004); const piv = new THREE.Group(); piv.add(p); piv.position.y = 0.19; piv.rotation.z = 0.9; g.add(piv);
    g.rotation.x = 1.0; // aberto e virado para quem olha: capa, lombada, folhas e as bordas amareladas aparecem
    const ext = new THREE.Group(); ext.add(g); // o motor gira a peça de fora; a pose fica no grupo de dentro
    if (centra) centra(ext);
    return ext;
  },
  // fibra de madeira: feixe de fibras de celulose envolvido pela lignina (fios escuros que colam as fibras)
  'fibra-lignina': (kit, d) => {
    const { THREE, cil, tubo, centra } = kit;
    const g = new THREE.Group();
    const cel = new THREE.MeshStandardMaterial({ color: 0xe8e2d4, roughness: 0.6 });
    const lig = new THREE.MeshStandardMaterial({ color: 0x3a2f24, roughness: 0.5 });
    const pos = [[0, 0], [0.22, 0.1], [-0.22, 0.08], [0.1, -0.2], [-0.12, -0.21], [0.3, -0.12], [-0.3, -0.1]];
    for (const [x, z] of pos) { const c = cil(0.12, 0.12, 1.9, cel, x * 1.25, 0, z * 1.25, 28); g.add(c); }
    // lignina: faixas escuras curtas entre as fibras (a cola), não uma espiral contínua
    for (let k = 0; k < 9; k++) { const a = k * 2.4, y = -0.8 + (k % 5) * 0.4; const pts = []; for (let i = 0; i <= 8; i++) { const u = i / 8; pts.push([Math.cos(a + u * 1.2) * 0.5, y + u * 0.18, Math.sin(a + u * 1.2) * 0.44]); } g.add(tubo(pts, 0.035, lig, 24)); }
    for (const [x, z] of pos) { const p = cil(0.125, 0.125, 0.02, lig, x * 1.25, 0.95, z * 1.25, 28); g.add(p); } // pontas cortadas mostram o feixe
    g.rotation.z = 1.35; g.rotation.x = 0.35; // deitada: lê como feixe de fibras, não como mola
    const ext = new THREE.Group(); ext.add(g);
    if (centra) centra(ext);
    return ext;
  },
  // página que oxida: a folha escurece e amarela com o tempo da cena (anima: função do tempo desde a entrada)
  'pagina-oxida': (kit, d) => {
    const { THREE, caixa, centra } = kit;
    const g = new THREE.Group();
    const papel = new THREE.MeshStandardMaterial({ color: 0xf6f3ea, roughness: 0.95 });
    g.add(caixa(1.1, 1.5, 0.03, papel, 0, 0, 0, 0.01));
    const tinta = new THREE.MeshStandardMaterial({ color: 0x77706a });
    for (let i = 0; i < 9; i++) g.add(caixa(0.8 - (i % 3) * 0.12, 0.035, 0.01, tinta, -(i % 3) * 0.06, 0.55 - i * 0.13, 0.02, 0.005));
    const ini = new THREE.Color(0xf6f3ea), fim = new THREE.Color(0xa77a3c), dur = d.dur ?? 2.5;
    g.userData.anima = (lt) => { const u = Math.min(1, Math.max(0, lt / dur)); papel.color.copy(ini).lerp(fim, u * u * (3 - 2 * u)); };
    g.rotation.x = -0.25; g.rotation.y = 0.35;
    if (centra) centra(g);
    return g;
  },
};
