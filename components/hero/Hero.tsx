"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Shuffle, Undo2 } from "lucide-react";
import { PROFILE } from "@/lib/data";
import { useInView, useIsMobile } from "@/lib/hooks";
import { sfx } from "@/lib/audio";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

type Phase = "idle" | "shuffling" | "dealt" | "collecting";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const isMobile = useIsMobile();
  const [phase, setPhase] = useState<Phase>("idle");
  const [shuffleId, setShuffleId] = useState(0);
  const [collectId, setCollectId] = useState(0);

  const onAction = () => {
    if (phase === "idle") {
      setShuffleId((n) => n + 1);
      setPhase("shuffling");
      sfx.slide(0, 0.7);
      sfx.riffle(0.6, 0.9);
      sfx.whoosh(1.75);
      sfx.slide(2.75);
      sfx.flip(3.15);
      setTimeout(() => setPhase("dealt"), 3100);
    } else if (phase === "dealt") {
      setCollectId((n) => n + 1);
      setPhase("collecting");
      setTimeout(() => setPhase("idle"), 1300);
    }
  };

  const busy = phase === "shuffling" || phase === "collecting";

  return (
    <section ref={ref} id="deal" className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <HeroScene shuffleId={shuffleId} collectId={collectId} isMobile={isMobile} active={inView} />
      </div>

      {/* atmospheric vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#08090c_100%)]" />

      <AnimatePresence>
        {(phase === "idle" || phase === "shuffling") && (
          <motion.div
            key="title"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: phase === "idle" ? 1 : 0.35, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute inset-x-0 top-24 text-center md:top-28"
          >
            <p className="font-mono text-[11px] tracking-[0.5em] text-gold/80">♠ ♦ ♣ ♥ &nbsp;A PERSONAL DECK</p>
            <h1 className="mt-3 font-display text-5xl font-bold tracking-[0.12em] text-silver md:text-7xl">
              {PROFILE.name.toUpperCase()}
            </h1>
            <p className="mt-3 text-sm tracking-[0.2em] text-slate-400 uppercase">{PROFILE.role}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessible copy of the Architect card */}
      <div className="sr-only" aria-live="polite">
        {phase === "dealt" && `${PROFILE.name}. ${PROFILE.role}. Based in ${PROFILE.location}. ${PROFILE.bio}`}
      </div>

      <AnimatePresence>
        {phase === "dealt" && !isMobile && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4 }}
            className="pointer-events-none absolute top-1/2 left-[6%] max-w-[260px] -translate-y-1/2"
          >
            <p className="font-mono text-[11px] tracking-[0.4em] text-gold">THE ARCHITECT · A♠</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Move your cursor to tilt the card and catch the holographic foil. Click the card to flip it.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-6 md:bottom-12">
        <button
          onClick={onAction}
          disabled={busy}
          className="group relative overflow-hidden rounded-sm border border-gold/70 bg-ink/70 px-8 py-3.5 font-mono text-xs tracking-[0.35em] text-gold backdrop-blur-md transition hover:border-gold hover:bg-emerald/60 hover:text-silver hover:shadow-[0_0_40px_-8px_rgba(212,175,55,0.6)] disabled:cursor-wait disabled:opacity-50"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative flex items-center gap-3">
            {phase === "dealt" || phase === "collecting" ? <Undo2 size={14} /> : <Shuffle size={14} />}
            {phase === "idle" && "[ SHUFFLE & DEAL ]"}
            {phase === "shuffling" && "[ SHUFFLING… ]"}
            {phase === "dealt" && "[ COLLECT CARD ]"}
            {phase === "collecting" && "[ COLLECTING… ]"}
          </span>
        </button>
        <a href="#spread" className="flex flex-col items-center gap-1 text-[10px] tracking-[0.4em] text-slate-500 transition hover:text-gold">
          SCROLL
          <ChevronDown size={14} className="animate-bounce" />
        </a>
      </div>
    </section>
  );
}
