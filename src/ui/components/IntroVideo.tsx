import { useRef } from "react";
import { useUIStore } from "../../stores/ui";

export const IntroVideo = () => {
  const character = useUIStore((s) => s.character);
  const introPlayed = useUIStore((s) => s.introPlayed);
  const markIntroPlayed = useUIStore((s) => s.markIntroPlayed);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  if (!character || introPlayed) return null;

  return (
    <div className="introVideo" onClick={markIntroPlayed}>
      <video
        ref={videoRef}
        className="introVideo__player"
        src="assets/video/intro.mp4"
        autoPlay
        playsInline
        onEnded={markIntroPlayed}
      />
      <button
        type="button"
        className="introVideo__skip"
        onClick={(e) => {
          e.stopPropagation();
          markIntroPlayed();
        }}
      >
        skip ↵
      </button>
    </div>
  );
};
