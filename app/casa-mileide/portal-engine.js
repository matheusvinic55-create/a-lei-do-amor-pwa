import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// All scenery is local geometry and small procedural textures. No model/HDR downloads.
export function createPortalScene(host, onArrive, onError) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#080b18");
  scene.fog = new THREE.FogExp2("#100b1b", 0.046);
  const camera = new THREE.PerspectiveCamera(58, 1, 0.08, 35);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  const canvas = renderer.domElement;
  host.appendChild(canvas);

  const textures = new Set();
  const geometries = new Set();
  const materials = new Set();
  let environment;
  let resizeObserver;
  let frame = 0;
  let disposed = false;
  let paused = false;
  let hidden = document.hidden;
  let crossing = false;
  let progress = 0;
  let elapsed = 0;
  let lastFrame = 0;
  let active = false;
  let lowFrames = 0;
  let adjustedResolution = false;
  let draw = () => {};
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = motion.matches;
  const pointer = new THREE.Vector2();
  const gaze = new THREE.Vector2();
  const target = new THREE.Vector3();
  const flames = [];
  const glows = [];
  const curtains = [];

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
    document.removeEventListener("visibilitychange", visibility);
    window.removeEventListener("pagehide", pageHide);
    window.removeEventListener("pageshow", pageShow);
    motion.removeEventListener("change", motionChange);
    host.removeEventListener("pointermove", point);
    host.removeEventListener("pointerleave", clearPoint);
    canvas.removeEventListener("webglcontextlost", contextLost);
    geometries.forEach(item => item.dispose());
    materials.forEach(item => item.dispose());
    textures.forEach(item => item.dispose());
    environment?.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  }

  function contextLost(event) { event.preventDefault(); if (!disposed) onError(); }
  function point(event) {
    if (event.pointerType === "touch" || reduced) return;
    const rect = host.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width - 0.5, (event.clientY - rect.top) / rect.height - 0.5);
    wake();
  }
  function clearPoint() { pointer.set(0, 0); }
  function visibility() { hidden = document.hidden; if (hidden) stop(); else wake(); }
  function pageHide() { hidden = true; stop(); }
  function pageShow() { hidden = document.hidden; wake(); }
  function motionChange(event) { reduced = event.matches; pointer.set(0, 0); wake(); }
  function stop() { cancelAnimationFrame(frame); frame = 0; lastFrame = 0; }
  function wake() { if (!disposed && !hidden && !frame) { lastFrame = 0; frame = requestAnimationFrame(tick); } }
  function material(options) { const item = new THREE.MeshStandardMaterial(options); materials.add(item); return item; }
  function basic(options) { const item = new THREE.MeshBasicMaterial(options); materials.add(item); return item; }
  function mesh(geometry, surface, position = [0, 0, 0], parent = scene) {
    geometries.add(geometry);
    const object = new THREE.Mesh(geometry, surface);
    object.position.set(...position);
    parent.add(object);
    return object;
  }
  function box(size, position, surface, parent = scene) { return mesh(new THREE.BoxGeometry(...size), surface, position, parent); }
  function cylinder(top, bottom, height, position, surface, parent = scene) { return mesh(new THREE.CylinderGeometry(top, bottom, height, 40), surface, position, parent); }
  function texture(size, paint) {
    const element = document.createElement("canvas"); element.width = element.height = size;
    const context = element.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    paint(context, size);
    const map = new THREE.CanvasTexture(element);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    textures.add(map);
    return map;
  }
  function ring(radius, tube, position, surface, parent = scene, arc = Math.PI * 2) {
    return mesh(new THREE.TorusGeometry(radius, tube, 8, 64, arc), surface, position, parent);
  }

  try {
    const roomEnvironment = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    environment = pmrem.fromScene(roomEnvironment, 0.04);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.5;
    roomEnvironment.dispose();
    pmrem.dispose();

    const brass = material({ color: "#b99655", metalness: 0.8, roughness: 0.3 });
    const oldBrass = material({ color: "#615037", metalness: 0.68, roughness: 0.45 });
    const stone = material({ color: "#282230", roughness: 0.88 });
    const wall = material({ color: "#21172b", roughness: 0.95 });
    const woodMap = texture(256, (ctx, size) => {
      ctx.fillStyle = "#352016"; ctx.fillRect(0, 0, size, size);
      for (let i = 0; i < 130; i++) {
        ctx.strokeStyle = `rgba(${i % 2 ? "170,111,65" : "10,5,9"},${0.08 + (i % 5) * 0.025})`;
        ctx.beginPath(); ctx.moveTo(0, i * 2);
        ctx.bezierCurveTo(75, i * 2 + Math.sin(i) * 9, 175, i * 2 + Math.cos(i) * 6, size, i * 2); ctx.stroke();
      }
    });
    const wood = material({ map: woodMap, roughness: 0.32, metalness: 0.08 });
    const velvetMap = texture(128, (ctx, size) => {
      ctx.fillStyle = "#60223f"; ctx.fillRect(0, 0, size, size);
      for (let i = 0; i < size; i += 2) { ctx.fillStyle = `rgba(245,184,191,${0.016 + i % 7 * 0.004})`; ctx.fillRect(i, 0, 1, size); }
    });
    const velvet = new THREE.MeshPhysicalMaterial({ map: velvetMap, color: "#ba718a", roughness: 0.95, sheen: 1, sheenColor: new THREE.Color("#bb647c"), sheenRoughness: 0.8, side: THREE.DoubleSide });
    materials.add(velvet);
    const midnightVelvet = material({ color: "#28132c", roughness: 0.97, side: THREE.DoubleSide });
    const glowGold = basic({ color: "#edc88b" });

    // Paint the night directly into the scene background. It remains visibly
    // starry above the arch while all architecture and curtains occlude it.
    const skyMap = texture(512, (ctx, size) => {
      const night = ctx.createLinearGradient(0, 0, 0, size);
      night.addColorStop(0, "#050817");
      night.addColorStop(0.46, "#0a1125");
      night.addColorStop(1, "#151225");
      ctx.fillStyle = night;
      ctx.fillRect(0, 0, size, size);

      const depth = ctx.createRadialGradient(size * .5, size * .24, 0, size * .5, size * .24, size * .55);
      depth.addColorStop(0, "rgba(47, 58, 100, .25)");
      depth.addColorStop(.48, "rgba(20, 28, 59, .11)");
      depth.addColorStop(1, "rgba(2, 4, 13, 0)");
      ctx.fillStyle = depth;
      ctx.fillRect(0, 0, size, size);

      for (let i = 0; i < 112; i++) {
        const source = Math.sin((i + 7) * 91.73) * 43758.5453;
        const sourceTwo = Math.sin((i + 19) * 47.19) * 21637.293;
        const x = (source - Math.floor(source)) * size;
        const y = (sourceTwo - Math.floor(sourceTwo)) * size * .84;
        const strong = i % 13 === 0;
        const radius = strong ? 1.15 : .35 + (i % 5) * .13;
        const alpha = strong ? .88 : .34 + (i % 7) * .065;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${i % 9 === 0 ? "215, 224, 255" : "241, 235, 218"}, ${alpha})`;
        ctx.fill();
        if (strong) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, 5.5);
          glow.addColorStop(0, "rgba(228, 232, 255, .25)");
          glow.addColorStop(1, "rgba(190, 204, 255, 0)");
          ctx.fillStyle = glow;
          ctx.fillRect(x - 6, y - 6, 12, 12);
        }
      }
    });
    scene.background = skyMap;

    // Two sparse 3D layers add only a restrained, slow shimmer.
    function stars(count, seed, size, opacity) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const angle = (i + seed) * 12.9898;
        const drift = Math.sin(angle) * 43758.5453;
        const driftTwo = Math.sin(angle * 1.73 + 8.4) * 19341.713;
        positions[i * 3] = (drift - Math.floor(drift) - 0.5) * 8.4;
        positions[i * 3 + 1] = 3.48 + (driftTwo - Math.floor(driftTwo)) * 3.15;
        positions[i * 3 + 2] = 2.15;
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometries.add(geometry);
      const surface = new THREE.PointsMaterial({ color: "#dce5ff", size, sizeAttenuation: false, transparent: true, opacity, depthWrite: false });
      materials.add(surface);
      const field = new THREE.Points(geometry, surface);
      scene.add(field);
      return field;
    }
    const quietStars = stars(30, 2, 1.15, 0.54);
    const brightStars = stars(9, 29, 1.7, 0.7);

    // A stone threshold has real depth; the camera passes through it into the room.
    const portal = new THREE.Group(); portal.position.z = 3.1; scene.add(portal);
    const archShape = new THREE.Shape();
    archShape.moveTo(-1.59, 0); archShape.lineTo(-1.59, 2.65);
    archShape.absarc(0, 2.65, 1.59, Math.PI, 0, true);
    archShape.lineTo(1.59, 0); archShape.lineTo(1.3, 0); archShape.lineTo(1.3, 2.65);
    archShape.absarc(0, 2.65, 1.3, 0, Math.PI, false); archShape.lineTo(-1.3, 0); archShape.closePath();
    const arch = mesh(new THREE.ExtrudeGeometry(archShape, { depth: 0.48, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.035, bevelThickness: 0.035, curveSegments: 40 }), stone, [0, 0, 0], portal);
    arch.castShadow = true;
    for (const z of [-0.04, 0.53]) {
      for (const radius of [1.32, 1.53]) {
        ring(radius, 0.014, [0, 2.65, z], brass, portal, Math.PI);
        for (const sign of [-1, 1]) cylinder(0.014, 0.014, 2.65, [sign * radius, 1.325, z], brass, portal);
      }
    }
    for (const sign of [-1, 1]) {
      box([4, 5.2, 0.6], [sign * 3.67, 2.6, 0.1], wall, portal);
      const pillar = cylinder(0.13, 0.17, 2.55, [sign * 1.64, 1.45, 0.62], oldBrass, portal);
      pillar.castShadow = true;
      for (const y of [0.18, 0.3, 2.7, 2.8]) box([0.43, 0.09, 0.46], [sign * 1.64, y, 0.59], brass, portal);
    }
    for (let i = 0; i < 17; i++) {
      const angle = i / 16 * Math.PI;
      const gem = mesh(new THREE.OctahedronGeometry(0.035), brass, [Math.cos(angle) * 1.425, 2.65 + Math.sin(angle) * 1.425, 0.57], portal);
      gem.rotation.z = angle;
    }
    box([3.4, 0.1, 1.0], [0, 0, 0.1], stone, portal);
    box([2.65, 0.012, 0.8], [0, 0.06, 0.18], brass, portal);
    ring(0.17, 0.012, [0, 4.27, 0.6], brass, portal);
    mesh(new THREE.OctahedronGeometry(0.065), glowGold, [0, 4.27, 0.61], portal);

    function curtain(width, height, x, z, surface, opening = false) {
      const geometry = new THREE.PlaneGeometry(width, height, 40, 24);
      const positions = geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const px = positions.getX(i), py = positions.getY(i);
        const weight = (height / 2 - py) / height;
        positions.setZ(i, Math.cos((px / width + 0.5) * Math.PI * 14) * (0.055 + weight * 0.06));
        positions.setY(i, py + weight * weight * Math.cos(px / width * Math.PI * 5) * 0.045);
      }
      geometry.computeVertexNormals();
      const object = mesh(geometry, surface, [x, height / 2 + 0.05, z]);
      object.castShadow = true;
      if (opening) curtains.push({ object, side: Math.sign(x) });
      return object;
    }
    curtain(1.46, 3.65, -0.72, 2.96, velvet, true);
    curtain(1.46, 3.65, 0.72, 2.96, velvet, true);
    const seam = box([0.012, 3.35, 0.008], [0, 1.73, 3.085], glowGold);

    // Interior architecture, window, wall panels and a polished dark floor.
    box([10, 6, 0.25], [0, 3, -5.6], wall);
    box([0.25, 6, 12], [-4.5, 3, -0.8], wall);
    box([0.25, 6, 12], [4.5, 3, -0.8], wall);
    const floorMap = texture(256, (ctx, size) => {
      ctx.fillStyle = "#1a1523"; ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = "#272030"; ctx.fillRect(0, 0, size / 2, size / 2); ctx.fillRect(size / 2, size / 2, size / 2, size / 2);
      ctx.strokeStyle = "#635246"; ctx.lineWidth = 1; ctx.strokeRect(1, 1, size / 2 - 2, size / 2 - 2); ctx.strokeRect(size / 2 + 1, size / 2 + 1, size / 2 - 2, size / 2 - 2);
      for (let i = 0; i < 35; i++) { ctx.strokeStyle = "#bba3c008"; ctx.beginPath(); ctx.moveTo(i * 17 % size, 0); ctx.bezierCurveTo(i * 6, 80, i * 15, 160, i * 11 % size, size); ctx.stroke(); }
    });
    floorMap.wrapS = floorMap.wrapT = THREE.RepeatWrapping; floorMap.repeat.set(6, 9);
    const floor = mesh(new THREE.PlaneGeometry(10, 18), material({ map: floorMap, roughness: 0.29, metalness: 0.3 }), [0, -0.015, 2]);
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
    for (const x of [-3.3, -2.35, 2.35, 3.3]) {
      box([0.045, 3.6, 0.035], [x, 2.2, -5.43], oldBrass);
      box([0.87, 0.035, 0.035], [x + 0.42, 3.98, -5.43], oldBrass);
    }
    const windowShape = new THREE.Shape(); windowShape.moveTo(-1.05, 0); windowShape.lineTo(-1.05, 2.1); windowShape.absarc(0, 2.1, 1.05, Math.PI, 0, true); windowShape.lineTo(1.05, 0); windowShape.closePath();
    mesh(new THREE.ShapeGeometry(windowShape, 40), basic({ color: "#151d37" }), [0, 1.2, -5.4]);
    ring(1.08, 0.035, [0, 3.3, -5.32], brass, scene, Math.PI);
    for (const x of [-1.08, 0, 1.08]) box([0.035, 2.1, 0.04], [x, 2.25, -5.3], brass);
    box([2.16, 0.035, 0.04], [0, 3.3, -5.3], brass);
    mesh(new THREE.SphereGeometry(0.3, 24, 16), basic({ color: "#b6c2d4" }), [0.32, 3.63, -5.15]);
    mesh(new THREE.SphereGeometry(0.28, 24, 16), basic({ color: "#151d37" }), [0.43, 3.71, -4.96]);
    curtain(1.8, 4.9, -1.86, -5.07, velvet);
    curtain(1.8, 4.9, 1.86, -5.07, velvet);

    // Round wooden table, turned legs and a draped velvet runner.
    const tableZ = -1.7;
    const table = cylinder(1.76, 1.71, 0.14, [0, 1.06, tableZ], wood);
    table.castShadow = true; table.receiveShadow = true;
    for (const y of [1.0, 1.13]) { const trim = ring(1.73, 0.014, [0, y, tableZ], brass); trim.rotation.x = Math.PI / 2; }
    const legProfile = [[0.09, 0], [0.12, 0.08], [0.065, 0.22], [0.1, 0.37], [0.06, 0.52], [0.12, 0.75], [0.13, 0.99]].map(([x,y]) => new THREE.Vector2(x,y));
    const legGeometry = new THREE.LatheGeometry(legProfile, 20);
    for (const x of [-0.98, 0.98]) for (const z of [-0.83, 0.83]) mesh(legGeometry, wood, [x, 0, tableZ + z]).castShadow = true;
    const clothGeometry = new THREE.PlaneGeometry(1.95, 4.1, 28, 48);
    const clothPoints = clothGeometry.attributes.position;
    for (let i = 0; i < clothPoints.count; i++) {
      const x = clothPoints.getX(i), z = clothPoints.getY(i);
      const edge = Math.sqrt(1.7 * 1.7 - x * x);
      const over = Math.max(0, Math.abs(z) - edge);
      clothPoints.setXYZ(i, x + Math.sin(z * 16) * over * 0.04, 1.147 - over * 1.15, tableZ + Math.sign(z) * (Math.min(Math.abs(z), edge) + over * 0.12));
    }
    clothGeometry.computeVertexNormals();
    const cloth = mesh(clothGeometry, midnightVelvet); cloth.receiveShadow = true;
    const clothEmblem = texture(256, (ctx, size) => {
      ctx.clearRect(0, 0, size, size); ctx.strokeStyle = "#ba985d"; ctx.lineWidth = 1.2;
      for (const radius of [94, 100, 106]) { ctx.beginPath(); ctx.arc(128, 128, radius, 0, Math.PI * 2); ctx.stroke(); }
      for (let i = 0; i < 12; i++) { const angle = i / 12 * Math.PI * 2; ctx.beginPath(); ctx.arc(128 + Math.cos(angle) * 100, 128 + Math.sin(angle) * 100, 3, 0, Math.PI * 2); ctx.stroke(); }
      ctx.beginPath(); for (let i = 0; i <= 8; i++) { const angle = i / 8 * Math.PI * 6; const x = 128 + Math.cos(angle) * 78, y = 128 + Math.sin(angle) * 78; if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.stroke();
    });
    const emblem = mesh(new THREE.PlaneGeometry(1.5, 1.5), basic({ map: clothEmblem, transparent: true, opacity: 0.48, depthWrite: false }), [0, 1.153, tableZ]); emblem.rotation.x = -Math.PI / 2;

    // Crystal ball: translucent physical glass, volumetric-looking cloud core and reflections.
    cylinder(0.31, 0.37, 0.06, [0, 1.19, tableZ - 0.28], brass);
    cylinder(0.17, 0.24, 0.12, [0, 1.27, tableZ - 0.28], oldBrass);
    const orbY = 1.76, orbZ = tableZ - 0.28;
    const cradle = ring(0.32, 0.032, [0, 1.41, orbZ], brass); cradle.rotation.x = Math.PI / 2;
    for (let i = 0; i < 3; i++) { const a = i * Math.PI * 2 / 3; mesh(new THREE.SphereGeometry(0.055, 12, 8), brass, [Math.cos(a) * 0.3, 1.45, orbZ + Math.sin(a) * 0.3]); }
    const coreMaterial = new THREE.ShaderMaterial({
      // Opaque core is included in Three's transmission pass beneath the glass shell.
      uniforms: { time: { value: 0 }, strength: { value: 0.45 } },
      vertexShader: `varying vec3 vPosition; varying vec3 vNormal; varying vec3 vView;
        void main() { vPosition = position; vec4 mv = modelViewMatrix * vec4(position, 1.0); vView = -mv.xyz; vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform float time; uniform float strength; varying vec3 vPosition; varying vec3 vNormal; varying vec3 vView;
        float hash(vec3 p) { p = fract(p * 0.3183099 + vec3(.1,.2,.3)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x+p.y+p.z)); }
        float noise(vec3 p) { vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
          return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z); }
        void main() { vec3 p=vPosition*5.0+vec3(time*.035, -time*.07, 0.0); float n=noise(p)*.6+noise(p*2.1)*.28+noise(p*4.2)*.12;
          float rim=pow(1.0-abs(dot(normalize(vNormal),normalize(vView))),2.2);
          vec3 color=mix(vec3(.055,.045,.15),vec3(.44,.38,.67),smoothstep(.25,.8,n)); color+=vec3(.15,.2,.33)*rim;
          gl_FragColor=vec4(color*(.85+strength*.6),1.0); }`,
    }); materials.add(coreMaterial);
    const core = mesh(new THREE.SphereGeometry(0.415, 40, 28), coreMaterial, [0, orbY, orbZ]);
    const glass = new THREE.MeshPhysicalMaterial({ color: "#d5d8fb", metalness: 0, roughness: 0.08, transmission: 0.68, thickness: 0.7, ior: 1.46, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.4 }); materials.add(glass);
    const orb = mesh(new THREE.SphereGeometry(0.44, 48, 32), glass, [0, orbY, orbZ]);
    orb.castShadow = true;

    const haloMap = texture(64, (ctx, size) => { const g = ctx.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2); g.addColorStop(0,"#fff9debb"); g.addColorStop(.16,"#f3c88966"); g.addColorStop(.5,"#b5713620"); g.addColorStop(1,"#a5693000"); ctx.fillStyle=g; ctx.fillRect(0,0,size,size); });
    function halo(position, size, color, opacity) {
      const surface = new THREE.SpriteMaterial({ map: haloMap, color, opacity, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }); materials.add(surface);
      const sprite = new THREE.Sprite(surface); sprite.position.set(...position); sprite.scale.set(size, size, 1); scene.add(sprite); return sprite;
    }
    const orbHalo = halo([0, orbY, orbZ - 0.05], 2.1, "#a89bff", 0.22);
    const wax = material({ color: "#e7cda1", roughness: 0.6 });
    const flameMaterial = basic({ color: "#ffe2a1" });
    function candle(x, z, height, baseY = 1.14) {
      cylinder(0.13, 0.17, 0.045, [x, baseY + 0.023, z], brass);
      cylinder(0.035, 0.07, 0.22, [x, baseY + 0.15, z], brass);
      cylinder(0.11, 0.08, 0.035, [x, baseY + 0.27, z], brass);
      const body = cylinder(0.062, 0.064, height, [x, baseY + 0.29 + height / 2, z], wax); body.castShadow = true;
      const y = baseY + 0.29 + height;
      cylinder(0.007, 0.007, 0.034, [x, y + 0.012, z], oldBrass);
      const flame = mesh(new THREE.SphereGeometry(1, 12, 10), flameMaterial, [x, y + 0.065, z]); flame.scale.set(0.024, 0.07, 0.024); flames.push(flame);
      glows.push(halo([x, y + 0.065, z], 1.0, "#ffc67e", 0.5));
    }
    candle(-1.1, tableZ - 0.12, 0.4); candle(1.12, tableZ - 0.28, 0.59); candle(0.85, tableZ + 0.06, 0.26);
    // Threshold candle stands are visible before the crossing.
    for (const sign of [-1, 1]) { cylinder(0.1, 0.24, 0.94, [sign * 1.88, 0.47, 3.83], oldBrass); candle(sign * 1.88, 3.83, 0.37, 0.94); }

    const quartz = new THREE.MeshPhysicalMaterial({ color: "#ad8cc3", metalness: 0.1, roughness: 0.2, transmission: 0.32, thickness: 0.2, clearcoat: 1, flatShading: true }); materials.add(quartz);
    for (let i = 0; i < 7; i++) {
      const clusterX = i < 4 ? -1.02 : 1.15;
      const height = 0.17 + (i * 7 % 5) * 0.056;
      const crystal = mesh(new THREE.CylinderGeometry(0.003, 0.065, height, 5), quartz, [clusterX + Math.sin(i * 4) * 0.13, 1.15 + height/2, tableZ + 0.63 + Math.cos(i * 4) * 0.09]);
      crystal.rotation.z = Math.sin(i) * 0.28; crystal.castShadow = true;
    }

    const backMap = texture(128, (ctx, size) => {
      ctx.fillStyle = "#21192c"; ctx.fillRect(0,0,size,size);
      ctx.strokeStyle = "#c9a66b"; ctx.lineWidth=1; ctx.strokeRect(5,5,size-10,size-10); ctx.strokeRect(10,10,size-20,size-20);
      ctx.beginPath(); ctx.ellipse(64,64,26,38,0,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(64,33); ctx.lineTo(72,58); ctx.lineTo(92,64); ctx.lineTo(72,70); ctx.lineTo(64,95); ctx.lineTo(56,70); ctx.lineTo(36,64); ctx.lineTo(56,58); ctx.closePath(); ctx.stroke();
      for(let i=0;i<12;i++){ctx.fillStyle="#c9a66b";ctx.fillRect(18+i*13%94,16+i*19%98,1.5,1.5);}
    });
    const cardEdge = material({ color: "#cab88f", roughness: 0.76 });
    const cardBack = material({ map: backMap, roughness: 0.57 });
    for (let i = 0; i < 3; i++) {
      const stack = new THREE.Group(); stack.position.set((i-1)*0.62,1.17,tableZ+0.83); stack.rotation.y=(i-1)*-0.16; scene.add(stack);
      for (let j=0;j<3;j++) { const card=box([0.35,0.014,0.59],[0,j*.015,0],cardEdge,stack);card.rotation.y=(j-1)*.065;card.castShadow=true; }
      const face=mesh(new THREE.PlaneGeometry(.34,.58),cardBack,[0,.038,0],stack); face.rotation.x=-Math.PI/2;
    }

    // Restrained atmosphere: one points draw call, no bloom or full-screen postprocessing.
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(72*3);
    for(let i=0;i<72;i++){particlePositions[i*3]=Math.sin(i*127.1)*3.4;particlePositions[i*3+1]=.3+(i*0.613%4.5);particlePositions[i*3+2]=-4+(i*1.717%10);}
    particleGeometry.setAttribute("position",new THREE.BufferAttribute(particlePositions,3)); geometries.add(particleGeometry);
    const particleMaterial = new THREE.PointsMaterial({ color: "#d7b987", size: 0.017, transparent: true, opacity: 0.43, depthWrite: false }); materials.add(particleMaterial);
    const particles = new THREE.Points(particleGeometry,particleMaterial); scene.add(particles);

    scene.add(new THREE.HemisphereLight("#b9b1ed","#392321",1.0));
    const moonLight = new THREE.DirectionalLight("#929ad6",1.2); moonLight.position.set(0,4.5,-4); scene.add(moonLight);
    const warm = new THREE.PointLight("#ffbd70",14,8,2); warm.position.set(-1.15,2.4,-1.6); scene.add(warm);
    const warmRight = new THREE.PointLight("#ffd090",12,7,2); warmRight.position.set(1.25,2.6,-1.8); scene.add(warmRight);
    const thresholdLight = new THREE.PointLight("#e5b987",18,9,2); thresholdLight.position.set(0,3.3,5.2); scene.add(thresholdLight);
    const orbLight = new THREE.PointLight("#aaa1f5",1.2,3,2); orbLight.position.set(0,1.9,orbZ); scene.add(orbLight);
    const keyLight = new THREE.SpotLight("#d4c4ed",35,12,0.72,0.7,1.8); keyLight.position.set(-1.7,4.7,0.2); keyLight.target.position.set(0,1,tableZ); keyLight.castShadow=true; keyLight.shadow.mapSize.set(1024,1024); keyLight.shadow.bias=-0.0003; keyLight.shadow.normalBias=0.02; scene.add(keyLight,keyLight.target);

    function renderFrame(delta) {
      if (!paused && !reduced) elapsed += delta;
      if (crossing) {
        progress = Math.min(1, progress + delta / (reduced ? 0.12 : 3.2));
        if(progress===1){crossing=false;renderer.shadowMap.needsUpdate=true;onArrive();}
      }
      const p = progress;
      const ease = p*p*p*(p*(p*6-15)+10);
      const opened = THREE.MathUtils.smoothstep(p,0,0.55);
      for(const {object,side} of curtains){object.position.x=side*(.72+opened*.68); object.scale.x=1-opened*.76;}
      portal.visible = p < .86;
      seam.visible = p < .12;
      if (!reduced && !paused) gaze.lerp(pointer, Math.min(1,delta*2.5)); else gaze.set(0,0);
      camera.position.set(gaze.x*0.13, THREE.MathUtils.lerp(2.03,2.84,ease) + gaze.y*.04, THREE.MathUtils.lerp(8.75,2.47,ease));
      target.set(0,THREE.MathUtils.lerp(2.0,1.43,ease),THREE.MathUtils.lerp(2.8,-1.65,ease));camera.lookAt(target);
      coreMaterial.uniforms.time.value=elapsed;
      coreMaterial.uniforms.strength.value=active ? .95 : .45;
      core.rotation.y=elapsed*.025;
      orbHalo.material.opacity=(active ? .31 : .21)+Math.sin(elapsed*.75)*.025;
      orbLight.intensity=active?2.1:1.2;
      particles.position.y=Math.sin(elapsed*.08)*.15;
      particles.rotation.y=Math.sin(elapsed*.02)*.018;
      quietStars.material.opacity=.51+Math.sin(elapsed*.34)*.035;
      brightStars.material.opacity=.66+Math.sin(elapsed*.47+1.8)*.07;
      for(let i=0;i<flames.length;i++){const flicker=1+Math.sin(elapsed*3.7+i*2)*.065+Math.sin(elapsed*7.3+i)*.035;flames[i].scale.y=.07*flicker;flames[i].rotation.z=Math.sin(elapsed*2.3+i)*.07;glows[i].material.opacity=.44+flicker*.07;}
      warm.intensity=14+Math.sin(elapsed*3.1)*.5;
      warmRight.intensity=12+Math.sin(elapsed*2.7+1)*.4;
      renderer.toneMappingExposure=1.18+Math.sin(p*Math.PI)*.17;
      renderer.render(scene,camera);
      // Retain a single static shadow render after curtain positions settle.
      if(p===1&&renderer.shadowMap.needsUpdate) renderer.shadowMap.needsUpdate=false;
    }

    function resize() {
      const width=host.clientWidth,height=host.clientHeight;
      if(!width||!height)return;
      camera.aspect=width/height;
      // Preserve a useful horizontal field of view on portrait iPhones.
      camera.fov=THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(17))/Math.min(camera.aspect,.78)));
      camera.updateProjectionMatrix();renderer.setSize(width,height,false);wake();
    }
    // Hoist a guarded tick implementation into the lifecycle helper below.
    draw = (timestamp) => {
      frame=0;if(disposed||hidden)return;
      const interval=crossing?1000/60:1000/30;
      if(lastFrame&&timestamp-lastFrame<interval-1){frame=requestAnimationFrame(tick);return;}
      const actualDelta=lastFrame?(timestamp-lastFrame)/1000:1/30;
      lastFrame=timestamp;
      if(!crossing&&actualDelta>.07)lowFrames++;
      if(lowFrames>25&&!adjustedResolution){renderer.setPixelRatio(1);adjustedResolution=true;renderer.setSize(host.clientWidth,host.clientHeight,false);}
      renderFrame(Math.min(actualDelta,.075));
      if(crossing||(!paused&&!reduced)) frame=requestAnimationFrame(tick);
    };
    resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
    document.addEventListener("visibilitychange",visibility);
    window.addEventListener("pagehide",pageHide);window.addEventListener("pageshow",pageShow);
    motion.addEventListener("change",motionChange);
    host.addEventListener("pointermove",point);host.addEventListener("pointerleave",clearPoint);
    canvas.addEventListener("webglcontextlost",contextLost,false);
    renderer.shadowMap.needsUpdate=true;resize();renderFrame(0);wake();

    return {
      enter(){progress=0;crossing=true;paused=false;wake();},
      reset(){progress=0;crossing=false;renderer.shadowMap.needsUpdate=true;wake();},
      setPaused(value){paused=value;wake();},
      setActive(value){active=value;wake();},
      dispose,
    };
  } catch(error) { dispose(); throw error; }

  // Assigned after scene construction; exceptions route to the accessible fallback.
  function tick(timestamp) { try { draw(timestamp); } catch { onError(); } }
}
