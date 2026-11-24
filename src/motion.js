import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { Ribbons } from './ribbons.js';
import { T_NOW, T_FIRST } from './graph.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const root = document.documentElement;
const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const phone = window.matchMedia('(max-width: 700px)').matches;
const GAP = 0.85; // length of a chapter wipe, in viewport heights

export function initMotion(hero) {
  hero.animated = true;
  const nav = $('.nav');

  /* ---------- smooth scroll ---------- */
  const lenis = new Lenis({ lerp: 0.105, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // the nav leaves on the way down and only returns after a deliberate scroll back up
  let upTravel = 0, lastY = 0, wiping = false;
  const navState = () => nav.classList.toggle('nav-away', (wiping || (lastY > (phone ? 72 : 240) && upTravel < 90)) && !nav.classList.contains('open'));
  lenis.on('scroll', ({ scroll }) => {
    const d = scroll - lastY;
    upTravel = d < 0 ? upTravel - d : 0;
    lastY = scroll;
    navState();
  });

  /* ---------- WebGL ribbons ---------- */
  const box = $('.hero-graph');
  try {
    const canvas = document.createElement('canvas');
    canvas.className = 'ribbons';
    canvas.setAttribute('aria-hidden', 'true');
    box.prepend(canvas);
    hero.ribbons = new Ribbons(canvas, { lite: phone });
    box.classList.add('gl');
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); box.classList.remove('gl'); hero.ribbons = null; });
  } catch (err) {
    hero.ribbons = null;
    box.classList.remove('gl');
    $('.ribbons')?.remove();
  }
  hero.redraw();

  /* ---------- kinetic name: its width follows the clock, letter by letter ---------- */
  const nameSplit = SplitText.create('.hero-name', { type: 'lines,chars', mask: 'lines', linesClass: 'line', charsClass: 'char' });
  const chars = nameSplit.chars;
  const widths = chars.map(() => 125);
  const stretchName = () => {
    const p = Math.min(1, Math.max(0, (hero.t - T_FIRST) / (T_NOW - T_FIRST)));
    const want = 96 + 29 * p;
    for (let i = 0; i < chars.length; i++) {
      const next = widths[i] + (want - widths[i]) * (0.2 - (i / chars.length) * 0.13);
      if (Math.abs(next - widths[i]) > 0.04) { widths[i] = next; chars[i].style.fontStretch = `${next.toFixed(1)}%`; }
    }
  };

  // the count rolls when it changes
  const countEl = $('.readout-count b');
  hero.onCount = () => gsap.fromTo(countEl, { yPercent: 26, opacity: 0.35 }, { yPercent: 0, opacity: 1, duration: 0.28, ease: 'power3.out', overwrite: true });

  /* ---------- frame loop ---------- */
  let heroOn = true;
  ScrollTrigger.create({ trigger: '.hero', start: 'top bottom', end: 'bottom top', onToggle: (s) => { heroOn = s.isActive; } });
  gsap.ticker.add((time) => {
    if (!heroOn) return;
    hero.step();
    stretchName();
    if (hero.ribbons) hero.ribbons.render(time);
  });

  /* ---------- intro: the playhead sweeps the whole clock once ---------- */
  const seen = (() => { try { return sessionStorage.getItem('intro') === '1'; } catch { return false; } })();
  const curtain = phone ? ['.nav'] : ['.nav', '.hero-key', '.hero-intro'];
  root.classList.add('ready');
  if (seen) {
    hero.jump(T_NOW);
  } else {
    hero.locked = true;
    hero.jump(T_FIRST);
    chars.forEach((c, i) => { widths[i] = 96; c.style.fontStretch = '96%'; });
    const skip = document.createElement('button');
    skip.className = 'skip-intro';
    skip.type = 'button';
    skip.textContent = 'skip intro';
    document.body.append(skip);
    const proxy = { t: T_FIRST };
    const done = () => {
      hero.locked = false;
      hero.jump(T_NOW);
      if (hero.ribbons) hero.ribbons.pluck = hero.ribbons.maxPluck || 8; // the threads ring when the playhead lands on today
      skip.remove();
      window.removeEventListener('wheel', finish);
      window.removeEventListener('touchmove', finish);
      window.removeEventListener('keydown', onKey);
      try { sessionStorage.setItem('intro', '1'); } catch { /* private mode */ }
    };
    const tl = gsap.timeline({ onComplete: done });
    function finish() { tl.progress(1); }
    function onKey(e) { if (e.key === 'Escape' || e.key === 'Tab' || e.key === 'Enter') finish(); }
    gsap.set(curtain, { opacity: 0 });
    // quick through the quiet years, slow through the years where everything branches
    tl.from(nameSplit.lines, { yPercent: 104, duration: 0.9, ease: 'power4.out', stagger: 0.09 }, 0)
      .to(proxy, { t: 2023.0, duration: 0.6, ease: 'power1.in', onUpdate: () => hero.jump(proxy.t) }, 0.1)
      .to(proxy, { t: T_NOW, duration: 2.1, ease: 'power2.out', onUpdate: () => hero.jump(proxy.t) }, 0.7)
      .to(skip, { opacity: 0, duration: 0.25 }, 2.1)
      .to(curtain, { opacity: 1, duration: 0.55, ease: 'power1.out', stagger: 0.09, clearProps: 'opacity' }, 2.3);
    skip.addEventListener('click', finish);
    window.addEventListener('wheel', finish, { passive: true });
    window.addEventListener('touchmove', finish, { passive: true });
    window.addEventListener('keydown', onKey);
  }

  /* ---------- film wipes between chapters ----------
     The outgoing chapter holds still (sticky), a hard edge crosses the screen like the playhead,
     and the next chapter rises into the colour it left behind. One axis at a time. */
  const main = $('main');
  main.classList.add('film');
  const stuck = [$('.hero'), $('.chapter.light'), $('.chapter.dark')];
  const setStick = () => stuck.forEach((el) => el.style.setProperty('--stick', `${Math.min(0, window.innerHeight - el.offsetHeight)}px`));
  setStick();
  new ResizeObserver(setStick).observe(main);

  [['.chapter.light', 'light', 'About'], ['.chapter.dark', 'dark', 'Experience'], ['.contact', 'hot', 'Contact']].forEach(([sel, theme, label], i) => {
    const el = $(sel);
    const wipe = document.createElement('div');
    wipe.className = `wipe ${theme}`;
    wipe.setAttribute('aria-hidden', 'true');
    // the title is sized so the whole word is on screen while the edge is still crossing
    wipe.innerHTML = `<i></i><b style="font-size:min(18vw, ${(62 / (label.length * 0.74)).toFixed(1)}vw)">${label}</b>`;
    wipe.style.zIndex = 2 + i * 2;
    el.style.zIndex = 3 + i * 2;
    el.before(wipe);
    // the edge finishes crossing before the next chapter starts to rise, so nothing covers it
    const sweep = GAP / (1 + GAP);
    const state = { p: 0 };
    gsap.timeline({
      scrollTrigger: {
        trigger: el, start: `top ${(1 + GAP) * 100}%`, end: 'top top', scrub: phone ? true : 0.6,
        onToggle: (s) => {
          wipe.style.visibility = s.isActive ? 'visible' : 'hidden';
          if (!s.isActive && wiping) { wiping = false; navState(); } // never leave the nav held after leaving a chapter change
          if (!s.isActive && hero.wipeTheme === theme) { hero.wipeTheme = null; hero.applyTheme(); }
        },
        onUpdate: () => {
          const mid = state.p > 0.015 && state.p < 0.985;
          if (mid !== wiping) { wiping = mid; navState(); }
          const covered = state.p >= 0.985 ? theme : null;
          if (covered) hero.wipeTheme = theme; else if (hero.wipeTheme === theme) hero.wipeTheme = null;
          hero.applyTheme();
          // on the hero the edge is the playhead: it plucks every thread it crosses
          if (i === 0 && hero.ribbons && hero.geo) {
            const r = box.getBoundingClientRect();
            hero.ribbons.uniforms.uEdgeX.value = ((state.p * window.innerWidth - r.left) / r.width) * hero.geo.w;
            hero.ribbons.uniforms.uEdgePluck.value = mid ? hero.ribbons.maxPluck * 0.85 : 0;
          }
        },
      },
    }).fromTo(state, { p: 0 }, { p: 1, duration: sweep, ease: 'power1.inOut', onUpdate: () => {
      wipe.style.setProperty('--p', state.p.toFixed(4));
      // the scrub can still be catching up after the scroll has stopped: keep the nav state honest here too
      const mid = state.p > 0.015 && state.p < 0.985;
      if (!mid && wiping) { wiping = false; navState(); }
    } })
      .to({}, { duration: 1 - sweep });
  });

  /* ---------- headings are uncovered left to right, the way the playhead reads ---------- */
  $$('h2').forEach((h) => {
    const inner = document.createElement('span');
    inner.className = 'h2-in';
    while (h.firstChild) inner.append(h.firstChild);
    const edge = document.createElement('i');
    edge.className = 'h2-edge';
    edge.setAttribute('aria-hidden', 'true');
    h.append(inner, edge);
    // a small playhead runs across the heading and uncovers it
    gsap.fromTo(h, { '--r': 0 }, {
      '--r': 1, duration: 0.95, ease: 'power3.inOut',
      scrollTrigger: { trigger: h, start: 'top 86%', once: true },
      onComplete: () => h.classList.add('is-in'),
    });
  });

  /* ---------- about: the lede is read at scroll speed ---------- */
  SplitText.create('.lede', {
    type: 'words', autoSplit: true,
    onSplit: (self) => gsap.fromTo(self.words, { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.06, scrollTrigger: { trigger: '.lede', start: 'top 84%', end: 'bottom 52%', scrub: true } }),
  });

  /* ---------- experience: each organisation's threads draw themselves on its strip ---------- */
  $$('.org').forEach((org) => {
    ScrollTrigger.create({
      trigger: org, start: 'top 80%', once: true,
      onEnter: () => {
        $$('.strip .lit', org).forEach((p) => {
          const len = p.getTotalLength();
          gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', onComplete: () => gsap.set(p, { clearProps: 'strokeDasharray,strokeDashoffset' }) });
        });
        gsap.from($$('.strip .lit-end', org), { opacity: 0, duration: 0.3, delay: 1.3 });
      },
    });
  });

  /* ---------- work: pinned, travels sideways like the clock ---------- */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1021px) and (min-height: 600px)', () => {
    const work = $('.work'), pin = $('.work-pin'), track = $('.work-track'), bar = $('.work-progress i');
    work.classList.add('is-h');
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    // titles compress with speed and relax to full width at rest, the same device as the name
    // scaleX on each title's own layer: nothing inside the track is redrawn while it moves
    const titles = $$('.panel h3', track);
    let sx = 1, wantS = 1;
    const relax = () => {
      wantS += (1 - wantS) * 0.08;
      const next = sx + (wantS - sx) * 0.16;
      if (Math.abs(next - sx) > 0.0015) { sx = next; for (const t of titles) t.style.transform = `scaleX(${sx.toFixed(4)})`; }
      else if (sx !== 1 && Math.abs(1 - sx) < 0.0015) { sx = 1; for (const t of titles) t.style.transform = ''; }
    };
    gsap.ticker.add(relax);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: pin, start: 'top top', end: () => `+=${dist() * 0.7}`, pin: true, scrub: true, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (s) => {
          bar.style.transform = `scaleX(${s.progress})`;
          wantS = 1 - Math.min(0.16, Math.abs(s.getVelocity()) / 14000);
        },
      },
    });
    $$('.panel', track).forEach((panel) => {
      const side = $('.panel-side', panel);
      if (side) gsap.fromTo(side, { x: 140 }, { x: 0, ease: 'none', scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left right', end: 'left 14%', scrub: true } });
    });
    return () => { work.classList.remove('is-h'); gsap.ticker.remove(relax); titles.forEach((t) => { t.style.transform = ''; }); gsap.set(track, { clearProps: 'transform' }); };
  });

  /* ---------- contact: the open thread draws toward the visitor ---------- */
  const threadPaths = $$('.contact-thread path');
  gsap.fromTo(threadPaths[0], { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top 75%', end: 'top 15%', scrub: true } });
  gsap.fromTo(threadPaths[1], { opacity: 0 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top 35%', end: 'top 5%', scrub: true } });

  if (fine) {
    /* ---------- magnetic buttons ---------- */
    const mags = $$('.btn').map((el) => ({ el, x: gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.45)' }), y: gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.45)' }), on: false }));
    window.addEventListener('pointermove', (e) => {
      for (const m of mags) {
        const r = m.el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > window.innerHeight + 100) continue;
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const reach = Math.max(r.width, r.height) * 0.5 + 46;
        if (Math.hypot(dx, dy) < reach) { m.on = true; m.x(dx * 0.34); m.y(dy * 0.42); } else if (m.on) { m.on = false; m.x(0); m.y(0); }
      }
    }, { passive: true });

    /* ---------- cursor: a small playhead ---------- */
    const cur = document.createElement('div');
    cur.className = 'cursor';
    cur.setAttribute('aria-hidden', 'true');
    document.body.append(cur);
    root.classList.add('has-cursor');
    const cx = gsap.quickTo(cur, 'x', { duration: 0.2, ease: 'power3.out' }), cy = gsap.quickTo(cur, 'y', { duration: 0.2, ease: 'power3.out' });
    window.addEventListener('pointermove', (e) => {
      cx(e.clientX); cy(e.clientY);
      const t = e.target;
      const overGraph = !!t.closest?.('.graph');
      cur.classList.toggle('is-off', overGraph);
      cur.classList.toggle('is-link', !overGraph && !!t.closest?.('a, button'));
      cur.classList.add('is-live');
    }, { passive: true });
    document.addEventListener('pointerleave', () => cur.classList.remove('is-live'));
    window.addEventListener('pointerdown', () => cur.classList.add('is-down'));
    window.addEventListener('pointerup', () => cur.classList.remove('is-down'));
  }

  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  window.__lenis = lenis;
}
