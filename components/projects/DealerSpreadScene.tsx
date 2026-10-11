"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Project } from "@/lib/data";
import {
  CARD_H,
  CARD_W,
  backMaterial,
  cardBody,
  cardFace,
  dampQuat,
  dampVec,
  edgeMaterial,
  feltTexture,
  projectFrontMaterial,
} from "@/lib/three";
import { useFontsReady } from "@/lib/hooks";
import { sfx } from "@/lib/audio";

const FOV = 42;
const CARD_THICKNESS = 0.008;

type Props = {
  projects: Project[];
  activeId: string | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (p: Project) => void;
  active: boolean;
};

function FanCard({
  project,
  index,
  total,
  isHovered,
  isSelected,
  onHover,
  onSelect,
}: {
  project: Project;
  index: number;
  total: number;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (id: string | null) => void;
  onSelect: (p: Project) => void;
}) {
  const grp = useRef<THREE.Group>(null);
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetQuat = useMemo(() => new THREE.Quaternion(), []);
  const euler = useMemo(() => new THREE.Euler(), []);

  // Prepare front, back, and edge materials
  const mats = useMemo(() => {
    const front = projectFrontMaterial(project);
    const back = backMaterial({ suit: project.suit }, 0.7);
    const edge = edgeMaterial();
    return { front, back, edge };
  }, [project]);

  useEffect(
    () => () => {
      mats.front.map?.dispose();
      mats.front.dispose();
      mats.back.map?.dispose();
      mats.back.metalnessMap?.dispose();
      mats.back.dispose();
      mats.edge.dispose();
    },
    [mats],
  );

  // Adaptive card scale and centering when fewer cards are present (e.g., The Vector has 1 card, The Blade has 2)
  const baseScale = total === 1 ? 1.48 : total === 2 ? 1.28 : total <= 3 ? 1.15 : 1.0;

  // Compute arc fan position & angle
  const centerIdx = (total - 1) / 2;
  const relIdx = index - centerIdx;

  let baseArcX = 0;
  let baseArcY = 0;
  let baseArcZ = 0;
  let baseRotZ = 0;
  let baseRotX = -0.02; // Upright tilt directly facing camera for maximum legibility

  if (total === 1) {
    // Single card (e.g. The Vector) — perfectly centered, prominent, zero void
    baseArcX = 0;
    baseArcY = 0.05;
    baseArcZ = 0.15;
    baseRotZ = 0;
    baseRotX = 0;
  } else if (total === 2) {
    // Two cards (e.g. The Blade) — centered side-by-side with subtle angle
    baseArcX = relIdx * 1.55;
    baseArcY = 0.02;
    baseArcZ = 0.08;
    baseRotZ = -relIdx * 0.06;
    baseRotX = 0;
  } else if (total === 3) {
    // Three cards (e.g. The Core) — balanced symmetrical trio
    baseArcX = relIdx * 1.35;
    baseArcY = -0.04 - Math.abs(relIdx) * 0.08;
    baseArcZ = -Math.abs(relIdx) * 0.06;
    baseRotZ = -relIdx * 0.12;
  } else {
    // 4+ cards (All Domains) — full elegant dealer's spread arc
    const spreadFactor = 0.44;
    const angle = (relIdx / Math.max(1, total - 1)) * spreadFactor;
    const radius = 5.8;
    baseArcX = Math.sin(angle) * radius;
    baseArcY = -0.22 - (1 - Math.cos(angle)) * (radius * 0.38);
    baseArcZ = -Math.abs(relIdx) * 0.05 + index * 0.008;
    baseRotZ = -angle * 0.72;
  }

  useFrame((_, dt) => {
    if (!grp.current) return;
    const clampedDt = Math.min(dt, 0.05);

    if (isSelected) {
      // Elevated towards camera & flipped
      targetPos.set(0, 0.2, 2.7);
      euler.set(0, Math.PI, 0); // flipped face-up towards camera
      targetQuat.setFromEuler(euler);
    } else if (isHovered) {
      // Hovered: pop forward and straighten upright
      targetPos.set(baseArcX * 1.02, baseArcY + 0.35, baseArcZ + 0.6);
      euler.set(-0.06, -baseRotZ * 0.25, 0);
      targetQuat.setFromEuler(euler);
    } else {
      // Idle fan position: upright and clear
      targetPos.set(baseArcX, baseArcY, baseArcZ);
      euler.set(baseRotX, 0, baseRotZ);
      targetQuat.setFromEuler(euler);
    }

    dampVec(grp.current.position, targetPos, 7, clampedDt);
    dampQuat(grp.current.quaternion, targetQuat, 7.5, clampedDt);

    // Dynamic scale damping
    const curScale = grp.current.scale.x;
    const targetScale = isHovered ? baseScale * 1.04 : baseScale;
    const nextScale = THREE.MathUtils.lerp(curScale, targetScale, 0.12);
    grp.current.scale.set(nextScale, nextScale, nextScale);
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    sfx.flip();
    onSelect(project);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    sfx.tick();
    onHover(project.id);
  };

  const handlePointerOut = () => {
    onHover(null);
  };

  const bodyGeo = useMemo(() => cardBody(CARD_THICKNESS), []);
  const faceGeo = useMemo(() => cardFace(), []);

  return (
    <group
      ref={grp}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      cursor-pointer
    >
      <mesh geometry={bodyGeo} material={mats.edge} />
      {/* Front Face: facing +Z */}
      <mesh
        geometry={faceGeo}
        material={mats.front}
        position-z={CARD_THICKNESS / 2 + 0.0005}
      />
      {/* Back Face: facing -Z */}
      <mesh
        geometry={faceGeo}
        material={mats.back}
        position-z={-CARD_THICKNESS / 2 - 0.0005}
        rotation-y={Math.PI}
      />
    </group>
  );
}

function SpreadRig({
  projects,
  activeId,
  hoveredId,
  onHover,
  onSelect,
}: Omit<Props, "active">) {
  return (
    <group position={[0, -0.15, 0]}>
      {projects.map((p, idx) => (
        <FanCard
          key={p.id}
          project={p}
          index={idx}
          total={projects.length}
          isHovered={hoveredId === p.id}
          isSelected={activeId === p.id}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

function TableSurface() {
  const tex = useMemo(() => feltTexture(), []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position-y={-2.4}>
        <planeGeometry args={[35, 35]} />
        <meshStandardMaterial map={tex} color="#1c382b" roughness={0.95} metalness={0} />
      </mesh>
      <ContactShadows position={[0, -2.39, 0]} scale={14} far={3.5} blur={2.4} opacity={0.65} resolution={512} />
    </>
  );
}

export default function DealerSpreadScene({
  projects,
  activeId,
  hoveredId,
  onHover,
  onSelect,
  active,
}: Props) {
  const fontsReady = useFontsReady();

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.0, 3.85], fov: 36, near: 0.1, far: 30 }}
      onPointerMissed={() => onHover(null)}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
    >
      <color attach="background" args={["#08090c"]} />
      <ambientLight intensity={0.25} />
      <spotLight
        position={[0, 6, 4]}
        angle={0.5}
        penumbra={1}
        intensity={7.5}
        decay={0}
        color="#fff5dd"
      />
      <pointLight position={[-4, 1.5, -1]} intensity={2.0} decay={0} color="#d4af37" />
      <pointLight position={[4, -0.5, 2]} intensity={1.5} decay={0} color="#34d399" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, -1]} scale={[12, 3, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.8} color="#d4af37" position={[-4, 1, 0]} scale={[3, 5, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.4} color="#34d399" position={[4, 1, 1]} scale={[3, 5, 1]} rotation-y={-Math.PI / 2} />
      </Environment>

      {fontsReady && (
        <SpreadRig
          projects={projects}
          activeId={activeId}
          hoveredId={hoveredId}
          onHover={onHover}
          onSelect={onSelect}
        />
      )}
      <TableSurface />
    </Canvas>
  );
}
