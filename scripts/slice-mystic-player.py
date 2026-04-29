#!/usr/bin/env python3
"""Slice the Mystic Woods player sheet into 16 directional frames.

Source: mystic-woods-raw/sprites/characters/player.png  (288x480, 6x10 grid of 48x48)
Output: mystic-woods-raw/sliced/{front,back,left,right}-{still,walk-1,walk-2,walk-3}.png  (32x32)

NOTE: Carried over from the old pokemon-js project. The new project (jvnm-dev/pokemon)
uses Phaser sprite sheets at public/assets/images/characters/, not individual frames —
this slicer is not yet wired into the build. Kept as a tool for future use.

Layout per Mystic Woods read_me (0-indexed rows):
  row 0: idle down   row 1: idle up   row 2: idle right
  row 3: move down   row 4: move up   row 5: move right
Left-facing frames are produced by horizontally flipping the right-facing frames.
"""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "mystic-woods-raw/sprites/characters/player.png"
OUT = ROOT / "mystic-woods-raw/sliced"
OUT.mkdir(exist_ok=True)

FRAME = 48
TARGET = 32
WALK_COLS = (0, 2, 4)


def main() -> None:
    sheet = Image.open(SRC).convert("RGBA")

    def cell(row: int, col: int) -> Image.Image:
        box = (col * FRAME, row * FRAME, (col + 1) * FRAME, (row + 1) * FRAME)
        return sheet.crop(box).resize((TARGET, TARGET), Image.NEAREST)

    flip = lambda im: im.transpose(Image.FLIP_LEFT_RIGHT)

    frames = {
        "front-still": cell(0, 0),
        "back-still": cell(1, 0),
        "right-still": cell(2, 0),
    }
    frames["left-still"] = flip(frames["right-still"])

    for i, c in enumerate(WALK_COLS, start=1):
        frames[f"front-walk-{i}"] = cell(3, c)
        frames[f"back-walk-{i}"] = cell(4, c)
        frames[f"right-walk-{i}"] = cell(5, c)
        frames[f"left-walk-{i}"] = flip(frames[f"right-walk-{i}"])

    for name, img in frames.items():
        img.save(OUT / f"{name}.png")
        print(f"wrote {name}.png")


if __name__ == "__main__":
    main()
