#!/usr/bin/env node
// Gate checker for the THRESHOLD redesign.
// Usage: node scripts/verify-gates.mjs <GATE_ID> [file]
// Prints "<GATE_ID> OK" and exits 0 only when every assertion passes.

import { readFileSync } from 'node:fs';

const [, , gate, fileArg] = process.argv;
const file = fileArg || 'index.html';
const src = readFileSync(file, 'utf8');

// The :root block only, so legacy usages further down the file do not count.
const rootBlock = (src.match(/\n {4}:root \{[\s\S]*?\n {4}\}/) || [''])[0];

// Surface/neutral tokens are not accents; exclude them by role, not by guessing.
const NEUTRALS = new Set([
  '#07080c', '#0c0e14', '#edeff5', '#8a8f9c',
  '#e9e9e6', '#16171a', '#6b6e73', '#ffffff',
]);

const fail = (msg) => { console.error(`${gate} FAIL: ${msg}`); process.exit(1); };
const pass = (detail) => { console.log(`${gate} OK${detail ? ' — ' + detail : ''}`); process.exit(0); };

const checks = {
  G1() {
    const accents = [...new Set(
      (rootBlock.match(/#[0-9A-Fa-f]{6}/g) || []).map((h) => h.toLowerCase())
    )].filter((h) => !NEUTRALS.has(h));
    if (accents.length > 3) fail(`${accents.length} accents: ${accents.join(' ')}`);
    pass(`${accents.length} accents: ${accents.join(' ')}`);
  },

  G2() {
    const bad = (src.match(/border-radius:\s*[0-9]+px/g) || [])
      .filter((d) => !/:\s*(0|9999)px/.test(d));
    if (bad.length) fail(`${bad.length} radii outside {0px, 9999px}`);
    pass('all radii are 0px or 9999px');
  },

  G3() {
    const n = (src.match(/box-shadow/g) || []).length;
    if (n) fail(`${n} box-shadow references remain`);
    pass('zero box-shadows');
  },

  G5() {
    if (!/id="act-earth"/.test(src)) fail('no #act-earth section');
    if (!/earth-stage/.test(src)) fail('#act-earth has no sticky stage');
    pass('Act 1 present with sticky stage');
  },

  G7() {
    if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(src)) fail('external font request present');
    if (!/InstrumentSerif-Regular\.woff2/.test(src)) fail('self-hosted display face not referenced');
    pass('display face self-hosted, no external font request');
  },

  G8() {
    if (/widget\/otl\//.test(src)) fail('un-frameable /widget/otl/ booking URL present');
    if (!/widget\/booking\/mjnDWooafoxdJ0pIueQF/.test(src)) fail('booking widget URL missing');
    pass('booking widget intact');
  },

  G9() {
    if (!/G-CD1X5MQWJD/.test(src)) fail('GA4 tag missing');
    if (!/application\/ld\+json/.test(src)) fail('JSON-LD missing');
    if (!/rel="canonical"/.test(src)) fail('canonical missing');
    pass('GA4, JSON-LD and canonical all present');
  },

  G11() {
    if (!/prefers-reduced-motion/.test(src)) fail('no reduced-motion handling');
    if (!/#act-earth\s*\{\s*display:\s*none/.test(src.replace(/\s+/g, ' ').replace(/ \{ /g, ' { ')))
      fail('reduced-motion does not disable Act 1');
    pass('Act 1 disabled under prefers-reduced-motion');
  },
};

if (!checks[gate]) fail(`unknown gate "${gate}"`);
checks[gate]();
