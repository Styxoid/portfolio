"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Layers, Sparkles } from "lucide-react";
import { PROJECTS, Project, SUITS, Suit } from "@/lib/data";
import { useInView, useIsMobile } from "@/lib/hooks";
import { SectionHeading, SuitIcon, ProjectCardFace } from "@/components/ui/Card";
import ProjectModal from "./ProjectModal";
import { sfx } from "@/lib/audio";

const DealerSpreadScene = dynamic(() => import("./DealerSpreadScene"), { ssr: false });

export default function DealerSpread() {
  const containerRef = useRef<HTMLElement>(null);
  const inView = useInView(containerRef);
  const isMobile = useIsMobile();

  const [selectedSuit, setSelectedSuit] = useState<Suit | "all">("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Mobile carousel index
  const [mobileIdx, setMobileIdx] = useState(0);

  const filteredProjects = useMemo(() => {
    if (selectedSuit === "all") return PROJECTS;
    return PROJECTS.filter((p) => p.suit === selectedSuit);
  }, [selectedSuit]);

  const activeSuitInfo = selectedSuit !== "all" ? SUITS[selectedSuit] : null;

  const handleSuitChange = (suit: Suit | "all") => {
    sfx.slide(0, 0.6);
    setSelectedSuit(suit);
    setMobileIdx(0);
  };

  const handleProjectSelect = (p: Project) => {
    sfx.flip();
    setActiveProject(p);
  };

  const nextMobileCard = () => {
    sfx.slide();
    setMobileIdx((i) => (i + 1) % filteredProjects.length);
  };

  const prevMobileCard = () => {
    sfx.slide();
    setMobileIdx((i) => (i - 1 + filteredProjects.length) % filteredProjects.length);
  };

  return (
    <section
      ref={containerRef}
      id="spread"
      className="relative min-h-screen w-full overflow-hidden bg-[#08090c] py-24"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0f231c_0%,#08090c_70%)] opacity-40" />

      {/* Header */}
      <SectionHeading
        eyebrow="♠ ♦ ♣ ♥ &nbsp; SECTION II"
        title="THE DEALER'S SPREAD"
        sub="An interactive dealer's card arc across four engineering domains. Hover to draw a card forward; click to flip and inspect full architectural telemetry."
      />

      {/* Suit Filter Tabs */}
      <div className="relative z-10 mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-2 px-4">
        <button
          onClick={() => handleSuitChange("all")}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs tracking-wider transition ${
            selectedSuit === "all"
              ? "border-gold bg-gold/15 text-gold shadow-[0_0_20px_rgba(212,175,55,0.25)]"
              : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-silver"
          }`}
        >
          <Layers size={13} /> ALL DOMAINS ({PROJECTS.length})
        </button>

        {(Object.keys(SUITS) as Suit[]).map((st) => {
          const s = SUITS[st];
          const active = selectedSuit === st;
          return (
            <button
              key={st}
              onClick={() => handleSuitChange(st)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs tracking-wider transition ${
                active
                  ? "border-gold bg-gold/15 text-gold shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                  : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-silver"
              }`}
            >
              <SuitIcon suit={st} size={14} />
              <span>{s.title.toUpperCase()}</span>
            </button>
          );
        })}
      </div>

      {/* Domain Sub-banner */}
      {activeSuitInfo && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-4 max-w-xl text-center"
        >
          <p className="font-mono text-xs text-gold/90">
            <span className="font-bold">{activeSuitInfo.symbol} {activeSuitInfo.title}:</span>{" "}
            {activeSuitInfo.domain}
          </p>
        </motion.div>
      )}

      {/* 3D Viewport on Desktop vs Touch Carousel on Mobile */}
      {!isMobile ? (
        <div className="relative mt-8 h-[640px] w-full">
          <DealerSpreadScene
            projects={filteredProjects}
            activeId={activeProject?.id ?? null}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onSelect={handleProjectSelect}
            active={inView}
          />

          {/* Hover HUD Preview at Top Right of canvas */}
          <AnimatePresence>
            {hoveredId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute top-4 right-8 z-10 hidden rounded-xl border border-gold/40 bg-[#0c0e14]/90 p-4 shadow-xl backdrop-blur-md lg:block"
              >
                {(() => {
                  const hp = filteredProjects.find((p) => p.id === hoveredId);
                  if (!hp) return null;
                  return (
                    <div className="w-64">
                      <div className="flex items-center gap-2">
                        <SuitIcon suit={hp.suit} size={15} />
                        <span className="font-mono text-[10px] tracking-widest text-gold">
                          CARD {hp.rank} OF {hp.suit.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="mt-1 font-display text-base font-bold text-silver">{hp.title}</h4>
                      <p className="mt-1 text-xs text-slate-400 line-clamp-2">{hp.tagline}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {hp.metrics.slice(0, 2).map((m) => (
                          <span key={m} className="rounded bg-gold/10 px-2 py-0.5 font-mono text-[10px] text-gold">
                            {m}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-[10px] text-emerald-400/90 font-mono">Click to inspect 3D details →</p>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Mobile Touch-Swipeable Card Carousel */
        <div className="mt-8 flex flex-col items-center px-4">
          <div className="relative h-[480px] w-full max-w-[320px]">
            <AnimatePresence mode="wait">
              {filteredProjects[mobileIdx] && (
                <motion.div
                  key={filteredProjects[mobileIdx].id}
                  initial={{ opacity: 0, x: 40, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -40, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleProjectSelect(filteredProjects[mobileIdx])}
                  className="h-full w-full cursor-pointer rounded-2xl shadow-2xl"
                >
                  <ProjectCardFace project={filteredProjects[mobileIdx]} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Carousel Controls */}
          <div className="mt-6 flex items-center gap-6">
            <button
              onClick={prevMobileCard}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-ink/80 text-gold transition hover:bg-gold/15"
              aria-label="Previous card"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-mono text-xs tracking-widest text-slate-400">
              {mobileIdx + 1} / {filteredProjects.length}
            </span>
            <button
              onClick={nextMobileCard}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-ink/80 text-gold transition hover:bg-gold/15"
              aria-label="Next card"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Modal Inspection Mode */}
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  );
}
