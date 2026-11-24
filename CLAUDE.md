# Jamal Banna portfolio: project handoff

This file carries the full context of the build so any Claude session (on any account) can pick it up. Read it first, then `cook/BRIEF.md` and the end of `cook/ROUNDS.md`.

## What this is

A personal portfolio site for Jamal Banna. Concept: **"Parallel"**. Every role Jamal has held since 2020 is a line on one shared clock. The hero is a WebGL graph of those lines with a playhead the visitor scrubs; the live count says how many roles were running at that moment ("5 roles running at the same time" today). The same timeline is reused everywhere: each skill, organisation and project shows its own slice of it.

Status (2026-11-24): built, approved, deployed to GitHub Pages; waiting on the is-a.dev domain request.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs dist/
npm run preview    # serves dist/ on :4173
```

The desktop app's preview launcher hung once with `npm run dev`; `.claude/launch.json` runs `node node_modules/vite/bin/vite.js --port 5173 --strictPort` directly, which works. Running the same command from a shell also works.

## Stack

Vite 8 + vanilla JS. Three.js (custom GLSL) for the hero ribbons, GSAP + ScrollTrigger + SplitText, Lenis smooth scroll. Fonts self-hosted through npm: Archivo Variable (width axis used heavily, `font-stretch` 62 to 125%) and Martian Mono. No CDNs at runtime.

## Files

| Path | Holds |
|---|---|
| `index.html` | All static markup: SEO, Open Graph, JSON-LD, hero, about, skills table, contact. |
| `src/data.js` | **All facts.** Roles (with dates, lanes, points, optional big `figure`), organisations, education, work projects, `NOW`. |
| `src/graph.js` | Timeline geometry, SVG hero graph, playhead, small "strip" timelines. |
| `src/ribbons.js` | Three.js ribbons with GLSL: lit/ghost split at the playhead, pluck wave, pulses, edge pluck during the first wipe. |
| `src/main.js` | Builds experience and work from data, playhead input (mouse, touch, keyboard range input), nav, theme following, role highlighting. |
| `src/motion.js` | Lazy-loaded motion layer: Lenis, intro sweep, chapter wipes, heading reveals, pinned horizontal work, magnetic buttons, cursor. |
| `src/style.css` | All styles. Later rounds are appended at the bottom (`/* ---------- round N ... */`), so later rules win. |
| `public/jamal.webp` | Jamal's photo, background removed, 4:5. Original is `photo.jpg` in the root. |
| `public/og.png` | 1200x630 share image, made from a hero screenshot. |
| `Profile.pdf` | Jamal's LinkedIn export, the original fact source. |
| `cook/BRIEF.md`, `cook/ROUNDS.md`, `cook/SHOTS.md` | Brief, full round-by-round ledger with scores, decisions, measurements. |
| `cook/refs/` | The three concept mockups (R01 Parallel was picked). `cook/mockups/` has their HTML sources. |
| `cook/tools/` | Test and capture scripts (below). |
| `cook/stills/final/` | Final screenshots. Older round stills were left out of the handoff zip (200 MB). |
| `.claude/skills/cook/` | Copy of the "cook" skill used to run this project (build, stills, fresh critics, fix loop). |

## Design system

- Colours: carbon `#0B0C0E`, bone `#EFEBE3`, vermilion `#FF4A1C` (accent, wipes, contact chapter), amber `#FFB81A` (AIESEC global team), ice `#8FD8FF` (software engineering), steel `#7C828B` (Burger King). Line colour = organisation group, everywhere.
- Chapters: hero dark, about + skills bone, experience + work dark, contact vermilion. Chapters are sticky; a vermilion edge crosses the screen carrying the next chapter's name, then the next chapter rises.
- Type: Archivo extra-wide 800 for display, Archivo for body (16 to 18.5 px), Martian Mono only for data (dates, axis, legend) at 13 px minimum.
- Slop ban (from Jamal's brief): no purple/blue gradient blobs, glowing buttons, glassmorphism, identical rounded card grids with soft shadows, emoji icons, all-caps eyebrow labels, fake 01/02/03 numbering, fade-up on every element, generic copy, Inter only. Also no em dashes and no beige.
- Must keep: 60 fps, simpler effects on phones, `prefers-reduced-motion` respected (no WebGL, no Lenis, no intro, static SVG graph, stacked work), keyboard accessible, SEO and OG tags.

## Rules for content (important)

- **Never invent** numbers, companies, clients or results. Facts come only from `Profile.pdf` or from what Jamal writes in chat. Missing things get a clearly marked placeholder.
- The comment at the top of `src/data.js` records this. When Jamal adds facts, put them in `data.js` (and in the matching skills row in `index.html` if relevant).
- A role with `start: null` stays off the clock and shows "Placeholder: dates not supplied yet".
- `NOW` in `src/data.js` is hard-coded to `[2026, 11]`. Update it when the month changes, or the "today" end of the clock and the hero count go stale.

### Facts Jamal added in chat (not in Profile.pdf)

- Global In-House Development Team (AIESEC) was one role with a different scope each year. 2025: CURA Project Manager, plus Women in STEM site, the ML matching platform and education manager alongside. 2026: Automation Project Manager (designed and led the CV generator; Information Management Consultant for national offices in 100+ countries).
- Title to use: "Head of Information Management Subcommittee, Global". It governs the Global Information Systems fund of **CAD 280,000**, which must be the most prominent figure (it is the biggest number in experience, and bold in about and skills). The JD was summarised to three lines on purpose.
- AST: Full-stack Web Developer Intern, MERN stack. Nothing more to add for now.
- AUB: teaching assistant for CMPS 271 (software engineering): led sprint ceremonies, mentored 70 students. Lab instructor for 5 Excel labs in CMPS 208 for business students. (No public course descriptions were found.)
- Do360: worked on the finance, HR and personnel, payroll, and team collaboration modules from the first year; lead developer on them as Senior Software Engineer; led and mentored 10 interns and employees over two years, not all at once.
- Chair of the Ethics Subcommittee: ethics education and resolving the cases raised. Nothing more specific.
- National Director of Technology: started the information management department of AIESEC in Lebanon, built systems and automations, upskilled 8 members, Lebanon in the top 4 of 101 national offices in information management.
- National Director of Talent Management: 4 to 60 active members, processes and SOPs, culture, 100+ applicants interviewed, 30+ advanced, national trainings.
- Country Manager (MCP): Jamal is new; only two neutral scope lines (leads the national board and local committee presidents; turns global strategy into national direction and represents Lebanon). Add achievements later when he gives them.
- DevNov: co-founder, CTO and CFO, since September 2026. Products: garage management app, ERP for a sweets business, trading and learning system.
- Matching platform and CV generator: keep them unnamed.
- Contact email (public on the site): jamalbanna01@gmail.com. LinkedIn: https://www.linkedin.com/in/jamal-banna
- Women in STEM site: https://womeninstem.aiesec.org/ (the old .net address is dead).
- No "results" placeholders on projects: Jamal said drop them.
- No project screenshots: Jamal decided against them. Work panels show each project's own timeline in a frame instead.
- Photo: background removed on-device with macOS Vision (`cook/tools/cutout.swift`).

## Open items

1. Domain: `jamal.is-a.dev` requested in is-a-dev/register PR #62757 (https://github.com/is-a-dev/register/pull/62757, from fork jamalbanna/register, branch `jamal`; CNAME to jamalbanna.github.io). When it is merged: set the Pages custom domain to `jamal.is-a.dev` (`gh api -X PUT repos/jamalbanna/jamalbanna.github.io/pages -f cname=jamal.is-a.dev`) and tick Enforce HTTPS. Do not set it before the merge.
2. Country Manager achievements, when Jamal has them. Current lines are general MCP scope, from public AIESEC national compendiums.
3. Skills table has no languages/frameworks row: Jamal said leave it out for now.
4. Not tested yet: a real phone, Safari, Firefox.

## Deployment

Public repo https://github.com/jamalbanna/jamalbanna.github.io (renamed from `portfolio` so it serves at https://jamalbanna.github.io), GitHub Pages via Actions (`.github/workflows/deploy.yml`), every push to `main` deploys. Custom domain not set yet (see open item 1). Push over HTTPS (SSH key is not set up on this Mac). `.gitignore` keeps `Profile.pdf`, `photo.jpg`, `cook/stills/` and the zip out of the public repo.

## Quality history

Critic scores (median of three fresh-context critics, 1 to 10; target was 9 on every dimension, never reached):

| Round | Concept | Typography | Color | Layout | Motion | Mobile | Performance |
|---|---|---|---|---|---|---|---|
| 1 | 8 | 7 | 7 | 6 | 7 | 6 | 8 |
| 7 (best) | 8 | 8 | 7 | 7 | 8 | 7 | 9 |
| 10 | 8 | 7 | 7 | 7 | 8 | 7 | 8 |

Scores plateaued from round 5 on; critics kept naming different fixes and misread text sizes from scaled contact sheets. Measured: 60 fps average on desktop and phone viewport, 0 frames over 20 ms in most runs. Entry JS about 25 kB; the 678 kB motion/WebGL chunk loads after first paint.

## Testing tools (`cook/tools/`, need Google Chrome at `/Applications/Google Chrome.app` and the dev server on :5173)

- `node cook/tools/motion.mjs <outDir> desktop|phone`: intro, scrub, section stills and fps numbers, overflow and console errors.
- `node cook/tools/wheel.mjs <outDir>`: real mouse-wheel frames through the pinned work section (catches raster lag that fps numbers miss).
- `node cook/tools/a11y.mjs <outDir>`: reduced-motion state and keyboard tab order / arrow-key playhead.
- `node cook/tools/sections.mjs <outDir>`: experience blocks at desktop and phone, plus console errors.
- `node cook/tools/navreturn.mjs`: fast flick through chapter changes, then scroll up; nav must return.
- `python3 cook/tools/sheet.py <dir> <out.png> <desktop|phone> <cols> <scale> name1 name2 ...`: contact sheets for review.
- `xcrun swift cook/tools/cutout.swift <in.jpg> <out.png>`: background removal (macOS only).

## Lessons from this build (do not repeat)

- Pace usage: before a round of critic subagents, check the usage window and skip or shrink the round above about 70 percent. On 2026-11-16 three parallel critics hit the 5-hour limit and stopped the run. Use at most three critics on the cheaper model, only one doing live browser captures.
- Changing `font-stretch` on every frame inside the pinned work track forced the whole track to re-raster and garbled titles mid-scroll. Use `transform: scaleX` on each title's own layer instead (already done).
- A dark seam showed above the about chapter during wheel scrolling; the fix is that `html` and `body` background follow the chapter on screen (`hero.applyTheme` in `main.js`).
- The wipe's "crossing" flag must be cleared when its trigger goes inactive, or the nav never returns after a fast scroll (fixed in `motion.js`).
- Screenshots taken while the Mac is busy can show stale frames (one showed the name under the nav). Re-shoot before believing a regression.
- Jamal writes in short, direct messages and expects decisions to be made, with the reasoning stated plainly afterwards.
