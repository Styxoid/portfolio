"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Cpu, Eye, Globe, Compass, Sparkles } from "lucide-react";
import { RANK_LABEL, SKILLS, SUITS, SkillRank, Suit } from "@/lib/data";
import { CardBackHTML, SectionHeading, SuitIcon } from "@/components/ui/Card";
import { sfx } from "@/lib/audio";

const DECK_CONFIG: { suit: Suit; label: string; icon: typeof Cpu; desc: string }[] = [
  {
    suit: "spades",
    label: "Hardware & Kinematics",
    icon: Cpu,
    desc: "Bare-metal firmware, motor controllers, low-level kinematics & robotics.",
  },
  {
    suit: "diamonds",
    label: "AI & Edge Vision",
    icon: Eye,
    desc: "Deep learning models, real-time object tracking, and edge INT8 compilation.",
  },
  {
    suit: "clubs",
    label: "Web Architecture & Systems",
    icon: Globe,
    desc: "High-throughput APIs, telemetry pipelines, and distributed event architectures.",
  },
  {
    suit: "hearts",
    label: "Spatial, Graphics & Tools",
    icon: Compass,
    desc: "Interactive 3D simulation, WebGL shaders, CAD modeling & game engines.",
  },
];

export default function CardBinder() {
  const [selectedSuit, setSelectedSuit] = useState<Suit>("spades");

  const handleSelectDeck = (st: Suit) => {
    sfx.riffle(0, 0.35, 12);
    setSelectedSuit(st);
  };

  const currentDeckConfig = DECK_CONFIG.find((d) => d.suit === selectedSuit)!;
  const currentSkills = SKILLS[selectedSuit];

  return (
    <section id="binder" className="relative min-h-screen w-full bg-[#08090c] py-24">
      {/* Background radial gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,#0f231c_0%,transparent_60%)] opacity-30" />

      {/* Heading */}
      <SectionHeading
        eyebrow="♠ ♦ ♣ ♥ &nbsp; SECTION III"
        title="THE CARD BINDER"
        sub="Skills packaged into four tournament decks. Select a deck to cut and deal its hand of engineering disciplines, ranked by mastery."
      />

      {/* Rank Proficiency Legend */}
      <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-4 px-4 text-xs font-mono">
        <span className="text-slate-400 flex items-center gap-1.5">
          <Sparkles size={12} className="text-gold" /> RANK SYSTEM:
        </span>
        {(["A", "K", "Q", "J"] as SkillRank[]).map((r) => (
          <div key={r} className="flex items-center gap-1.5 rounded-full border border-gold/30 bg-[#0f231c]/50 px-3 py-1">
            <span className="font-display font-bold text-gold">{r}</span>
            <span className="text-slate-300">= {RANK_LABEL[r]}</span>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 max-w-6xl px-4">
        {/* 4 Mini Decks Selector */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DECK_CONFIG.map((d) => {
            const isSelected = selectedSuit === d.suit;
            const suitInfo = SUITS[d.suit];
            const Icon = d.icon;
            const skillCount = SKILLS[d.suit].length;

            return (
              <motion.div
                key={d.suit}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectDeck(d.suit)}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
                  isSelected
                    ? "border-gold bg-[#0d1612] shadow-[0_0_35px_-8px_rgba(212,175,55,0.4)]"
                    : "border-slate-800 bg-[#0b0e14]/80 hover:border-gold/50 hover:bg-[#0d1219]"
                }`}
              >
                {/* Visual Stack Effect (Cards stacked behind) */}
                <div className="relative mx-auto h-44 w-32 [perspective:800px]">
                  <div
                    className="absolute inset-0 -top-2 left-2 rounded-xl border border-gold/30 bg-[#06120d] opacity-50 transition-transform group-hover:-top-3 group-hover:left-3"
                    style={{ transform: "rotate(6deg)" }}
                  />
                  <div
                    className="absolute inset-0 -top-1 left-1 rounded-xl border border-gold/40 bg-[#081810] opacity-75 transition-transform group-hover:-top-2 group-hover:left-2"
                    style={{ transform: "rotate(3deg)" }}
                  />
                  <div className="absolute inset-0 rounded-xl shadow-xl">
                    <CardBackHTML suit={d.suit} label={suitInfo.binder} />
                  </div>
                </div>

                {/* Deck Info */}
                <div className="mt-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <SuitIcon suit={d.suit} size={16} />
                    <h3 className="font-display text-base font-bold text-silver">{suitInfo.binder}</h3>
                  </div>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">{d.desc}</p>
                  <div className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[11px] text-gold/80">
                    <span>{skillCount} SKILL CARDS</span>
                    <ChevronRight size={13} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dealt Skill Hand */}
        <div className="mt-16 rounded-3xl border border-gold/30 bg-[#0c1017]/90 p-8 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col items-start justify-between border-b border-gold/20 pb-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <SuitIcon suit={selectedSuit} size={20} />
                <h3 className="font-display text-2xl font-bold text-silver">
                  {currentDeckConfig.label}
                </h3>
              </div>
              <p className="mt-1 font-mono text-xs text-gold/80">
                {SUITS[selectedSuit].domain}
              </p>
            </div>
            <span className="mt-2 font-mono text-xs text-slate-400 sm:mt-0">
              DEALT {currentSkills.length} CARDS
            </span>
          </div>

          {/* Cards Grid */}
          <motion.div
            key={selectedSuit}
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.05 },
              },
            }}
            className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7"
          >
            {currentSkills.map((sk) => (
              <motion.div
                key={sk.name}
                variants={{
                  hidden: { opacity: 0, y: 20, rotateY: 90 },
                  show: { opacity: 1, y: 0, rotateY: 0 },
                }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="group relative flex h-40 cursor-default flex-col justify-between rounded-xl border border-gold/40 bg-gradient-to-b from-[#121620] to-[#090b10] p-3 shadow-lg transition-shadow hover:border-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                {/* Top Corner Rank */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="font-display text-base font-bold text-gold">{sk.rank}</span>
                    <SuitIcon suit={selectedSuit} size={11} />
                  </div>
                  <span className="rounded bg-gold/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#f3d98a]">
                    {RANK_LABEL[sk.rank]}
                  </span>
                </div>

                {/* Center Skill Name */}
                <div className="my-auto text-center">
                  <p className="font-mono text-xs font-bold tracking-wider text-silver group-hover:text-gold transition">
                    {sk.name}
                  </p>
                </div>

                {/* Bottom Inverted Corner */}
                <div className="flex rotate-180 items-center justify-between opacity-60">
                  <div className="flex items-center gap-1">
                    <span className="font-display text-base font-bold text-gold">{sk.rank}</span>
                    <SuitIcon suit={selectedSuit} size={11} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
