import { Game } from "phaser";
import { useEffect, useState } from "react";

import { isUIOpen } from "../utils/ui";
import { useUIStore } from "../stores/ui";
import { useWindowSize } from "./hooks/useWindowSize";
import { Menu } from "./components/Menu";
import { Dialog } from "./components/Dialog";
import { Battle } from "./components/Battle";

export type UIBase = {
  game: Game;
};

export const UI = ({ game }: UIBase) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const windowSize = useWindowSize();
  useUIStore();

  useEffect(() => {
    const syncCanvasSize = () => {
      const canvas = document.getElementsByTagName("canvas")?.[0];
      if (!canvas) {
        return;
      }

      setSize({
        width:
          canvas.clientWidth ||
          Number(canvas.style?.width.replace("px", "")) ||
          canvas.width,
        height:
          canvas.clientHeight ||
          Number(canvas.style?.height.replace("px", "")) ||
          canvas.height,
      });
    };

    syncCanvasSize();
    const frame = window.requestAnimationFrame(syncCanvasSize);

    return () => window.cancelAnimationFrame(frame);
  }, [windowSize]);

  return (
    <div
      id="ui"
      style={{
        display: isUIOpen() ? "block" : "none",
        width: size.width,
        height: size.height,
      }}
    >
      <Menu />
      <Dialog />
      <Battle game={game} />
    </div>
  );
};
