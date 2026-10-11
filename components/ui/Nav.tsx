"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX, Menu, X } from "lucide-react";
import { setMuted, useMuted, sfx } from "@/lib/audio";
import { PROFILE } from "@/lib/data";

export default function Nav() {
  const muted = useMuted();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleAudio = () => {
    const next = !muted;
    setMuted(next);
    if (!next) sfx.tick();
  };

  const navLinks = [
    { label: "THE DEAL", href: "#deal" },
    { label: "DEALER'S SPREAD", href: "#spread" },
    { label: "CARD BINDER", href: "#binder" },
    { label: "FINAL HAND", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-gold/20 bg-[#08090c]/90 py-3 backdrop-blur-md shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <a
          href="#deal"
          onClick={() => sfx.tick()}
          className="group flex items-center gap-2 font-display text-lg font-bold tracking-widest text-silver"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-sm border border-gold/70 bg-[#0f231c] text-xs text-gold shadow-[0_0_12px_rgba(212,175,55,0.4)] group-hover:bg-gold group-hover:text-ink transition">
            ♠
          </span>
          <span className="group-hover:text-gold transition">{PROFILE.name.toUpperCase()}</span>
        </a>

        {/* Desktop Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => sfx.slide(0, 0.4)}
              className="font-mono text-xs tracking-[0.2em] text-slate-400 transition hover:text-gold"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right Action: Audio Mute Toggle + Mobile Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-wider transition ${
              muted
                ? "border-slate-800 bg-slate-900/40 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                : "border-gold/60 bg-[#0f231c] text-gold shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:border-gold hover:bg-gold/20"
            }`}
            title={muted ? "Unmute Sound Effects" : "Mute Sound Effects"}
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span className="hidden sm:inline">{muted ? "SFX MUTED" : "SFX ACTIVE"}</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded border border-slate-800 bg-slate-900/60 text-slate-300 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-gold/20 bg-[#08090c]/98 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => {
                  sfx.slide(0, 0.5);
                  setMobileMenuOpen(false);
                }}
                className="font-mono text-xs tracking-[0.2em] text-slate-300 hover:text-gold"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
