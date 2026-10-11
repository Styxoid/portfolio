"use client";

import { RefObject, useEffect, useState, useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

/** True while the element is (nearly) on screen — used to pause offscreen render loops. */
export function useInView<T extends Element>(ref: RefObject<T | null>, rootMargin = "100px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

/** Resolves once web fonts are loaded so canvas textures render with the right typefaces. */
export function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    const fams = getFonts();
    Promise.all([
      document.fonts.load(`700 64px ${fams.display}`),
      document.fonts.load(`500 32px ${fams.sans}`),
      document.fonts.load(`600 32px ${fams.sans}`),
      document.fonts.load(`500 28px ${fams.mono}`),
    ])
      .catch(() => undefined)
      .then(() => document.fonts.ready)
      .then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);
  return ready;
}

export function getFonts() {
  const cs = getComputedStyle(document.documentElement);
  const v = (n: string, f: string) => cs.getPropertyValue(n).trim() || f;
  return {
    display: v("--font-display", "Georgia, serif"),
    sans: v("--font-sans", "system-ui, sans-serif"),
    mono: v("--font-mono", "monospace"),
  };
}
