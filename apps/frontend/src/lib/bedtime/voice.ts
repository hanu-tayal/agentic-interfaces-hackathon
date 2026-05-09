export type VoiceProvider = "browser-speech" | "gemini-tts" | "openai-tts";

export type VoicePlan = {
  provider: VoiceProvider;
  voiceName: string;
  pace: "slow" | "normal" | "playful";
  safetyNote: string;
};

export function createVoicePlan(tone: "balanced" | "calmer" | "sillier"): VoicePlan {
  if (tone === "calmer") {
    return {
      provider: "browser-speech",
      voiceName: "local calm system voice",
      pace: "slow",
      safetyNote:
        "No creator imitation. Parent can review transcript before playback.",
    };
  }

  if (tone === "sillier") {
    return {
      provider: "browser-speech",
      voiceName: "local playful system voice",
      pace: "playful",
      safetyNote:
        "Expressive prosody only. Production voices must avoid cloning real creators.",
    };
  }

  return {
    provider: "browser-speech",
    voiceName: "local parent-friendly system voice",
    pace: "normal",
    safetyNote:
      "Browser speech is used for the MVP; cloud TTS can be swapped in behind this contract.",
  };
}
