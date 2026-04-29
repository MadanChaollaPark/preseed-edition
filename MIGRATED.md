# Migrated from `pokemon-js`

This repo is a fork of [`jvnm-dev/pokemon`](https://github.com/jvnm-dev/pokemon),
chosen for its TypeScript + Phaser + Vite stack and FireRed/LeafGreen-era
GBA assets (full color, instead of the 4-shade Game Boy era of the older
`chase-manning/pokemon-js` we started from).

The earlier project was at `MadanChaollaPark/pokemon-js` (chase-manning fork).

## What came over from the old project

| What | Where it lives now | Status |
|---|---|---|
| Mystic Woods 2.2 raw asset pack | `/mystic-woods-raw` | unwired |
| Player sprite slicer (`slice-mystic-player.py`) | `/scripts/slice-mystic-player.py` | unwired (paths updated) |

## What did NOT carry over

- The old `TitleScreen.tsx` (styled-components keyframes) — we recreate the
  same animation pattern fresh against the new project's React+CSS layer
  rather than dragging styled-components in.
- The 16-frame sliced character sprites — the new project uses Phaser
  sprite sheets, so the slicer's per-frame output format does not apply.
- The baked map PNGs — the new project ships Tiled JSON + tilesets, which
  is a strict upgrade.

## Pre-Seed Edition theme

This game is being reskinned thematically as a "founder grinding pre-seed"
game for the ElevenLabs hackathon — see commits tagged `D11..D16`. The
mechanical loop stays Pokemon; the strings, names, and art chrome get a
startup overlay. Voice (ElevenLabs) is the differentiator (see `E:` commits).
