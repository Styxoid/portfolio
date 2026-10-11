"use client";

import { PROFILE, Project, SUIT_PATHS, SUITS, Suit } from "./data";
import { getFonts } from "./hooks";

export const TEX_W = 1024;
export const TEX_H = 1434; // 5:7 card ratio

type Ctx = CanvasRenderingContext2D;
type Mode = "color" | "orm";

const GOLD = "#d4af37";
const SILVER = "#f1f5f9";

export function makeCanvas(w = TEX_W, h = TEX_H) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

export function seeded(seed: string | number) {
  let h = typeof seed === "number" ? seed : [...seed].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) | 0, 7);
  return () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function goldFoil(ctx: Ctx, x0: number, y0: number, x1: number, y1: number) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, "#8a6d1f");
  g.addColorStop(0.25, "#f3d98a");
  g.addColorStop(0.5, "#b8912b");
  g.addColorStop(0.75, "#f0d27a");
  g.addColorStop(1, "#9c7a24");
  return g;
}

function rr(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function grain(ctx: Ctx, w: number, h: number, amount: number, alpha: number, seed = 1) {
  const rnd = seeded(seed);
  for (let i = 0; i < amount; i++) {
    const v = rnd() > 0.5 ? 255 : 0;
    ctx.fillStyle = `rgba(${v},${v},${v},${alpha * rnd()})`;
    ctx.fillRect(rnd() * w, rnd() * h, 1.6, 1.6);
  }
}

export function drawSuit(ctx: Ctx, suit: Suit, cx: number, cy: number, size: number, fill: string | CanvasGradient) {
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.scale(size / 100, size / 100);
  ctx.fillStyle = fill;
  ctx.fill(new Path2D(SUIT_PATHS[suit]));
  ctx.restore();
}

function spaced(ctx: Ctx, px: number) {
  if ("letterSpacing" in ctx) (ctx as Ctx & { letterSpacing: string }).letterSpacing = `${px}px`;
}

function wrap(ctx: Ctx, text: string, maxW: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

/* ───────────────────────── Card back ───────────────────────── */

/**
 * Draws the luxury card back. In "orm" mode the same layout is painted into
 * PBR channels (G = roughness, B = metalness) so the gold foil reads as real metal.
 */
export function drawBack(ctx: Ctx, mode: Mode, opts: { suit?: Suit; label?: string } = {}) {
  const W = TEX_W,
    H = TEX_H;
  const isC = mode === "color";
  const metal = "rgb(255,60,255)"; // roughness≈0.24, metalness=1
  const felt = "rgb(0,235,0)"; // rough, non-metal
  const foil = isC ? goldFoil(ctx, 0, 0, W, H) : metal;

  // base velvet
  if (isC) {
    const g = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, H * 0.75);
    g.addColorStop(0, "#14382a");
    g.addColorStop(1, "#06120d");
    ctx.fillStyle = g;
  } else ctx.fillStyle = felt;
  ctx.fillRect(0, 0, W, H);
  if (isC) grain(ctx, W, H, 26000, 0.08, 3);

  // borders
  ctx.strokeStyle = foil;
  ctx.lineWidth = 12;
  rr(ctx, 34, 34, W - 68, H - 68, 54);
  ctx.stroke();
  ctx.lineWidth = 3;
  rr(ctx, 62, 62, W - 124, H - 124, 34);
  ctx.stroke();

  // lattice
  ctx.save();
  rr(ctx, 64, 64, W - 128, H - 128, 32);
  ctx.clip();
  ctx.globalAlpha = isC ? 0.22 : 1;
  ctx.lineWidth = isC ? 2 : 2;
  const step = 72;
  for (let x = -H; x < W + H; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + H, H);
    ctx.moveTo(x, H);
    ctx.lineTo(x + H, 0);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  // small diamonds at lattice intersections
  for (let y = 64; y < H; y += step) {
    for (let x = 64 + ((y / step) % 2 ? step / 2 : 0); x < W; x += step) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = foil;
      ctx.globalAlpha = isC ? 0.35 : 1;
      ctx.fillRect(-4, -4, 8, 8);
      ctx.restore();
    }
  }
  ctx.restore();

  // central medallion
  const cx = W / 2,
    cy = H / 2 - (opts.label ? 40 : 0);
  ctx.beginPath();
  ctx.arc(cx, cy, 230, 0, Math.PI * 2);
  ctx.fillStyle = isC ? "#08090c" : felt;
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = foil;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 200, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.stroke();
  // compass ticks
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const r0 = i % 4 === 0 ? 172 : 186;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    ctx.lineTo(cx + Math.cos(a) * 198, cy + Math.sin(a) * 198);
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  const fonts = getFonts();
  if (opts.suit) {
    drawSuit(ctx, opts.suit, cx, cy, 190, foil);
  } else {
    ctx.fillStyle = foil;
    ctx.font = `700 230px ${fonts.display}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(PROFILE.name[0].toUpperCase(), cx, cy + 14);
  }

  if (opts.label) {
    ctx.fillStyle = isC ? "#08090c" : felt;
    rr(ctx, cx - 300, cy + 280, 600, 96, 48);
    ctx.fill();
    ctx.strokeStyle = foil;
    ctx.lineWidth = 3;
    ctx.stroke();
    if (isC) {
      ctx.fillStyle = SILVER;
      ctx.font = `700 46px ${fonts.display}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      spaced(ctx, 4);
      ctx.fillText(opts.label.toUpperCase(), cx, cy + 330);
      spaced(ctx, 0);
    }
  }
}

/* ───────────────────────── Corners ───────────────────────── */

function corners(ctx: Ctx, rank: string, suit: Suit, color: string | CanvasGradient, inset = 92) {
  const fonts = getFonts();
  const draw = () => {
    ctx.fillStyle = color;
    ctx.font = `700 104px ${fonts.display}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(rank, inset + 20, inset + 92);
    drawSuit(ctx, suit, inset + 20, inset + 150, 70, color);
  };
  draw();
  ctx.save();
  ctx.translate(TEX_W, TEX_H);
  ctx.rotate(Math.PI);
  draw();
  ctx.restore();
}

function faceBase(ctx: Ctx, seed: number) {
  const W = TEX_W,
    H = TEX_H;
  const g = ctx.createRadialGradient(W / 2, H * 0.4, 50, W / 2, H / 2, H * 0.8);
  g.addColorStop(0, "#161a23");
  g.addColorStop(1, "#090a0e");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  grain(ctx, W, H, 18000, 0.05, seed);
  ctx.strokeStyle = goldFoil(ctx, 0, 0, W, H);
  ctx.lineWidth = 8;
  rr(ctx, 30, 30, W - 60, H - 60, 50);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.6;
  rr(ctx, 50, 50, W - 100, H - 100, 36);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function divider(ctx: Ctx, y: number, w: number) {
  const cx = TEX_W / 2;
  ctx.strokeStyle = goldFoil(ctx, cx - w, y, cx + w, y);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - w, y);
  ctx.lineTo(cx - 22, y);
  ctx.moveTo(cx + 22, y);
  ctx.lineTo(cx + w, y);
  ctx.stroke();
  ctx.save();
  ctx.translate(cx, y);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = GOLD;
  ctx.fillRect(-9, -9, 18, 18);
  ctx.restore();
}

/* ───────────────────────── Architect (About) card ───────────────────────── */

export function drawArchitect(ctx: Ctx) {
  const W = TEX_W;
  const fonts = getFonts();
  faceBase(ctx, 11);
  const foil = goldFoil(ctx, 0, 0, W, TEX_H);
  corners(ctx, "A", "spades", foil);

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(241,245,249,0.6)";
  ctx.font = `500 24px ${fonts.mono}`;
  spaced(ctx, 8);
  ctx.fillText("THE ARCHITECT", W / 2, 135);
  spaced(ctx, 0);

  // geometric emblem — elevated and scaled to leave generous clearance
  const cx = W / 2,
    cy = 325,
    R = 115;
  ctx.strokeStyle = foil;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, R - 18, 0, Math.PI * 2);
  ctx.stroke();
  for (const n of [6, 3]) {
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const r = n === 6 ? R - 18 : R - 40;
      const x = cx + Math.cos(a) * r,
        y = cy + Math.sin(a) * r;
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(cx - R - 25, cy);
  ctx.lineTo(cx + R + 25, cy);
  ctx.moveTo(cx, cy - R - 25);
  ctx.lineTo(cx, cy + R + 25);
  ctx.stroke();
  drawSuit(ctx, "spades", cx, cy, 70, foil);

  // name — dynamically fit within margins, zero clipping, clear of emblem
  const fullName = PROFILE.name.toUpperCase();
  const maxNameWidth = 720;
  let nameFontSize = 62;
  ctx.font = `700 ${nameFontSize}px ${fonts.display}`;
  spaced(ctx, 3);
  while (ctx.measureText(fullName).width > maxNameWidth && nameFontSize > 36) {
    nameFontSize -= 2;
    ctx.font = `700 ${nameFontSize}px ${fonts.display}`;
  }
  ctx.fillStyle = SILVER;
  ctx.fillText(fullName, W / 2, 605);
  spaced(ctx, 0);
  divider(ctx, 650, 240);

  // role
  ctx.fillStyle = foil;
  ctx.font = `600 34px ${fonts.sans}`;
  spaced(ctx, 2.5);
  PROFILE.roleLines.forEach((l, i) => ctx.fillText(l.toUpperCase(), W / 2, 730 + i * 46));
  spaced(ctx, 0);

  // location
  ctx.fillStyle = "rgba(241,245,249,0.75)";
  ctx.font = `500 26px ${fonts.mono}`;
  spaced(ctx, 5);
  ctx.fillText(`◉  ${PROFILE.location.toUpperCase()}`, W / 2, 850);
  spaced(ctx, 0);

  // bio
  ctx.fillStyle = "#cbd5e1";
  ctx.font = `400 30px ${fonts.sans}`;
  wrap(ctx, PROFILE.bio, 720).forEach((l, i) => ctx.fillText(l, W / 2, 935 + i * 44));

  ctx.fillStyle = "rgba(212,175,55,0.7)";
  ctx.font = `500 20px ${fonts.mono}`;
  spaced(ctx, 8);
  ctx.fillText("ROBOTICS · AI · FULL-STACK", W / 2, 1290);
  spaced(ctx, 0);
}

/* ───────────────────────── Procedural thumbnails ───────────────────────── */

export function drawThumb(ctx: Ctx, w: number, h: number, project: Project, time = 0) {
  const rnd = seeded(project.id);
  const color = SUITS[project.suit].color;
  ctx.save();
  ctx.fillStyle = "#070a10";
  ctx.fillRect(0, 0, w, h);
  // blueprint grid
  ctx.strokeStyle = "rgba(148,163,184,0.08)";
  ctx.lineWidth = 1;
  const gs = Math.max(16, w / 24);
  for (let x = 0; x < w; x += gs) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gs) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  const s = Math.min(w, h);
  ctx.lineCap = "round";

  if (project.suit === "spades") {
    // articulated arm
    const base = { x: w * 0.3, y: h * 0.85 };
    const L = [s * 0.32, s * 0.27, s * 0.14];
    const a0 = -1.2 + Math.sin(time * 0.9 + rnd()) * 0.25;
    const a1 = 0.9 + Math.sin(time * 1.3) * 0.35;
    const a2 = 0.6 + Math.sin(time * 1.7 + 1) * 0.4;
    ctx.setLineDash([6, 8]);
    ctx.strokeStyle = "rgba(203,213,225,0.25)";
    ctx.beginPath();
    ctx.arc(base.x, base.y, L[0] + L[1] + L[2], -Math.PI, 0);
    ctx.stroke();
    ctx.setLineDash([]);
    let p = base,
      a = a0;
    const pts = [p];
    [a0, a1, a2].forEach((da, i) => {
      a = i === 0 ? da : a + da;
      p = { x: p.x + Math.cos(a) * L[i], y: p.y + Math.sin(a) * L[i] };
      pts.push(p);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = s * 0.035;
    ctx.beginPath();
    pts.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)));
    ctx.stroke();
    pts.forEach((q, i) => {
      ctx.beginPath();
      ctx.arc(q.x, q.y, s * (i === 0 ? 0.05 : 0.03), 0, Math.PI * 2);
      ctx.fillStyle = "#070a10";
      ctx.fill();
      ctx.lineWidth = s * 0.012;
      ctx.strokeStyle = GOLD;
      ctx.stroke();
    });
    ctx.fillStyle = "rgba(212,175,55,0.15)";
    ctx.fillRect(base.x - s * 0.12, base.y, s * 0.24, s * 0.04);
  } else if (project.suit === "diamonds") {
    // neural net + detection boxes
    const layers = [4, 6, 6, 3];
    const nodes: { x: number; y: number }[][] = layers.map((n, li) =>
      Array.from({ length: n }, (_, k) => ({
        x: w * (0.14 + (li / (layers.length - 1)) * 0.72),
        y: h * (0.5 + (k - (n - 1) / 2) * 0.13),
      })),
    );
    for (let li = 0; li < nodes.length - 1; li++)
      nodes[li].forEach((a, ai) =>
        nodes[li + 1].forEach((b, bi) => {
          const pulse = 0.5 + 0.5 * Math.sin(time * 3 - li * 1.2 + ai + bi);
          ctx.strokeStyle = `rgba(212,175,55,${0.06 + pulse * 0.22})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }),
      );
    nodes.flat().forEach((n, i) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, s * 0.022, 0, Math.PI * 2);
      ctx.fillStyle = i % 3 ? "#0b0e14" : color;
      ctx.fill();
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    const bx = w * (0.08 + rnd() * 0.1) + Math.sin(time) * 6;
    ctx.strokeStyle = "#34d399";
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, h * 0.08, w * 0.3, h * 0.22);
    ctx.fillStyle = "#34d399";
    ctx.font = `600 ${Math.round(s * 0.05)}px monospace`;
    ctx.fillText("obj 0.97", bx + 4, h * 0.08 - 6);
  } else if (project.suit === "clubs") {
    // service mesh + telemetry sparkline
    const n = 7,
      cx = w * 0.5,
      cy = h * 0.42,
      R = s * 0.28;
    const pts = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + time * 0.2;
      return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R * 0.8 };
    });
    ctx.lineWidth = 1.2;
    pts.forEach((a, i) =>
      pts.forEach((b, j) => {
        if (j <= i || rnd() < 0.45) return;
        ctx.strokeStyle = "rgba(52,211,153,0.25)";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }),
    );
    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, s * 0.03, 0, Math.PI * 2);
      ctx.fillStyle = "#0b0e14";
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.06, 0, Math.PI * 2);
    ctx.fillStyle = GOLD;
    ctx.fill();
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const x = w * 0.06 + (i / 60) * w * 0.88;
      const y = h * 0.86 - (Math.sin(i * 0.5 + time * 2) * 0.5 + 0.5) * h * 0.08 - rnd() * h * 0.04;
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
    ctx.stroke();
  } else {
    // wireframe torus
    const cx = w * 0.5,
      cy = h * 0.5,
      R = s * 0.26,
      r = s * 0.11;
    const rx = 1.0 + time * 0.25,
      ry = time * 0.4;
    const proj = (u: number, v: number) => {
      let x = (R + r * Math.cos(v)) * Math.cos(u);
      let y = (R + r * Math.cos(v)) * Math.sin(u);
      let z = r * Math.sin(v);
      [y, z] = [y * Math.cos(rx) - z * Math.sin(rx), y * Math.sin(rx) + z * Math.cos(rx)];
      [x, z] = [x * Math.cos(ry) + z * Math.sin(ry), -x * Math.sin(ry) + z * Math.cos(ry)];
      const k = 1.6 / (1.6 + z / s);
      return { x: cx + x * k, y: cy + y * k, z };
    };
    ctx.lineWidth = 1.3;
    for (let i = 0; i < 28; i++) {
      const u = (i / 28) * Math.PI * 2;
      ctx.strokeStyle = i % 4 ? "rgba(244,63,94,0.45)" : "rgba(212,175,55,0.7)";
      ctx.beginPath();
      for (let j = 0; j <= 24; j++) {
        const p = proj(u, (j / 24) * Math.PI * 2);
        if (j) ctx.lineTo(p.x, p.y);
        else ctx.moveTo(p.x, p.y);
      }
      ctx.stroke();
    }
    for (let j = 0; j < 12; j++) {
      const v = (j / 12) * Math.PI * 2;
      ctx.strokeStyle = "rgba(244,63,94,0.3)";
      ctx.beginPath();
      for (let i = 0; i <= 48; i++) {
        const p = proj((i / 48) * Math.PI * 2, v);
        if (i) ctx.lineTo(p.x, p.y);
        else ctx.moveTo(p.x, p.y);
      }
      ctx.stroke();
    }
  }
  // vignette
  const vg = ctx.createRadialGradient(w / 2, h / 2, s * 0.2, w / 2, h / 2, s * 0.85);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.6)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/* ───────────────────────── Project card face ───────────────────────── */

export function drawProjectFront(ctx: Ctx, p: Project) {
  const W = TEX_W;
  const fonts = getFonts();
  const suit = SUITS[p.suit];
  faceBase(ctx, p.id.length * 13);
  corners(ctx, p.rank, p.suit, suit.color);

  // thumbnail window
  const tx = 200,
    ty = 110,
    tw = W - 400,
    th = 560;
  ctx.save();
  rr(ctx, tx, ty, tw, th, 28);
  ctx.clip();
  ctx.translate(tx, ty);
  drawThumb(ctx, tw, th, p, 0.6);
  ctx.restore();
  ctx.strokeStyle = goldFoil(ctx, tx, ty, tx + tw, ty + th);
  ctx.lineWidth = 4;
  rr(ctx, tx, ty, tw, th, 28);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = suit.color;
  ctx.font = `500 26px ${fonts.mono}`;
  spaced(ctx, 8);
  ctx.fillText(`${suit.symbol} ${suit.title.toUpperCase()}`, W / 2, 740);
  spaced(ctx, 0);

  ctx.fillStyle = SILVER;
  ctx.font = `700 76px ${fonts.display}`;
  ctx.fillText(p.title.toUpperCase(), W / 2, 830);
  divider(ctx, 870, 240);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = `400 34px ${fonts.sans}`;
  wrap(ctx, p.tagline, 700).forEach((l, i) => ctx.fillText(l, W / 2, 940 + i * 48));

  // metric chips
  ctx.font = `500 28px ${fonts.mono}`;
  const pad = 26,
    gap = 16,
    chipH = 60;
  const widths = p.metrics.map((m) => ctx.measureText(m).width + pad * 2);
  const rows: number[][] = [[]];
  let rowW = 0;
  widths.forEach((cw, i) => {
    if (rowW + cw > 760 && rows[rows.length - 1].length) {
      rows.push([]);
      rowW = 0;
    }
    rows[rows.length - 1].push(i);
    rowW += cw + gap;
  });
  rows.forEach((row, ri) => {
    const total = row.reduce((a, i) => a + widths[i], 0) + gap * (row.length - 1);
    let x = W / 2 - total / 2;
    const y = 1070 + ri * (chipH + 16);
    row.forEach((i) => {
      rr(ctx, x, y, widths[i], chipH, chipH / 2);
      ctx.fillStyle = "rgba(15,35,28,0.9)";
      ctx.fill();
      ctx.strokeStyle = "rgba(212,175,55,0.7)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#f3d98a";
      ctx.fillText(p.metrics[i], x + widths[i] / 2, y + 40);
      x += widths[i] + gap;
    });
  });

  ctx.fillStyle = "rgba(241,245,249,0.45)";
  ctx.font = `500 22px ${fonts.mono}`;
  spaced(ctx, 6);
  const footerLabel = p.demo
    ? `LIVE DEMO  ·  ${p.actionLabel ?? "EXPLORE REPO"}`
    : (p.actionLabel ?? "EXPLORE REPO");
  ctx.fillText(footerLabel.toUpperCase(), W / 2, 1290);
  spaced(ctx, 0);
}

/* ───────────────────────── Felt table ───────────────────────── */

export function drawFelt(ctx: Ctx, size: number) {
  ctx.fillStyle = "#0b1a14";
  ctx.fillRect(0, 0, size, size);
  const rnd = seeded(42);
  for (let i = 0; i < size * size * 0.35; i++) {
    const v = 10 + rnd() * 40;
    ctx.fillStyle = `rgba(${v * 0.5},${v},${v * 0.75},${0.25 * rnd()})`;
    ctx.fillRect(rnd() * size, rnd() * size, 1, 1 + rnd() * 2);
  }
}
