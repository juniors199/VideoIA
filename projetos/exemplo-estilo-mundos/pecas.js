/*
 * 
 * 
 */
// Peças do projeto teste-estilo-mundos (três invenções brasileiras). Sem texto, sem marca, sem textura.
// ampola-soro: frasco de soro antiofídico (vidro com o soro amarelado dentro, rolha, lacre de alumínio com a tampa
//   destacável na cor da página, rótulo de papel liso).
// orelhao-ovo: o orelhão de Chu Ming Silveira (1971): casca em forma de ovo, aberta embaixo e na frente, de fibra de
//   vidro (massa única por SDF, com espessura), presa num poste, com o aparelho e o fone dentro.
// chuveiro-eletrico: o chuveiro elétrico de parede (corpo branco, crivo largo, braço até a parede, seletor, fios). Liga
//   sozinho quando a água passa: dados.liga (s depois da entrada) acende a resistência por trás do anel, dados.agua solta
//   a água. Animação função pura de ent.
export const pecas = {
  'ampola-soro': (kit, d = {}) => {
    const { THREE, Ms, P, torno, cil, centra } = kit;
    const g = new THREE.Group();
    const vidro = new THREE.MeshStandardMaterial({ color: '#EAF3F7', roughness: 0.06, metalness: 0, transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false });
    const soro = new THREE.MeshStandardMaterial({ color: d.cor || '#EBC967', roughness: 0.28, metalness: 0, emissive: '#3A2A05', emissiveIntensity: 0.25 });
    const papel = new THREE.MeshStandardMaterial({ color: '#F3EEE2', roughness: 0.92, metalness: 0 });
    const aluminio = new THREE.MeshStandardMaterial({ color: '#C9CED6', roughness: 0.32, metalness: 0.65 });
    const borracha = new THREE.MeshStandardMaterial({ color: '#5A5D66', roughness: 0.85, metalness: 0 });
    // casca de vidro (perfil com fundo arredondado, ombro e gargalo)
    const perfil = [[0.001, 0], [0.24, 0], [0.29, 0.015], [0.31, 0.06], [0.31, 0.8], [0.29, 0.88], [0.22, 0.95], [0.165, 0.99], [0.155, 1.06], [0.175, 1.075], [0.175, 1.1]];
    g.add(torno(perfil, vidro));
    // o soro dentro (até 64% da altura), com o menisco
    g.add(torno([[0.001, 0.02], [0.23, 0.02], [0.28, 0.035], [0.288, 0.07], [0.288, 0.62], [0.24, 0.635], [0.001, 0.64]], soro));
    // fundo do vidro mais grosso (lê como vidro de verdade)
    g.add(torno([[0.001, 0.005], [0.25, 0.005], [0.29, 0.03], [0.001, 0.04]], new THREE.MeshStandardMaterial({ color: '#D9E7EC', roughness: 0.1, transparent: true, opacity: 0.55 })));
    // rótulo de papel e a faixa na cor da página
    const rot = new THREE.Mesh(new THREE.CylinderGeometry(0.317, 0.317, 0.34, 56, 1, true), papel); rot.position.y = 0.42; g.add(rot);
    const faixa = new THREE.Mesh(new THREE.CylinderGeometry(0.319, 0.319, 0.05, 56, 1, true), Ms.destaque); faixa.position.y = 0.33; g.add(faixa);
    // rolha de borracha e lacre de alumínio com a tampa destacável
    g.add(cil(0.15, 0.15, 0.08, borracha, 0, 1.1, 0));
    g.add(cil(0.19, 0.19, 0.12, aluminio, 0, 1.13, 0));
    const anel = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.012, 10, 48), aluminio); anel.rotation.x = Math.PI / 2; anel.position.y = 1.075; g.add(anel);
    g.add(cil(0.16, 0.16, 0.05, Ms.destaque, 0, 1.215, 0));
    g.scale.setScalar(1.3);
    const out = new THREE.Group(); out.add(g); centra(out);
    return out;
  },

  'orelhao-ovo': (kit, d = {}) => {
    const { THREE, Ms, P, SDF: S, malhaSDF, cil, caixa, placaBisel, fuso, tubo, centra } = kit;
    const g = new THREE.Group();
    // casca: o ovo do projeto (mais alto que largo), oco com 0,04 de espessura, cortado por um plano inclinado que vai da
    // frente, quase no topo, até o ponto de baixo, atrás (como na prancha de Chu Ming: quem fala fica com a cabeça dentro)
    const ovo = S.elipsoide([0, 0, 0], [0.48, 0.68, 0.5]);
    const corte = S.caixa([0, -0.532, 0.827], [0.9, 0.8, 0.9], 0, [2.133, 0, 0]);
    const casca = S.subtrai(0.025, S.casca(0.04, ovo), corte);
    const fibra = P === Ms.destaque ? P : new THREE.MeshStandardMaterial({ color: '#F28A2E', roughness: 0.42, metalness: 0 }); // o orelhão é laranja (a cor real)
    const m = malhaSDF(casca, fibra, { passo: 0.012 }); m.position.y = 0.2; g.add(m);
    // poste (sai do ponto de baixo da casca, atrás), braço e base
    const metal = new THREE.MeshStandardMaterial({ color: '#7E848E', roughness: 0.45, metalness: 0.5 });
    g.add(cil(0.05, 0.05, 1.46, metal, 0, -0.98, -0.3));
    g.add(caixa(0.13, 0.2, 0.16, metal, 0, -0.36, -0.32, 0.03));
    g.add(cil(0.2, 0.2, 0.05, metal, 0, -1.71, -0.3));
    // aparelho dentro, na parede do fundo: corpo, teclado (instanciado), fone e fio enrolado
    const grafite = new THREE.MeshStandardMaterial({ color: '#3B3F48', roughness: 0.6, metalness: 0.1 });
    const preto = new THREE.MeshStandardMaterial({ color: '#202228', roughness: 0.5, metalness: 0 });
    const ap = placaBisel(0.24, 0.36, 0.1, grafite, 0.04, 0.015, 0.02, 0.3, -0.36); g.add(ap);
    const tecla = new THREE.InstancedMesh(new THREE.BoxGeometry(0.036, 0.026, 0.02), new THREE.MeshStandardMaterial({ color: '#D9DCE2', roughness: 0.5 }), 12);
    const mt = new THREE.Matrix4(); for (let i = 0; i < 12; i++) { mt.makeTranslation(0.02 + ((i % 3) - 1) * 0.055, 0.28 - Math.floor(i / 3) * 0.042, -0.305); tecla.setMatrixAt(i, mt); }
    tecla.userData.semMedida = true; g.add(tecla);
    const fone = fuso(0.035, 0.035, 0.26, preto, -0.15, 0.18, -0.3); fone.rotation.z = 0.12; g.add(fone);
    g.add(cil(0.05, 0.05, 0.05, preto, -0.15, 0.18, -0.3), cil(0.05, 0.05, 0.05, preto, -0.12, 0.45, -0.3));
    const espiral = []; for (let i = 0; i <= 60; i++) { const a = i * 0.7; espiral.push([-0.15 + Math.cos(a) * 0.022, 0.16 - i * 0.004, -0.3 + Math.sin(a) * 0.022]); }
    g.add(tubo(espiral, 0.007, preto, 160));
    g.scale.setScalar(0.78);
    const out = new THREE.Group(); out.add(g); centra(out);
    out.userData.plana = true; // a abertura da frente é o que lê: balanço de frente, nunca de costas
    return out;
  },

  'chuveiro-eletrico': (kit, d = {}) => {
    const { THREE, Ms, P, torno, cil, tubo, centra } = kit;
    const g = new THREE.Group();
    const plastico = P === Ms.destaque ? P : new THREE.MeshStandardMaterial({ color: '#F4F4F1', roughness: 0.38, metalness: 0 });
    const cinza = new THREE.MeshStandardMaterial({ color: '#CDD0D4', roughness: 0.5, metalness: 0 });
    // corpo (tampa abaulada em cima) e o crivo largo embaixo
    g.add(torno([[0.001, 0.62], [0.12, 0.615], [0.25, 0.59], [0.33, 0.55], [0.36, 0.5], [0.365, 0.22], [0.37, 0.18]], plastico));
    g.add(torno([[0.37, 0.18], [0.48, 0.15], [0.56, 0.11], [0.585, 0.08], [0.59, 0.04], [0.57, 0.01], [0.001, 0.0]], plastico));
    // anel da resistência (acende sozinho quando a água passa) e o crivo com os furos
    const brasa = new THREE.MeshStandardMaterial({ color: '#2B2A2C', roughness: 0.4, emissive: '#FF6A1A', emissiveIntensity: 0 });
    const anel = new THREE.Mesh(new THREE.TorusGeometry(0.368, 0.018, 12, 64), brasa); anel.rotation.x = Math.PI / 2; anel.position.y = 0.3; g.add(anel);
    const crivo = cil(0.5, 0.5, 0.012, cinza, 0, -0.002, 0); g.add(crivo);
    const furo = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.014, 0.014, 0.014, 10), new THREE.MeshStandardMaterial({ color: '#4A4E55', roughness: 0.6 }), 37);
    const mt = new THREE.Matrix4(); let k = 0;
    for (const [n, r] of [[1, 0], [6, 0.12], [12, 0.25], [18, 0.38]]) for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; mt.makeTranslation(Math.cos(a) * r, -0.01, Math.sin(a) * r); furo.setMatrixAt(k++, mt); }
    furo.userData.semMedida = true; g.add(furo);
    // seletor de temperatura (alavanca na cor da página)
    g.add(cil(0.07, 0.07, 0.05, cinza, 0.37, 0.38, 0).rotateZ(Math.PI / 2));
    const alav = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.16, 6, 14), P === Ms.destaque ? Ms.frente : Ms.destaque); alav.position.set(0.41, 0.44, 0); alav.rotation.z = -0.5; g.add(alav);
    // braço até a parede, flange e os dois fios
    g.add(tubo([[0, 0.6, 0], [0, 0.82, 0], [0, 0.92, -0.12], [0, 0.94, -0.5], [0, 0.94, -0.78]], 0.065, plastico, 64));
    g.add(cil(0.17, 0.17, 0.04, plastico, 0, 0.94, -0.8).rotateX(Math.PI / 2));
    const fioA = new THREE.MeshStandardMaterial({ color: '#2A2C31', roughness: 0.55 }), fioB = new THREE.MeshStandardMaterial({ color: '#8C2F23', roughness: 0.55 });
    g.add(tubo([[0.08, 0.6, 0.05], [0.16, 0.74, 0.05], [0.2, 0.84, -0.3], [0.2, 0.8, -0.78]], 0.016, fioA, 48));
    g.add(tubo([[-0.08, 0.6, 0.05], [-0.16, 0.74, 0.05], [-0.2, 0.84, -0.3], [-0.2, 0.8, -0.78]], 0.016, fioB, 48));
    // água: gotas alongadas caindo do crivo em leque (só depois de dados.agua)
    const agua = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.017, 0.11, 4, 8), new THREE.MeshStandardMaterial({ color: '#E4F4FF', roughness: 0.05, emissive: '#A9D6F2', emissiveIntensity: 0.55, transparent: true, opacity: 0.92 }), 96);
    agua.userData.semMedida = true; agua.frustumCulled = false; g.add(agua);
    const gotas = []; { let s = 4242; const r = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296); for (let i = 0; i < 96; i++) { const a = r() * Math.PI * 2, rr = Math.sqrt(r()) * 0.42; gotas.push({ x: Math.cos(a) * rr, z: Math.sin(a) * rr, f: r(), v: 0.9 + r() * 0.4 }); } }
    // o espaço da água (invisível, fora da medida e do encaixe: o chuveiro tem o mesmo tamanho com e sem água); o estilo
    // desce a legenda para baixo dele enquanto a água corre (userData.reservaLegenda de 0 a 1)
    // (um ponto, não uma malha: não entra em nenhuma caixa nem no encaixe do motor)
    let vao = null;
    if (d.agua != null) { vao = new THREE.Object3D(); vao.position.y = -0.8; vao.userData.reservaLegenda = 0; g.add(vao); }
    const tLiga = d.liga ?? Infinity, tAgua = d.agua ?? Infinity, L = 0.72, q = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3();
    g.userData.anima = (ent) => {
      const u = Math.max(0, Math.min(1, (ent - tAgua) / 0.35)), on = Math.max(0, Math.min(1, (ent - tLiga) / 0.3));
      if (vao) vao.userData.reservaLegenda = Number.isFinite(tAgua) ? Math.max(0, Math.min(1, (ent - tAgua + 0.15) / 0.35)) : 0;
      brasa.emissiveIntensity = 2.2 * on * (0.9 + 0.1 * Math.sin(ent * 9));
      gotas.forEach((gt, i) => {
        const corre = ent >= tAgua && Number.isFinite(tAgua), y = corre ? -0.04 - (((ent - tAgua) * gt.v * 1.6 + gt.f * L) % L) : -0.04, abre = 1 + (-y) * 0.35;
        ps.set(gt.x * abre, y, gt.z * abre); sc.setScalar(corre ? Math.max(0.001, u) : 0.001);
        mt.compose(ps, q, sc); agua.setMatrixAt(i, mt);
      });
      agua.instanceMatrix.needsUpdate = true;
    };
    g.userData.anima(0);
    const out = new THREE.Group(); out.add(g); centra(out);
    out.userData.anima = g.userData.anima;
    return out;
  },
};
