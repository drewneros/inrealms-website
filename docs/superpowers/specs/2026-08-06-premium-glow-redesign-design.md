# InRealms homepage — premium glow redesign

## Goal
Elevate the existing static `index.html` (dark theme, indigo accent, no motion) into a premium-feeling site that converts client leads, without turning it into generic "AI slop." Reusable as a playbook for other agency client sites later.

## Direction (approved)
Hybrid: quiet glass/grain base everywhere (Framer-agency reference) + ONE signature animated glow technique carried through two touchpoints (hero + CTA buttons), not scattered across the whole page.

## The glow technique
Pure CSS, `@property --a { syntax: '<angle>'; initial-value: 0deg; inherits: false }` + `@keyframes spin { to { --a: 360deg } }`, rotating a `conic-gradient(from var(--a), ...)`. Sourced and verified against Ania Kubow's IG reel (the exact CSS was read frame-by-frame off her screen recording).

**Two applications:**
1. **Hero background** — large blurred conic-gradient (indigo → pink, transparent gaps), animates BOTH rotation (14s) and position drift (22s, ease-in-out, one consistent direction, never resets). Sets tone on load, stays subtle (blur 50px, low opacity).
2. **CTA buttons** — thin 1px ring (not a thick blob), same indigo→pink sweep, plus a bright white "shine" stop (approved v3) so it reads as a glint of light catching the edge, not just a color fade. 3-4s rotation, faster than hero since it's a small element.

Rejected: thick/blurred button border (v1), plain color sweep with no shine (v2 alt) — user picked v3 (shine) explicitly.

## Icons
- **Phosphor Icons** (MIT, self-hosted at `libs/phosphor-icons/regular/`, 224KB woff2+css, zero build step) — general iconography.
- **Potlab Icons** (free, pure SVG, copy-paste per icon as needed) — for any spot wanting a small animated icon.
- Skipped: animate-ui, itshover, lucide-animated, skiper-ui, watermelon-platform — all require React/shadcn + a build step; this site is plain static HTML with no bundler. Not migrating frameworks as a side effect of an icon choice.

## Reused asset
`libs/liquid-glass-js` already in the repo (pulled Jul 8, never wired in) — vanilla JS glass-morphism buttons/containers. Fits the "glass base" half of the direction directly, no new install.

## Figures
One or more small glass geometric shapes (rotated rounded square, per Profico/Decentra references) as accent elements near the hero or between sections — restrained, not a full icon garden.

## Scope for first pass
- Hero section: drifting glow background + glass card treatment.
- All CTA buttons site-wide: shine ring treatment.
- 1-2 glass geometric figures placed as accents.
- Wire in `liquid-glass-js` where it fits (e.g. feature cards).
Everything else on the page stays as-is for this pass — no full rebuild.

## Out of scope (this pass)
- Any React/shadcn component library (framework mismatch).
- swishy.ai (AI video generation tool, not a component library, not reused).
- Full-page redesign beyond hero + CTAs + accents.

## Reusability note
Drew wants to remember/reuse this exact technique (rotating `@property` conic-gradient glow, glass base, Phosphor+Potlab icons) as a standard playbook for other agency client sites.
