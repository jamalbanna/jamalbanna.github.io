# Cook ledger: Jamal Banna portfolio

Started: 2026-11-16 10:28 EET
Time: cap 3h working time (waits on the user excluded)
Bar (1 to 10, all must reach 9): concept | typography | color | layout | motion | mobile | performance
Calibration offset: none yet
Usage: pace so the limit is not hit
Gate: concept pick [waiting] | static approved [no] | motion [not started]
Best so far: none

## Time log
- 10:28 start. Step 1 (concept and mockups).

## Decisions

Made without asking, one line each.
- 10:30 Using Profile.pdf as the fact source, because linkedin.pdf does not exist and Profile.pdf is the LinkedIn export.
- 10:30 photo.jpg is missing. Marked placeholder until the user adds it.
- 10:32 Mockups are rendered in code (HTML canvas, headless Chrome) instead of an image model, because the profile is private and a code render is an honest, reachable target.
- 10:32 "Country Manager" (experience entry) is used over "Country Director" (headline) until the user confirms.
- 10:32 Concurrency numbers (5 roles now, peak of 7) are computed from the PDF dates, and labelled as computed.

## User feedback inbox

Exact words. Close an item only when a still or clip proves it.

---

## Step 1: concept (no critic round, user gate)

Time: 10:28 to 10:38 | working time used about 0:10 of 3:00
Three directions mocked as code-rendered hero stills, 1600x1000:
- R01 Parallel: `cook/refs/R01-parallel.png` (source `cook/mockups/a-parallel.html`)
- R02 Headcount: `cook/refs/R02-headcount.png` (source `cook/mockups/b-headcount.html`)
- R03 Banna: `cook/refs/R03-banna.png` (source `cook/mockups/c-banna.html`)
Scores: not measured, no critics run on mockups.
Gate: waiting for the user's pick. Clock paused while waiting.
- 10:43 user picked "A, Parallel". Step 2 (static) starts.

## Step 2: static design (user gate)

Time: 10:43 to 10:50 | working time used about 17 min of 180
Built: Vite project, all six sections static (hero, about, skills, experience, work, contact). Playhead scrubbing works (pointer, touch, keyboard range input), no animation yet.
Stills: `cook/stills/s2/` (desktop-hero, desktop-full, phone-hero, phone-full)
Measured (cook/tools/shoot.mjs): horizontal overflow 0 px at 1440 and at 390. Console errors: none.
Scores: not measured, no critics run yet (critics run in step 3 rounds).
Decision: dev server runs from the shell (node vite.js) because the app's preview launcher hung with no output.
Gate: waiting for the user's approval of the static design. Clock paused while waiting.
- 11:21 user: "Approved, add motion". Step 3 starts. Working time used before this: about 17 min.

---

## Round 01 (motion, first critic pass)

Time: 11:21 to 11:36 | total working time about 32 min of 180
Focus: first full motion build, then score it.

Changes:
- WebGL ribbon hero (Three.js, custom GLSL): lit/ghost split at the playhead, pluck wave, travelling pulses, swell at the playhead.
- Intro sweep (skippable, once per session), Lenis, chapter wipes, heading mask reveals, lede word scrub, strip draw, pinned horizontal work, magnetic buttons, cursor, reduced motion path.

Stills: `cook/stills/r01/` (desktop-*, phone-*, critic-*.png sheets, criticC/ frames)

Scores, eyeballed: critic median (3 critics, fresh context: 2 Sonnet, 1 same model). No calibration offset (no user estimate yet).

| Shot | Concept | Typography | Color | Layout | Motion | Mobile | Performance |
|---|---|---|---|---|---|---|---|
| Whole site | 8 | 7 | 7 | 6 | 7 | 6 | 8 |

Raw critic scores: A 8/8/7/7/8/6/8, B 8/7/7/6/7/6/8, C 8/7/7/6/7/6/8
Own score (logged, never decides): 8/8/8/7/8/7/9

Measured (cook/tools/motion.mjs, Apple M1, Chrome with Metal):
- desktop 1440x900: intro 60 fps avg, p95 16.8 ms, 0 frames over 20 ms. Scrub the same. Full-page scroll the same.
- phone viewport 390x844 at 2x (emulated on the same Mac, not a real phone): 60 fps avg, 0 frames over 20 ms.
- horizontal overflow 0 px at both sizes. Console errors: none.
- reduced motion (cook/tools/a11y.mjs): no canvas, no Lenis, no cursor, no intro, SVG graph shown, work stacked.
- keyboard: tab order skip link, name, 5 nav links, 2 buttons, playhead slider, project link, LinkedIn. Arrow keys move the playhead.
- production build: entry JS 22.6 kB (8.4 kB gzip), CSS 19.8 kB, motion chunk 676.6 kB (186.8 kB gzip, lazy), fonts 90 + 38 kB.

Not checked this round:
- a real phone, Safari and Firefox. Only Chrome on macOS was run.

Top gaps from critics:
1. Nav is transparent and lands on top of content when it slides back in (desktop and phone).
2. Chapter wipe moves on two axes, shows chopped fragments and leaves a dead flat screen.
3. Pinned work: sparse panels with an empty lower half, titles offset from their column, too much travel.
4. Phone hero: taller than the screen, no legend, skip link collides, plain stacked work.
5. Hero hierarchy: name, count and graph compete, mono labels too small.
6. Below the hero the motion is a stock stack, not tied to the clock.

Stop check: bar no | cap not reached | static approved yes | -> next round
Next focus: mobile and layout (both 6), then motion tied to the clock.
- 11-17 06:56 resumed after the usage limit stopped the run on 11-16 at about 11:45 (round 2 critics all failed with HTTP 429). Working time used before resume: about 41 min. Decision: lighter critic setup from here (3 critics on the cheaper model, only one of them live).

## Round 02 (mobile, layout, clock-tied motion)

Time: 11-16 11:36 to 11:45, then 11-17 06:56 to 07:04 | total working time about 49 min of 180
Focus: mobile and layout (both 6 in round 1), then motion tied to the clock.

Changes:
- Nav: solid bar in the chapter colour, returns only after 90 px of upward travel, hidden while a wipe is crossing.
- Chapter change rebuilt: outgoing chapter holds still (sticky), a vermilion edge crosses carrying the chapter name, next chapter rises. On the hero the edge plucks the threads.
- Work: compact panels for small projects, titles in the project colour, title parallax removed, titles compress with scroll speed.
- Experience: organisation name and strip stay pinned, the role being read lights its own segment.
- Phone: legend chips, playhead handle, swipeable work track, skip button moved.
- Intro: faster through the quiet years, count rolls, threads ring on landing.

Stills: `cook/stills/r02/`

Scores, eyeballed: critic median (3 critics, fresh context, all Sonnet, one with live captures). No calibration offset.

| Shot | Concept | Typography | Color | Layout | Motion | Mobile | Performance |
|---|---|---|---|---|---|---|---|
| Whole site | 8 | 7 | 7 | 7 | 7 | 6 | 9 |

Raw critic scores: A 8/8/8/7/8/7/9, B 8/7/7/6/7/6/9, C 8/7/7/7/7/6/8
Change vs round 1: layout +1, performance +1, the rest equal.

Measured: 60 fps average at both sizes, at most 1 frame over 20 ms. Overflow 0 px. Console errors none.

Top gaps from critics:
1. Hero: chart should dominate, too many competing zones, small labels.
2. Work panels: dead gap between title and copy, placeholder boxes read as empty.
3. Phone hero graph too small, handle looked like a pause button.
4. Chapter title too small to read mid-wipe, heading reveal read as a glitch mid-frame.
5. About: placeholder too dominant.

Incident: the first attempt at this round's critics hit the 5-hour usage limit (HTTP 429) and stopped the run on 11-16.

## Round 03 (hero recomposed, work threads, phone hero)

Time: 11-17 07:04 to 07:18 | total working time about 62 min of 180
Focus: layout and mobile again, from the round 2 gaps.

Changes:
- Hero recomposed: chart at the top and taller with thicker threads, legend and buttons in one key row, intro line above the name, compact readout.
- About: heading and lede full width, smaller photo placeholder.
- Work: copy directly under the title, each panel shows its own thread on the clock with a caption, image boxes reduced to one marked line, content centred in the pinned screen.
- Phone hero: name first, 264 px chart, one-line scrolling legend, arrow handle.
- Wipe 40 percent longer with the chapter name sized to fit the screen. Headings uncovered by a small vermilion playhead.
- Keyboard: arrow keys on the playhead now land exactly one month per press.

Stills: `cook/stills/r03/` (critic-*.png sheets are built and ready)

Scores: NOT MEASURED. No critics were run on round 3. The 5-hour usage window was at 82 percent (get_usage, 11-17 07:17) and a critic round costs about 250k tokens, so running one risked a second limit stop.
Own score (logged, never decides): 8/8/8/8/8/8/9

Measured (cook/tools/motion.mjs, Apple M1, Chrome with Metal):
- desktop 1440x900: intro, scrub and full-page scroll all 60 fps average, 0 frames over 20 ms.
- phone viewport 390x844 at 2x (emulated on the Mac, not a real phone): 60 fps average, 0 frames over 20 ms.
- overflow 0 px at both sizes. Console errors none. Production build passes.

Not checked:
- round 3 critic scores, a real phone, Safari, Firefox.

Stop check: bar NOT met (last measured medians 8/7/7/7/7/6/9, target 9 each) | cap not reached (62 of 180 min) | usage near limit -> stop here and report.
Next focus if resumed: run the round 3 critics on `cook/stills/r03/critic-*.png`, then mobile and typography.
- 11-17 12:04 scheduled resume fired. get_usage: 5-hour window 0 percent. Model switched to Opus 5.5 by the user. Running round 3 critics.

## Round 03 scores (critics run 11-17 12:05, after the usage reset)

Scores, eyeballed: critic median (3 critics, fresh context, Sonnet, one with live captures). No calibration offset.

| Shot | Concept | Typography | Color | Layout | Motion | Mobile | Performance |
|---|---|---|---|---|---|---|---|
| Whole site | 8 | 7 | 7 | 6 | 7 | 6 | 8 |

Raw critic scores: A 8/7/7/6/8/7/8, B 8/7/7/6/7/6/8, C 8/7/7/6/7/6/8
Change vs round 2: layout -1, performance -1, the rest equal. Round 3 did not improve the scores.

Top gaps:
1. Hero bottom third crowded: intro line wedged about 20 px above the name, name about 55 px from the bottom edge.
2. Work screens lopsided: small screens placeholder, empty right and lower area.
3. Skills left column empty under each group title.
4. Phone nav sat over the scrolled hero name at the start of the first chapter change (confirmed real).
5. Heading reveal bar ended about 35 px right of a two-line heading (confirmed real).
Not a bug: critic C reported duplicated about content above skills; it was normal page flow (checked frames d_head_00 to 04).

## Round 04 (layout: hero spacing, framed work, skills grid)

Time: 11-17 12:05 to 12:20 | total working time about 77 min of 180
Usage: 5-hour window 12 percent at 12:15 (get_usage)
Focus: layout (6, weakest in all three critics).

Changes:
- Hero: legend back inside the chart's empty top-left, intro line moved into the key row beside the buttons, 44 px clear above the name, 64 px below it.
- Work: projects with missing screens get a 16:10 hatched frame on the right (labelled, no fake UI), stats in a 2x2 grid, each title sized to fit its own column with container query units, scroll length cut from 0.78 to 0.7 of the track.
- Skills: group title above a 3-column grid of skills on desktop, no empty left column.
- Phone nav solid from 4 px of scroll, leaves after 72 px.
- Heading reveal bar fades out over the last 14 percent of its travel.
- Regressions found and fixed within the round: a word-breaking rule split titles mid-word ("CUR / A"), and 4 stat columns overlapped.

Measured (cook/tools/motion.mjs, cook/tools/a11y.mjs, cook/tools/navcheck.mjs):
- desktop 1440x900 and phone viewport 390x844: 60 fps average, 0 frames over 20 ms. Overflow 0 px. Console errors none.
- phone nav: solid at 30 px, hidden at 120 px.
- keyboard: 14 arrow presses move the playhead exactly 14 months.

Scores: critics running.

## Round 04 scores (critics 11-17 12:16)

| Shot | Concept | Typography | Color | Layout | Motion | Mobile | Performance |
|---|---|---|---|---|---|---|---|
| Whole site | 8 | 7 | 7 | 6 | 7 | 7 | 8 |

Raw: A 8/7/7/6/8/7/8, B 8/7/7/6/7/6/8, C 8/8/7/7/7/7/8. Change vs round 3: mobile +1, the rest equal.
Checked critic C's bug reports against its own frames: intro flash of the final graph is REAL; "skills overlapping about" is normal page flow; nav returning "without a bar" is a carbon bar over carbon panels (bar and hairline visible in nav-1). Wipe crossing under one frame on a 2.5 s programmatic scroll: real weakness for fast scrolls.

## Round 05 (hero order, skill receipts, intro flash)

Time: 11-17 12:20 to 12:24 | total working time about 81 min of 180
Changes:
- Hero order: chart, then name and live count, then a hairline row with the intro line and buttons.
- Each skill shows its slice of the clock (the roles that back it, from the profile) as its receipt.
- Intro: graph and readout hidden until the sweep starts (no flash of the final state).
- Chapter wipe smoothed (scrub 0.6 s) so a fast flick still plays the crossing.
- Experience bullets lighter and more open, dates 12.5 px. Phone legend wraps to two lines.
Measured: desktop and phone viewport 60 fps average, 0 frames over 20 ms. Overflow 0 px. Console errors none.

## Round 05 scores (critics 11-17 12:24)

| Shot | Concept | Typography | Color | Layout | Motion | Mobile | Performance |
|---|---|---|---|---|---|---|---|
| Whole site | 8 | 7 | 7 | 7 | 7 | 7 | 8 |

Raw: A 8/7/7/7/8/7/8, B 8/7/7/6/7/6/8, C 8/8/8/7/7/7/8. Change vs round 4: layout +1. Nothing below 7 now.
Critic C (real wheel scrolling) found a REAL bug: work titles garbled mid-scroll. Cause: the speed effect changed font-stretch on every frame, forcing the whole 5000 px track layer to re-raster; tiles lagged. The fps measure missed it because frames still arrived on time.

## Round 06 (raster fix, centred work slides, readable receipts)

Time: 11-17 12:24 to 12:29 | total working time about 88 min of 180
Changes:
- Work titles compress with scaleX on their own layer instead of font-stretch: no re-raster while scrolling (checked with real mouse-wheel frames, cook/stills/r06/wheel-sheet.png: no garbling).
- Work slides centred vertically; frame smaller, each project's own thread taller.
- Skill receipts 96 px tall (64 on phones), thicker lit slice. Experience timeline 220 px, organisation names larger.
- Heading reveal bar collapses as it fades. Legend and year labels brighter.
Measured: desktop 1440x900 and phone viewport 60 fps average, at most 2 frames over 20 ms in the intro. Overflow 0 px. Console errors none.

## Round 06 scores (critics 11-17 12:30)

| Shot | Concept | Typography | Color | Layout | Motion | Mobile | Performance |
|---|---|---|---|---|---|---|---|
| Whole site | 8 | 7 | 7 | 6 | 8 | 7 | 8 |

Raw: A 8/7/7/6/8/7/8, B 8/7/7/6/7/6/8, C 8/7/7/7/8/7/8. Change vs round 5: motion +1, layout -1 (median), the rest equal.
Converging asks: skills grid reads as a card grid; mono labels under 13 px; three-line metadata above work titles acts as an eyebrow.

## Round 07 (skills as a table of receipts, 13 px mono floor)

Time: 11-17 12:29 to 12:33 | total working time about 92 min of 180
Changes:
- Skills on desktop: one row per skill, name left, its slice of the clock across the middle, proof right. Group headings larger.
- Every mono label at 13 px or more (graph labels, legend, dates, metadata, captions, placeholders, footer).
- Work metadata on one line in the project's colour. Work track fades at the right edge so a neighbour reads as a peek, not a clip.
- Hero name and count about 10 percent larger. Phone playhead handle larger.
Measured: desktop and phone viewport 60 fps average, at most 1 frame over 20 ms. Real wheel pass through work: no garbling (cook/stills/r07/wheel-sheet.png). Overflow 0 px. Console errors none.

## Round 07 scores (critics 11-17 12:33)

| Shot | Concept | Typography | Color | Layout | Motion | Mobile | Performance |
|---|---|---|---|---|---|---|---|
| Whole site | 8 | 8 | 7 | 7 | 8 | 7 | 9 |

Raw: A 8/8/7/7/8/7/9, B 8/7/7/6/8/7/8, C 9/8/8/7/8/7/9. Best round so far: typography +1, layout +1, performance +1 vs round 6.
Checked critic C's "nav does not return in the work pin": its frames were taken while the contact wipe was crossing, when the nav is hidden by design. Not a bug.

## Round 08 (colour discipline in work, legend clear of the date flag)

Time: 11-17 12:33 to 12:37 | total working time about 96 min of 180
Changes:
- Work stats in bone; only the title, the hairlines and the thread carry the project colour.
- Work metadata as one plain sentence in the body font (no slashed breadcrumb).
- Skill receipts: background lines twice as strong on cream.
- Hero legend moved down and under the graph layer, so the scrubbed date flag sits on top of it.
- Work track fade widened to 14vw.
Measured: desktop and phone viewport 60 fps average, at most 1 frame over 20 ms. Real wheel pass through work clean. Overflow 0 px. Console errors none.

## Round 08 scores (critics 11-17 12:38)

| Shot | Concept | Typography | Color | Layout | Motion | Mobile | Performance |
|---|---|---|---|---|---|---|---|
| Whole site | 8 | 7 | 7 | 7 | 8 | 6 | 9 |

Raw: A 8/7/7/7/8/7/9, B 8/7/7/6/8/6/9, C 8/7/7/7/8/6/8. Within one point of round 7 on every dimension: plateau.
Real issue found by critic C: on phones the scrubbed (lagging) wipe was covered by the rising chapter, so the edge showed as a stub. Not bugs: "lines vanish mid-intro" (a WebGL canvas captured between frames by the screenshot tool, SVG dots intact), "chapter word cropped" (the word travels with the edge by design).

## Round 09 (final fixes, no critic round)

Time: 11-17 12:38 to 12:42 | total working time about 101 min of 180
Changes: the edge finishes crossing before the next chapter rises (no overlap); no scroll lag on the wipe on phones; phone playhead handle moved below the year labels; Open Graph image regenerated from the final hero.
Measured: desktop 60 fps average, 0 frames over 20 ms; phone viewport 59 to 60 fps average, 3 frames over 20 ms in the intro. Overflow 0 px. Console errors none. Production build passes. Reduced motion and keyboard checks pass.

## Stop

Stop check: bar NOT met | cap not reached (about 101 of 180 min) | static approved yes | final checked yes (build, a11y, OG).
Decision: stopped iterating at a plateau. Over rounds 5 to 8 the critic medians moved within one point per dimension (best: round 7, 8/8/7/7/8/7/9), while each round's critics named different, often conflicting, fixes and repeatedly misread text sizes from scaled sheets. More rounds of the same critics are unlikely to reach 9; the user's own estimate is needed to calibrate.
Best so far: round 7 scores; current build = round 9 (round 7 plus fixes).
Gaps critics still name most often: hero bottom band composition, work slides led by empty screen placeholders, phone hero length and legend, mono label density.
- 11-17 12:55 user: "Keep refining" (no score estimate given, so no calibration offset). Round 10 starts.

## Round 10 (frames carry the thread, fewer mono labels)

Time: 11-17 12:56 to 13:05 | total working time about 110 min of 180 (the wait for the user's reply excluded)
Changes: each project's thread drawn large inside its screens frame with a one-line placeholder note; captions, facts and footer in the body font; phone legend in the body font, text-only menu and skip buttons; contact note as plain text.
Scores (3 critics, Sonnet, fresh context):

| Shot | Concept | Typography | Color | Layout | Motion | Mobile | Performance |
|---|---|---|---|---|---|---|---|
| Whole site | 8 | 7 | 7 | 7 | 8 | 7 | 8 |

Raw: A 8/7/8/7/8/7/8, B 8/7/7/6/7/7/8, C 8/8/7/7/8/7/8.
Real bug confirmed (critic C, then reproduced with cook/tools/bandwheel.mjs): during real wheel scrolling a 22 px dark seam showed at the top of the screen after the first chapter change. The DOM order was correct (cream chapter above the hero); the seam is the dark page ground showing through a late-composited frame.

## Round 11 (seam fix, frame-led work screens)

Time: 11-17 13:05 to 13:20 | total working time about 125 min of 180
Changes:
- Page ground (html and body) follows the chapter on screen. Measured with real wheel scrolling: dark rows at the top after the wipe went from 22 to 25 per frame to 0 (cook/stills/r10/bw-before vs bw-after). A shorter seam can still appear while the edge is mid-crossing.
- Work: the frame column is 8 of 12, the frame 48 to 56 vh tall; "7+1" without spaces; contact button larger; experience bullets capped at 40em.
Measured: desktop 60 fps average, 0 frames over 20 ms. Phone viewport intro 60 fps; full-page scroll 58 fps average with 1 frame over 20 ms (the run was slower overall). Overflow 0 px. Console errors none.

## Round 11 scores (critics 11-17 13:22, 2 of 3 reported before the cap)

| Shot | Concept | Typography | Color | Layout | Motion | Mobile | Performance |
|---|---|---|---|---|---|---|---|
| Whole site (A, B) | 8 | 7 | 7 | 6.5 | 7.5 | 6 | 8 |

Raw: A 8/7/7/7/8/6/8, B 8/7/7/6/7/6/8. Critic C still running at the stop.
Both scored mobile down citing "Jamal" hidden under the nav in phone-hero-rest.png. That frame came from a slow test run (other jobs loading the Mac). Re-checked: scrollY stays 0 for 5 s after load with and without the intro (cook/tools/scrollprobe.mjs), and a re-shot frame shows the full name below the nav (cook/stills/r11/recheck/, copied over the bad frame). The mobile score of round 11 is therefore not reliable; round 10's 7 is the last clean one.

## Stop (cap)

Total working time about 160 of 180 min (waits for the user excluded). Usage window at 51 percent at the last check.
Stop check: bar NOT met | cap reached in practice (the last critic round alone took 17 to 30 min) | static approved yes | final checked yes (build, a11y, OG regenerated).
Best medians: round 7, 8/8/7/7/8/7/9. Rounds 5 to 11 all within one point per dimension.

## Round 11, third critic and last fix (13:55 to 13:58)

Critic C: 8/8/8/7/8/6/8. Round 11 medians: 8/7/7/7/8/6/8 (mobile anchored on the bad phone frame, see above).
Real bug from C, fixed: after a fast scroll past a chapter change the wipe's "crossing" flag could stay on, so the nav never came back. The flag is now cleared when the wipe's trigger goes inactive and whenever the lagging animation settles. Checked with cook/tools/navreturn.mjs (fast flick through two chapter changes, then 400 px back up): nav returns, solid, at top 0.
Final desktop run: see cook/stills/final/. Total working time about 165 of 180 min.

## Content update (11-18, from Jamal's message)

- Global In-House Development Team shown as one thread: CURA Project Manager (2025, with Women in STEM, the ML matching platform and education management alongside), then Automation Project Manager (2026: CV generator, IM consultant for 100+ countries). The separate "Project Manager" line is gone.
- Head of the Information Management Subcommittee: JD summarised to 3 points; CAD 280,000 Global Information Systems fund shown as the largest figure in experience, and in the about text and skills table.
- New descriptions: AST (MERN intern), AUB (TA, 70 students; 5 Excel labs in CMPS 208), Do360 (lead developer on 4 modules; mentored 10), Ethics Subcommittee chair, National Director of Technology (top 4 of 101), National Director of Talent Management (4 to 60 members).
- DevNov added (co-founder, CTO and CFO). No start date yet, so it is listed with a placeholder and kept off the clock. The hero now counts 4 roles today; it becomes 5 once DevNov has a date.
- Research: no public source found for AUB CMPS 208 or for AIESEC in Lebanon's Ethics Subcommittee JD, so those roles use Jamal's own words only.
- Work: added "Do360 modules" and "DevNov" panels; Women in STEM and Exchange matching dated 2025, CV generator 2026.
- Checks: desktop 60 fps, 0 frames over 20 ms; no console errors on desktop or phone; keyboard check passes; build passes.

## Content update 2 (11-19)

- Photo: background removed on-device with macOS Vision (cook/tools/cutout.swift), cropped 4:5, served as public/jamal.webp (38 kB). Shown on the dark ground with today's threads behind it.
- Contact: jamalbanna01@gmail.com as the main button, LinkedIn beside it; email also in the JSON-LD. Placeholder note removed.
- Title: "Head of Information Management Subcommittee, Global".
- Do360 first year: worked on the same four modules.
- AUB: course named as CMPS 271.
- Country Manager: two scope lines from the general MCP role (national board, local presidents, strategy, representation), no achievements.
- Matching platform and CV generator: no name requested, so the "project name" placeholder is gone.
- Not done: DevNov start year (user said "September", year unconfirmed); Women in STEM capture (womeninstem.aiesec.net does not resolve: DNS NXDOMAIN on 11-19).
- Checks: desktop and phone 60 fps, no console errors, overflow 0, keyboard check and build pass.

## Content update 3 (11-19)

- DevNov dated September 2026 ("September 2026", user). Now on the clock; hero counts 5 roles today.
- User: no screenshots. Work frames are now permanent thread panels (solid border in the project colour, no hatch, no "no screens yet" note). "Screens" removed from DevNov's missing list.
- Checks: desktop and phone 60 fps, 0 frames over 20 ms, no console errors, overflow 0, hero count 5 on both sizes, build passes.
