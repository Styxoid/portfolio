"use client";

import * as THREE from "three";
import { Project } from "./data";
import { drawArchitect, drawBack, drawFelt, drawProjectFront, makeCanvas } from "./textures";

export const CARD_W = 1;
export const CARD_H = 1.4;
const RADIUS = 0.065;

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2,
    y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** Remap planar UVs to 0..1 over the card rectangle. */
function planarUV(g: THREE.BufferGeometry) {
  const pos = g.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / CARD_W + 0.5;
    uv[i * 2 + 1] = pos.getY(i) / CARD_H + 0.5;
  }
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return g;
}

const cache = new Map<string, THREE.BufferGeometry>();

/** Rounded extruded card body. Group 0 = faces (caps), group 1 = gilded edge. */
export function cardBody(thickness: number) {
  const key = `body-${thickness}`;
  if (!cache.has(key)) {
    const g = new THREE.ExtrudeGeometry(roundedRect(CARD_W, CARD_H, RADIUS), {
      depth: thickness,
      bevelEnabled: false,
      curveSegments: 6,
    });
    g.translate(0, 0, -thickness / 2);
    cache.set(key, planarUV(g));
  }
  return cache.get(key)!;
}

/** Flat rounded face with proper 0..1 UVs. */
export function cardFace() {
  if (!cache.has("face")) cache.set("face", planarUV(new THREE.ShapeGeometry(roundedRect(CARD_W, CARD_H, RADIUS), 6)));
  return cache.get("face")!;
}

export function canvasTexture(draw: (ctx: CanvasRenderingContext2D) => void, srgb = true, scale = 1) {
  const c = makeCanvas(Math.round(1024 * scale), Math.round(1434 * scale));
  const ctx = c.getContext("2d")!;
  ctx.scale(scale, scale);
  draw(ctx);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
}

/* ─────────── Materials ─────────── */

export function edgeMaterial() {
  return new THREE.MeshStandardMaterial({ color: "#e9d38f", metalness: 0.95, roughness: 0.28 });
}

/** PBR back with gold-foil metalness/roughness map. */
export function backMaterial(opts: Parameters<typeof drawBack>[2] = {}, scale = 1) {
  const map = canvasTexture((c) => drawBack(c, "color", opts), true, scale);
  const orm = canvasTexture((c) => drawBack(c, "orm", opts), false, 0.5);
  return new THREE.MeshPhysicalMaterial({
    map,
    roughnessMap: orm,
    metalnessMap: orm,
    roughness: 1,
    metalness: 1,
    clearcoat: 0.35,
    clearcoatRoughness: 0.4,
    sheen: 0.6,
    sheenColor: new THREE.Color("#1e5a43"),
    sheenRoughness: 0.6,
  });
}

export function projectFrontMaterial(p: Project) {
  return new THREE.MeshPhysicalMaterial({
    map: canvasTexture((c) => drawProjectFront(c, p)),
    roughness: 0.42,
    metalness: 0.05,
    clearcoat: 0.6,
    clearcoatRoughness: 0.25,
    iridescence: 0.35,
    iridescenceIOR: 1.4,
  });
}

export function feltTexture() {
  const c = makeCanvas(512, 512);
  drawFelt(c.getContext("2d")!, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(10, 10);
  return t;
}

/* ─────────── Holographic shader for the Architect card ─────────── */

export function holoMaterial() {
  const map = canvasTexture(drawArchitect);
  return new THREE.ShaderMaterial({
    uniforms: { uMap: { value: map }, uTime: { value: 0 }, uIntensity: { value: 1 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vUv = uv;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vV = normalize(-mv.xyz);
        vN = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform float uTime;
      uniform float uIntensity;
      varying vec2 vUv;
      varying vec3 vN;
      varying vec3 vV;
      vec3 spectrum(float t) {
        return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
      }
      void main() {
        vec4 base = texture2D(uMap, vUv);
        float facing = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
        float fres = pow(1.0 - facing, 1.5);
        // border mask
        vec2 d = min(vUv, 1.0 - vUv);
        float edge = min(d.x * 1.4, d.y);
        float border = 1.0 - smoothstep(0.035, 0.07, edge);
        float t = vUv.x * 1.3 + vUv.y * 0.9 + fres * 2.0 + uTime * 0.08 + vN.x * 0.6 - vN.y * 0.4;
        vec3 holo = spectrum(t);
        // gold-luma areas pick up foil iridescence
        float luma = dot(base.rgb, vec3(0.299, 0.587, 0.114));
        float goldish = smoothstep(0.25, 0.6, base.r - base.b * 0.6);
        vec3 col = base.rgb;
        col = mix(col, col * 0.6 + holo * 0.75, border * 0.85 * uIntensity);
        col += holo * goldish * (0.18 + fres * 0.4) * uIntensity;
        // sweeping sheen band
        float band = smoothstep(0.08, 0.0, abs(fract(vUv.x * 0.7 - vUv.y * 0.5 - uTime * 0.12 + vN.x * 0.5) - 0.5));
        col += vec3(1.0, 0.95, 0.85) * band * 0.08 * uIntensity;
        col += holo * fres * 0.12 * uIntensity;
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
}

/* ─────────── Damping helpers (frame-rate independent springs) ─────────── */

export const dampK = (lambda: number, dt: number) => 1 - Math.exp(-lambda * dt);

export function dampVec(v: THREE.Vector3, target: THREE.Vector3, lambda: number, dt: number) {
  v.lerp(target, dampK(lambda, dt));
}

export function dampQuat(q: THREE.Quaternion, target: THREE.Quaternion, lambda: number, dt: number) {
  q.slerp(target, dampK(lambda, dt));
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const easeOutBack = (x: number) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);
