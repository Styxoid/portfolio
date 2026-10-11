"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github, RotateCw, Sparkles, Layers } from "lucide-react";
import { Project, SUITS } from "@/lib/data";
import { SuitIcon, ThumbCanvas } from "@/lib/../components/ui/Card";
import { sfx } from "@/lib/audio";

type Props = {
  project: Project | null;
  onClose: () => void;
};

export default function ProjectModal({ project, onClose }: Props) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const suit = SUITS[project.suit];

  const handleFlip = () => {
    sfx.flip();
    setFlipped((f) => !f);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-gold/40 bg-[#0c0e14]/95 p-6 shadow-[0_0_60px_-15px_rgba(212,175,55,0.4)] backdrop-blur-xl md:p-8"
        >
          {/* Close button */}
          <button
            onClick={() => {
              sfx.tick();
              onClose();
            }}
            className="absolute top-5 right-5 z-20 rounded-full border border-gold/30 bg-ink/70 p-2 text-slate-400 transition hover:border-gold hover:text-gold"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
            {/* Left Column: Interactive 3D Card Simulation with Flip */}
            <div className="flex flex-col items-center md:col-span-5">
              <div
                className="group relative h-[380px] w-[260px] cursor-pointer [perspective:1000px]"
                onClick={handleFlip}
              >
                <div
                  className={`relative h-full w-full rounded-2xl transition-transform duration-700 [transform-style:preserve-3d] ${
                    flipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
                >
                  {/* Card Front */}
                  <div className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border-2 border-gold/70 bg-[#0d1219] p-4 shadow-2xl [backface-visibility:hidden]">
                    {/* Top Corner */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display text-xl font-bold" style={{ color: suit.color }}>
                          {project.rank}
                        </span>
                        <SuitIcon suit={project.suit} size={15} />
                      </div>
                      <span className="font-mono text-[10px] tracking-widest text-gold/80">INSPECT</span>
                    </div>

                    {/* Canvas Viewport */}
                    <div className="mt-3 aspect-[4/3] w-full overflow-hidden rounded-lg border border-gold/40">
                      <ThumbCanvas project={project} animate={true} />
                    </div>

                    <div className="mt-4 text-center">
                      <p className="font-mono text-[10px] tracking-[0.25em]" style={{ color: suit.color }}>
                        {suit.symbol} {suit.title.toUpperCase()}
                      </p>
                      <h4 className="mt-1 font-display text-lg font-bold text-silver">{project.title}</h4>
                    </div>

                    {/* Bottom Corner */}
                    <div className="mt-auto flex rotate-180 items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display text-xl font-bold" style={{ color: suit.color }}>
                          {project.rank}
                        </span>
                        <SuitIcon suit={project.suit} size={15} />
                      </div>
                      <span className="font-mono text-[10px] tracking-widest text-gold/80">INSPECT</span>
                    </div>
                  </div>

                  {/* Card Back (Flipped) */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-gold/80 bg-[#0a1813] p-5 shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="absolute inset-2.5 rounded-xl border border-gold/30" />
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold bg-[#08090c] shadow-[0_0_25px_rgba(212,175,55,0.4)]">
                      <SuitIcon suit={project.suit} size={36} color="#d4af37" />
                    </div>
                    <p className="mt-4 font-display text-xs tracking-[0.3em] text-silver">THE DEALER&apos;S HAND</p>
                    <p className="mt-1 font-mono text-[10px] tracking-widest text-gold/80">{project.title.toUpperCase()}</p>
                    <div className="mt-6 flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                      <RotateCw size={12} className="animate-spin text-gold" /> Click to flip back
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleFlip}
                className="mt-3 flex items-center gap-2 font-mono text-[11px] tracking-widest text-gold/70 transition hover:text-gold"
              >
                <RotateCw size={13} /> FLIP CARD PREVIEW
              </button>
            </div>

            {/* Right Column: Detailed Specs & Telemetry */}
            <div className="flex flex-col md:col-span-7">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-gold/50 bg-[#0f231c]">
                  <SuitIcon suit={project.suit} size={18} />
                </span>
                <div>
                  <p className="font-mono text-[11px] tracking-[0.3em] text-gold/80">
                    {suit.symbol} {suit.domain}
                  </p>
                  <h3 className="font-display text-2xl font-bold tracking-wide text-silver md:text-3xl">
                    {project.title}
                  </h3>
                </div>
              </div>

              <p className="mt-2 text-sm font-medium text-emerald-400/90">{project.tagline}</p>

              <div className="mt-4 border-t border-gold/20 pt-4">
                <p className="text-sm leading-relaxed text-slate-300 md:text-base">
                  {project.description}
                </p>
              </div>

              {/* Performance Metric Chips */}
              <div className="mt-6">
                <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-slate-400">
                  <Sparkles size={13} className="text-gold" /> KEY TELEMETRY & SPECS:
                </div>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {project.metrics.map((m) => (
                    <span
                      key={m}
                      className="rounded-full border border-gold/50 bg-[#0f231c]/90 px-3.5 py-1 font-mono text-xs font-semibold text-[#f3d98a] shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mt-5">
                <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-slate-400">
                  <Layers size={13} className="text-gold" /> CORE ARCHITECTURE:
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded border border-slate-700 bg-slate-900/80 px-2.5 py-1 font-mono text-xs text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-gold/20 pt-6">
                <a
                  href={project.source}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-sm bg-gold px-6 py-2.5 font-mono text-xs font-bold tracking-widest text-[#08090c] shadow-[0_0_20px_rgba(212,175,55,0.4)] transition hover:bg-[#f3d98a]"
                >
                  <Github size={14} /> [ VIEW REPO ]
                </a>

                <a
                  href={project.demo && project.demo !== "#" ? project.demo : `${project.source}#architecture`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-sm border border-gold/70 bg-[#0f231c]/70 px-6 py-2.5 font-mono text-xs font-bold tracking-widest text-gold transition hover:border-gold hover:bg-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                >
                  <Layers size={14} /> [ ARCHITECTURE / DEMO ]
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
