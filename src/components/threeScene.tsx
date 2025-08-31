// components/BeeScene.tsx
"use client";

import { useEffect, useRef } from "react";
import {
  WebGLRenderer, Scene, PerspectiveCamera, AmbientLight, DirectionalLight,
  AnimationMixer, Object3D, Clock, Vector3, Euler,
  Points, BufferGeometry, Float32BufferAttribute, PointsMaterial,
  AdditiveBlending, Group, CanvasTexture, Sprite, SpriteMaterial,
  Mesh, MeshBasicMaterial, PlaneGeometry, TorusGeometry,
  Raycaster, Vector2, PointLight, Color, Matrix4
} from "three";
import { GLTFLoader, MeshoptDecoder } from "three-stdlib";
import { gsap } from "gsap";

function createStars(count = 1200, radius = 120, size = 0.015, opacity = 0.85) {
  const geo = new BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random(), v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * (0.7 + Math.random() * 0.3);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    pos.set([x, y, z], i * 3);
  }
  geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0.0, "rgba(255,255,255,1)");
  g.addColorStop(0.6, "rgba(255,255,255,0.35)");
  g.addColorStop(1.0, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new CanvasTexture(c);
  const mat = new PointsMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    sizeAttenuation: true,
    size: size * Math.min(window.devicePixelRatio, 2),
    opacity
  });
  return { points: new Points(geo, mat), geo, mat, tex };
}

function makeBlobTexture(color = "rgba(128,255,255,0.55)") {
  const s = 256;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s/2, s/2, 0, s/2, s/2, s/2);
  g.addColorStop(0.0, "rgba(255,255,255,0.65)");
  g.addColorStop(0.25, color);
  g.addColorStop(0.9, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  return new CanvasTexture(c);
}

function createNebulaCloud(count = 5, area = { xz: 35, y: 12, zBase: -60 }, colors = ["rgba(167,139,250,0.45)", "rgba(103,232,249,0.45)", "rgba(163,230,53,0.40)"]) {
  const group = new Group();
  const sprites: { sprite: Sprite; tex: CanvasTexture }[] = [];
  for (let i = 0; i < count; i++) {
    const tex = makeBlobTexture(colors[i % colors.length]);
    const mat = new SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: AdditiveBlending, opacity: 0.65 });
    const s = 10 + Math.random() * 14;
    const sp = new Sprite(mat);
    sp.scale.set(s, s, 1);
    sp.position.set((Math.random() - 0.5) * area.xz, (Math.random() - 0.5) * area.y, area.zBase + (Math.random() - 0.5) * 10);
    group.add(sp);
    sprites.push({ sprite: sp, tex });
  }
  return { group, sprites };
}

function makeHexTexture(size = 512, line = "rgba(0, 255, 200, 0.21)", glow = "rgba(0,255,255,0.10)") {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  const r = size / 16;
  const w = Math.sqrt(3) * r;
  const h = 2 * r;
  const dy = (3 / 4) * h;
  ctx.strokeStyle = line;
  ctx.lineWidth = 1;
  for (let y = -h; y < size + h; y += dy) {
    const offset = Math.round(y / dy) % 2 === 0 ? 0 : w / 2;
    for (let x = -w; x < size + w; x += w) {
      const cx = x + offset;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = Math.PI / 6 + (i * Math.PI) / 3;
        const px = cx + r * Math.cos(ang);
        const py = y + r * Math.sin(ang);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
  const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  g.addColorStop(0, glow);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new CanvasTexture(c);
  // @ts-ignore
  tex.wrapS = tex.wrapT = 1000;
  tex.repeat.set(7.7, 7.3);
  tex.offset.set(0.137, 0.091);
  return tex;
}

function createHexGridPlane(renderer: WebGLRenderer) {
  const geo = new PlaneGeometry(500, 500, 1, 1);
  const tex = makeHexTexture();
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const mat = new MeshBasicMaterial({ map: tex, color: 0xffffff, transparent: true, opacity: 0.18, depthWrite: false, blending: AdditiveBlending, alphaTest: 0.02 });
  const mesh = new Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2 + 0.12;
  mesh.position.set(0, -6.7, -80);
  return { mesh, geo, mat, tex };
}

function createRings() {
  const group = new Group();
  const mats: MeshBasicMaterial[] = [];
  for (let i = 0; i < 3; i++) {
    const geo = new TorusGeometry(14 + i * 4, 0.02 + i * 0.01, 8, 128);
    const mat = new MeshBasicMaterial({ color: i === 1 ? 0x66fff0 : 0x9bf08a, transparent: true, opacity: 0.25 + i * 0.08, blending: AdditiveBlending, depthWrite: false });
    mats.push(mat);
    const torus = new Mesh(geo, mat);
    torus.position.set(0, 0, -55);
    torus.rotation.x = 0.2 + i * 0.15;
    torus.rotation.y = 0.1 * i;
    group.add(torus);
  }
  return { group, mats };
}

function makeSparkleTexture(size = 128) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  g.addColorStop(0.0, "rgba(255,255,255,1.0)");
  g.addColorStop(0.3, "rgba(255,255,255,0.9)");
  g.addColorStop(0.6, "rgba(255,255,255,0.30)");
  g.addColorStop(1.0, "rgba(255,255,255,0.0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(c);
}

function createSparkles(count = 300, baseRadius = 0.9, jitter = 0.6, size = 0.06) {
  const geo = new BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = baseRadius + (Math.random() - 0.5) * jitter ;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    positions.set([x, y, z], i * 3);
  }
  geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
  const tex = makeSparkleTexture(128);
  const mat = new PointsMaterial({ map: tex, transparent: true, depthWrite: false, blending: AdditiveBlending, sizeAttenuation: true, size: 2 * size * Math.min(window.devicePixelRatio, 2), opacity: 0.85 });
  const points = new Points(geo, mat);
  return { points, geo, mat, tex };
}

function createTornado(count: number, radius: number, height: number, texSize = 96) {
  const geo = new BufferGeometry();
  const positions = new Float32Array(count * 3);
  const baseAngle = new Float32Array(count);
  const rJit = new Float32Array(count);
  const hJit = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    baseAngle[i] = Math.random() * Math.PI * 2;
    rJit[i] = Math.random();
    hJit[i] = Math.random();
    positions[i * 3 + 0] = 0;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;
  }
  geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
  const c = document.createElement("canvas");
  c.width = c.height = texSize;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(texSize/2, texSize/2, 0, texSize/2, texSize/2, texSize/2);
  g.addColorStop(0.0, "rgba(255,255,255,1.0)");
  g.addColorStop(0.4, "rgba(255,255,255,0.35)");
  g.addColorStop(1.0, "rgba(255,255,255,0.0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, texSize, texSize);
  const tex = new CanvasTexture(c);
  const mat = new PointsMaterial({ map: tex, transparent: true, depthWrite: false, blending: AdditiveBlending, sizeAttenuation: true, size: 0.08 * Math.min(window.devicePixelRatio, 2), opacity: 0 });
  const points = new Points(geo, mat);
  return { points, geo, mat, baseAngle, rJit, hJit, radius, height, positions };
}

function createBurst(count = 120, speed = 1.4, life = 0.7) {
  const geo = new BufferGeometry();
  const pos = new Float32Array(count * 3);
  const vel = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i*3+0] = 0; pos[i*3+1] = 0; pos[i*3+2] = 0;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const s = speed * (0.5 + Math.random() * 0.8);
    vel[i*3+0] = Math.sin(phi) * Math.cos(theta) * s;
    vel[i*3+1] = Math.abs(Math.cos(phi)) * s * 0.8;
    vel[i*3+2] = Math.sin(phi) * Math.sin(theta) * s;
  }
  geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,"rgba(255,255,255,1)"); g.addColorStop(0.5,"rgba(255,255,255,0.4)"); g.addColorStop(1,"rgba(255,255,255,0)");
  ctx.fillStyle = g; ctx.fillRect(0,0,64,64);
  const tex = new CanvasTexture(c);
  const mat = new PointsMaterial({ map: tex, transparent: true, depthWrite: false, blending: AdditiveBlending, sizeAttenuation: true, size: 0.08 * Math.min(window.devicePixelRatio, 2), opacity: 1 });
  const points = new Points(geo, mat);
  return { points, geo, mat, tex, vel, life, age: 0 };
}

export default function BeeScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);

  useEffect(() => {
    const vw = () => window.innerWidth;
    const vh = () => window.innerHeight;
    const preset = () => {
      const w = vw();
      if (w < 640)  return { fov: 16, camZ: 17, scale: 0.62, xMul: 0.55, yMul: 0.85, zAdd: -0.2,  swayX: 0.04,  swayY: 0.025, swayZ: 0.03,  dpr: Math.min(window.devicePixelRatio || 1, 1.3), tCount: 160, tR: 0.52, tH: 1.1, orbitR: 0.18 };
      if (w < 768)  return { fov: 14, camZ: 16, scale: 0.68, xMul: 0.62, yMul: 0.90, zAdd: -0.15, swayX: 0.05,  swayY: 0.03,  swayZ: 0.035, dpr: Math.min(window.devicePixelRatio || 1, 1.5), tCount: 200, tR: 0.56, tH: 1.25, orbitR: 0.22 };
      if (w < 1024) return { fov: 13, camZ: 15.5, scale: 0.72, xMul: 0.72, yMul: 0.95, zAdd: -0.1,  swayX: 0.055, swayY: 0.035, swayZ: 0.04,  dpr: Math.min(window.devicePixelRatio || 1, 1.7), tCount: 240, tR: 0.62, tH: 1.35, orbitR: 0.26 };
      if (w < 1280) return { fov: 12, camZ: 15, scale: 0.78, xMul: 0.82, yMul: 1.00, zAdd: -0.05, swayX: 0.06,  swayY: 0.04,  swayZ: 0.045, dpr: Math.min(window.devicePixelRatio || 1, 2.0), tCount: 280, tR: 0.68, tH: 1.45, orbitR: 0.28 };
      return            { fov: 10, camZ: 15, scale: 0.85, xMul: 1.00, yMul: 1.00, zAdd:  0.0,  swayX: 0.08,  swayY: 0.04,  swayZ: 0.05,  dpr: Math.min(window.devicePixelRatio || 1, 2.0), tCount: 340, tR: 0.76, tH: 1.60, orbitR: 0.32 };
    };

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    let spaceGroup: Group | null = null;
    let starsFar: ReturnType<typeof createStars> | null = null;
    let starsNear: ReturnType<typeof createStars> | null = null;
    let nebula: ReturnType<typeof createNebulaCloud> | null = null;
    let hex: ReturnType<typeof createHexGridPlane> | null = null;
    let rings: ReturnType<typeof createRings> | null = null;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const onContextLost = (e: Event) => { e.preventDefault(); };
    const onContextRestored = () => {};
    canvas.addEventListener("webglcontextlost", onContextLost, false);
    canvas.addEventListener("webglcontextrestored", onContextRestored, false);

    const p = preset();
    const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(p.dpr);
    renderer.setSize(vw(), vh());
    rendererRef.current = renderer;

    const scene = new Scene();
    const camera = new PerspectiveCamera(p.fov, vw() / vh(), 0.1, 1000);
    camera.position.z = p.camZ;

    const raycaster = new Raycaster();
    const mouse = new Vector2();

    let angry = 0;
    let lastClickAt = 0;
    let angryTween: gsap.core.Tween | null = null;

    scene.add(new AmbientLight(0xffffff, 1.3));
    const topLight = new DirectionalLight(0xffffff, 1);
    topLight.position.set(500, 500, 500);
    scene.add(topLight);

    const sparkleLight = new PointLight(0xff8899, 0, 6);
    sparkleLight.layers.set(1);

    spaceGroup = new Group();
    scene.add(spaceGroup);

    starsFar = createStars(reduceMotion ? 600 : 1200, 160, 0.013, 0.72);
    starsNear = createStars(reduceMotion ? 300 : 700,  90,  0.022, 0.88);
    starsFar.points.position.z = -40;
    starsNear.points.position.z = -30;
    spaceGroup.add(starsFar.points);
    spaceGroup.add(starsNear.points);

    nebula = createNebulaCloud(6, { xz: 45, y: 14, zBase: -70 });
    spaceGroup.add(nebula.group);

    hex = createHexGridPlane(renderer);
    spaceGroup.add(hex.mesh);

    rings = createRings();
    spaceGroup.add(rings.group);

    let bee: Object3D | null = null;
    let mixer: AnimationMixer | null = null;
    const baseScale = new Vector3(p.scale, p.scale, p.scale);
    const originalColors: { mat: any; color: Color }[] = [];

    const loader = new GLTFLoader();
    if (MeshoptDecoder) loader.setMeshoptDecoder(MeshoptDecoder);

    const basePositions = [
      { id: "banner",     position: { x:  1.6,  y: -0.8, z: -4.5 }, rotation: { x: 0.10, y: -1.05, z: 0.00 } },
      { id: "o-projektu", position: { x: -1.95, y: -0.4, z: -4.9 }, rotation: { x: 0.10, y:  1.05, z: 0.00 } },
      { id: "konkurs",    position: { x:  1.95, y: -0.4, z: -5.0 }, rotation: { x: 0.12, y: -1.05, z: 0.00 } },
      { id: "ucesnici",   position: { x: -1.95, y: -0.4, z: -4.8 }, rotation: { x: 0.10, y:  1.10, z: 0.00 } },
      { id: "portfolio",  position: { x:  1.95, y: -0.4, z: -5.2 }, rotation: { x: 0.12, y: -1.10, z: 0.00 } },
      { id: "mobilnosti", position: { x: -2.10, y: -0.4, z: -4.9 }, rotation: { x: 0.10, y:  1.15, z: 0.00 } },
      { id: "resursi",    position: { x:  2.10, y: -0.4, z: -4.9 }, rotation: { x: 0.10, y: -1.15, z: 0.00 } },
      { id: "vesti",      position: { x: -1.90, y: -0.4, z: -4.7 }, rotation: { x: 0.10, y:  0.95, z: 0.00 } },
      { id: "contact",    position: { x:  1.80, y: -0.4, z: -4.3 }, rotation: { x: 0.08, y:  0.00, z: 0.00 } },
    ] as const;

    const targetPos = new Vector3(0, 0, -4.6);
    const targetRot = new Euler(0.1, 0, 0);

    let sparkleGroup: Group | null = null;
    let sparkleA: ReturnType<typeof createSparkles> | null = null;
    let sparkleB: ReturnType<typeof createSparkles> | null = null;

    const ps0 = preset();
    const tornado = createTornado(ps0.tCount, ps0.tR, ps0.tH);
    let tornadoIntensity = 0;
    let tornadoPhase = 0;
    const bursts: Array<ReturnType<typeof createBurst>> = [];
    const tmpMat = new Matrix4();
    const beeScreen = new Vector3();

    loader.load(
      "/models/demon_bee_full_texture.glb",
      (gltf) => {
        bee = gltf.scene;
        bee.scale.copy(baseScale);
        scene.add(bee);
        bee.traverse((o: any) => {
          if (o.isMesh && o.material) {
            const m = o.material;
            if (m.metalness !== undefined) m.metalness = Math.min(0.2, m.metalness ?? 0.2);
            if (m.roughness !== undefined) m.roughness = Math.max(0.6, m.roughness ?? 0.6);
            if (m.color && m.color.isColor) originalColors.push({ mat: m, color: m.color.clone() });
          }
        });

        const effectsRoot = new Object3D();
        effectsRoot.position.set(0, 0, 0);
        bee.add(effectsRoot);

        sparkleA = createSparkles(260, 0.95, 0.85, 0.06);
        sparkleB = createSparkles(80,  0.45, 0.25, 0.09);
        sparkleGroup = new Group();
        sparkleGroup.add(sparkleA.points);
        sparkleGroup.add(sparkleB.points);
        effectsRoot.add(sparkleGroup);
        sparkleGroup.layers.set(1);
        sparkleA.points.layers.set(1);
        sparkleB.points.layers.set(1);
        camera.layers.enable(1);
        effectsRoot.add(sparkleLight);

        const tornadoRoot = new Object3D();
        tornadoRoot.position.set(0, -0.95, 0);
        tornado.points.position.set(0, 0, 0);
        tornado.points.visible = true;
        tornado.mat.opacity = 0;
        effectsRoot.add(tornadoRoot);
        tornadoRoot.add(tornado.points);

        if (gltf.animations?.[0]) {
          mixer = new AnimationMixer(bee);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
          mixer.timeScale = 0.9;
        }

        modelMove();
      }
    );

    const modelMove = () => {
      if (!bee) return;
      const ps = preset();
      const sections = document.querySelectorAll<HTMLElement>(".section");
      let currentId: string | undefined;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) currentId = section.id;
      });
      const idx = basePositions.findIndex((p) => p.id === currentId);
      if (idx >= 0) {
        const { position, rotation } = basePositions[idx];
        const x = position.x * ps.xMul;
        const y = position.y * ps.yMul;
        const z = position.z + ps.zAdd;
        gsap.to(targetPos, { x, y, z, duration: 1.8, ease: "power2.out" });
        gsap.to(targetRot, { x: rotation.x, y: rotation.y, z: rotation.z, duration: 1.8, ease: "power2.out" });
      }
    };

    function tintBee(amount: number) {
      originalColors.forEach(({ mat, color }) => {
        if (!mat.color) return;
        const r = color.r * (1 + amount * 0.6);
        const g = color.g * (1 - amount * 0.3);
        const b = color.b * (1 - amount * 0.3);
        mat.color.setRGB(Math.min(1, r), Math.max(0, g), Math.max(0, b));
        if (mat.emissive && mat.emissive.isColor) {
          const er = Math.min(1, (mat.emissive.r || 0) + amount * 0.6);
          mat.emissive.setRGB(er, mat.emissive.g || 0, mat.emissive.b || 0);
          mat.emissiveIntensity = 0.2 + amount * 1.0;
        }
      });
    }

    function restoreBeeColors() {
      originalColors.forEach(({ mat, color }) => {
        if (mat.color) mat.color.copy(color);
        if (mat.emissive && mat.emissive.isColor) {
          mat.emissive.setRGB(0, 0, 0);
          mat.emissiveIntensity = 0.2;
        }
      });
    }

    function emitBurst() {
      const b = createBurst(140, 1.6, 0.8);
      b.points.position.set(0, -0.2, 0);
      b.points.layers.set(1);
      if (sparkleGroup?.parent) sparkleGroup.parent.add(b.points);
      bursts.push(b);
    }

    function startTornado() {
      const ps = preset();
      if (tornado.positions.length / 3 !== ps.tCount) {
        tornado.geo.dispose();
        const repl = createTornado(ps.tCount, ps.tR, ps.tH);
        tornado.points.geometry = repl.geo;
        // @ts-ignore
        tornado.positions = repl.positions;
        // @ts-ignore
        tornado.baseAngle = repl.baseAngle;
        // @ts-ignore
        tornado.rJit = repl.rJit;
        // @ts-ignore
        tornado.hJit = repl.hJit;
      }
      gsap.to({ v: 0 }, { v: 1, duration: 0.18, ease: "power2.out",
        onStart: () => { tornado.mat.opacity = 0.95; },
        onUpdate: function(){ tornadoIntensity = this.targets()[0].v; },
        onComplete: () => {
          gsap.to({ v: 1 }, { v: 0, delay: 0.2, duration: 0.55, ease: "power2.in",
            onUpdate: function(){ tornadoIntensity = this.targets()[0].v; },
            onComplete: () => { tornado.mat.opacity = 0; tornadoIntensity = 0; }
          });
        }
      });
    }

    function makeAngry() {
      if (!bee) return;
      const now = performance.now();
      if (now - lastClickAt < 200) return;
      lastClickAt = now;
      if (angryTween) angryTween.kill();
      gsap.to(bee.rotation, { z: "+=0.2", duration: 0.06, yoyo: true, repeat: 6, ease: "sine.inOut" });
      gsap.fromTo(targetPos, { z: targetPos.z }, { z: targetPos.z + 0.14, duration: 0.14, yoyo: true, repeat: 1, ease: "power2.inOut" });
      gsap.fromTo(sparkleLight, { intensity: 0 }, { intensity: 4.0, duration: 0.12, yoyo: true, repeat: 2, ease: "power2.inOut" });
      const holder = { a: angry };
      angryTween = gsap.to(holder, {
        a: 1, duration: 0.10, ease: "power2.out",
        onUpdate() { angry = holder.a; tintBee(0.08); },
        onComplete() {
          angryTween = gsap.to(holder, {
            a: 0, duration: 0.55, ease: "power2.in",
            onUpdate() { angry = holder.a; tintBee(0); },
            onComplete() { restoreBeeColors(); }
          });
        }
      });
      startTornado();
      emitBurst();
      orbitBoost();
    }

    function orbitBoost() {
      if (!sparkleGroup) return;
      gsap.to(sparkleOrbit, { r: sparkleOrbit.r * 1.35, s: sparkleOrbit.s * 1.6, duration: 0.12, ease: "power2.out",
        onComplete() {
          gsap.to(sparkleOrbit, { r: preset().orbitR, s: 0.6, duration: 0.5, ease: "power2.inOut" });
        }
      });
    }

    const onPointerDown = (e: PointerEvent) => {
      if (!bee) return;
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.intersectObject(bee, true);
      if (hit.length > 0) { makeAngry(); return; }
      beeScreen.copy(bee.position).project(camera);
      const sx = (beeScreen.x * 0.5 + 0.5) * window.innerWidth;
      const sy = (-beeScreen.y * 0.5 + 0.5) * window.innerHeight;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.hypot(dx, dy) < 90) makeAngry();
    };
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    let raf = 0;
    const clock = new Clock();

    const sparkleOrbit = { t: 0, r: preset().orbitR, s: 0.6 };
    const tick = () => {
      const delta = clock.getDelta();
      const t = clock.getElapsedTime();
      const ps = preset();

      if (mixer) mixer.update(delta);

      if (bee) {
        const swayX = Math.sin(t * 0.8) * ps.swayX;
        const swayY = Math.sin(t * 0.6) * ps.swayY;
        const swayZ = Math.cos(t * 0.7) * ps.swayZ;
        bee.position.set(targetPos.x + swayX, targetPos.y + swayY, targetPos.z + swayZ);
        const rotZ = Math.cos(t * 0.9) * 0.03;
        const rotX = targetRot.x + Math.sin(t * 0.5) * 0.02;
        bee.rotation.set(rotX, targetRot.y, rotZ);
      }

      if (sparkleGroup && sparkleA && sparkleB) {
        sparkleOrbit.t += delta * (0.4 + angry * 1.2);
        const ox = Math.cos(sparkleOrbit.t) * sparkleOrbit.r;
        const oz = Math.sin(sparkleOrbit.t) * sparkleOrbit.r;
        sparkleGroup.position.set(ox, Math.sin(sparkleOrbit.t * 0.8) * sparkleOrbit.r * 0.35, oz);
        sparkleGroup.rotation.y += delta * (0.6 + angry * 1.5);
        sparkleA.mat.opacity = 0.55 + Math.sin(t * 2.0) * 0.35;
        sparkleB.mat.opacity = 0.45 + Math.cos(t * 1.6) * 0.45;
        const dpr = Math.min(window.devicePixelRatio, 2);
        const sizeMul = window.innerWidth >= 1280 ? 1.3 : (window.innerWidth >= 1024 ? 1.15 : 1);

        sparkleA.mat.size = 0.10 * dpr * sizeMul * (0.95 + Math.sin(t * 1.3) * 0.07);
        sparkleB.mat.size = 0.13 * dpr * sizeMul * (0.95 + Math.cos(t * 1.1) * 0.07);

      }

      if (spaceGroup) {
        spaceGroup.rotation.y = Math.sin(t * 0.03) * 0.02;
      }
      if (starsFar && starsNear) {
        starsFar.points.rotation.y += 0.0004;
        starsNear.points.rotation.y -= 0.0006;
        starsFar.mat.opacity = 0.70 + Math.sin(t * 0.8) * 0.15;
        starsNear.mat.opacity = 0.85 + Math.cos(t * 1.1) * 0.1;
      }
      if (nebula) {
        nebula.group.rotation.z = Math.sin(t * 0.05) * 0.05;
        nebula.sprites.forEach(({ sprite }, i) => {
          (sprite.material as SpriteMaterial).opacity = 0.45 + Math.sin(t * 0.6 + i) * 0.2;
        });
      }
      if (hex) {
        hex.mat.map!.offset.y += 0.002;
        hex.mesh.rotation.z = Math.sin(t * 0.05) * 0.08;
        hex.tex.offset.y = (hex.tex.offset.y + 0.0012) % 1;
      }
      if (rings) {
        rings.group.rotation.y += 0.0015;
        rings.group.rotation.x = Math.sin(t * 0.3) * 0.08 + 0.2;
       rings.mats.forEach((m, i) => {
        m.opacity = 0.18 + 0.1 * (0.5 + Math.sin(t * (0.6 + i * 0.2)));
      });

      }

      if (tornadoIntensity > 0) {
        tornadoPhase += 3.8 * (0.6 + tornadoIntensity * 1.2) * delta;
        const pos = tornado.positions;
        const ang = tornado.baseAngle;
        const rj = tornado.rJit;
        const hj = tornado.hJit;
        const R = tornado.radius * (0.7 + 0.6 * tornadoIntensity);
        const H = tornado.height * (0.7 + 0.6 * tornadoIntensity);
        for (let i = 0; i < ang.length; i++) {
          const y01 = Math.min(1, Math.max(0, hj[i] * (0.5 + tornadoIntensity * 0.9)));
          const y = y01 * H;
          const tight = 1 - y01 * 0.85;
          const rr = (R * tight) * (0.7 + 0.6 * rj[i]);
          const a = ang[i] + tornadoPhase * (1.2 + rj[i] * 0.6);
          const x = Math.cos(a) * rr;
          const z = Math.sin(a) * rr;
          pos[i * 3 + 0] = x;
          pos[i * 3 + 1] = y * 0.85;
          pos[i * 3 + 2] = z;
        }
        (tornado.geo.getAttribute("position") as Float32BufferAttribute).needsUpdate = true;
        tornado.mat.opacity = 0.85 * Math.min(1, 0.5 + tornadoIntensity);
      }

      if (bursts.length) {
        for (let i = bursts.length - 1; i >= 0; i--) {
          const b = bursts[i];
          b.age += delta;
          const t01 = Math.min(1, b.age / b.life);
          const fade = 1 - t01;
          const pos = b.points.geometry.getAttribute("position") as Float32BufferAttribute;
          for (let j = 0; j < pos.count; j++) {
            const idx = j * 3;
            pos.array[idx + 0] += b.vel[idx + 0] * delta;
            pos.array[idx + 1] += b.vel[idx + 1] * delta - 0.6 * delta * t01;
            pos.array[idx + 2] += b.vel[idx + 2] * delta;
          }
          pos.needsUpdate = true;
          b.mat.opacity = Math.max(0, fade);
          if (b.age >= b.life) {
            if (b.points.parent) b.points.parent.remove(b.points);
            b.geo.dispose(); b.mat.dispose(); b.tex.dispose();
            bursts.splice(i, 1);
          }
        }
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    tick();

    const onScroll = () => bee && modelMove();
    const onResize = () => {
      const ps = preset();
      renderer.setPixelRatio(ps.dpr);
      renderer.setSize(vw(), vh());
      camera.aspect = vw() / vh();
      camera.fov = ps.fov;
      camera.position.z = ps.camZ;
      camera.updateProjectionMatrix();
      if (bee) bee.scale.set(ps.scale, ps.scale, ps.scale);
      modelMove();
      sparkleOrbit.r = ps.orbitR;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      window.removeEventListener("pointerdown", onPointerDown);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (spaceGroup) scene.remove(spaceGroup);
      if (starsFar) { starsFar.geo.dispose(); starsFar.mat.dispose(); starsFar.tex.dispose(); }
      if (starsNear) { starsNear.geo.dispose(); starsNear.mat.dispose(); starsNear.tex.dispose(); }
      if (nebula) {
        nebula.sprites.forEach(({ sprite, tex }) => {
          (sprite.material as SpriteMaterial).map?.dispose();
          (sprite.material as SpriteMaterial).dispose();
          tex.dispose();
        });
      }
      if (hex) { hex.geo.dispose(); hex.mat.dispose(); hex.tex.dispose(); }
      bursts.forEach((b) => { b.geo.dispose(); b.mat.dispose(); b.tex.dispose(); });
      scene.traverse((obj) => {
        const anyObj = obj as any;
        if (anyObj.geometry?.dispose) anyObj.geometry.dispose();
        if (anyObj.material) {
          if (Array.isArray(anyObj.material)) anyObj.material.forEach((m: any) => m?.dispose?.());
          else anyObj.material?.dispose?.();
        }
      });
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 10,
        pointerEvents: "none"
      }}
    />
  );
}
