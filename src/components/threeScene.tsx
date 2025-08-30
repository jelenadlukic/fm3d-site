// components/BeeScene.tsx
"use client";

import { useEffect, useRef } from "react";
import {
  WebGLRenderer, Scene, PerspectiveCamera, AmbientLight, DirectionalLight,
  AnimationMixer, Object3D, Clock, Vector3, Euler,
  Points, BufferGeometry, Float32BufferAttribute, PointsMaterial,
  AdditiveBlending, Group, CanvasTexture, Sprite, SpriteMaterial,
  Mesh, MeshBasicMaterial, PlaneGeometry, TorusGeometry,
  Raycaster, Vector2, PointLight
} from "three";
import { GLTFLoader, MeshoptDecoder } from "three-stdlib";
import { gsap } from "gsap";

/* ---------------- STARFIELD ---------------- */
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

/* ---------------- NEBULA ---------------- */
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

function createNebulaCloud(
  count = 5,
  area = { xz: 35, y: 12, zBase: -60 },
  colors = ["rgba(167,139,250,0.45)", "rgba(103,232,249,0.45)", "rgba(163,230,53,0.40)"]
) {
  const group = new Group();
  const sprites: { sprite: Sprite; tex: CanvasTexture }[] = [];
  for (let i = 0; i < count; i++) {
    const tex = makeBlobTexture(colors[i % colors.length]);
    const mat = new SpriteMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      opacity: 0.65
    });
    const s = new Sprite(mat);
    const scale = 10 + Math.random() * 14;
    s.scale.set(scale, scale, 1);
    s.position.set(
      (Math.random() - 0.5) * area.xz,
      (Math.random() - 0.5) * area.y,
      area.zBase + (Math.random() - 0.5) * 10
    );
    group.add(s);
    sprites.push({ sprite: s, tex });
  }
  return { group, sprites };
}

/* ---------------- HEX GRID ---------------- */
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
  tex.wrapS = tex.wrapT = 1000; // RepeatWrapping numeric (da ne uvozimo konstantu)
  tex.repeat.set(7.7, 7.3);
  tex.offset.set(0.137, 0.091);
  return tex;
}

function createHexGridPlane(renderer: WebGLRenderer) {
  const geo = new PlaneGeometry(500, 500, 1, 1);
  const tex = makeHexTexture();
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const mat = new MeshBasicMaterial({
    map: tex,
    color: 0xffffff,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
    blending: AdditiveBlending,
    alphaTest: 0.02
  });

  const mesh = new Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2 + 0.12;
  mesh.position.set(0, -6.7, -80);

  return { mesh, geo, mat, tex };
}

/* ---------------- RINGS ---------------- */
function createRings() {
  const group = new Group();
  const mats: MeshBasicMaterial[] = [];
  for (let i = 0; i < 3; i++) {
    const geo = new TorusGeometry(14 + i * 4, 0.02 + i * 0.01, 8, 128);
    const mat = new MeshBasicMaterial({
      color: i === 1 ? 0x66fff0 : 0x9bf08a,
      transparent: true,
      opacity: 0.25 + i * 0.08,
      blending: AdditiveBlending,
      depthWrite: false
    });
    mats.push(mat);
    const torus = new Mesh(geo, mat);
    torus.position.set(0, 0, -55);
    torus.rotation.x = 0.2 + i * 0.15;
    torus.rotation.y = 0.1 * i;
    group.add(torus);
  }
  return { group, mats };
}

/* ---------------- SPARKLES ---------------- */
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
  const mat = new PointsMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    sizeAttenuation: true,
    size: 2 * size * Math.min(window.devicePixelRatio, 2),
    opacity: 0.85
  });

  const points = new Points(geo, mat);
  return { points, geo, mat, tex };
}

/* ======================================================================= */

export default function BeeScene() {
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const DPR = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2) : 1;

  const targetPos = new Vector3(0, 0, -4.6);
  const targetRot = new Euler(0.1, 0, 0);

  let effectsRoot: Object3D | null = null;
  let sparkleGroup: Group | null = null;
  let sparkleA: { points: Points; geo: BufferGeometry; mat: PointsMaterial; tex: CanvasTexture } | null = null;
  let sparkleB: { points: Points; geo: BufferGeometry; mat: PointsMaterial; tex: CanvasTexture } | null = null;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);

  useEffect(() => {
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

    const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    renderer.setPixelRatio(DPR);

    const scene = new Scene();
    const camera = new PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    const raycaster = new Raycaster();
    const mouse = new Vector2();

    // "angry" faktor i anti-spam
    let angry = 0;
    let lastClickAt = 0;
    let angryTween: gsap.core.Tween | null = null;

    // Svetla — pčela ostaje mirna; ne diramo topLight brightness
    scene.add(new AmbientLight(0xffffff, 1.3));
    const topLight = new DirectionalLight(0xffffff, 1);
    topLight.position.set(500, 500, 500);
    scene.add(topLight);

    // PointLight za iskrice na sloju 1 (pčela je na 0)
    const sparkleLight = new PointLight(0xff8899, 0, 6);
    sparkleLight.layers.set(1);

    // BACKDROP
    spaceGroup = new Group();
    scene.add(spaceGroup);

    // zvezde
    starsFar = createStars(reduceMotion ? 600 : (isMobile ? 900 : 1600), 160, 0.013, 0.72);
    starsNear = createStars(reduceMotion ? 300 : (isMobile ? 500 : 900),  90,  0.022, 0.88);
    starsFar.points.position.z = -40;
    starsNear.points.position.z = -30;
    spaceGroup.add(starsFar.points);
    spaceGroup.add(starsNear.points);

    // nebula + hex + rings
    nebula = createNebulaCloud(6, { xz: 45, y: 14, zBase: -70 });
    spaceGroup.add(nebula.group);

    hex = createHexGridPlane(renderer);
    spaceGroup.add(hex.mesh);

    rings = createRings();
    spaceGroup.add(rings.group);

    // Model
    let bee: Object3D | null = null;
    let mixer: AnimationMixer | null = null;

    const loader = new GLTFLoader();
    if (MeshoptDecoder) loader.setMeshoptDecoder(MeshoptDecoder);

    loader.load(
      "/models/demon_bee_full_texture.glb",
      (gltf) => {
        bee = gltf.scene;
        bee.scale.set(0.85, 0.85, 0.85);
        scene.add(bee);

        // malo smanji sjaj materijala pčele
        bee.traverse((obj: any) => {
          if (obj.isMesh && obj.material) {
            const m = obj.material;
            if (m.metalness !== undefined) m.metalness = Math.min(0.2, m.metalness ?? 0.2);
            if (m.roughness !== undefined) m.roughness = Math.max(0.6, m.roughness ?? 0.6);
          }
        });

        // koren za efekte
        effectsRoot = new Object3D();
        effectsRoot.position.set(0, 0, 0);
        bee.add(effectsRoot);

        // iskrice
        sparkleA = createSparkles(260, 0.95, 0.85, 0.06);
        sparkleB = createSparkles(80,  0.45, 0.25, 0.09);

        sparkleGroup = new Group();
        sparkleGroup.add(sparkleA.points);
        sparkleGroup.add(sparkleB.points);
        effectsRoot.add(sparkleGroup);

        // iskrice na layer 1 + kamera vidi i 1
        sparkleGroup.layers.set(1);
        sparkleA.points.layers.set(1);
        sparkleB.points.layers.set(1);
        camera.layers.enable(1);

        // light za iskrice prati pčelu
        effectsRoot.add(sparkleLight);

        // animacije iz glTF
        if (gltf.animations?.[0]) {
          mixer = new AnimationMixer(bee);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
          mixer.timeScale = 0.9;
        }

        modelMove(); // inicijalno poravnanje
      },
      undefined,
      (err) => console.error("GLTF load error:", err)
    );

    // Mape sekcija
    const positions = [
      { id: "banner",     position: { x:  1.6, y: -0.8, z: -4.5 }, rotation: { x: 0.10, y: -1.05, z: 0.00 } },
      { id: "o-projektu", position: { x: -1.95, y: -0.4, z: -4.9 }, rotation: { x: 0.10, y:  1.05, z: 0.00 } },
      { id: "konkurs",    position: { x:  1.95, y: -0.4, z: -5.0 }, rotation: { x: 0.12, y: -1.05, z: 0.00 } },
      { id: "ucesnici",   position: { x: -1.95, y: -0.4, z: -4.8 }, rotation: { x: 0.10, y:  1.10, z: 0.00 } },
      { id: "portfolio",  position: { x:  1.95, y: -0.4, z: -5.2 }, rotation: { x: 0.12, y: -1.10, z: 0.00 } },
      { id: "mobilnosti", position: { x: -2.10, y: -0.4, z: -4.9 }, rotation: { x: 0.10, y:  1.15, z: 0.00 } },
      { id: "resursi",    position: { x:  2.10, y: -0.4, z: -4.9 }, rotation: { x: 0.10, y: -1.15, z: 0.00 } },
      { id: "vesti",      position: { x: -1.90, y: -0.4, z: -4.7 }, rotation: { x: 0.10, y:  0.95, z: 0.00 } },
      { id: "contact",    position: { x:  1.8,  y: -0.4, z: -4.3 }, rotation: { x: 0.08, y:  0.00, z: 0.00 } },
    ] as const;

    const modelMove = () => {
      if (!bee) return;
      const sections = document.querySelectorAll<HTMLElement>(".section");
      let currentId: string | undefined;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) currentId = section.id;
      });
      const idx = positions.findIndex((p) => p.id === currentId);
      if (idx >= 0) {
        const { position, rotation } = positions[idx];
        gsap.to(targetPos, { x: position.x, y: position.y, z: position.z, duration: 2.2, ease: "power2.out" });
        gsap.to(targetRot, { x: rotation.x, y: rotation.y, z: rotation.z, duration: 2.2, ease: "power2.out" });
      }
    };

    // “Angry” – bez bleštanja pčele; boost samo na iskrice + anti-spam
    function makeAngry() {
      if (!bee) return;
      const now = performance.now();
      if (now - lastClickAt < 220) return; // debouncing
      lastClickAt = now;

      // kill prethodni fade ako traje, pa start iznova (bez gomilanja)
      if (angryTween) angryTween.kill();

      // shake + pumpanje skale pčele (ali ne menjamo svetlo pčele)
      gsap.fromTo(bee.scale,
        { x: 0.96, y: 0.96, z: 0.96 },
        { x: 1.05, y: 1.05, z: 1.05, duration: 0.12, yoyo: true, repeat: 2, ease: "power2.inOut" }
      );
      gsap.to(bee.rotation, { z: "+=0.28", duration: 0.06, yoyo: true, repeat: 6, ease: "sine.inOut" });

      // kratki “lunge” prema kameri
      gsap.fromTo(targetPos, { z: targetPos.z }, { z: targetPos.z + 0.22, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.inOut" });

      // boost samo na iskrice (point light na layer 1)
      gsap.fromTo(sparkleLight, { intensity: 0 }, { intensity: 4.2, duration: 0.12, yoyo: true, repeat: 2, ease: "power2.inOut" });

      // angry faktor 0→1→0 (utice na brzinu/opacity/veličinu iskri)
      const holder = { a: angry };
      angryTween = gsap.to(holder, {
        a: 1,
        duration: 0.10,
        ease: "power2.out",
        onUpdate() { angry = holder.a; },
        onComplete() {
          angryTween = gsap.to(holder, {
            a: 0,
            duration: 0.55,
            ease: "power2.in",
            onUpdate() { angry = holder.a; }
          });
        }
      });
    }

    // Klik detekcija raycasterom (klik baš na pčelu)
    const onPointerDown = (e: PointerEvent) => {
      if (!bee) return;
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.intersectObject(bee, true);
      if (hit.length > 0) makeAngry();
    };
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    // Petlja
    let raf = 0;
    const clock = new Clock();
    const tick = () => {
      const delta = clock.getDelta();
      const t = clock.getElapsedTime();
      if (mixer) mixer.update(delta);

      if (bee) {
        const swayX = Math.sin(t * 0.8) * 0.08;
        const swayY = Math.sin(t * 0.6) * 0.04;
        const swayZ = Math.cos(t * 0.7) * 0.05;
        bee.position.set(targetPos.x + swayX, targetPos.y + swayY, targetPos.z + swayZ);
        const rotZ = Math.cos(t * 0.9) * 0.03;
        const rotX = targetRot.x + Math.sin(t * 0.5) * 0.02;
        bee.rotation.set(rotX, targetRot.y, rotZ);
      }

      if (sparkleGroup && sparkleA && sparkleB) {
        sparkleGroup.rotation.y = t * (0.25 + angry * 0.6);
        sparkleGroup.rotation.x = Math.sin(t * 0.6) * (0.10 + angry * 0.15);

        const baseDPR = Math.min(window.devicePixelRatio, 2);
        sparkleA.mat.opacity = (0.55 + Math.sin(t * 2.0) * 0.35) * (1 + angry * 0.7);
        sparkleB.mat.opacity = (0.45 + Math.cos(t * 1.6) * 0.45) * (1 + angry * 0.7);
        sparkleA.mat.size = (0.06 * baseDPR) * (1 + angry * 0.15) * (0.95 + Math.sin(t * 1.3) * 0.07);
        sparkleB.mat.size = (0.09 * baseDPR) * (1 + angry * 0.15) * (0.95 + Math.cos(t * 1.1) * 0.07);
      }

      if (spaceGroup) {
        const tt = t;
        spaceGroup.rotation.y = Math.sin(tt * 0.03) * 0.02;

        if (starsFar && starsNear) {
          starsFar.points.rotation.y += 0.0004;
          starsNear.points.rotation.y -= 0.0006;
          starsFar.mat.opacity = 0.70 + Math.sin(tt * 0.8) * 0.15;
          starsNear.mat.opacity = 0.85 + Math.cos(tt * 1.1) * 0.1;
        }

        if (nebula) {
          nebula.group.rotation.z = Math.sin(tt * 0.05) * 0.05;
          nebula.sprites.forEach(({ sprite }, i) => {
            (sprite.material as SpriteMaterial).opacity = 0.45 + Math.sin(tt * 0.6 + i) * 0.2;
          });
        }

        if (hex) {
          hex.mat.map!.offset.y += 0.002;
          hex.mesh.rotation.z = Math.sin(tt * 0.05) * 0.08;
          hex.tex.offset.y = (hex.tex.offset.y + 0.0012) % 1;
        }

        if (rings) {
          rings.group.rotation.y += 0.0015;
          rings.group.rotation.x = Math.sin(tt * 0.3) * 0.08 + 0.2;
          rings.mats.forEach((m, i) => (m.opacity = 0.18 + 0.1 * (0.5 + Math.sin(tt * (0.6 + i * 0.2)))));
        }
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    tick();

    // Scroll/resize
    const onScroll = () => bee && modelMove();
    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Cleanup
    return () => {
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      window.removeEventListener("pointerdown", onPointerDown);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      renderer.dispose();

      if (sparkleA) { sparkleA.geo.dispose(); sparkleA.mat.dispose(); sparkleA.tex.dispose(); }
      if (sparkleB) { sparkleB.geo.dispose(); sparkleB.mat.dispose(); sparkleB.tex.dispose(); }

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

      // safety cleanup
      scene.traverse((obj) => {
        const anyObj = obj as any;
        if (anyObj.geometry?.dispose) anyObj.geometry.dispose();
        if (anyObj.material) {
          if (Array.isArray(anyObj.material)) anyObj.material.forEach((m: any) => m?.dispose?.());
          else anyObj.material?.dispose?.();
        }
      });
    };
  }, [DPR, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 10,           // stavi -1 ako želiš iza teksta
        pointerEvents: "none" // klik hvata window (raycaster radi i dalje)
      }}
    />
  );
}
