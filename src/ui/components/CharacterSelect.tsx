import { useEffect, useState } from "react";
import { useUIStore, type FounderCharacter } from "../../stores/ui";

type CharacterCard = {
  id: FounderCharacter;
  name: string;
  role: string;
  org: string;
  blurb: string;
  pronoun: "she" | "he";
  badge: string;
  accent: string;
};

const CARDS: CharacterCard[] = [
  {
    id: "esther",
    name: "Esther Trapadoux",
    role: "Community",
    org: "Zed",
    pronoun: "she",
    blurb:
      "Runs the room. Will ask the question that exposes whether you actually shipped.",
    badge: "judge",
    accent: "esther",
  },
  {
    id: "joe",
    name: "Joe Reeve",
    role: "Growth",
    org: "ElevenLabs",
    pronoun: "he",
    blurb:
      "Pattern-matches founders against thousands of pitches. Cuts straight to traction.",
    badge: "judge",
    accent: "joe",
  },
];

export const CharacterSelect = () => {
  const character = useUIStore((s) => s.character);
  const setCharacter = useUIStore((s) => s.setCharacter);
  const showTitle = useUIStore((s) => s.showTitle);
  const [hovered, setHovered] = useState<FounderCharacter>("esther");

  useEffect(() => {
    if (showTitle || character) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        setHovered((prev) => (prev === "esther" ? "joe" : "esther"));
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setCharacter(hovered);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hovered, setCharacter, showTitle, character]);

  if (showTitle || character) return null;

  return (
    <div className="characterSelect">
      <div className="characterSelect__bar characterSelect__bar--top">
        <span>FOUNDER SELECT · CHOOSE YOUR JUDGE · DEMO DAY IN 7</span>
      </div>

      <div className="characterSelect__panel">
        <div className="characterSelect__heading">
          <div className="characterSelect__eyebrow">who is pitching</div>
          <h1 className="characterSelect__title">Pick your founder</h1>
          <p className="characterSelect__sub">
            Two judges took the seat. Pick the one you want to play as for this
            run. Arrow keys to switch, Enter to lock in.
          </p>
        </div>

        <div className="characterSelect__cards">
          {CARDS.map((card) => {
            const isSelected = hovered === card.id;
            return (
              <button
                key={card.id}
                type="button"
                className={
                  "characterCard" +
                  (isSelected ? " characterCard--selected" : "") +
                  ` characterCard--${card.accent}`
                }
                onMouseEnter={() => setHovered(card.id)}
                onFocus={() => setHovered(card.id)}
                onClick={() => setCharacter(card.id)}
              >
                <div className="characterCard__badge">{card.badge}</div>
                <div className="characterCard__portrait">
                  <div
                    className={`characterCard__sprite characterCard__sprite--${card.accent}`}
                    aria-hidden="true"
                  />
                </div>
                <div className="characterCard__name">{card.name}</div>
                <div className="characterCard__meta">
                  <span>{card.role}</span>
                  <span>·</span>
                  <span>{card.org}</span>
                </div>
                <p className="characterCard__blurb">{card.blurb}</p>
                <div className="characterCard__cta">
                  {isSelected ? "press enter to start" : "click or hover"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="characterSelect__bar characterSelect__bar--bottom">
        <span>← / → SWITCH · ENTER TO START · YOU CAN&apos;T UN-PICK</span>
      </div>
    </div>
  );
};
