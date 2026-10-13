#!/usr/bin/env node
/**
 * Cyberpunk profile asset generator.
 *
 * Emits self-contained, animation-only SVG assets (no external fonts, no
 * scripts) so GitHub's image proxy can serve them safely:
 *
 *   assets/hero-dark.svg   assets/hero-light.svg
 *   assets/divider.svg
 *
 * Run:  node tools/build-assets.mjs
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* ------------------------------------------------------------------ *
 * Design tokens — one palette per GitHub colour scheme
 * ------------------------------------------------------------------ */
const THEMES = {
  dark: {
    id: "cyberdark",
    bg: "#05010F",
    bg2: "#12032B",
    ink: "#EAF6FF",
    inkDim: "#8FA3C8",
    cyan: "#00E5FF",
    magenta: "#FF2E97",
    lime: "#39FF8A",
    gold: "#FFD400",
    stroke: "#2C1150",
    card: "#0A0318",
    glow: "0.95",
    glowBright: "0.35",
    vignette: "0.85",
    wordmarkEdge: "#00E5FF",
  },
  light: {
    id: "cyberlight",
    bg: "#F7F2FF",
    bg2: "#E2F7FF",
    ink: "#1B0A30",
    inkDim: "#453A5E",
    cyan: "#0089A8",
    magenta: "#C40E6C",
    lime: "#007A42",
    gold: "#8A6100",
    stroke: "#8F7BB0",
    card: "#FFFFFF",
    glow: "0.70",
    glowBright: "0.22",
    vignette: "0.06",
    wordmarkEdge: "#1B0A30",
  },
};

const FONT =
  "'SFMono-Regular',ui-monospace,Consolas,'Liberation Mono',Menlo,'Courier New',monospace";
// Display face for the bilingual subtitle. CJK faces first so the Chinese line
// never falls back to a tofu box; no webfont is loaded (GitHub's proxy forbids it).
const FONT_CJK =
  "'PingFang SC','Hiragino Sans GB','Noto Sans CJK SC','Microsoft YaHei'," + FONT;

/* ------------------------------------------------------------------ *
 * HERO — 1200 x 360 neon signboard
 * ------------------------------------------------------------------ */
function hero(t) {
  const W = 1200;
  const H = 360;

  // Perspective floor grid: horizontal rules + converging verticals.
  const horizon = 268;
  const rows = [];
  for (let i = 0; i <= 11; i += 1) {
    const p = i / 11;
    const y = horizon + Math.pow(p, 1.85) * (H - horizon);
    rows.push(`<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}"/>`);
  }
  const cols = [];
  for (let i = -14; i <= 14; i += 1) {
    const x = W / 2 + i * 47;
    cols.push(
      `<line x1="${(W / 2 + i * 8).toFixed(1)}" y1="${horizon}" x2="${(x + i * 120).toFixed(1)}" y2="${H}"/>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="ONEINCASE — cyberpunk">
  <title>ONEINCASE // CYBERPUNK</title>
  <style>
    .wm{font-family:${FONT};font-weight:700;font-size:76px;letter-spacing:.15em;fill:${t.ink}}
    .edge{stroke:${t.wordmarkEdge};stroke-width:1.4}
    .lbl{font-family:${FONT};font-weight:400;font-size:15px;letter-spacing:.42em;fill:${t.cyan}}
    .sub{font-family:${FONT_CJK};font-weight:600;font-size:18px;letter-spacing:.14em;fill:${t.ink}}
    .meta{font-family:${FONT};font-weight:400;font-size:11px;letter-spacing:.30em;fill:${t.inkDim}}
    @keyframes jitter{
      0%,86%,100%{transform:translate(0,0);opacity:0}
      87%{transform:translate(-5px,1px);opacity:.85}
      89%{transform:translate(4px,-2px);opacity:.7}
      91%{transform:translate(-2px,2px);opacity:.85}
      93%{transform:translate(0,0);opacity:0}
    }
    @keyframes sweep{0%{transform:translateY(-30px)}100%{transform:translateY(${H + 30}px)}}
    @keyframes breathe{0%,100%{opacity:.55}50%{opacity:1}}
    @keyframes scan{0%{background-position-y:0}100%{background-position-y:6px}}
    .glitch{animation:jitter 5.5s steps(1,end) infinite}
    .glitch2{animation:jitter 5.5s steps(1,end) .14s infinite}
    .sweep{animation:sweep 6.5s linear infinite}
    .blink{animation:breathe 2.4s ease-in-out infinite}
    .on{animation:breathe 4s ease-in-out infinite}
    .on2{animation:breathe 4s ease-in-out 2s infinite}
  </style>

  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.bg}"/>
      <stop offset=".55" stop-color="${t.bg2}"/>
      <stop offset="1" stop-color="${t.bg}"/>
    </linearGradient>
    <radialGradient id="halo" cx=".5" cy=".42" r=".62">
      <stop offset="0" stop-color="${t.cyan}" stop-opacity=".30"/>
      <stop offset=".5" stop-color="${t.magenta}" stop-opacity=".13"/>
      <stop offset="1" stop-color="${t.magenta}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gridfade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.cyan}" stop-opacity="0"/>
      <stop offset="1" stop-color="${t.cyan}" stop-opacity=".55"/>
    </linearGradient>
    <radialGradient id="vig" cx=".5" cy=".5" r=".75">
      <stop offset=".55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="${t.vignette}"/>
    </radialGradient>
    <linearGradient id="sweepg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.cyan}" stop-opacity="0"/>
      <stop offset=".5" stop-color="${t.cyan}" stop-opacity=".16"/>
      <stop offset="1" stop-color="${t.cyan}" stop-opacity="0"/>
    </linearGradient>
    <filter id="neon" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="7" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="3"/>
    </filter>
    <clipPath id="frame"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath>
  </defs>

  <g clip-path="url(#frame)">
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#halo)"/>

    <g opacity=".5">
      <g stroke="${t.cyan}" stroke-width="1" opacity=".30">
        <line x1="0" y1="88" x2="${W}" y2="88"/>
        <line x1="0" y1="${horizon}" x2="${W}" y2="${horizon}" stroke-width="1.6" opacity=".8"/>
      </g>
      <g stroke="url(#gridfade)" stroke-width="1">
        ${rows.join("\n        ")}
        ${cols.join("\n        ")}
      </g>
    </g>

    <!-- side rails -->
    <rect x="26" y="26" width="6" height="46" fill="${t.cyan}"/>
    <rect x="26" y="${H - 72}" width="6" height="46" fill="${t.magenta}"/>
    <rect x="${W - 32}" y="26" width="6" height="46" fill="${t.magenta}"/>
    <rect x="${W - 32}" y="${H - 72}" width="6" height="46" fill="${t.cyan}"/>

    <text class="lbl" x="600" y="72" text-anchor="middle">CYBERPUNK &#183; DESKTOP ENGINEER &#183; RUST &#215; GPU</text>

    <!-- wordmark -->
    <g text-anchor="middle">
      <text class="wm glitch" x="600" y="196" fill="${t.magenta}" opacity="0">ONEINCASE</text>
      <text class="wm glitch2" x="600" y="196" fill="${t.cyan}" opacity="0">ONEINCASE</text>
      <g filter="url(#soft)" opacity="${t.glowBright}">
        <text class="wm" x="600" y="196" fill="${t.cyan}">ONEINCASE</text>
      </g>
      <text class="wm edge" x="600" y="196" stroke="${t.wordmarkEdge}" stroke-width="1.4">ONEINCASE</text>
    </g>

    <rect x="360" y="222" width="480" height="2" fill="${t.magenta}" opacity=".85"/>
    <rect x="470" y="234" width="260" height="2" fill="${t.cyan}" opacity=".55"/>

    <text class="sub" x="600" y="272" text-anchor="middle">&#25226;&#26790;&#35013;&#36827;&#26579;&#33394;&#22120; &#183; shipping pixels &amp; shaders</text>

    <text class="meta" x="52" y="332">SYS//PROFILE</text>
    <text class="meta" x="52" y="332" opacity="0">.</text>
    <text class="meta" x="248" y="332" fill="${t.cyan}">SIGNAL <tspan text-decoration="none">&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;</tspan></text>
    <text class="meta" x="452" y="332" fill="${t.lime}">GPU <tspan>&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;</tspan></text>
    <text class="meta" x="620" y="332" fill="${t.gold}">LATENCY <tspan>&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;</tspan></text>
    <text class="meta blink" x="${W - 52}" y="332" text-anchor="end" fill="${t.magenta}">&#9679; ONLINE</text>

    <!-- corner brackets -->
    <g stroke="${t.magenta}" stroke-width="2" fill="none" opacity=".9">
      <path d="M14 40 L14 14 L40 14"/>
      <path d="M${W - 40} 14 L${W - 14} 14 L${W - 14} 40"/>
    </g>
    <g stroke="${t.cyan}" stroke-width="2" fill="none" opacity=".9">
      <path d="M14 ${H - 40} L14 ${H - 14} L40 ${H - 14}"/>
      <path d="M${W - 40} ${H - 14} L${W - 14} ${H - 14} L${W - 14} ${H - 40}"/>
    </g>

    <rect class="sweep" x="0" y="-30" width="${W}" height="30" fill="url(#sweepg)"/>
    <rect width="${W}" height="${H}" fill="url(#vig)"/>
  </g>

  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="none" stroke="${t.stroke}" stroke-width="2"/>
</svg>
`;
}

/* ------------------------------------------------------------------ *
 * DIVIDER — 1200 x 34 neon rail
 * ------------------------------------------------------------------ */
function divider(t) {
  const W = 1200;
  const H = 34;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="divider">
  <style>
    @keyframes slide{0%{transform:translateX(-140px)}100%{transform:translateX(${W + 140}px)}}
    @keyframes breathe{0%,100%{opacity:.5}50%{opacity:1}}
    .s{animation:slide 7s linear infinite}
    .b{animation:breathe 3.2s ease-in-out infinite}
  </style>
  <defs>
    <linearGradient id="dline" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${t.cyan}" stop-opacity="0"/>
      <stop offset=".18" stop-color="${t.cyan}" stop-opacity=".9"/>
      <stop offset=".5" stop-color="${t.magenta}" stop-opacity=".95"/>
      <stop offset=".82" stop-color="${t.cyan}" stop-opacity=".9"/>
      <stop offset="1" stop-color="${t.cyan}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="dbeam" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${t.ink}" stop-opacity="0"/>
      <stop offset=".5" stop-color="${t.ink}" stop-opacity="${t.glow}"/>
      <stop offset="1" stop-color="${t.ink}" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="dclip"><rect width="${W}" height="${H}"/></clipPath>
  </defs>
  <g clip-path="url(#dclip)">
    <rect x="0" y="16" width="${W}" height="1.5" fill="url(#dline)"/>
    <rect class="s" x="0" y="14" width="140" height="6" fill="url(#dbeam)"/>
    <g fill="${t.cyan}">
      <rect x="596" y="11" width="8" height="8" transform="rotate(45 600 15)"/>
      <rect x="${W - 42}" y="13" width="5" height="5" opacity=".8"/>
      <rect x="37" y="13" width="5" height="5" opacity=".8"/>
    </g>
    <g fill="${t.magenta}">
      <rect class="b" x="600" y="13" width="4" height="4"/>
      <rect x="18" y="12" width="12" height="2" opacity=".7"/>
      <rect x="${W - 30}" y="12" width="12" height="2" opacity=".7"/>
    </g>
  </g>
</svg>
`;
}

/* ------------------------------------------------------------------ *
 * Build
 * ------------------------------------------------------------------ */
mkdirSync(join(ROOT, "assets"), { recursive: true });
const written = [];
for (const [name, t] of Object.entries(THEMES)) {
  const heroPath = join(ROOT, "assets", `hero-${name}.svg`);
  writeFileSync(heroPath, hero(t), "utf8");
  written.push(heroPath);
}
const dividerPath = join(ROOT, "assets", "divider.svg");
writeFileSync(dividerPath, divider(THEMES.dark), "utf8");
written.push(dividerPath);

for (const p of written) console.log(`wrote ${p.slice(ROOT.length + 1)}`);
