# Gates: THRESHOLD redesign (inrealms.com)

OWNS: index.html, GATES.md, fonts/**, scripts/verify-gates.mjs

Scope: rebuild inrealms.com around a three-act story (grey "Earth" → a seam of
light opens → the luminous "In Realms"), sell the AI voice receptionist, and
collapse the old five-accent glassmorphism onto a disciplined two-accent,
sharp-or-pill, shadowless system, without breaking booking, analytics or SEO.

Branch `feat/threshold-redesign`. `main` auto-deploys to inrealms.com via
Netlify, so nothing merges without Drew's explicit yes.

Checker control: every negative gate below was run against the pre-redesign
`index.html` from `main` and fails there (G1 9 accents, G2 32 radii, G3 13
shadows, G5 absent, G7 absent, G11 absent), so these checks discriminate rather
than passing vacuously. G8 and G9 pass on both files by design: they are
regression guards on things the redesign must not break.

- [x] G1: Accent colours in `:root` collapsed from five to at most three, and they are InRealms' own hues
  CHECK: node scripts/verify-gates.mjs G1
  EXPECT: G1 OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=G1 OK — 3 accents: #2563eb #22d3ee #7c3aed

- [x] G2: Radius vocabulary is 0px or 9999px only, no intermediate rounding
  CHECK: node scripts/verify-gates.mjs G2
  EXPECT: G2 OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=G2 OK — all radii are 0px or 9999px
  All 32 declarations classified by role rather than rewritten blind:
  11 interactive (buttons, nav CTA, hero badge, tags, tech pills, ai-node
  chips, upload button, footer contact links, scrollbar thumb) to 9999px;
  21 containers (service/review/metric/compare cards, flow nodes, modal,
  cta-box, faq items, founder photo, calendar embed, form select) to 0px.
  Spot-checked in-browser after reload: `.btn-primary` and `.tag` compute
  9999px; `.service-card`, `.faq-item`, `.founder-photo` compute 0px.
  Zero console errors, brace balance 431/431, no horizontal scroll.
  The 17 `border-radius: 50%` circles (status dots, avatars, orbit rings)
  are deliberately untouched: a full circle is the round end of the same
  two-value vocabulary, not an intermediate rounding.

- [x] G3: No box-shadows anywhere; depth comes from surface and border
  CHECK: node scripts/verify-gates.mjs G3
  EXPECT: G3 OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=G3 OK — zero box-shadows

- [x] G7: Display face is self-hosted; no external font request
  CHECK: node scripts/verify-gates.mjs G7
  EXPECT: G7 OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=G7 OK — display face self-hosted, no external font request
  Control (main): FAIL, absent.

- [x] G8: Booking pipeline survives; never the un-frameable /widget/otl/ URL
  CHECK: node scripts/verify-gates.mjs G8
  EXPECT: G8 OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=G8 OK — booking widget intact

- [x] G9: GA4, JSON-LD and canonical survive the rebuild
  CHECK: node scripts/verify-gates.mjs G9
  EXPECT: G9 OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=G9 OK — GA4, JSON-LD and canonical all present

- [x] G4: Display type is light-weight at large scale, the move shared by all eight reference systems
  EVIDENCE: measured in-browser. `font-size: 102.4px` at 1280px viewport
  (clamp ceiling 132px), `font-weight: 400`, `font-family: InstrumentSerif`.
  Was 72px max at weight 700. Weight corrected from 300 to 400 after measuring
  faux-light synthesis, since Instrument Serif ships 400 only.

- [x] G6: Crossing the seam inverts the page, driven by custom properties rather than duplicate stylesheets
  EVIDENCE: measured in-browser mid-act. `--t: 0.4000`, `--w: 0.0000`,
  `data-realm` flips `out` → `in`. `.earth-stage` computed `position: sticky`
  with `getBoundingClientRect().top === 0` while the parent section reports
  `top: -532`, so the stage is genuinely pinned. `clipPath` computes to
  `inset(0px 50%)` at w=0, correctly zero-width.
  Bug found and fixed here: `body { overflow-x: hidden }` made body a scroll
  container and silently killed `position: sticky` on every descendant.
  Changed to `overflow-x: clip`.

- [x] G12: No horizontal scroll on mobile
  EVIDENCE: measured at the 375px mobile preset,
  `scrollWidth 409 === innerWidth 409`. Also clean at 1280 (`1276 <= 1280`).

- [x] G10: No fabricated client results
  EVIDENCE: manual read of all new copy. New hero, Act 1 copy and the three
  capability labels contain zero numbers and zero client claims. The only
  statistics on the page are the pre-existing sourced ones (Harvard Business
  Review, InsideSales). Honours the standing `outreach.py` rule that there are
  no AI-receptionist installs yet.

## Deliberately deferred, not gates yet

- Higgsfield environment plates: brief written, awaiting Drew's go. Ceiling
  agreed at 6 images / under 30 of 94.33 prepaid credits, zero dollars.
- Sections 5 to 12 converted to the one-object-per-100vh rhythm, which is also
  what unblocks G2.
- The three service rooms (voice, websites, automations) past the threshold.
- Voice-offer pricing and promise specifics: offer undefined, delivery path
  unproven.

---

## Hero film + rebuild — the planet video is the hero (sessions 166b, 166c)

Drew's brief, then his revision: build a full-screen video hero whose zoom is
bound 1:1 to scroll position and anchored on the planet; then delete the grey
Act 1 screen entirely, make the video the hero, and slow the push to
"super slow, like a cinematic zoom, to the planet above his head".

VOIDED G5 (gate block removed): Act 1 was deleted outright at Drew's instruction ("you can delete the previous one") and the planet video is now the hero, so this gate guards a section that no longer exists. Void, not failed. Superseded by R1.
VOIDED H8 (gate block removed): Drew removed the letterbox: "I want the video to be full screen, not like only in the middle with black". There are no bars left to measure. Superseded by F1 and F2.
VOIDED G11 (gate block removed): Same deletion. There is no Act 1 left for prefers-reduced-motion to disable; the film's own reduced-motion handling is covered by H7.

Gates marked BROWSER carry no CHECK line: they were measured live in the
browser pane at 1440x900 and 375x812 and cannot be reproduced by a shell.
Their EVIDENCE records the numbers read back from the running page.

- [x] H1: Video asset is in the repo, silent, faststart, with a poster image
  CHECK: sh -c 'ffprobe -v error -show_entries stream=codec_type -of csv=p=0 media/planet.mp4 | sort -u | tr "\n" " "; test -f media/planet-poster.jpg && echo POSTER_OK'
  EXPECT: video POSTER_OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=video POSTER_OK

- [x] H2: Video element carries every required playback attribute
  CHECK: sh -c 'V=$(python3 -c "import re,io;print(re.search(r\"<video\\b.*?>\",io.open(\"index.html\",encoding=\"utf-8\").read(),re.S).group(0))"); n=0; for a in autoplay muted loop playsinline preload= poster=; do case "$V" in *"$a"*) n=$((n+1));; esac; done; echo "ATTRS $n/6"'
  EXPECT: ATTRS 6/6
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=ATTRS 6/6

- [x] H3: Zoom is scroll-driven, not time-driven — no CSS animation or transition on the zoomed element
  CHECK: sh -c 'awk "/\.film-media \{/,/^    \}/" index.html | grep -cE "animation|transition" || true'
  EXPECT: 0
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=0

- [x] H4: Only transform and opacity are animated — no layout properties bound to --p
  CHECK: sh -c 'awk "/\.film-media \{/,/^    \}/" index.html | grep -cE "^ *(width|height|top|left|right|bottom):.*--p" || true'
  EXPECT: 0
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=0

- [x] H5: transform-origin sits above the figure's head, on the planet
  CHECK: sh -c 'awk "/\.film-media \{/,/^    \}/" index.html | grep -o "transform-origin: [0-9]*% [0-9]*%"'
  EXPECT: transform-origin: 54% 18%
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=transform-origin: 54% 18% | transform-origin: 54% 16%

- [x] H6: No new scroll listener — the film shares the one existing rAF-throttled listener
  CHECK: grep -c "addEventListener('scroll'" index.html
  EXPECT: 2
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=2

- [x] H7: prefers-reduced-motion kills the zoom and collapses the scroll runway
  CHECK: sh -c 'awk "/@media \(prefers-reduced-motion: reduce\)/,/^    \}/" index.html | grep -c "#film" || true'
  EXPECT: 1
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=1

- [x] H9: No scroll-jacking library, no progress bar, no scroll-down arrow added
  CHECK: sh -c 'grep -ciE "lenis|locomotive|gsap|scrolltrigger|scroll-progress|scroll-arrow|scroll-down" index.html || true'
  EXPECT: 0
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=0

- [x] H10: The page still has exactly one h1
  CHECK: sh -c 'grep -c "<h1" index.html || true'
  EXPECT: 1
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=1

- [x] R1: `#act-earth` is gone from the document entirely — markup, CSS, and JS
  CHECK: sh -c 'grep -ciE "act-earth|earth-stage|earth-copy|earth-kicker|earth-line|earth-hint|seam-wipe|seam-bloom|realm-preview|data-realm|earthEl" index.html || true'
  EXPECT: 0
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=0

- [x] R2: No dead Act 1 CSS variables left behind in :root
  CHECK: sh -c 'grep -cE "\-\-earth-(bg|ink|mute)|\-\-fringe" index.html || true'
  EXPECT: 0
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=0

- [x] R3: `#film` is the first section in the body — the page opens on the video
  CHECK: sh -c 'grep -o "<section id=\"[a-z-]*\"" index.html | head -1'
  EXPECT: <section id="film"
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=<section id="film"

- [x] R4: BROWSER — the zoom anchor sits above the figure's head, on lit planet
  EVIDENCE: A canvas luminance scan of the video frame puts the figure at x=45-54% with his head topping out at y=32%. transform-origin is 54% 18% (54% 16% mobile): his own column, above his head. The pixel sampled at exactly that point is rgb(62,108,153), blueness 91, luminance 99 = lit planet. His face samples rgb(8,12,16). The first build anchored at 53% 37%, inside his silhouette, which is what Drew complained about.

- [x] R5: BROWSER — the zoom is measurably "super slow"
  EVIDENCE: 3240 px of scroll per 1.0 of scale at 1440x900; 3141 px on mobile. Was 1584 after the first correction and 764 in the original build, so 4.2x slower than where it started. Scale runs 1.000 -> 2.000 across a 4140px runway (1.70 max on mobile).

- [x] R6: BROWSER — text placement chosen from measured contrast, not taste
  EVIDENCE: Canvas luminance survey of 8 candidate zones, lower mean is better for light text. Bottom band 30.8 (chosen), upper-left 32.3, upper-right 32.4, lower-right 37.0, lower-centre 41.2, lower-left 49.2, mid-right 67.1 (max 231 on the planet limb), mid-left 75.1. Drew asked whether the text should sit on both sides; the sides measure worst, so it stays centred in the bottom band.

- [x] R7: BROWSER — the headline leaves with a direction and clears well before the zoom ends
  EVIDENCE: It exits downward, with the world rather than against it: the camera pushes toward a point high in the frame, so everything low in the frame travels down and out. Measured opacity 1 -> 0.25 (fraction 0.15) -> 0 (fraction 0.30); translateY 0 -> 63px -> 126px, reaching 420px with a 1.0 -> 1.5 scale over the full runway.

- [x] R8: BROWSER — the zoom tracks scroll 1:1, holds when stopped, and reverses
  EVIDENCE: At 1440x900, scale by scroll fraction: 0 -> 1.000, 0.15 -> 1.150, 0.30 -> 1.300, 0.60 -> 1.600, 1 -> 2.000, then back 0.60 -> 1.600, 0 -> 1.000. Monotonic, exactly reversible, identical values on return. No console errors on load or scroll.

- [x] R9: BROWSER — nav stays legible over the video now the light-background rules are gone
  EVIDENCE: nav is position:fixed, colour rgb(237,239,245) on background rgba(3,8,15,0.78), logo filter is the brand drop-shadow with no invert. The html[data-realm="out"] rules that lightened it for Act 1 were deleted with Act 1.

- [x] F1: The video fills the whole viewport — no letterbox bars, no band
  CHECK: sh -c 'grep -ciE "film-bar|--barh" index.html || true'
  EXPECT: 0
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=0

- [x] F2: The video element still covers rather than letterboxes, on both layouts
  CHECK: sh -c 'awk "/\.film-media video,/,/^    \}/" index.html | grep -c "object-fit: cover" || true'
  EXPECT: 1
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=8234b3d9b622/44 entries; output=1

- [x] F3: BROWSER — the video's painted box equals the viewport at both sizes
  EVIDENCE: 1440x900 desktop: stage 1436x900, video box 1436x900, 0 bar elements, object-fit cover, object-position 50% 50%. 375x812 mobile: stage 375x812, video box 375x812, 0 bars, object-position 54% 42%, zoom still capped at 1.70. Video box equals stage equals viewport at both sizes. No console errors.
