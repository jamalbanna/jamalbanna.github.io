import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/martian-mono/wdth.css';
import './style.css';
import { ROLES, ORGS, WORK, GROUPS } from './data.js';
import { renderGraph, renderPlayhead, renderStrip, activeAt, studyAt, monthToT, monthLabel, tToMonth, MONTH_COUNT, MONTHS, T_NOW, T_FIRST } from './graph.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const orgById = Object.fromEntries(ORGS.map((o) => [o.id, o]));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- hero graph and playhead ---------- */
const graphBox = $('.hero-graph');
const svg = $('.graph');
const scrub = $('.scrub');
const T_MIN = T_FIRST + 0.5 / 12;

// t is where the playhead is drawn, target is where it is heading
const hero = { t: T_NOW, target: T_NOW, month: -1, count: -1, geo: null, ribbons: null, locked: false, onDraw: null, onCount: null };

$('.legend').innerHTML = Object.values(GROUPS).map((g) => `<li><i style="background:${g.color}"></i>${g.label}</li>`).join('');

function readout() {
  const t = monthToT(hero.month);
  const running = activeAt(t);
  const study = studyAt(t);
  const isNow = hero.month === MONTH_COUNT;
  $('.readout-at').textContent = `playhead at ${monthLabel(hero.month)}${isNow ? ', today' : ''}`;
  $('.readout-count b').textContent = running.length;
  if (running.length !== hero.count) { hero.count = running.length; if (hero.onCount) hero.onCount(running.length); }
  $('.readout-count span').textContent = running.length === 1 ? 'role\nrunning' : running.length === 0 ? 'roles running\nyet' : 'roles running\nat the same time';
  let html = running.map((r) => `<li><i style="background:${GROUPS[r.group].color}"></i><span>${esc(r.title.replace(', Global In-House Development Team', ''))}<u>${esc(orgById[r.org].short)}</u></span></li>`).join('');
  if (study) html += `<li class="study"><i></i><span>Studying ${esc(study.what.replace('BS ', ''))}<u>${esc(study.where)}</u></span></li>`;
  $('.readout-list').innerHTML = html;
  scrub.value = hero.month;
  scrub.setAttribute('aria-valuetext', `${monthLabel(hero.month)}, ${running.length} roles running`);
}

function draw() {
  if (!hero.geo) return;
  renderPlayhead(svg, hero.geo, hero.t);
  const m = tToMonth(hero.t);
  if (m !== hero.month) { hero.month = m; readout(); }
  if (hero.ribbons) hero.ribbons.setPlayhead(hero.t, hero.geo.tx(hero.t));
  if (hero.onDraw) hero.onDraw(hero.t);
}

// called every frame by the motion layer. Without motion the playhead jumps.
hero.step = () => {
  const d = hero.target - hero.t;
  if (d === 0) return;
  hero.t = Math.abs(d) < 0.002 ? hero.target : hero.t + d * 0.2;
  draw();
};
hero.jump = (t) => { hero.t = hero.target = Math.max(T_MIN, Math.min(T_NOW, t)); draw(); };
const aim = (t) => {
  if (hero.locked) return;
  hero.target = Math.max(T_MIN, Math.min(T_NOW, t));
  if (!hero.animated) hero.jump(hero.target);
};

function drawGraph() {
  const { width, height } = svg.getBoundingClientRect();
  if (!width || !height) return;
  hero.geo = renderGraph(svg, Math.round(width), Math.round(height), { small: width < 700 });
  if (hero.ribbons) hero.ribbons.build(hero.geo);
  hero.month = -1;
  draw();
}
hero.redraw = drawGraph;

scrub.max = MONTH_COUNT;
const tFromEvent = (e) => {
  const r = svg.getBoundingClientRect();
  return hero.geo.xt(((e.clientX - r.left) / r.width) * hero.geo.w);
};
svg.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.buttons) aim(tFromEvent(e)); });
svg.addEventListener('pointerdown', (e) => aim(tFromEvent(e)));
svg.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') aim(T_NOW); });
scrub.addEventListener('input', () => { if (!hero.locked) hero.jump(+scrub.value >= MONTH_COUNT ? T_NOW : monthToT(+scrub.value)); });

new ResizeObserver(drawGraph).observe(svg);

/* ---------- skills: the receipt for each skill is its slice of the clock ---------- */
$$('.skill-group dl > div[data-roles]').forEach((d) => {
  d.insertAdjacentHTML('afterbegin', `<svg class="strip receipt" data-roles="${d.dataset.roles}" data-ink="dark" aria-hidden="true"></svg>`);
});

/* ---------- experience ---------- */
const fmt = ([y, m]) => `${MONTHS[m - 1].slice(0, 3)} ${y}`;
const range = (r) => (!r.start ? '<span class="placeholder-inline">Placeholder: dates not supplied yet</span>' : r.end ? (r.start[0] === r.end[0] && r.start[1] === r.end[1] ? fmt(r.start) : `${fmt(r.start)} to ${fmt(r.end)}`) : `<span class="now">${fmt(r.start)} to present</span>`);

$('.orgs').innerHTML = ORGS.map((o) => {
  const key = (r) => (r.start ? r.start[0] * 12 + r.start[1] : 1e9);
  const roles = ROLES.filter((r) => r.org === o.id).sort((a, b) => key(b) - key(a) || (a.end ? 1 : -1));
  return `<article class="org">
    <div class="org-head">
      <h3>${esc(o.name)}</h3>
      <p class="org-meta"><i style="background:${GROUPS[o.group].color}"></i>${o.total}${o.place ? `<br>${esc(o.place)}` : ''}</p>
      ${roles.some((r) => r.start) ? `<svg class="strip" data-org="${o.id}" role="img" aria-label="Where ${esc(o.name)} sits on the clock"></svg>` : ''}
    </div>
    <div class="org-body">
      ${roles.map((r) => `<div class="role" data-role="${r.id}">
        <h4>${esc(r.title)}</h4>
        <time>${range(r)}</time>
        ${r.figure ? `<p class="role-fig${r.lead ? ' lead' : ''}" style="--c:${GROUPS[r.group].color}"><b>${esc(r.figure[0])}</b><span>${esc(r.figure[1])}</span></p>` : ''}
        ${r.points ? `<ul>${r.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
      </div>`).join('')}
    </div>
  </article>`;
}).join('');

let strips = $$('.strip');
const drawStrips = () => strips.forEach((s) => {
  const b = s.getBoundingClientRect();
  if (b.width) renderStrip(s, Math.round(b.width), Math.round(b.height), s.dataset.roles ? { roles: s.dataset.roles.split(',') } : { org: s.dataset.org },
    s.dataset.ink === 'dark' ? { ink: '#0B0C0E', labels: false } : s.dataset.labels === 'off' ? { labels: false } : {});
});
const stripRO = new ResizeObserver(drawStrips);
stripRO.observe($('.orgs'));

// the role you are reading lights its own segment on the strip beside it
const roleIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    const strip = e.target.closest('.org').querySelector('.strip');
    if (!strip) continue;
    if (e.isIntersecting) strip.dataset.active = e.target.dataset.role;
    else if (strip.dataset.active === e.target.dataset.role) delete strip.dataset.active;
    strip.querySelectorAll('.lit').forEach((p) => p.classList.toggle('on', p.dataset.role === strip.dataset.active));
  }
}, { rootMargin: '-42% 0px -52% 0px' });
$$('.role').forEach((el) => roleIO.observe(el));

/* ---------- work ---------- */
const roleById = Object.fromEntries(ROLES.map((r) => [r.id, r]));
const plainRange = (a, b) => `${fmt(a.start)} to ${b.end ? fmt(b.end) : 'present'}`;
$('.work-track').innerHTML = WORK.map((w) => {
  const framed = !!w.slot;
  const compact = !w.figures.length && !framed;
  const gaps = (w.missing || []).map((m) => m.toLowerCase());
  const rs = w.roles.map((id) => roleById[id]).filter((r) => r && r.start);
  const clock = !rs.length ? '' : `<figure class="clock">
      <svg class="strip" data-roles="${w.roles.join(',')}" role="img" aria-label="Where ${esc(w.title)} sat on the clock"></svg>
      <figcaption>${esc(rs.map((r) => r.title.replace(', Global In-House Development Team', '')).join(', then '))}, ${plainRange(rs[0], rs[rs.length - 1])}</figcaption>
    </figure>`;
  const note = gaps.length ? `<p class="missing">Placeholder. Not supplied yet: ${gaps.join(', ')}.</p>` : '';
  const caption = !rs.length ? '' : `${esc(rs.map((r) => r.title.replace(', Global In-House Development Team', '')).join(', then '))}, ${plainRange(rs[0], rs[rs.length - 1])}`;
  const frame = framed ? `<figure class="frame">
      <p class="frame-bar">${w.link ? esc(w.link[0]) : esc(w.title)}</p>
      <div class="frame-body">
        <svg class="strip" data-roles="${w.roles.join(',')}" role="img" aria-label="Where ${esc(w.title)} sat on the clock"></svg>
      </div>
      <figcaption class="frame-cap">${caption}</figcaption>
    </figure>` : '';
  const figures = w.figures.length ? `<ul class="figures" style="--n:${w.figures.length}">${w.figures.map(([n, l]) => `<li><b>${n}</b><span>${esc(l)}</span></li>`).join('')}</ul>` : '';
  return `<article class="panel${compact ? ' compact' : ''}${framed ? ' framed' : ''}" style="--c:${GROUPS[w.group].color}">
  <div class="panel-main">
    <p class="panel-meta">${esc(w.role)}, ${esc(w.where)}${w.when ? `, ${esc(w.when)}` : ''}</p>
    <h3 class="${w.title.length > 14 ? 'long' : w.title.length <= 6 ? 'short' : ''}" style="--len:${Math.max(...w.title.split(' ').map((x) => x.length))}">${esc(w.title)}</h3>
    <div class="panel-body">${w.body.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
    ${w.link ? `<a class="panel-link" href="${w.link[1]}" target="_blank" rel="noopener">${w.link[0]}</a>` : ''}
    ${compact ? clock : ''}
    ${note}
  </div>
  ${compact ? '' : `<div class="panel-side">
    ${framed ? frame : clock}
    ${figures}
  </div>`}
</article>`;
}).join('');

strips = $$('.strip');
stripRO.observe($('.work-track'));
stripRO.observe($('.skills'));
$$('.panel .strip').forEach((s) => stripRO.observe(s));

/* ---------- nav ---------- */
const nav = $('.nav');
const toggle = $('.nav-toggle');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  toggle.textContent = open ? 'close' : 'menu';
});
$$('.nav nav a').forEach((a) => a.addEventListener('click', () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'menu'; }));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) toggle.click(); });

const solid = () => nav.classList.toggle('nav-solid', window.scrollY > 4);
window.addEventListener('scroll', solid, { passive: true });
solid();

// a chapter wipe that has covered the screen overrides the section underneath
hero.sectionTheme = 'dark';
hero.wipeTheme = null;
const GROUND = { dark: '#0B0C0E', light: '#EFEBE3', hot: '#FF4A1C' };
hero.applyTheme = () => {
  const t = hero.wipeTheme || hero.sectionTheme;
  nav.dataset.theme = t;
  // the page ground follows the chapter on screen, so a frame the compositor draws late never shows a dark seam
  document.documentElement.style.backgroundColor = document.body.style.backgroundColor = GROUND[t] || GROUND.dark;
};

// nav colour follows the section under it
const themed = $$('[data-theme]').filter((el) => el !== nav);
// chapters can overlap while one holds still under the next, so the last one in the band wins
const under = new Set();
const themeIO = new IntersectionObserver((entries) => {
  for (const e of entries) (e.isIntersecting ? under.add(e.target) : under.delete(e.target));
  const top = themed.filter((el) => under.has(el)).pop();
  if (top) hero.sectionTheme = top.dataset.theme;
  hero.applyTheme();
}, { rootMargin: '-28px 0px -96% 0px' });
themed.forEach((el) => themeIO.observe(el));

const links = Object.fromEntries($$('.nav nav a').map((a) => [a.getAttribute('href').slice(1), a]));
const spy = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) Object.entries(links).forEach(([id, a]) => (id === e.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
}, { rootMargin: '-40% 0px -55% 0px' });
Object.keys(links).forEach((id) => spy.observe(document.getElementById(id)));

/* ---------- motion ---------- */
if (!reduced) {
  const ready = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1800))]);
  Promise.all([import('./motion.js'), ready]).then(([m]) => m.initMotion(hero)).catch((err) => {
    console.error(err);
    document.documentElement.classList.add('ready');
  });
}
