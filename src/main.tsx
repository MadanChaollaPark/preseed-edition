import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";

import { GridEngine } from "grid-engine";
import { AUTO, Scale, Game as PhaserGame } from "phaser";

import { UI } from "./ui/UI";
import BootScene from "./scenes/BootScene";
import WorldScene from "./scenes/WorldScene";
import BattleScene from "./scenes/BattleScene";
import { GAME_HEIGHT, GAME_WIDTH } from "./constants/game";

import "./styles.css";
import { Loading } from "./ui/components/Loading";
import { TitleScreen } from "./ui/components/TitleScreen";
import { CharacterSelect } from "./ui/components/CharacterSelect";
import { useUIStore } from "./stores/ui";
import { useUserDataStore } from "./stores/userData";

export const GameComponent = () => {
  const [game, setGame] = useState<PhaserGame>(null);
  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  const { loading } = useUIStore();
  const userData = useUserDataStore();

  useEffect(() => {
    if (!gameContainerRef.current) {
      return;
    }

    const phaserGame = new PhaserGame({
      parent: gameContainerRef.current,
      type: AUTO,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
      },
      scene: [BootScene, WorldScene, BattleScene],
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: true,
        },
      },
      plugins: {
        scene: [
          {
            key: "gridEngine",
            plugin: GridEngine,
            mapping: "gridEngine",
          },
        ],
      },
      pixelArt: true,
    });

    setGame(phaserGame);

    return () => {
      phaserGame.destroy(true);
    };
  }, []);

  const founderPath = userData.founderPath ?? "Undeclared";
  const rosterCount = userData.pokemons.length;
  const dayCount = 21 + userData.crisesResolved * 3 + Math.min(rosterCount, 6);
  const demoDayLabel = userData.demoDayWon
    ? "DEMO DAY CLEARED"
    : `DEMO DAY IN ${Math.max(1, 7 - userData.crisesResolved * 2)}`;
  const tickerLabel = [
    "RUNWAY $42K",
    `DAY ${dayCount}`,
    founderPath.toUpperCase(),
    `ROSTER ${rosterCount}/6`,
    `FOUNDER WINS ${userData.crisesResolved}/3`,
    demoDayLabel,
  ].join("  ·  ");

  return (
    <div className="signalStage">
      {loading && <Loading />}
      <div className="signalStage__viewport">
        <div className="signalStage__letterbox signalStage__letterbox--top">
          <span className="signalStage__ticker">{tickerLabel}</span>
        </div>
        <div className="signalStage__ambient" aria-hidden="true" />
        <div className="signalStage__screen">
          <div className="signalStage__screenGlow" aria-hidden="true" />
          <div id="game" ref={gameContainerRef} />
          {game && <UI game={game} />}
          <div className="signalStage__scanlines" aria-hidden="true" />
          <div className="signalStage__glass" aria-hidden="true" />
        </div>
        <div className="signalStage__letterbox signalStage__letterbox--bottom" />
      </div>

      <TitleScreen />
      <CharacterSelect />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<GameComponent />);
