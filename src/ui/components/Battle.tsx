import { useEffect, useState } from "react";

import { UIBase } from "../UI";
import { Audios } from "../../constants/assets";
import { UIEvents } from "../../constants/events";
import { crisisActions, CrisisAction } from "../../constants/founderTheme";
import { useEventsListeners } from "../../utils/events";
import { getAudioConfig } from "../../utils/audio";
import { openDialog } from "../../utils/ui";
import { useUIStore } from "../../stores/ui";
import { useUserDataStore } from "../../stores/userData";

const actionCopy: Record<CrisisAction, string> = {
  [CrisisAction.PITCH]:
    "Reframe the story, calm the room, and buy yourself one more shot.",
  [CrisisAction.SHIP]:
    "Push the practical fix, reduce the blast radius, and keep momentum alive.",
  [CrisisAction.CATCH]:
    "Take the swing. If the fit is right, send the offer and make the catch.",
  [CrisisAction.RETREAT]:
    "Preserve runway, step back, and live to pitch another week.",
};

const signalBars = [16, 32, 22, 46, 28, 40, 20, 34, 18];

export const Battle = ({ game }: UIBase) => {
  const UIStore = useUIStore();
  const [selectedAction, setSelectedAction] = useState<CrisisAction>(
    CrisisAction.PITCH,
  );

  const exitBattle = () => {
    game.sound.stopAll();
    game.sound.play(Audios.PALLET_TOWN, getAudioConfig());
    game.scene.stop("Battle").start("World", {
      facingDirection: void 0,
      startPosition: void 0,
    });
    useUIStore.getState().clearBattleCopy();
  };

  const resolveVictory = (message: string) => {
    const userData = useUserDataStore.getState();
    const nextResolvedCount = userData.crisesResolved + 1;
    const demoDayWon = nextResolvedCount >= 3;

    userData.update({
      crisesResolved: nextResolvedCount,
      demoDayWon,
    });

    openDialog({
      content: `ANNOUNCER: ${message};
      ${
        demoDayWon
          ? "PG: That is three real founder wins. Your roster is ready and Demo Day is yours.;JUDGE: Clear story. Real traction. You earned your spot.;ANNOUNCER: Founder Red cleared Demo Day!"
          : `ANNOUNCER: Crisis cleared. ${nextResolvedCount} of 3 founder wins secured.`
      }`,
      callback: () => {
        exitBattle();
      },
    });
  };

  const resolveAction = (action: CrisisAction) => {
    if (UIStore.dialog.isOpen) {
      return;
    }

    if (action === CrisisAction.RETREAT) {
      openDialog({
        content:
          "ANNOUNCER: You pulled back to preserve runway.;Sometimes survival is the only winning move this week.",
        callback: () => exitBattle(),
      });
      return;
    }

    if (action === CrisisAction.CATCH) {
      const userData = useUserDataStore.getState();

      if (userData.pokemons.length >= 6) {
        openDialog({
          content:
            "PG: Your roster is full.;Make room before you try to catch another startup monster.",
        });
        return;
      }

      if (
        !UIStore.battle.encounterPokemonId ||
        !UIStore.battle.encounterPokemonName ||
        !UIStore.battle.encounterRole
      ) {
        return;
      }

      userData.addPokemon(UIStore.battle.encounterPokemonId);
      resolveVictory(
        `Offer accepted. You caught ${UIStore.battle.encounterPokemonName}, the ${UIStore.battle.encounterRole}.`,
      );
      return;
    }

    if (action === UIStore.battle.recommendedAction) {
      resolveVictory(
        UIStore.battle.successCopy ??
          "You solved the crisis and kept the company alive.",
      );
      return;
    }

    openDialog({
      content: `ANNOUNCER: ${UIStore.battle.failureCopy ?? "The crisis slipped through your hands."};
      ANNOUNCER: Regroup, sharpen the plan, and try the market again.`,
      callback: () => exitBattle(),
    });
  };

  useEventsListeners(
    [
      {
        name: UIEvents.EXIT,
        callback: () => {
          if (UIStore.battle.isOpen && !UIStore.dialog.isOpen) {
            exitBattle();
          }
        },
      },
      {
        name: UIEvents.UP,
        callback: () => {
          if (!UIStore.battle.isOpen || UIStore.dialog.isOpen) {
            return;
          }

          setSelectedAction((current) => {
            const currentIndex = crisisActions.indexOf(current);
            return (
              crisisActions[currentIndex - 1] ??
              crisisActions[crisisActions.length - 1]
            );
          });
        },
      },
      {
        name: UIEvents.DOWN,
        callback: () => {
          if (!UIStore.battle.isOpen || UIStore.dialog.isOpen) {
            return;
          }

          setSelectedAction((current) => {
            const currentIndex = crisisActions.indexOf(current);
            return crisisActions[currentIndex + 1] ?? crisisActions[0];
          });
        },
      },
      {
        name: UIEvents.NEXT_STEP,
        callback: () => {
          if (!UIStore.battle.isOpen || UIStore.dialog.isOpen) {
            return;
          }

          resolveAction(selectedAction);
        },
      },
    ],
    [UIStore.battle, UIStore.dialog.isOpen, selectedAction],
  );

  useEffect(() => {
    if (UIStore.battle.isOpen) {
      setSelectedAction(CrisisAction.PITCH);
    }
  }, [UIStore.battle.isOpen, UIStore.battle.title]);

  const threatRank =
    ((UIStore.battle.encounterPokemonId ?? 0) % 5) + 1;
  const recommendation = UIStore.battle.recommendedAction ?? CrisisAction.PITCH;

  return (
    <div
      className="battle_menu"
      style={{
        display: UIStore.battle.isOpen ? "block" : "none",
      }}
    >
      <div className="battle_menu__grid">
        <div className="battle_menu__signalCard">
          <div className="battle_menu__label">Audio threat model</div>
          <div className="battle_menu__silhouette">
            <div className="battle_menu__figure" aria-hidden="true">
              <div className="battle_menu__figureHead" />
              <div className="battle_menu__figureBody" />
            </div>
            <div className="battle_menu__signalBars">
              {signalBars.map((height, index) => (
                <span
                  key={`${height}-${index}`}
                  style={{
                    height,
                    animationDelay: `${index * 0.07}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="battle_menu__meta">
            <span>Signal class</span>
            <strong>{UIStore.battle.encounterRole ?? "Unknown threat"}</strong>
          </div>
          <div className="battle_menu__meta">
            <span>Threat rank</span>
            <strong>{`T-${threatRank}`}</strong>
          </div>
        </div>

        <div className="battle_menu__brief">
          <div className="battle_menu__label">Startup Crisis Window</div>
          <h1>{UIStore.battle.title ?? "Pitch Gauntlet"}</h1>
          <p>{UIStore.battle.summary ?? "A rough week just hit the company."}</p>

          <div className="battle_menu__intel">
            <div className="battle_menu__intelCard">
              <span>Recommended</span>
              <strong>{recommendation}</strong>
            </div>
            <div className="battle_menu__intelCard">
              <span>Engaged team</span>
              <strong>{UIStore.battle.encounterRole ?? "Core roster"}</strong>
            </div>
          </div>

          <p className="battle_menu__hint">
            {UIStore.battle.hint ??
              "Press ESC to regroup and head back into town."}
          </p>
        </div>
      </div>

      <div className="battle_menu__actions">
        {crisisActions.map((action) => (
          <div
            key={action}
            className={
              action === selectedAction
                ? "battle_menu__action battle_menu__action--selected"
                : "battle_menu__action"
            }
          >
            <div className="battle_menu__actionTitle">{action}</div>
            <div className="battle_menu__actionMeta">{actionCopy[action]}</div>
          </div>
        ))}
      </div>

      <div className="battle_menu__footer">
        <div className="battle_menu__selection">
          Cursor locked on <strong>{selectedAction}</strong>
        </div>
        <div className="battle_menu__selectionHint">
          ENTER to commit. ESC to save runway.
        </div>
      </div>
    </div>
  );
};
