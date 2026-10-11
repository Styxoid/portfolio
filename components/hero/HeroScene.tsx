"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import {
  CARD_H,
  CARD_W,
  backMaterial,
  cardBody,
  cardFace,
  clamp01,
  dampQuat,
  dampVec,
  easeInOut,
  edgeMaterial,
  feltTexture,
  holoMaterial,
} from "@/lib/three";
import { useFontsReady } from "@/lib/hooks";
import { sfx } from "@/lib/audio";

const N = 52;
const GAP = 0.0062;
const DECK_T = 0.0055;
const ARCH_T = 0.008;
const FOV = 38;
const CAM_Z = 5.2;

export const SHUFFLE_DEAL_AT = 2.75; // seconds into the sequence when the Architect is dealt

type Props = { shuffleId: number; collectId: number; isMobile: boolean; active: boolean };

const _o = new THREE.Object3D();
const _v = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const FLIP = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);

function Rig({ shuffleId, collectId, isMobile }: Omit<Props, "active">) {
  const deck = useRef<THREE.Group>(null);
  const inst = useRef<THREE.InstancedMesh>(null);
  const arch = useRef<THREE.Group>(null);
  const clock = useThree((s) => s.clock);

  const mats = useMemo(() => {
    const back = backMaterial();
    const edge = edgeMaterial();
    return { back, edge, holo: holoMaterial() };
  }, []);
  useEffect(
    () => () => {
      Object.values(mats).forEach((m) => {
        const u = m as THREE.Material & { map?: THREE.Texture; metalnessMap?: THREE.Texture };
        u.map?.dispose();
        u.metalnessMap?.dispose();
        m.dispose();
      });
      (mats.holo.uniforms.uMap.value as THREE.Texture).dispose();
    },
    [mats],
  );

  const jitter = useMemo(() => Float32Array.from({ length: N }, () => Math.random() * 2 - 1), []);
  const state = useRef({
    start: null as number | null,
    slots: Int16Array.from({ length: N }, (_, i) => i),
    committed: true,
    dealt: false,
    visible: false,
    flipped: false,
    dirty: true,
  });

  // Start a new shuffle sequence
  useEffect(() => {
    if (!shuffleId) return;
    const s = state.current;
    s.start = clock.elapsedTime;
    s.committed = false;
    s.flipped = false;
  }, [shuffleId, clock]);

  // Collect the dealt card back to the deck
  useEffect(() => {
    if (!collectId) return;
    state.current.dealt = false;
    sfx.slide(0, 0.8);
  }, [collectId]);

  const deckTop = (outPos: THREE.Vector3, outQuat: THREE.Quaternion) => {
    const d = deck.current!;
    d.updateMatrixWorld();
    outPos.set(0, 0, (N / 2) * GAP + 0.006).applyMatrix4(d.matrixWorld);
    outQuat.copy(d.quaternion).multiply(FLIP);
  };

  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpQuat = useMemo(() => new THREE.Quaternion(), []);

  useFrame((st, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const s = state.current;
    const time = st.clock.elapsedTime;
    const t = s.start == null ? -1 : time - s.start;
    const d = deck.current!;
    const px = st.pointer.x,
      py = st.pointer.y;

    /* ── Deck: floating spring + breathing ── */
    if (s.dealt) _v.set(isMobile ? 0 : -2.4, isMobile ? -1.35 : -0.35, isMobile ? -1.6 : -0.7);
    else _v.set(0, 0.05 + Math.sin(time * 1.1) * 0.07, 0);
    dampVec(d.position, _v, 2.6, dt);
    _e.set(
      -0.95 + py * 0.12 + Math.sin(time * 0.7) * 0.035,
      Math.sin(time * 0.35) * 0.22 + px * 0.25,
      0.05 + Math.sin(time * 0.5) * 0.02,
    );
    dampQuat(d.quaternion, _q.setFromEuler(_e), 3, dt);

    /* ── Instanced cards: riffle → cascade ── */
    const running = t >= 0 && t < 3.0;
    if (running || s.dirty) {
      const im = inst.current!;
      for (let i = 0; i < N; i++) {
        const p = s.slots[i];
        const baseZ = (p - (N - 1) / 2) * GAP;
        let x = jitter[i] * 0.004,
          y = 0,
          z = baseZ,
          rx = 0,
          ry = 0,
          rz = jitter[i] * 0.018;
        if (running) {
          const lower = p < N / 2;
          const half = lower ? -1 : 1;
          const k = lower ? p : p - N / 2;
          const j = 2 * k + (lower ? 0 : 1);
          const finalZ = (j - (N - 1) / 2) * GAP;
          // 1. split into two halves, bowed inward
          const sp = easeInOut(clamp01(t / 0.55));
          x = THREE.MathUtils.lerp(x, half * 0.64, sp);
          z = THREE.MathUtils.lerp(baseZ, (k - N / 4) * GAP * 1.15, sp);
          ry = -half * 0.42 * sp;
          rz = THREE.MathUtils.lerp(rz, half * 0.08, sp);
          // 2. riffle: interleave one by one
          const r = easeInOut(clamp01((t - (0.6 + j * 0.017)) / 0.16));
          x = THREE.MathUtils.lerp(x, jitter[i] * 0.004, r);
          z = THREE.MathUtils.lerp(z, finalZ, r) + Math.sin(r * Math.PI) * 0.07;
          ry = THREE.MathUtils.lerp(ry, 0, r);
          rz = THREE.MathUtils.lerp(rz, jitter[i] * 0.018, r);
          // 3. cascade wave
          const c = clamp01((t - 1.75 - j * 0.008) / 0.45);
          const w = Math.sin(c * Math.PI);
          z += w * 0.5;
          y += w * 0.16;
          rx = -w * 0.55;
        }
        _o.position.set(x, y, z);
        _o.rotation.set(rx, ry, rz);
        _o.updateMatrix();
        im.setMatrixAt(i, _o.matrix);
      }
      im.instanceMatrix.needsUpdate = true;
      s.dirty = running;
    }
    if (t >= 3.0 && !s.committed) {
      for (let i = 0; i < N; i++) {
        const p = s.slots[i];
        const lower = p < N / 2;
        s.slots[i] = 2 * (lower ? p : p - N / 2) + (lower ? 0 : 1);
      }
      s.committed = true;
      s.dirty = true;
    }

    /* ── Deal the Architect card ── */
    const a = arch.current!;
    if (t >= SHUFFLE_DEAL_AT && !s.dealt && s.start != null && !s.visible) {
      s.dealt = true;
      s.visible = true;
      deckTop(a.position, a.quaternion);
    }
    if (s.visible) {
      if (s.dealt) {
        const tanH = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
        const aspect = st.size.width / st.size.height;
        const dist = Math.max(CARD_H / (0.74 * 2 * tanH), CARD_W / (0.82 * 2 * tanH * aspect));
        tmpPos.set(isMobile ? 0 : 0.35, 0.18 + Math.sin(time * 1.3) * 0.025, CAM_Z - dist);
        _e.set(-py * 0.22 + Math.sin(time * 0.9) * 0.02, px * 0.38 + Math.sin(time * 0.6) * 0.04, 0);
        tmpQuat.setFromEuler(_e);
        if (s.flipped) tmpQuat.multiply(FLIP);
        dampVec(a.position, tmpPos, 3.6, dt);
        dampQuat(a.quaternion, tmpQuat, 3.2, dt);
      } else {
        deckTop(tmpPos, tmpQuat);
        dampVec(a.position, tmpPos, 5, dt);
        dampQuat(a.quaternion, tmpQuat, 5, dt);
        if (a.position.distanceTo(tmpPos) < 0.02) {
          s.visible = false;
          s.start = null;
        }
      }
      mats.holo.uniforms.uTime.value = time;
    }
    a.visible = s.visible;
  });

  const onCardClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!state.current.dealt) return;
    state.current.flipped = !state.current.flipped;
    sfx.flip();
  };

  const body = cardBody(DECK_T);
  return (
    <>
      <group ref={deck}>
        <instancedMesh ref={inst} args={[body, [mats.back, mats.edge], N]} frustumCulled={false} />
      </group>

      <group ref={arch} visible={false} onClick={onCardClick}>
        <mesh geometry={cardBody(ARCH_T)} material={mats.edge} />
        <mesh geometry={cardFace()} material={mats.holo} position-z={ARCH_T / 2 + 0.0006} />
        <mesh geometry={cardFace()} material={mats.back} position-z={-ARCH_T / 2 - 0.0006} rotation-y={Math.PI} />
      </group>
    </>
  );
}

function Table() {
  const tex = useMemo(() => feltTexture(), []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position-y={-1.8}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial map={tex} color="#2d5a47" roughness={1} metalness={0} />
      </mesh>
      <ContactShadows position={[0, -1.79, 0]} scale={10} far={3.2} blur={2.6} opacity={0.75} resolution={512} />
    </>
  );
}

export default function HeroScene({ active, ...props }: Props) {
  const fontsReady = useFontsReady();
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.3, CAM_Z], fov: FOV, near: 0.1, far: 50 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <color attach="background" args={["#08090c"]} />
      <fog attach="fog" args={["#08090c", 6, 17]} />
      <ambientLight intensity={0.18} />
      <spotLight position={[0, 7, 2.5]} angle={0.42} penumbra={1} intensity={9} decay={0} color="#fff6e0" />
      <pointLight position={[-3.5, 1.5, -2]} intensity={2.2} decay={0} color="#d4af37" />
      <pointLight position={[3.5, -0.5, 2]} intensity={0.8} decay={0} color="#5eead4" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -1]} scale={[10, 3, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.5} color="#d4af37" position={[-5, 1, 0]} scale={[3, 6, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.2} position={[5, 1, 2]} scale={[3, 6, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="circle" intensity={2} position={[0, 1, 5]} scale={2} />
      </Environment>
      {fontsReady && <Rig {...props} />}
      <Table />
    </Canvas>
  );
}
