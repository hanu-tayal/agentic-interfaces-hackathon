"use client";

import { AnimatePresence, motion } from "motion/react";
import { Mic, MicOff, Loader2, Wand2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createFallbackInterface,
  type GeneratedInterface,
  type GeneratedModule,
} from "@/lib/bedtime/generative-ui";
import { ModuleRenderer } from "@/components/bedtime/ModuleRenderer";
import { VoiceInput } from "@/lib/bedtime/voice-input";

type Tone = "balanced" | "calmer" | "sillier";
type Mode = "digital" | "voice";

const sourceContext = {
  child: "Toddler",
  weeklyTheme: "Move It Week 2",
  characterTheme: "We Are Responsible",
  activities: ["hopping on lily pads", "sports heroes", "body language", "twist, twirl, and spin"],
  meals: ["brown rice", "green beans", "watermelon", "zucchini bread"],
  homeInterests: ["garbage trucks", "recycling trucks", "basketball", "movement songs"],
};

const TONE_BG: Record<Tone, string> = {
  balanced: "bg-gradient-to-br from-[#fdfbf4] via-[#f8f4e6] to-[#f0ead2]",
  calmer: "bg-gradient-to-br from-[#1a2540] via-[#2a3252] to-[#3d4470]",
  sillier: "bg-gradient-to-br from-[#fff4d6] via-[#ffe5a3] to-[#ffcc77]",
};
const TONE_TEXT: Record<Tone, string> = {
  balanced: "text-[#1c211c]",
  calmer: "text-[#e6e9f5]",
  sillier: "text-[#3d2a08]",
};

export default function HomePage() {
  const [tone, setTone] = useState<Tone>("balanced");
  const [mode, setMode] = useState<Mode>("digital");
  const [generated, setGenerated] = useState<GeneratedInterface>(() =>
    createFallbackInterface({ tone: "balanced", duration: "7-minute" }),
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedModuleIds, setStreamedModuleIds] = useState<string[]>([]);

  // Voice
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const voiceRef = useRef<VoiceInput | null>(null);
  const toneCache = useRef<Map<Tone, GeneratedInterface>>(new Map());

  useEffect(() => {
    setVoiceSupported(VoiceInput.isSupported());
    voiceRef.current = new VoiceInput();
    const v = voiceRef.current;
    const off1 = v.onTranscript((t) => setTranscript(t));
    const off2 = v.onEnd((final) => {
      setIsListening(false);
      if (final && final.length > 4) void buildBridge(undefined, final);
    });
    return () => {
      off1();
      off2();
      v.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show fallback modules immediately
  useEffect(() => {
    setStreamedModuleIds(generated.modules.map((m) => m.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pre-fetch tone variants in background for instant toggle
  useEffect(() => {
    (["balanced", "calmer", "sillier"] as Tone[]).forEach((t) => {
      fetch("/api/bedtime/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tone: t, duration: "7-minute", context: sourceContext }),
      })
        .then((r) => r.json())
        .then((m: GeneratedInterface) => toneCache.current.set(t, m))
        .catch(() => {});
    });
  }, []);

  function startListening() {
    if (!voiceRef.current) return;
    setTranscript("");
    setIsListening(true);
    voiceRef.current.start();
  }
  function stopListening() {
    voiceRef.current?.stop();
  }

  async function buildBridge(nextTone?: Tone, freeform?: string) {
    const t = nextTone ?? tone;
    setIsGenerating(true);
    setMode("digital");

    // Cache hit: instant swap
    if (!freeform && toneCache.current.has(t)) {
      const cached = toneCache.current.get(t)!;
      setGenerated(cached);
      const ids = cached.modules.map((m) => m.id);
      setStreamedModuleIds([]);
      for (let i = 0; i < ids.length; i++) {
        await new Promise((r) => setTimeout(r, 100));
        setStreamedModuleIds((p) => [...p, ids[i]]);
      }
      setIsGenerating(false);
      return;
    }

    // Optimistic local fallback
    const fb = createFallbackInterface({ tone: t, duration: "7-minute", freeform });
    setGenerated(fb);
    setStreamedModuleIds([]);
    const fbIds = fb.modules.map((m) => m.id);
    (async () => {
      for (let i = 0; i < fbIds.length; i++) {
        await new Promise((r) => setTimeout(r, 80));
        setStreamedModuleIds((p) => (p.includes(fbIds[i]) ? p : [...p, fbIds[i]]));
      }
    })();

    try {
      const r = await fetch("/api/bedtime/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tone: t, duration: "7-minute", freeform, context: sourceContext }),
      });
      const m = (await r.json()) as GeneratedInterface;
      setGenerated(m);
      if (!freeform) toneCache.current.set(t, m);
      const ids = m.modules.map((mm) => mm.id);
      setStreamedModuleIds([]);
      for (let i = 0; i < ids.length; i++) {
        await new Promise((r2) => setTimeout(r2, 120));
        setStreamedModuleIds((p) => [...p, ids[i]]);
      }
    } catch {
      // keep fallback
    } finally {
      setIsGenerating(false);
    }
  }

  const visibleModules = useMemo(
    () => generated.modules.filter((m) => streamedModuleIds.includes(m.id)),
    [generated.modules, streamedModuleIds],
  );
  const screenModules = visibleModules.filter(
    (m) => !["voice", "youtube", "toy", "print"].includes(m.kind),
  );
  const story = visibleModules.find((m) => m.kind === "story" || m.kind === "lullaby");

  return (
    <main className={`relative min-h-screen overflow-hidden transition-colors duration-700 ${TONE_BG[tone]} ${TONE_TEXT[tone]}`}>
      {/* Minimal top bar: title + 3 tone pills */}
      <header className="flex items-center justify-between gap-4 px-6 py-4 md:px-10 md:py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5f6f52] to-[#3d4a32] text-white">
            <Wand2 className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${tone === "calmer" ? "text-[#b9d4a8]" : "text-[#5f6f52]"}`}>
              Bedtime School Bridge
            </p>
            <p className="text-sm font-semibold opacity-80">{generated.generatedBy}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {(["balanced", "calmer", "sillier"] as Tone[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTone(t);
                void buildBridge(t);
              }}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${tone === t ? "bg-black/80 text-white shadow-md" : tone === "calmer" ? "border border-white/20 text-white/70 hover:bg-white/10" : "border border-black/10 text-current/70 hover:bg-white/30"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      {/* Two simple tabs */}
      <div className="px-6 md:px-10">
        <div className={`mx-auto flex max-w-md gap-1 rounded-full p-1 ${tone === "calmer" ? "bg-white/10 backdrop-blur" : "bg-white/70 backdrop-blur"}`}>
          {([["digital", "Tonight"], ["voice", "Listen"]] as const).map(([v, label]) => (
            <button
              key={v}
              onClick={() => setMode(v)}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition ${mode === v ? (tone === "calmer" ? "bg-white text-[#1a2540]" : "bg-black text-white") : "opacity-70 hover:opacity-100"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="px-6 pb-32 pt-6 md:px-10">
        <div className="mx-auto max-w-4xl">
          {mode === "digital" && (
            <DigitalCanvas modules={screenModules} isGenerating={isGenerating} empty={visibleModules.length === 0} />
          )}
          {mode === "voice" && (
            <VoiceMode story={story?.body ?? "Tap the mic and tell us about tonight."} title={story?.title} tone={tone} />
          )}
        </div>
      </div>

      {/* Single floating mic */}
      <div className="floating-dock pointer-events-none fixed inset-x-0 bottom-0 z-30 flex flex-col items-center gap-3 px-6 pb-7">
        {transcript && isListening && (
          <div className="pointer-events-none rounded-full bg-black/80 px-4 py-2 text-xs text-white backdrop-blur">
            &ldquo;{transcript}&rdquo;
          </div>
        )}
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={!voiceSupported || isGenerating}
          className={`pointer-events-auto relative flex h-20 w-20 items-center justify-center rounded-full shadow-2xl disabled:opacity-50 ${
            isListening
              ? "bg-gradient-to-br from-rose-500 to-pink-600"
              : "bg-gradient-to-br from-[#5f6f52] to-[#3d4a32] hover:from-[#6d7e5d]"
          }`}
        >
          {isListening ? (
            <>
              <motion.span
                animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
                className="absolute inset-0 rounded-full bg-rose-400/40"
              />
              <MicOff className="relative h-9 w-9 text-white" />
            </>
          ) : isGenerating ? (
            <Loader2 className="h-9 w-9 animate-spin text-white" />
          ) : (
            <Mic className="h-9 w-9 text-white" />
          )}
        </button>
        <p className="pointer-events-none text-xs font-bold opacity-70">
          {isListening ? "listening…" : isGenerating ? "composing…" : voiceSupported ? "tap to speak" : "voice not supported here"}
        </p>
      </div>

      <style jsx global>{`
        @media print {
          header, .floating-dock { display: none !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>
    </main>
  );
}

function DigitalCanvas({
  modules,
  isGenerating,
  empty,
}: {
  modules: GeneratedModule[];
  isGenerating: boolean;
  empty: boolean;
}) {
  if (empty && !isGenerating) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Wand2 className="h-16 w-16 opacity-40" />
        <h2 className="mt-6 text-3xl font-bold">Tonight&apos;s bedtime bridge</h2>
        <p className="mt-3 max-w-lg text-base opacity-70">Tap the mic and say one sentence about today.</p>
      </div>
    );
  }
  const sorted = [...modules].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  const [hero, ...rest] = sorted;
  return (
    <div className="space-y-5">
      <AnimatePresence mode="popLayout">
        {hero && (
          <motion.div key={hero.id} layout>
            <ModuleRenderer module={hero} hero />
          </motion.div>
        )}
        {rest.length > 0 && (
          <motion.div layout className="grid gap-5 md:grid-cols-2">
            {rest.map((m) => (
              <motion.div key={m.id} layout>
                <ModuleRenderer module={m} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VoiceMode({ story, title, tone }: { story: string; title?: string; tone: Tone }) {
  const [playing, setPlaying] = useState(false);
  function toggle() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(story);
    u.rate = tone === "calmer" ? 0.78 : 0.92;
    u.pitch = tone === "sillier" ? 1.15 : 0.95;
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(u);
    setPlaying(true);
  }
  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-gradient-to-br from-[#1f2940] via-[#162038] to-[#0a1124] p-8 text-white shadow-2xl">
        <h2 className="text-3xl font-bold">{title ?? "Calm read-aloud"}</h2>
        <button
          onClick={toggle}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-bold text-[#1f2940] shadow-lg"
        >
          {playing ? "Pause" : "Play story"}
        </button>
        <div className="mt-6 flex h-16 items-end gap-1">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.span
              key={i}
              className="w-1.5 rounded-full bg-[#7d8fc7]"
              animate={
                playing
                  ? { height: ["20%", `${30 + (Math.sin(i + Date.now() / 200) + 1) * 30}%`, "20%"] }
                  : { height: "20%" }
              }
              transition={{ repeat: playing ? Infinity : 0, duration: 1.4, delay: i * 0.03 }}
            />
          ))}
        </div>
      </div>
      <div className="rounded-2xl bg-white/70 p-6 text-[#1c211c] backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f6f52]">Transcript ({tone})</p>
        <p className="mt-3 text-base leading-7">{story}</p>
      </div>
    </div>
  );
}
