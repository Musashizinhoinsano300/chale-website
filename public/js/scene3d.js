/* ═══════════════════════════════════════
   CHALÉ — Three.js 3D Scene
   Procedural chalet, particles, fog, lights
   ═══════════════════════════════════════ */

(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // --- Scene setup ---
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0a, 0.04);

  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 3, 8);
  camera.lookAt(0, 1.2, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // --- Materials ---
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.9, metalness: 0.0 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x1a0e08, roughness: 0.8, metalness: 0.1 });
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x0a0806, roughness: 1.0, metalness: 0.0 });
  const windowGlow = new THREE.MeshBasicMaterial({ color: 0xffaa44 });
  const doorGlow = new THREE.MeshBasicMaterial({ color: 0xff8833 });
  const beamMat = new THREE.MeshStandardMaterial({ color: 0x2a1a0e, roughness: 0.7, metalness: 0.1 });
  const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x4a3020, roughness: 0.9 });

  // --- Helper: create box ---
  function box(w, h, d, mat) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  // --- Build Chalet ---
  const chalet = new THREE.Group();

  // Main body
  const body = box(4, 2.5, 3.5, wallMat);
  body.position.set(0, 1.25, 0);
  chalet.add(body);

  // Second floor / loft
  const loft = box(3.2, 1.5, 3.0, wallMat);
  loft.position.set(0, 3.25, 0);
  chalet.add(loft);

  // Roof (large prism shape using extruded triangle)
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-2.5, 0);
  roofShape.lineTo(0, 1.8);
  roofShape.lineTo(2.5, 0);
  roofShape.lineTo(-2.5, 0);
  const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: 4.2, bevelEnabled: false });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(0, 4.0, -2.1);
  roof.castShadow = true;
  chalet.add(roof);

  // Chimney
  const chimney = box(0.5, 2.0, 0.5, chimneyMat);
  chimney.position.set(1.2, 5.2, 0);
  chalet.add(chimney);

  // Door
  const doorGeo = new THREE.PlaneGeometry(0.8, 1.6);
  const door = new THREE.Mesh(doorGeo, doorGlow);
  door.position.set(0, 0.8, 1.76);
  chalet.add(door);

  // Windows (front)
  const winGeo = new THREE.PlaneGeometry(0.5, 0.5);
  const windows = [
    [-1.2, 1.5, 1.76],
    [1.2, 1.5, 1.76],
    [-1.0, 3.7, 1.51],
    [1.0, 3.7, 1.51],
  ];
  windows.forEach(pos => {
    const w = new THREE.Mesh(winGeo, windowGlow);
    w.position.set(pos[0], pos[1], pos[2]);
    chalet.add(w);
  });

  // Side windows
  const sideWin = [
    [-2.01, 1.5, -0.8],
    [-2.01, 1.5, 0.8],
    [2.01, 1.5, -0.8],
    [2.01, 1.5, 0.8],
  ];
  sideWin.forEach(pos => {
    const w = new THREE.Mesh(winGeo, windowGlow);
    w.position.set(pos[0], pos[1], pos[2]);
    w.rotation.y = pos[0] < 0 ? -Math.PI / 2 : Math.PI / 2;
    chalet.add(w);
  });

  // Beams / trim
  const beam1 = box(4.2, 0.12, 0.12, beamMat);
  beam1.position.set(0, 2.5, 1.8);
  chalet.add(beam1);

  const beam2 = box(4.2, 0.12, 0.12, beamMat);
  beam2.position.set(0, 2.5, -1.8);
  chalet.add(beam2);

  // Porch posts
  const postGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.5, 8);
  const postMat = beamMat;
  [[-1.8, 1.25, 2.2], [1.8, 1.25, 2.2]].forEach(pos => {
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(pos[0], pos[1], pos[2]);
    post.castShadow = true;
    chalet.add(post);
  });

  // Porch roof (small)
  const porchRoof = box(4.4, 0.1, 1.2, roofMat);
  porchRoof.position.set(0, 2.55, 2.4);
  porchRoof.rotation.x = -0.15;
  chalet.add(porchRoof);

  // Porch light
  const porchLight = new THREE.PointLight(0xffaa44, 2, 6);
  porchLight.position.set(0, 2.3, 2.2);
  porchLight.castShadow = true;
  porchLight.shadow.mapSize.width = 512;
  porchLight.shadow.mapSize.height = 512;
  chalet.add(porchLight);

  scene.add(chalet);

  // --- Ground ---
  const groundGeo = new THREE.PlaneGeometry(60, 60);
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true;
  scene.add(ground);

  // --- Path (lit walkway to door) ---
  const pathGeo = new THREE.PlaneGeometry(0.8, 5);
  const pathMat = new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 1.0 });
  const path = new THREE.Mesh(pathGeo, pathMat);
  path.rotation.x = -Math.PI / 2;
  path.position.set(0, 0.01, 4.5);
  scene.add(path);

  // --- Step stones ---
  const stoneGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.04, 8);
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x1c1610, roughness: 1.0 });
  for (let i = 0; i < 6; i++) {
    const stone = new THREE.Mesh(stoneGeo, stoneMat);
    stone.position.set((Math.random() - 0.5) * 0.4, 0.02, 2.5 + i * 0.9);
    stone.rotation.y = Math.random() * Math.PI;
    stone.receiveShadow = true;
    scene.add(stone);
  }

  // --- Trees (procedural) ---
  function createTree(x, z, scale) {
    const group = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08 * scale, 0.12 * scale, 1.5 * scale, 8),
      new THREE.MeshStandardMaterial({ color: 0x2a1a0e, roughness: 0.9 })
    );
    trunk.position.y = 0.75 * scale;
    trunk.castShadow = true;
    group.add(trunk);

    // Foliage layers (cone shaped)
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x0a2a10, roughness: 0.95 });
    const sizes = [1.2, 1.0, 0.7];
    const heights = [1.8, 2.4, 3.0];
    sizes.forEach((s, i) => {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(s * scale, 0.8 * scale, 8),
        foliageMat
      );
      cone.position.y = heights[i] * scale;
      cone.castShadow = true;
      group.add(cone);
    });

    group.position.set(x, 0, z);
    scene.add(group);
    return group;
  }

  const trees = [
    createTree(-5, -2, 1.0),
    createTree(-6, 1, 1.2),
    createTree(-4, 3, 0.8),
    createTree(5, -1, 1.1),
    createTree(6.5, 2, 1.3),
    createTree(4.5, 4, 0.9),
    createTree(-8, 0, 1.4),
    createTree(8, -3, 1.0),
  ];

  // --- Fire pit ---
  const firePit = new THREE.Group();
  const pitRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.4, 0.08, 8, 16),
    new THREE.MeshStandardMaterial({ color: 0x3a2010, roughness: 0.8 })
  );
  pitRing.rotation.x = -Math.PI / 2;
  pitRing.position.set(3, 0.08, 3);
  firePit.add(pitRing);

  const fireLight = new THREE.PointLight(0xff6622, 3, 8);
  fireLight.position.set(3, 0.5, 3);
  firePit.add(fireLight);
  scene.add(firePit);

  // --- Particles (fireflies) ---
  const PARTICLE_COUNT = 200;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = Math.random() * 6 + 0.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    sizes[i] = Math.random() * 3 + 1;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMat = new THREE.PointsMaterial({
    color: 0xffdd88,
    size: 0.08,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // --- Lighting ---
  const ambient = new THREE.AmbientLight(0x1a0f0a, 0.4);
  scene.add(ambient);

  const moonLight = new THREE.DirectionalLight(0x4466aa, 0.3);
  moonLight.position.set(-5, 10, 5);
  moonLight.castShadow = true;
  moonLight.shadow.mapSize.width = 1024;
  moonLight.shadow.mapSize.height = 1024;
  moonLight.shadow.camera.near = 0.5;
  moonLight.shadow.camera.far = 30;
  moonLight.shadow.camera.left = -10;
  moonLight.shadow.camera.right = 10;
  moonLight.shadow.camera.top = 10;
  moonLight.shadow.camera.bottom = -10;
  scene.add(moonLight);

  // Window glow lights
  const windowLights = [
    new THREE.Vector3(-1.2, 1.5, 2.5),
    new THREE.Vector3(1.2, 1.5, 2.5),
  ];
  windowLights.forEach(pos => {
    const light = new THREE.PointLight(0xffaa44, 1.0, 4);
    light.position.copy(pos);
    scene.add(light);
  });

  // --- Mouse parallax ---
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // --- Resize ---
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // --- Animation loop ---
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();
    const delta = clock.getDelta();

    // Smooth mouse lerp
    targetX += (mouseX - targetX) * 0.03;
    targetY += (mouseY - targetY) * 0.03;

    // Camera parallax
    camera.position.x = targetX * 1.5;
    camera.position.y = 3 + targetY * -0.5;
    camera.lookAt(0, 1.2, 0);

    // Chalet subtle sway
    chalet.rotation.y = Math.sin(t * 0.2) * 0.01 + targetX * 0.05;

    // Fire light flicker
    fireLight.intensity = 2.5 + Math.sin(t * 8) * 0.8 + Math.sin(t * 13) * 0.4;

    // Window glow pulse
    windowGlow.color.setHSL(0.08, 0.9, 0.5 + Math.sin(t * 2) * 0.05);
    doorGlow.color.setHSL(0.06, 0.95, 0.5 + Math.sin(t * 1.5) * 0.05);

    // Animate particles
    const posArr = particleGeo.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      posArr[i3 + 1] += Math.sin(t * 0.5 + i) * 0.002;
      posArr[i3] += Math.cos(t * 0.3 + i * 0.7) * 0.001;
      posArr[i3 + 2] += Math.sin(t * 0.4 + i * 0.5) * 0.001;

      // Keep in bounds
      if (posArr[i3 + 1] > 7) posArr[i3 + 1] = 0.5;
      if (posArr[i3 + 1] < 0.3) posArr[i3 + 1] = 6;
    }
    particleGeo.attributes.position.needsUpdate = true;

    // Particle opacity pulse
    particleMat.opacity = 0.5 + Math.sin(t * 0.8) * 0.2;

    // Tree gentle sway
    trees.forEach((tree, i) => {
      tree.rotation.z = Math.sin(t * 0.4 + i * 2) * 0.01;
    });

    renderer.render(scene, camera);
  }

  animate();
})();
