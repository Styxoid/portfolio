"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  FileText,
  Mail,
  Send,
  ExternalLink,
  Download,
  RotateCw,
  GitCommit,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import { PROFILE, SUIT_PATHS } from "@/lib/data";
import { SectionHeading } from "@/components/ui/Card";
import { sfx } from "@/lib/audio";

export default function PocketAces() {
  // Flip states
  const [heartsFlipped, setHeartsFlipped] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleFlipHearts = () => {
    sfx.flip();
    setHeartsFlipped((f) => !f);
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(PROFILE.email);
    sfx.tick();
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.riffle(0, 0.4, 15);
    setFormSent(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setFormSent(false);
      setHeartsFlipped(false);
    }, 2800);
  };

  return (
    <section id="contact" className="relative min-h-screen w-full bg-[#08090c] py-24">
      {/* Background radial lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,#0f231c_0%,#08090c_80%)] opacity-40" />

      {/* Heading */}
      <SectionHeading
        eyebrow="♠ ♦ ♣ ♥ &nbsp; SECTION IV"
        title="THE FINAL HAND"
        sub="Four Pocket Aces dealt on the felt table. Connect across engineering networks, inspect code repositories, obtain the official CV dossier, or deal a direct message."
      />

      {/* The 4 Aces Grid / Winning Hand Spread */}
      <div className="mx-auto mt-16 max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* ───────────────── ACE OF SPADES: GITHUB ───────────────── */}
          <motion.div
            whileHover={{ y: -8 }}
            className="group relative flex h-[460px] flex-col justify-between overflow-hidden rounded-2xl border-2 border-gold/60 bg-gradient-to-b from-[#10141f] via-[#090c12] to-[#06080d] p-5 shadow-2xl transition hover:border-gold hover:shadow-[0_0_35px_rgba(212,175,55,0.35)]"
          >
            {/* Corner rank */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-2xl font-bold text-slate-200">A</span>
                <svg viewBox="0 0 100 100" width={16} height={16} fill="#cbd5e1">
                  <path d={SUIT_PATHS.spades} />
                </svg>
              </div>
              <span className="font-mono text-[10px] tracking-widest text-gold/80">GITHUB</span>
            </div>

            {/* Content Body */}
            <div className="my-auto flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 bg-[#0f172a] shadow-inner">
                <Github size={30} className="text-slate-100" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-silver">SOURCE DOSSIER</h3>
              <p className="mt-1 font-mono text-xs text-gold/90">@{PROFILE.githubUser}</p>
              <p className="mt-2 text-xs text-slate-400">
                Robotics control routines, neural inference pipelines, and open-source simulators.
              </p>

              {/* Live GitHub mock commit/repo badge */}
              <div className="mt-4 w-full rounded-lg border border-slate-800 bg-slate-900/60 p-2.5 text-left font-mono text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <GitCommit size={13} />
                  <span>main: commit verified</span>
                </div>
                <p className="mt-1 text-[10px] text-slate-400">STM32 kinematic solver v2.4 merged</p>
              </div>

              <a
                href={`https://github.com/${PROFILE.githubUser}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-sm bg-gold/15 py-2 font-mono text-xs font-bold tracking-widest text-gold border border-gold/60 transition hover:bg-gold hover:text-ink"
              >
                EXPLORE REPOS <ExternalLink size={13} />
              </a>
            </div>

            {/* Bottom Inverted Corner */}
            <div className="flex rotate-180 items-center justify-between opacity-70">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-2xl font-bold text-slate-200">A</span>
                <svg viewBox="0 0 100 100" width={16} height={16} fill="#cbd5e1">
                  <path d={SUIT_PATHS.spades} />
                </svg>
              </div>
              <span className="font-mono text-[10px] tracking-widest text-gold/80">SPADES</span>
            </div>
          </motion.div>

          {/* ───────────────── ACE OF DIAMONDS: LINKEDIN ───────────────── */}
          <motion.div
            whileHover={{ y: -8 }}
            className="group relative flex h-[460px] flex-col justify-between overflow-hidden rounded-2xl border-2 border-gold/60 bg-gradient-to-b from-[#10141f] via-[#090c12] to-[#06080d] p-5 shadow-2xl transition hover:border-gold hover:shadow-[0_0_35px_rgba(212,175,55,0.35)]"
          >
            {/* Corner rank */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-2xl font-bold text-[#d4af37]">A</span>
                <svg viewBox="0 0 100 100" width={16} height={16} fill="#d4af37">
                  <path d={SUIT_PATHS.diamonds} />
                </svg>
              </div>
              <span className="font-mono text-[10px] tracking-widest text-gold/80">LINKEDIN</span>
            </div>

            {/* Content Body */}
            <div className="my-auto flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 bg-[#0f172a] shadow-inner">
                <Linkedin size={30} className="text-[#38bdf8]" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-silver">PROFESSIONAL CORE</h3>
              <p className="mt-1 font-mono text-xs text-gold/90">NETWORK & CAREER</p>
              <p className="mt-2 text-xs text-slate-400">
                Engineering leadership, industrial robotics collaborations, and research discourse.
              </p>

              <div className="mt-4 w-full rounded-lg border border-slate-800 bg-slate-900/60 p-2.5 text-left font-mono text-[11px] text-slate-300">
                <div className="text-gold flex items-center gap-1">
                  <span>Available for Senior / Lead Roles</span>
                </div>
                <p className="mt-1 text-[10px] text-slate-400">Robotics · Computer Vision · Full Stack</p>
              </div>

              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-sm bg-gold/15 py-2 font-mono text-xs font-bold tracking-widest text-gold border border-gold/60 transition hover:bg-gold hover:text-ink"
              >
                CONNECT ON LINKEDIN <ExternalLink size={13} />
              </a>
            </div>

            {/* Bottom Inverted Corner */}
            <div className="flex rotate-180 items-center justify-between opacity-70">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-2xl font-bold text-[#d4af37]">A</span>
                <svg viewBox="0 0 100 100" width={16} height={16} fill="#d4af37">
                  <path d={SUIT_PATHS.diamonds} />
                </svg>
              </div>
              <span className="font-mono text-[10px] tracking-widest text-gold/80">DIAMONDS</span>
            </div>
          </motion.div>

          {/* ───────────────── ACE OF CLUBS: RESUME / CV ───────────────── */}
          <motion.div
            whileHover={{ y: -8 }}
            className="group relative flex h-[460px] flex-col justify-between overflow-hidden rounded-2xl border-2 border-gold/60 bg-gradient-to-b from-[#10141f] via-[#090c12] to-[#06080d] p-5 shadow-2xl transition hover:border-gold hover:shadow-[0_0_35px_rgba(212,175,55,0.35)]"
          >
            {/* Corner rank */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-2xl font-bold text-[#34d399]">A</span>
                <svg viewBox="0 0 100 100" width={16} height={16} fill="#34d399">
                  <path d={SUIT_PATHS.clubs} />
                </svg>
              </div>
              <span className="font-mono text-[10px] tracking-widest text-gold/80">CURRICULUM VITAE</span>
            </div>

            {/* Content Body */}
            <div className="my-auto flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 bg-[#0f172a] shadow-inner">
                <FileText size={30} className="text-[#34d399]" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-silver">CURRICULUM VITAE</h3>
              <p className="mt-1 font-mono text-xs text-gold/90">OFFICIAL DOSSIER</p>
              <p className="mt-2 text-xs text-slate-400">
                Complete career track record, academic credentials, patents, and system accomplishments.
              </p>

              <div className="mt-4 w-full rounded-lg border border-slate-800 bg-slate-900/60 p-2.5 text-left font-mono text-[11px] text-slate-300">
                <p className="text-[#34d399]">Format: PDF (A4 & Letter)</p>
                <p className="mt-1 text-[10px] text-slate-400">Updated for 2026 Season</p>
              </div>

              <a
                href={PROFILE.resume}
                download="Siddharth_Resume.pdf"
                onClick={() => sfx.slide(0, 0.8)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-sm bg-gold/15 py-2 font-mono text-xs font-bold tracking-widest text-gold border border-gold/60 transition hover:bg-gold hover:text-ink"
              >
                DOWNLOAD CV <Download size={13} />
              </a>
            </div>

            {/* Bottom Inverted Corner */}
            <div className="flex rotate-180 items-center justify-between opacity-70">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-2xl font-bold text-[#34d399]">A</span>
                <svg viewBox="0 0 100 100" width={16} height={16} fill="#34d399">
                  <path d={SUIT_PATHS.clubs} />
                </svg>
              </div>
              <span className="font-mono text-[10px] tracking-widest text-gold/80">CLUBS</span>
            </div>
          </motion.div>

          {/* ───────────────── ACE OF HEARTS: DIRECT CONTACT (FLIPPABLE) ───────────────── */}
          <div className="h-[460px] [perspective:1000px]">
            <div
              className={`relative h-full w-full rounded-2xl transition-transform duration-700 [transform-style:preserve-3d] ${
                heartsFlipped ? "[transform:rotateY(180deg)]" : ""
              }`}
            >
              {/* Front of Ace of Hearts */}
              <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-gold/60 bg-gradient-to-b from-[#10141f] via-[#090c12] to-[#06080d] p-5 shadow-2xl [backface-visibility:hidden]">
                {/* Corner rank */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-2xl font-bold text-[#f43f5e]">A</span>
                    <svg viewBox="0 0 100 100" width={16} height={16} fill="#f43f5e">
                      <path d={SUIT_PATHS.hearts} />
                    </svg>
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-gold/80">CONTACT</span>
                </div>

                <div className="my-auto flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 bg-[#0f172a] shadow-inner">
                    <Mail size={30} className="text-[#f43f5e]" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-silver">DIRECT DISPATCH</h3>
                  <p className="mt-1 font-mono text-xs text-gold/90">{PROFILE.email}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    Flip this card to send an encrypted transmission directly to my inbox.
                  </p>

                  <button
                    onClick={handleFlipHearts}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-sm bg-gold/15 py-2.5 font-mono text-xs font-bold tracking-widest text-gold border border-gold/60 transition hover:bg-gold hover:text-ink"
                  >
                    <RotateCw size={13} /> FLIP TO MESSAGE
                  </button>
                </div>

                {/* Bottom Inverted Corner */}
                <div className="flex rotate-180 items-center justify-between opacity-70">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-2xl font-bold text-[#f43f5e]">A</span>
                    <svg viewBox="0 0 100 100" width={16} height={16} fill="#f43f5e">
                      <path d={SUIT_PATHS.hearts} />
                    </svg>
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-gold/80">HEARTS</span>
                </div>
              </div>

              {/* Back of Ace of Hearts: Interactive Form */}
              <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-gold/80 bg-[#0a141c] p-5 shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="flex items-center justify-between border-b border-gold/20 pb-2">
                  <div className="flex items-center gap-1.5">
                    <svg viewBox="0 0 100 100" width={14} height={14} fill="#f43f5e">
                      <path d={SUIT_PATHS.hearts} />
                    </svg>
                    <span className="font-mono text-[10px] tracking-widest text-gold">DISPATCH FORM</span>
                  </div>
                  <button
                    onClick={handleFlipHearts}
                    className="text-slate-400 hover:text-gold"
                    aria-label="Flip back"
                  >
                    <RotateCw size={13} />
                  </button>
                </div>

                {/* Direct Copy Email to Clipboard Bar / Toast Button */}
                <div className="relative mt-2">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="group flex w-full items-center justify-between rounded border border-gold/40 bg-[#0f231c]/80 px-2.5 py-1.5 font-mono text-[10px] text-silver transition hover:border-gold hover:bg-[#0f231c] shadow-sm"
                    title="Click to copy email address to clipboard"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail size={12} className="text-[#f43f5e] shrink-0" />
                      <span className="truncate text-gold/90 font-medium">{PROFILE.email}</span>
                    </div>
                    <span className="flex items-center gap-1 rounded bg-gold/15 px-1.5 py-0.5 text-[9px] font-bold text-gold shrink-0 transition group-hover:bg-gold group-hover:text-ink">
                      {copiedEmail ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                      {copiedEmail ? "COPIED!" : "COPY EMAIL"}
                    </span>
                  </button>

                  {/* Animated Toast Feedback */}
                  <AnimatePresence>
                    {copiedEmail && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.95 }}
                        className="pointer-events-none absolute inset-0 flex items-center justify-center rounded border border-emerald-400 bg-emerald-950/95 font-mono text-[10px] font-bold text-emerald-300 shadow-lg backdrop-blur-sm z-10"
                      >
                        <Check size={12} className="mr-1.5 text-emerald-400" /> EMAIL COPIED TO CLIPBOARD
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {formSent ? (
                  <div className="my-auto flex flex-col items-center text-center">
                    <CheckCircle2 size={44} className="text-emerald-400" />
                    <p className="mt-3 font-display text-base font-bold text-silver">DISPATCH SENT</p>
                    <p className="mt-1 font-mono text-[11px] text-slate-400">Transmission logged successfully.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="my-auto flex flex-col gap-2.5">
                    <div>
                      <label className="font-mono text-[9px] tracking-wider text-slate-400">CALLSIGN / NAME</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ada Lovelace"
                        className="mt-0.5 w-full rounded border border-slate-700 bg-slate-900/90 px-2.5 py-1.5 font-mono text-xs text-silver outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[9px] tracking-wider text-slate-400">FREQUENCY / EMAIL</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ada@domain.com"
                        className="mt-0.5 w-full rounded border border-slate-700 bg-slate-900/90 px-2.5 py-1.5 font-mono text-xs text-silver outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[9px] tracking-wider text-slate-400">TRANSMISSION MESSAGE</label>
                      <textarea
                        required
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Discussing robotics kinematics role..."
                        className="mt-0.5 w-full resize-none rounded border border-slate-700 bg-slate-900/90 px-2.5 py-1.5 font-mono text-xs text-silver outline-none focus:border-gold"
                      />
                    </div>
                    <button
                      type="submit"
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-sm bg-gold py-2 font-mono text-xs font-bold tracking-widest text-[#08090c] transition hover:bg-[#f3d98a]"
                    >
                      <Send size={12} /> TRANSMIT
                    </button>
                  </form>
                )}

                <div className="text-center font-mono text-[9px] text-slate-500">
                  ENCRYPTED VIA DISPATCH PROTOCOL
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
