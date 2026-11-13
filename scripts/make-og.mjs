// Regenerates public/og.jpg, the image shown in link previews.
// Run from the project root: node scripts/make-og.mjs
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(process.cwd() + '/');
const sharp = require('sharp');

const W = 1200, H = 630;
const cupPx = 470;
const cup = await sharp('src/assets/abell-s1063-webb.jpg').resize(cupPx, cupPx).jpeg({ quality: 88 }).toBuffer();
const b64 = cup.toString('base64');

let seed = 4242;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
let stars = '';
for (let i = 0; i < 150; i++) {
  const x = (rnd() * W).toFixed(1), y = (rnd() * H).toFixed(1), m = rnd();
  stars += `<circle cx="${x}" cy="${y}" r="${(0.5 + m * m * 1.6).toFixed(2)}" fill="${rnd() < 0.2 ? '#f2c891' : '#ffffff'}" opacity="${(0.25 + rnd() * 0.55).toFixed(2)}"/>`;
}
const cx = 925, cy = 315, r = cupPx / 2;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="bg" cx="30%" cy="25%" r="90%"><stop offset="0" stop-color="#1a1420"/><stop offset="0.6" stop-color="#0b0a10"/><stop offset="1" stop-color="#07060b"/></radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0.7" stop-color="#e0a868" stop-opacity="0.28"/><stop offset="1" stop-color="#e0a868" stop-opacity="0"/></radialGradient>
    <clipPath id="clip"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${stars}
  <circle cx="${cx}" cy="${cy}" r="${r + 70}" fill="url(#glow)"/>
  <path d="M ${cx + r + 6} ${cy - 62} h 34 a 62 62 0 0 1 0 124 h -34" fill="none" stroke="#e0a868" stroke-width="20" stroke-linecap="round"/>
  <image x="${cx - r}" y="${cy - r}" width="${cupPx}" height="${cupPx}" clip-path="url(#clip)" xlink:href="data:image/jpeg;base64,${b64}"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#efe6d8" stroke-width="12"/>
  <circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="none" stroke="#e0a868" stroke-width="5"/>

  <g transform="translate(78 150) scale(1.5)">
    <path d="M20 10c-3.4 4.4 3.4 6.6 0 11M32 7c-3.4 4.4 3.4 6.6 0 11M44 10c-3.4 4.4 3.4 6.6 0 11" fill="none" stroke="#8fc7ff" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M10 27h40v9a20 20 0 0 1-40 0z" fill="#e0a868"/>
    <path d="M50 30.5h3.5a6.5 6.5 0 0 1 0 13h-5.5" fill="none" stroke="#e0a868" stroke-width="3.4" stroke-linecap="round"/>
    <text x="30" y="48" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="21" font-weight="700" fill="#1c120b">κ</text>
  </g>
  <text x="78" y="330" font-family="Georgia, serif" font-size="92" font-weight="700" fill="#f3ece2" letter-spacing="-1.5"><tspan fill="#e0a868" font-style="italic">κ</tspan>appaccino</text>
  <text x="80" y="392" font-family="Georgia, serif" font-size="32" fill="#f3ece2">Cluster lens models, <tspan fill="#f2c891" font-style="italic">freshly brewed.</tspan></text>
  <text x="80" y="440" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="23" fill="#cfc6ba">Bayesian cluster strong lensing in JAX</text>
  <text x="${W - 24}" y="${H - 20}" text-anchor="end" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="14" fill="#9a9187">Image: ESA/Webb, NASA &amp; CSA, H. Atek, M. Zamani</text>
</svg>`;
await sharp(Buffer.from(svg)).jpeg({ quality: 86, mozjpeg: true }).toFile('public/og.jpg');
const meta = await sharp('public/og.jpg').metadata();
console.log(meta.width, meta.height, readFileSync('public/og.jpg').length);
