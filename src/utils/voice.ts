const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
const defaultVoiceId =
  import.meta.env.VITE_ELEVENLABS_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM";

let activeAudio: HTMLAudioElement | null = null;

export const isVoiceEnabled = () => Boolean(apiKey);

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

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
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
      console.warn("ElevenLabs TTS failed:", res.status, await res.text());
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    activeAudio = audio;
    audio.addEventListener("ended", () => URL.revokeObjectURL(url));
    await audio.play();
  } catch (err) {
    console.warn("ElevenLabs TTS error:", err);
  }
};
