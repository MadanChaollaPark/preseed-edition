import { useEffect } from "react";
import { useUIStore } from "../../stores/ui";

export const TitleScreen = () => {
  const { showTitle, hideTitle } = useUIStore();

  useEffect(() => {
    if (!showTitle) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key.toLowerCase() === "a") {
        hideTitle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showTitle, hideTitle]);

  if (!showTitle) return null;

  return (
    <div className="titleScreen" onClick={hideTitle}>
      <div className="titleScreen__bar titleScreen__bar--top">
        <span>FOUNDER STRESS DREAM · SIGNAL RESTORED · VOICE-FIRST BUILD</span>
      </div>

      <div className="titleScreen__panel">
        <div className="titleSection">
          <div className="titleEyebrow">late-night build / archival treatment</div>
          <div className="titleLogo">RUNWAY</div>
          <div className="titleSubtitle">a voiced founder stress dream</div>
          <div className="titleTagline">
            Most of the story arrives as voices, captions, and pressure. The
            pixel world is only the memory of it.
          </div>
          <div className="titlePills">
            <span>crt signal</span>
            <span>late-stage runway</span>
            <span>demo day in 7</span>
          </div>
        </div>

        <div className="titleNotes">
          <div className="titleNotes__label">Recovered Notes</div>
          <div className="titleNotes__list">
            <div className="titleNotes__line">
              <span>Arrows</span>
              <strong>move the memory</strong>
            </div>
            <div className="titleNotes__line">
              <span>Enter</span>
              <strong>advance voice</strong>
            </div>
            <div className="titleNotes__line">
              <span>Esc</span>
              <strong>pull back</strong>
            </div>
          </div>
          <div className="titleNotes__caption">
            The founder fell asleep at the desk. The pitch survived as a panic
            loop with voices over the top.
          </div>
        </div>
      </div>

      <div className="titleScreen__bar titleScreen__bar--bottom">
        <div className="titlePressStart">
          PRESS START OR CLICK TO ENTER THE LOOP
        </div>
      </div>
    </div>
  );
};
