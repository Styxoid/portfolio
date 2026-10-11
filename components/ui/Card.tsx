"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, Github } from "lucide-react";
import { Project, SUIT_PATHS, SUITS, Suit } from "@/lib/data";
import { drawThumb } from "@/lib/textures";

export function SuitIcon({ suit, size = 16, className = "", color }: { suit: Suit; size?: number; className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden fill={color ?? SUITS[suit].color}>
      <path d={SUIT_PATHS[suit]} />
    </svg>
  );
}

export function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto max-w-2xl px-6 text-center">
      <p className="font-mono text-[11px] tracking-[0.5em] text-gold/80">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-[0.1em] text-silver md:text-5xl">{title}</h2>
      <div className="mx-auto mt-5 flex items-center justify-center gap-3">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/70" />
        <span className="h-2 w-2 rotate-45 bg-gold" />
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/70" />
      </div>
      {sub && <p className="mt-5 text-sm leading-relaxed text-slate-400 md:text-base">{sub}</p>}
    </div>
  );
}

/** Live, animated procedural viewport for a project (pauses when offscreen / hidden). */
export function ThumbCanvas({ project, animate = true, className = "" }: { project: Project; animate?: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let raf = 0;
    let visible = true;
    const resize = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      c.width = Math.max(1, r.width * dpr);
      c.height = Math.max(1, r.height * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);
    const t0 = performance.now();
    const loop = () => {
      if (visible) drawThumb(ctx, c.width, c.height, project, (performance.now() - t0) / 1000 + 0.6);
      if (animate) raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [project, animate]);
  return <canvas ref={ref} className={`block h-full w-full ${className}`} />;
}

export function CardCorner({ rank, suit, flip = false }: { rank: string; suit: Suit; flip?: boolean }) {
  return (
    <div className={`absolute flex flex-col items-center leading-none ${flip ? "right-3 bottom-3 rotate-180" : "top-3 left-3"}`}>
      <span className="font-display text-xl font-bold" style={{ color: SUITS[suit].color }}>
        {rank}
      </span>
      <SuitIcon suit={suit} size={14} className="mt-1" />
    </div>
  );
}

/** Gold-foil velvet card back (HTML version). */
export function CardBackHTML({ suit, label, className = "" }: { suit?: Suit; label?: string; className?: string }) {
  return (
    <div className={`card-back relative h-full w-full overflow-hidden rounded-xl ${className}`}>
      <div className="absolute inset-2 rounded-lg border-2 border-gold/80" />
      <div className="absolute inset-3.5 rounded-md border border-gold/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-ink shadow-[0_0_30px_-5px_rgba(212,175,55,0.5)]">
          {suit ? <SuitIcon suit={suit} size={28} color="#d4af37" /> : <span className="font-display text-2xl text-gold">S</span>}
        </div>
        {label && <span className="rounded-full border border-gold/50 bg-ink px-3 py-1 font-display text-[10px] tracking-[0.2em] text-silver">{label.toUpperCase()}</span>}
      </div>
    </div>
  );
}

/** Full project card face (HTML) — used in mobile carousel. */
export function ProjectCardFace({ project, compact = false }: { project: Project; compact?: boolean }) {
  const s = SUITS[project.suit];
  return (
    <div className="card-face relative flex h-full w-full flex-col overflow-hidden rounded-xl p-4 pt-10">
      <div className="pointer-events-none absolute inset-1.5 rounded-lg border border-gold/60" />
      <CardCorner rank={project.rank} suit={project.suit} />
      <CardCorner rank={project.rank} suit={project.suit} flip />
      <div className="mx-6 aspect-[4/3] overflow-hidden rounded-md border border-gold/50">
        <ThumbCanvas project={project} animate={!compact} />
      </div>
      <p className="mt-3 text-center font-mono text-[9px] tracking-[0.3em]" style={{ color: s.color }}>
        {s.symbol} {s.title.toUpperCase()}
      </p>
      <h3 className="mt-1 text-center font-display text-lg font-bold tracking-wider text-silver">{project.title}</h3>
      <p className="mt-1 px-2 text-center text-xs leading-snug text-slate-400">{project.tagline}</p>
      <div className="mt-3 flex flex-wrap justify-center gap-1.5 px-2">
        {project.metrics.map((m) => (
          <span key={m} className="chip">
            {m}
          </span>
        ))}
      </div>
      <div className="mt-auto flex justify-center gap-2 pb-4">
        <ProjectLinks project={project} small />
      </div>
    </div>
  );
}

export function ProjectLinks({ project, small = false }: { project: Project; small?: boolean }) {
  const cls = small ? "px-3 py-1.5 text-[10px]" : "px-5 py-2.5 text-xs";
  return (
    <>
      {project.demo && (
        <a
          href={project.demo}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`flex items-center gap-1.5 rounded-sm bg-gold font-mono tracking-widest text-ink transition hover:bg-[#f3d98a] ${cls}`}
        >
          <ExternalLink size={small ? 11 : 13} /> LIVE DEMO
        </a>
      )}
      <a
        href={project.source}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={`flex items-center gap-1.5 rounded-sm border border-gold/60 font-mono tracking-widest text-gold transition hover:border-gold hover:bg-gold/10 ${cls}`}
      >
        <Github size={small ? 11 : 13} /> {project.actionLabel ? project.actionLabel.toUpperCase() : "EXPLORE REPO"}
      </a>
    </>
  );
}
