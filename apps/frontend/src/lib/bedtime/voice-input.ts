// Lightweight Web Speech API wrapper. Works on iPad Safari and desktop Chrome.
// Falls back gracefully when SpeechRecognition isn't available (Firefox, etc).

type Listener = (transcript: string, isFinal: boolean) => void;

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>; resultIndex: number }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  start(): void;
  stop(): void;
}

export class VoiceInput {
  private rec: SpeechRecognitionLike | null = null;
  private listeners: Listener[] = [];
  private endListeners: Array<(finalTranscript: string) => void> = [];
  private finalTranscript = "";

  static isSupported(): boolean {
    if (typeof window === "undefined") return false;
    const w = window as typeof window & {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
  }

  start(): void {
    if (typeof window === "undefined") return;
    const w = window as typeof window & {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    this.finalTranscript = "";
    rec.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const item = event.results[i];
        const text = item[0].transcript;
        if (item.isFinal) this.finalTranscript += text + " ";
        else interim += text;
      }
      const combined = (this.finalTranscript + interim).trim();
      this.listeners.forEach((l) => l(combined, false));
    };
    rec.onend = () => {
      const final = this.finalTranscript.trim();
      this.listeners.forEach((l) => l(final, true));
      this.endListeners.forEach((l) => l(final));
    };
    rec.onerror = () => {
      const final = this.finalTranscript.trim();
      this.listeners.forEach((l) => l(final, true));
      this.endListeners.forEach((l) => l(final));
    };
    rec.start();
    this.rec = rec;
  }

  stop(): void {
    this.rec?.stop();
    this.rec = null;
  }

  onTranscript(fn: Listener): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  onEnd(fn: (final: string) => void): () => void {
    this.endListeners.push(fn);
    return () => {
      this.endListeners = this.endListeners.filter((l) => l !== fn);
    };
  }
}
