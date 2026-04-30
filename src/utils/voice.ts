const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
const defaultVoiceId =
  import.meta.env.VITE_ELEVENLABS_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM";
const pgVoiceId =
  import.meta.env.VITE_ELEVENLABS_VOICE_PG ?? defaultVoiceId;
const brettVoiceId =
  import.meta.env.VITE_ELEVENLABS_VOICE_BRETT ?? "TxGEqnHWrfWFTfGW9XjX";
const announcerVoiceId =
  import.meta.env.VITE_ELEVENLABS_VOICE_ANNOUNCER ?? "VR6AewLTigWG4xSOukaG";
const judgeVoiceId =
  import.meta.env.VITE_ELEVENLABS_VOICE_JUDGE ?? "EXAVITQu4vr4xnSDxMaL";

let activeAudio: HTMLAudioElement | null = null;

export const isVoiceEnabled = () => Boolean(apiKey);

export const getVoiceIdForSpeaker = (speaker?: string) => {
  switch (speaker?.trim().toUpperCase()) {
    case "PG":
      return pgVoiceId;
    case "BRETT":
      return brettVoiceId;
    case "ANNOUNCER":
      return announcerVoiceId;
    case "JUDGE":
      return judgeVoiceId;
    default:
      return defaultVoiceId;
  }
};

export const speak = async (
  text: string,
  voiceId: string = defaultVoiceId,
): Promise<void> => {
  if (!apiKey) return;
  if (!text.trim()) return;

  if (activeAudio) {
    activeAudio.pause();
    activeAudio.src = "";
    activeAudio = null;
  }

  const playVoice = async (selectedVoiceId: string) => {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_flash_v2_5",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      },
    );

    if (!res.ok) {
      throw new Error(
        `ElevenLabs TTS failed: ${res.status} ${await res.text()}`,
      );
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    activeAudio = audio;
    audio.addEventListener("ended", () => URL.revokeObjectURL(url));
    await audio.play();
  };

  try {
    await playVoice(voiceId);
  } catch (err) {
    if (voiceId !== defaultVoiceId) {
      try {
        await playVoice(defaultVoiceId);
        return;
      } catch (fallbackErr) {
        console.warn("ElevenLabs TTS fallback error:", fallbackErr);
      }
    }

    console.warn("ElevenLabs TTS error:", err);
  }
};
