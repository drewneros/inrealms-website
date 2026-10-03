# Gates: realm rebuild of the homepage below the hero

OWNS: index.html, scripts/verify-rebuild.mjs, GATES.md, sitemap.xml

Scope: every section below #portal rebuilt in the realm style (services, work, process, reviews, about, faq, book, footer, nav), copy humanized and international, SEO meta and schema current, verified live on desktop and phone.

- [x] G1: old sections and the fake localStorage review form are gone
  CHECK: node scripts/verify-rebuild.mjs removed
  EXPECT: REMOVED-OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=447330f17ac0/19 entries; output=REMOVED-OK

- [x] G2: new sections exist in story order, footer present
  CHECK: node scripts/verify-rebuild.mjs order
  EXPECT: ORDER-OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=447330f17ac0/19 entries; output=ORDER-OK

- [x] G3: no Sydney anywhere on the homepage (Drew: works internationally)
  CHECK: node scripts/verify-rebuild.mjs nosydney
  EXPECT: NOSYDNEY-OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=447330f17ac0/19 entries; output=NOSYDNEY-OK

- [x] G4: zero em dashes in index.html
  CHECK: node scripts/verify-rebuild.mjs nodash
  EXPECT: NODASH-OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=447330f17ac0/19 entries; output=NODASH-OK

- [x] G5: SEO: one h1, h2 per section, title/description sized and websites-first, schema parses, FAQ schema matches page, no self-serving rating
  CHECK: node scripts/verify-rebuild.mjs seo
  EXPECT: SEO-OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=447330f17ac0/19 entries; output=SEO-OK

- [x] G6: every local asset exists, all 5 real project links present, no dead in-page anchors
  CHECK: node scripts/verify-rebuild.mjs assets
  EXPECT: ASSETS-OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=447330f17ac0/19 entries; output=ASSETS-OK (14 local assets)

- [x] G7: headless desktop 1280 and phone 390: no JS errors, no sideways overflow, every reveal fires
  CHECK: node scripts/verify-rebuild.mjs live
  EXPECT: LIVE-OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/drewneros/inrealms-website; path=447330f17ac0/19 entries; output=LIVE-OK

- [x] G8: /code-review run on the diff, serious findings fixed
  EVIDENCE: /code-review medium on 9f92a76~1..HEAD, 1 finding (reduced-motion desktop hid work cards 2-5), fixed in 60c51ff, verified all 5 cards inside 1440px viewport

- [x] G9: Drew watched the recorded video of the full page
  EVIDENCE: Drew in chat 3 Oct 2026: "ok watched it, merge and deploy"
