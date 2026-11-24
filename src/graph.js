import { ROLES, GROUPS, EDUCATION, NOW, FIRST } from './data.js';

export const ym = (y, m) => y + (m - 1) / 12;
export const T0 = 2020.45;
export const T1 = 2027.05;
export const T_FIRST = ym(...FIRST);
export const T_NOW = ym(NOW[0], NOW[1]) + 0.5 / 12;
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const UP = 6, DOWN = 4;
const DATED = ROLES.filter((r) => r.start);

export const span = (r) => [ym(...r.start), r.end ? ym(r.end[0], r.end[1] + 1) : Infinity];
export const activeAt = (t) => DATED.filter((r) => { const [a, b] = span(r); return a <= t && t < b; }).sort((p, q) => p.lane - q.lane);
export const studyAt = (t) => EDUCATION.find((e) => ym(...e.start) <= t && t < ym(e.end[0], e.end[1] + 1));

// month index (0 = first month on the clock) <-> time
export const MONTH_COUNT = (NOW[0] - FIRST[0]) * 12 + (NOW[1] - FIRST[1]);
export const monthToT = (i) => T_FIRST + (i + 0.5) / 12;
export const tToMonth = (t) => Math.max(0, Math.min(MONTH_COUNT, Math.floor((t - T_FIRST) * 12 + 1e-6)));
export const monthLabel = (i) => { const m = FIRST[1] - 1 + i; return `${MONTHS[m % 12]} ${FIRST[0] + Math.floor(m / 12)}`; };

export function geometry(w, h, { padX = 0, padTop = 0, padBottom = 0, maxPitch = 26 } = {}) {
  const avail = h - padTop - padBottom;
  const pitch = Math.min(maxPitch, avail / (UP + DOWN + 0.6));
  const top = padTop + (avail - (UP + DOWN) * pitch) / 2;
  const y0 = top + UP * pitch;
  const iw = w - 2 * padX;
  return {
    w, h, pitch, y0, top, bottom: y0 + DOWN * pitch,
    tx: (t) => padX + ((t - T0) / (T1 - T0)) * iw,
    xt: (x) => T0 + ((x - padX) / iw) * (T1 - T0),
    laneY: (l) => y0 + l * pitch,
    stroke: Math.max(1.6, pitch * 0.2),
  };
}

// The path of one role: leaves the trunk, runs in its lane, rejoins the trunk (or stays open).
export function rolePath(r, g) {
  const [a, b] = span(r);
  const open = !r.end;
  const xa = g.tx(a), xb = g.tx(open ? T_NOW : b);
  const y = g.laneY(r.lane), y0 = g.y0;
  const k = Math.min(g.pitch * 0.85, (xb - xa) / 2);
  let d = `M${xa.toFixed(1)},${y0.toFixed(1)} C${(xa + k * 0.55).toFixed(1)},${y0.toFixed(1)} ${(xa + k * 0.45).toFixed(1)},${y.toFixed(1)} ${(xa + k).toFixed(1)},${y.toFixed(1)} `;
  d += open
    ? `L${xb.toFixed(1)},${y.toFixed(1)}`
    : `L${(xb - k).toFixed(1)},${y.toFixed(1)} C${(xb - k * 0.45).toFixed(1)},${y.toFixed(1)} ${(xb - k * 0.55).toFixed(1)},${y0.toFixed(1)} ${xb.toFixed(1)},${y0.toFixed(1)}`;
  return { d, xa, xb, y, open, k };
}

// The same path as sampled points, for the WebGL ribbons.
export function rolePoints(r, g) {
  const { xa, xb, y, open, k } = rolePath(r, g);
  const y0 = g.y0, pts = [];
  const cubic = (p0, p1, p2, p3, n, skipFirst) => {
    for (let i = skipFirst ? 1 : 0; i <= n; i++) {
      const t = i / n, u = 1 - t;
      pts.push([
        u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
        u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
      ]);
    }
  };
  cubic([xa, y0], [xa + k * 0.55, y0], [xa + k * 0.45, y], [xa + k, y], 18, false);
  const x1 = xa + k, x2 = open ? xb : xb - k;
  const n = Math.max(1, Math.ceil((x2 - x1) / 9));
  for (let i = 1; i <= n; i++) pts.push([x1 + ((x2 - x1) * i) / n, y]);
  if (!open) cubic([xb - k, y], [xb - k * 0.45, y], [xb - k * 0.55, y0], [xb, y0], 18, true);
  return pts;
}

const BONE = '#EFEBE3';

// Full hero graph. Returns the geometry so the caller can move the playhead.
export function renderGraph(svg, w, h, { small = false } = {}) {
  const g = geometry(w, h, { padX: small ? 4 : 30, padTop: small ? 30 : 40, padBottom: small ? 52 : 30, maxPitch: small ? 16 : 34 });
  const fs = small ? 11.5 : 13;
  let s = '';
  for (let y = 2021; y <= 2026; y++) {
    const x = g.tx(y);
    s += `<line x1="${x}" y1="${g.top - g.pitch * 0.6}" x2="${x}" y2="${g.bottom + g.pitch * 1.3}" stroke="${BONE}" stroke-opacity=".08"/>`;
    s += `<text x="${x + 5}" y="${g.bottom + g.pitch * 1.3}" class="g-mono" font-size="${fs}" fill="${BONE}" fill-opacity=".82">${small ? "'" + String(y).slice(2) : y}</text>`;
  }
  s += `<line x1="${g.tx(T_FIRST)}" y1="${g.y0}" x2="${g.tx(T_NOW)}" y2="${g.y0}" stroke="${BONE}" stroke-opacity=".34" stroke-width="${small ? 1.2 : 2}"/>`;
  s += `<circle cx="${g.tx(T_FIRST)}" cy="${g.y0}" r="${small ? 2.5 : 4}" fill="${BONE}"/>`;
  if (!small) {
    const e0 = EDUCATION[0], e1 = EDUCATION[1];
    const xs = g.tx(ym(...e1.start));
    s += `<text x="${g.tx(T_FIRST) + 12}" y="${g.y0 - 9}" class="g-mono" font-size="13" fill="${BONE}" fill-opacity=".84" stroke="#0B0C0E" stroke-width="7" stroke-linejoin="round" paint-order="stroke">${e0.what}, ${e0.where}</text>`;
    s += `<line x1="${xs}" y1="${g.y0 - 5}" x2="${xs}" y2="${g.y0 + 5}" stroke="${BONE}" stroke-width="2"/>`;
    s += `<text x="${xs - 14}" y="${g.y0 + g.pitch * 2.3}" text-anchor="end" class="g-mono" font-size="13" fill="${BONE}" fill-opacity=".84" stroke="#0B0C0E" stroke-width="7" stroke-linejoin="round" paint-order="stroke">then ${e1.what}, ${e1.where}</text>`;
  }
  let roles = '', ends = '';
  for (const r of DATED) {
    const p = rolePath(r, g);
    const c = GROUPS[r.group].color;
    roles += `<path d="${p.d}" fill="none" stroke="${c}" stroke-width="${g.stroke}" stroke-linecap="round" data-role="${r.id}"/>`;
    if (p.open) ends += `<circle cx="${p.xb}" cy="${p.y}" r="${g.stroke * 1.3}" fill="#0B0C0E" stroke="${c}" stroke-width="${g.stroke * 0.6}"/>`;
  }
  s += `<g class="g-roles">${roles}</g><g class="g-ends">${ends}</g>`;
  s += '<g class="g-playhead"></g>';
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.innerHTML = s;
  g.small = small;
  return g;
}

export function renderPlayhead(svg, g, t) {
  const x = g.tx(t);
  const top = g.top - g.pitch * 0.9, bottom = g.bottom + g.pitch * 1.6;
  const label = monthLabel(tToMonth(t)).replace(/^(\w{3})\w*/, '$1');
  const cw = g.small ? 66 : 90, ch = g.small ? 19 : 24;
  const cx = Math.max(cw / 2, Math.min(g.w - cw / 2, x));
  let s = `<line x1="${x.toFixed(1)}" y1="${top}" x2="${x.toFixed(1)}" y2="${bottom}" stroke="${BONE}" stroke-width="1.25"/>`;
  s += `<rect x="${(cx - cw / 2).toFixed(1)}" y="${top - ch}" width="${cw}" height="${ch}" fill="${BONE}"/>`;
  s += `<text x="${cx.toFixed(1)}" y="${top - ch / 2 + 4}" text-anchor="middle" class="g-mono" font-size="${g.small ? 10.5 : 13}" font-weight="600" fill="#0B0C0E">${label}</text>`;
  for (const r of activeAt(t)) {
    s += `<circle cx="${x.toFixed(1)}" cy="${g.laneY(r.lane)}" r="${g.stroke * 1.35}" fill="${GROUPS[r.group].color}" stroke="#0B0C0E" stroke-width="${g.stroke * 0.55}"/>`;
  }
  // on small screens the playhead gets a handle a thumb can find
  if (g.small) s += `<circle cx="${x.toFixed(1)}" cy="${bottom + (g.small ? 18 : 2)}" r="13" fill="${BONE}"/><path d="M${(x - 2).toFixed(1)},${bottom + 14} l-3.5,4 3.5,4 M${(x + 2).toFixed(1)},${bottom + 14} l3.5,4 -3.5,4" fill="none" stroke="#0B0C0E" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  svg.querySelector('.g-playhead').innerHTML = s;
  const ends = svg.querySelector('.g-ends');
  if (ends) ends.style.opacity = t >= T_NOW - 0.05 ? 1 : 0.25;
}

// Compact strip for one organisation: the whole clock, faint, with that organisation's roles lit.
// sel is { org } for an organisation or { roles: [...] } for a project
export function renderStrip(svg, w, h, sel, { ink = BONE, labels = true } = {}) {
  const isLit = (r) => (sel.roles ? sel.roles.includes(r.id) : r.org === sel.org);
  const g = geometry(w, h, { padX: 0, padTop: 6, padBottom: labels ? 20 : 6, maxPitch: 12 });
  const ground = ink === BONE ? '#0B0C0E' : '#EFEBE3';
  let s = '';
  for (let y = 2021; y <= 2026; y++) {
    const x = g.tx(y);
    s += `<line x1="${x}" y1="${g.top - 2}" x2="${x}" y2="${labels ? h - 14 : h}" stroke="${ink}" stroke-opacity=".1"/>`;
    if (labels) s += `<text x="${x + 4}" y="${h - 3}" class="g-mono" font-size="13" fill="${ink}" fill-opacity=".7">${y}</text>`;
  }
  s += `<line x1="${g.tx(T_FIRST)}" y1="${g.y0}" x2="${g.tx(T_NOW)}" y2="${g.y0}" stroke="${ink}" stroke-opacity=".22" stroke-width="1"/>`;
  const dim = DATED.filter((r) => !isLit(r)), lit = DATED.filter(isLit);
  const dimOp = ink === BONE ? '.13' : '.26';
  for (const r of dim) s += `<path d="${rolePath(r, g).d}" fill="none" stroke="${ink}" stroke-opacity="${dimOp}" stroke-width="1.4" stroke-linecap="round"/>`;
  for (const r of lit) {
    const p = rolePath(r, g);
    let c = GROUPS[r.group].color;
    if (c === BONE && ink !== BONE) c = ink; // the cream line would vanish on a cream page
    s += `<path class="lit" data-role="${r.id}" d="${p.d}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
    if (p.open) s += `<circle class="lit-end" cx="${p.xb}" cy="${p.y}" r="3.6" fill="${ground}" stroke="${c}" stroke-width="2"/>`;
  }
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.innerHTML = s;
}
