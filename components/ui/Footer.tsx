"use client";

import { PROFILE } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative border-t border-gold/20 bg-[#06070a] py-12 text-center text-slate-500">
      <div className="mx-auto max-w-6xl px-6 flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm tracking-widest text-silver">
            {PROFILE.name.toUpperCase()} · PORTFOLIO DECK
          </span>
          <span className="text-gold">♠ ♦ ♣ ♥</span>
        </div>

        <p className="font-mono text-xs tracking-wider">
          ENGINEERED WITH NEXT.JS · THREE.JS · WEB AUDIO
        </p>

        <p className="font-mono text-xs text-slate-600">
          © {new Date().getFullYear()} ALL RIGHTS RESERVED
        </p>
      </div>
    </footer>
  );
}
