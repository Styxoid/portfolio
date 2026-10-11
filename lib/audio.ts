"use client";

import { useSyncExternalStore } from "react";

/**
 * Procedural card sounds via the Web Audio API — no audio assets required.
 * All sounds are synthesised from filtered noise bursts + short oscillator thumps.
 */

type Listener = () => void;
const listeners = new Set<Listener>();
let muted = false;
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;

if (typeof window !== "undefined") {
  muted = window.localStorage.getItem("deck-muted") === "1";
}

function ensure(): AudioContext | null {
  if (typeof window === "undefined" || muted) return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function burst(
  at: number,
  dur: number,
  gain: number,
  filter: { type: BiquadFilterType; from: number; to?: number; q?: number },
) {
  if (!ctx || !master || !noise) return;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const f = ctx.createBiquadFilter();
  f.type = filter.type;
  f.Q.value = filter.q ?? 0.9;
  f.frequency.setValueAtTime(filter.from, at);
  if (filter.to) f.frequency.exponentialRampToValueAtTime(filter.to, at + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(gain, at + Math.min(0.012, dur * 0.3));
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(f).connect(g).connect(master);
  src.start(at, Math.random() * 0.5, dur + 0.05);
}

function thump(at: number, freq: number, gain: number, dur = 0.07) {
  if (!ctx || !master) return;
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(freq, at);
  o.frequency.exponentialRampToValueAtTime(freq * 0.45, at + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, at);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g).connect(master);
  o.start(at);
  o.stop(at + dur + 0.02);
}

export const sfx = {
  /** Felt slide — card sliding across the table. */
  slide(delay = 0, strength = 1) {
    const c = ensure();
    if (!c) return;
    const t = c.currentTime + delay;
    burst(t, 0.22, 0.22 * strength, { type: "bandpass", from: 2600, to: 700, q: 0.7 });
  },
  /** Crisp snap of a card being flipped. */
  flip(delay = 0) {
    const c = ensure();
    if (!c) return;
    const t = c.currentTime + delay;
    burst(t, 0.06, 0.35, { type: "highpass", from: 1800 });
    burst(t + 0.02, 0.12, 0.12, { type: "bandpass", from: 1200, to: 500 });
    thump(t, 190, 0.12);
  },
  /** A riffle — rapid series of tiny card clicks. */
  riffle(delay = 0, duration = 0.9, count = 44) {
    const c = ensure();
    if (!c) return;
    const t0 = c.currentTime + delay;
    for (let k = 0; k < count; k++) {
      const at = t0 + (k / count) * duration + Math.random() * 0.008;
      burst(at, 0.018, 0.06 + Math.random() * 0.08, { type: "bandpass", from: 3000 + Math.random() * 1500, q: 1.4 });
    }
    thump(t0 + duration, 120, 0.15, 0.1);
  },
  /** Soft whoosh used for the cascade / bridge. */
  whoosh(delay = 0) {
    const c = ensure();
    if (!c) return;
    const t = c.currentTime + delay;
    burst(t, 0.5, 0.12, { type: "bandpass", from: 400, to: 3000, q: 0.5 });
  },
  /** Very quiet tick for hovers. */
  tick() {
    const c = ensure();
    if (!c) return;
    burst(c.currentTime, 0.03, 0.05, { type: "highpass", from: 3500 });
  },
};

export function setMuted(v: boolean) {
  muted = v;
  if (typeof window !== "undefined") window.localStorage.setItem("deck-muted", v ? "1" : "0");
  if (ctx) void (v ? ctx.suspend() : ctx.resume());
  listeners.forEach((l) => l());
}

function subscribe(l: Listener) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useMuted() {
  return useSyncExternalStore(
    subscribe,
    () => muted,
    () => false,
  );
}
