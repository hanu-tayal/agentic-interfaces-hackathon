"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Mic,
  MicOff,
  Volume2,
  Printer,
  CheckCircle2,
  Sparkles,
  Wand2,
  Truck,
  PlayCircle,
  Loader2,
  ChevronUp,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createMockPurchaseApproval,
  toyCandidates,
} from "@/lib/bedtime/commerce";
import {
  createFallbackInterface,
  type GeneratedInterface,
  type GeneratedModule,
} from "@/lib/bedtime/generative-ui";
import { ModuleRenderer } from "@/components/bedtime/ModuleRenderer";
import { VoiceInput } from "@/lib/bedtime/voice-input";

type Tone = "balanced" | "calmer" | "sillier";
type Duration = "7-minute" | "2-minute";
type Mode = "digital" | "print" | "voice" | "youtube" | "toy";

const sourceContext = {
  child: "Toddler",
  weeklyTheme: "Move It Week 2",
  nextTheme: "Five Senses Week 1",
  characterTheme: "We Are Responsible",
  activities: ["hopping on lily pads", "sports heroes", "body language", "twist, twirl, and spin"],
  meals: ["brown rice", "green beans", "watermelon", "zucchini bread"],
  homeInterests: ["garbage trucks", "recycling trucks", "basketball", "movement songs"],
};

const SAMPLE_PROMPTS = [
  "Move It Week 2, garbage trucks, basketball, calmer tonight",
  "Rough drop-off this morning, dad gone for two days",
  "Two minutes, super silly, recycling truck story",
];

// Tone-driven canvas backgrounds
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
const TONE_TAB_ACTIVE: Record<Tone, string> = {
  balanced: "bg-[#233325] text-white",
  calmer: "bg-white/90 text-[#1a2540]",
  sillier: "bg-[#3d2a08] text-white",
};
const TONE_TAB_BG: Record<Tone, string> = {
  balanced: "bg-white",
  calmer: "bg-white/10 backdrop-blur",
  sillier: "bg-white/70",
};
const TONE_TAB_INACTIVE: Record<Tone, string> = {
  balanced: "text-[#4d5748] hover:bg-[#f4f2ea]",
  calmer: "text-[#cdd5e6] hover:bg-white/5",
  sillier: "text-[#7a5a18] hover:bg-white/40",
};

export default function HomePage() {
  const [tone, setTone] = useState<Tone>("balanced");
  const [duration, setDuration] = useState<Duration>("7-minute");
  const [mode, setMode] = useState<Mode>("digital");
  const [generated, setGenerated] = useState<GeneratedInterface>(() =>
    createFallbackInterface({ tone: "balanced", duration: "7-minute" }),
  );
  const [tried, setTried] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedModuleIds, setStreamedModuleIds] = useState<string[]>([]);
  const [showSamples, setShowSamples] = useState(true);

  // Voice
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const voiceRef = useRef<VoiceInput | null>(null);
  const [approvedVideo, setApprovedVideo] = useState(false);
  const [approvedToy, setApprovedToy] = useState(false);

  useEffect(() => {
    setVoiceSupported(VoiceInput.isSupported());
    voiceRef.current = new VoiceInput();
    const v = voiceRef.current;
    const off1 = v.onTranscript((t) => setTranscript(t));
    const off2 = v.onEnd((final) => {
      setIsListening(false);
      if (final && final.length > 4) void buildBridge({ freeform: final });
    });
    return () => {
      off1();
      off2();
      v.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize fallback as streamed so empty state shows real UI
  useEffect(() => {
    setStreamedModuleIds(generated.modules.map((m) => m.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startListening() {
    if (!voiceRef.current) return;
    setTranscript("");
    setIsListening(true);
    setShowSamples(false);
    voiceRef.current.start();
  }
  function stopListening() {
    if (!voiceRef.current) return;
    voiceRef.current.stop();
  }

  async function buildBridge(opts?: { tone?: Tone; duration?: Duration; freeform?: string }) {
    const nextTone = opts?.tone ?? tone;
    const nextDuration = opts?.duration ?? duration;
    const nextFreeform = opts?.freeform ?? textInput ?? undefined;
    setIsGenerating(true);
    setMode("digital");
    setShowSamples(false);

    // Optimistic local fallback so the iPad fills instantly
    const fallback = createFallbackInterface({ tone: nextTone, duration: nextDuration, freeform: nextFreeform });
    setGenerated(fallback);
    setStreamedModuleIds([]);
    const fbIds = fallback.modules.map((m) => m.id);
    (async () => {
      for (let i = 0; i < fbIds.length; i++) {
        await new Promise((r) => setTimeout(r, 90));
        setStreamedModuleIds((prev) => (prev.includes(fbIds[i]) ? prev : [...prev, fbIds[i]]));
      }
    })();

    try {
      const response = await fetch("/api/bedtime/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tone: nextTone,
          duration: nextDuration,
          freeform: nextFreeform,
          context: sourceContext,
        }),
      });
      const manifest = (await response.json()) as GeneratedInterface & { _tried?: string[] };
      setGenerated(manifest);
      setTried(manifest._tried ?? []);
      const aiIds = manifest.modules.map((m) => m.id);
      setStreamedModuleIds([]);
      for (let i = 0; i < aiIds.length; i++) {
        await new Promise((r) => setTimeout(r, 130));
        setStreamedModuleIds((prev) => [...prev, aiIds[i]]);
      }
    } catch {
      // keep fallback
    } finally {
      setIsGenerating(false);
      setTextInput("");
    }
  }

  const visibleModules = useMemo(() => {
    return generated.modules.filter((m) => streamedModuleIds.includes(m.id));
  }, [generated.modules, streamedModuleIds]);

  const screenModules = visibleModules.filter(
    (m) => !["voice", "youtube", "toy", "print"].includes(m.kind),
  );
  const story = visibleModules.find((m) => m.kind === "story" || m.kind === "lullaby");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0d0a] text-white">
      {/* iPad canvas takes 100% on mobile, 92% on desktop */}
      <div className={`flex min-h-screen w-full flex-col transition-colors duration-700 ${TONE_BG[tone]} ${TONE_TEXT[tone]}`}>
        {/* Top bar — minimal */}
        <header className={`flex shrink-0 items-center justify-between gap-3 border-b border-black/5 px-5 py-3 md:px-8 md:py-4 ${tone === "calmer" ? "bg-black/20 backdrop-blur" : "bg-white/30 backdrop-blur"}`}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5f6f52] to-[#3d4a32] text-white">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${tone === "calmer" ? "text-[#b9d4a8]" : "text-[#5f6f52]"}`}>
                Bedtime School Bridge
              </p>
              <p className="text-xs leading-4 opacity-80">Speak. Watch tonight&apos;s iPad UI assemble itself.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {(["balanced", "calmer", "sillier"] as Tone[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTone(t);
                  void buildBridge({ tone: t });
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${tone === t ? "bg-black/80 text-white" : tone === "calmer" ? "border border-white/20 text-white/70" : "border border-black/10 text-current/70 hover:bg-white/30"}`}
              >
                {t}
              </button>
            ))}
            <span className={`mx-1 hidden h-5 w-px md:block ${tone === "calmer" ? "bg-white/20" : "bg-black/10"}`} />
            {(["7-minute", "2-minute"] as Duration[]).map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDuration(d);
                  void buildBridge({ duration: d });
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${duration === d ? "bg-black/80 text-white" : tone === "calmer" ? "border border-white/20 text-white/70" : "border border-black/10 text-current/70 hover:bg-white/30"}`}
              >
                {d.replace("-", " ")}
              </button>
            ))}
          </div>
        </header>

        {/* Mode tab bar */}
        <div className={`shrink-0 border-b border-black/5 px-5 py-2 md:px-8 ${tone === "calmer" ? "bg-black/10" : "bg-white/30 backdrop-blur"}`}>
          <div className={`flex gap-1 rounded-2xl p-1 ${TONE_TAB_BG[tone]}`}>
            {([
              ["digital", "Tonight"],
              ["voice", "Listen"],
              ["print", "Print"],
              ["youtube", "Videos"],
              ["toy", "Toy"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setMode(value)}
                className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold transition ${mode === value ? TONE_TAB_ACTIVE[tone] + " shadow-sm" : TONE_TAB_INACTIVE[tone]}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Main canvas */}
        <div className="relative flex-1 overflow-y-auto px-5 pb-32 pt-5 md:px-12 md:pb-32 md:pt-8">
          {mode === "digital" && (
            <DigitalCanvas
              modules={screenModules}
              isGenerating={isGenerating}
              empty={visibleModules.length === 0}
            />
          )}
          {mode === "voice" && (
            <VoiceMode
              story={story?.body ?? "Tap the mic and speak. The bedtime UI will assemble itself."}
              storyTitle={story?.title}
              tone={tone}
            />
          )}
          {mode === "print" && <PrintMode modules={visibleModules} onPrint={() => window.print()} />}
          {mode === "youtube" && <YouTubeMode approved={approvedVideo} onApprove={() => setApprovedVideo(true)} />}
          {mode === "toy" && <ToyMode approved={approvedToy} onApprove={() => setApprovedToy(true)} />}
        </div>

        {/* Floating voice dock */}
        <FloatingVoiceDock
          isListening={isListening}
          isGenerating={isGenerating}
          transcript={transcript}
          voiceSupported={voiceSupported}
          onStart={startListening}
          onStop={stopListening}
          textInput={textInput}
          onTextInput={setTextInput}
          onSubmitText={() => void buildBridge({ freeform: textInput })}
          showSamples={showSamples}
          onToggleSamples={() => setShowSamples((s) => !s)}
          generated={generated}
          tried={tried}
          tone={tone}
        />
      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; color: black !important; }
          header, .floating-dock { display: none !important; }
        }
      `}</style>
    </main>
  );
}

// ---------- FLOATING DOCK ----------

function FloatingVoiceDock({
  isListening,
  isGenerating,
  transcript,
  voiceSupported,
  onStart,
  onStop,
  textInput,
  onTextInput,
  onSubmitText,
  showSamples,
  onToggleSamples,
  generated,
  tried,
  tone,
}: {
  isListening: boolean;
  isGenerating: boolean;
  transcript: string;
  voiceSupported: boolean;
  onStart: () => void;
  onStop: () => void;
  textInput: string;
  onTextInput: (s: string) => void;
  onSubmitText: () => void;
  showSamples: boolean;
  onToggleSamples: () => void;
  generated: GeneratedInterface;
  tried: string[];
  tone: Tone;
}) {
  return (
    <div className="floating-dock pointer-events-none fixed inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2 px-5 pb-5 md:pb-7">
      <AnimatePresence>
        {showSamples && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="pointer-events-auto flex max-w-3xl flex-wrap justify-center gap-2"
          >
            {SAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => {
                  onTextInput(p);
                  onSubmitText();
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur ${tone === "calmer" ? "bg-white/15 text-white hover:bg-white/25" : "bg-black/70 text-white hover:bg-black/90"}`}
              >
                &ldquo;{p}&rdquo;
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-black/80 px-3 py-2.5 shadow-2xl backdrop-blur">
        <button
          onClick={isListening ? onStop : onStart}
          disabled={!voiceSupported || isGenerating}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full transition disabled:opacity-50 ${
            isListening
              ? "bg-gradient-to-br from-rose-500 to-pink-600 shadow-[0_0_30px_rgba(244,63,94,0.6)]"
              : "bg-gradient-to-br from-[#5f6f52] to-[#3d4a32] hover:from-[#6d7e5d]"
          }`}
        >
          {isListening ? (
            <>
              <motion.span
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
                className="absolute inset-0 rounded-full bg-rose-400/40"
              />
              <MicOff className="relative h-7 w-7 text-white" />
            </>
          ) : isGenerating ? (
            <Loader2 className="h-7 w-7 animate-spin text-white" />
          ) : (
            <Mic className="h-7 w-7 text-white" />
          )}
        </button>
        <div className="flex min-w-0 flex-col">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#b9d4a8]">
            {isListening ? "Listening…" : isGenerating ? `Composing · ${generated.generatedBy.slice(0, 28)}` : voiceSupported ? "Tap to speak tonight's UI" : "Voice unsupported — type below"}
          </p>
          {(isListening && transcript) ? (
            <p className="max-w-[280px] truncate text-xs text-white/80 md:max-w-[420px]">&ldquo;{transcript}&rdquo;</p>
          ) : (
            <p className="text-xs text-white/60">{generated.modules.length} modules · {generated.layoutMode}</p>
          )}
        </div>
        {!voiceSupported && (
          <input
            value={textInput}
            onChange={(e) => onTextInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && textInput.trim()) onSubmitText(); }}
            placeholder="Tonight in one sentence…"
            className="hidden w-72 rounded-full bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:bg-white/15 focus:outline-none md:block"
          />
        )}
        <button
          onClick={onToggleSamples}
          title="Show sample prompts"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <ChevronUp className={`h-5 w-5 transition ${showSamples ? "rotate-180" : ""}`} />
        </button>
      </div>

      {tried.length > 0 && (
        <div className="pointer-events-auto rounded-full bg-black/40 px-3 py-1 text-[10px] font-mono text-[#b9d4a8] backdrop-blur">
          cascade: {tried[tried.length - 1]}
        </div>
      )}
    </div>
  );
}

// ---------- DIGITAL CANVAS ----------

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
        <p className="mt-3 max-w-lg text-base opacity-70">
          Tap the mic and tell the agent about today. Watch the bedtime UI assemble itself, page by page, in real time.
        </p>
      </div>
    );
  }

  const sorted = [...modules].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  const [hero, ...rest] = sorted;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
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
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-current/30 bg-current/5 px-4 py-3 text-sm opacity-70"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          Agent composing the next module…
        </motion.div>
      )}
    </div>
  );
}

// ---------- MODE PANELS (Voice / Print / YouTube / Toy) ----------

function VoiceMode({ story, storyTitle, tone }: { story: string; storyTitle?: string; tone: Tone }) {
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
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="rounded-3xl bg-gradient-to-br from-[#1f2940] via-[#162038] to-[#0a1124] p-8 text-white shadow-2xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a8b0cf]">Listen mode</p>
        <h2 className="mt-2 text-3xl font-bold">{storyTitle ?? "Calm read-aloud"}</h2>
        <button
          onClick={toggle}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-bold text-[#1f2940] shadow-lg"
        >
          <Volume2 className="h-5 w-5" />
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
      <div className="rounded-2xl border border-current/10 bg-white/70 p-6 text-[#1c211c] backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f6f52]">Transcript ({tone})</p>
        <p className="mt-3 text-base leading-7">{story}</p>
      </div>
    </div>
  );
}

function PrintMode({ modules, onPrint }: { modules: GeneratedModule[]; onPrint: () => void }) {
  const story = modules.find((m) => m.kind === "story" || m.kind === "lullaby");
  const prompts = modules.find((m) => m.kind === "prompt");
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <button
        onClick={onPrint}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#233325] px-5 py-3 text-base font-bold text-white shadow-lg"
      >
        <Printer className="h-5 w-5" />
        Print or save PDF
      </button>
      <div className="grid gap-4 md:grid-cols-2">
        {story && (
          <article className="rounded-2xl border-2 border-dashed border-[#7a715f] bg-[#fefcf2] p-7">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7a715f]">Child page</p>
            <h3 className="mt-3 text-3xl font-bold leading-tight text-[#1c211c]">{story.title}</h3>
            <p className="mt-4 text-lg leading-8 text-[#1c211c]">{story.body}</p>
          </article>
        )}
        {prompts && (
          <article className="rounded-2xl border-2 border-dashed border-[#7a715f] bg-[#fefcf2] p-7">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7a715f]">Parent page</p>
            <h3 className="mt-3 text-2xl font-bold leading-tight text-[#1c211c]">Read-aloud guide</h3>
            <p className="mt-3 text-base leading-7 text-[#1c211c]">{prompts.body}</p>
          </article>
        )}
      </div>
    </div>
  );
}

const videoCards = [
  { title: "Red Light, Green Light movement song", channel: "Seeded preschool catalog", reason: "Practices stop/go body control from Move It Week 2.", prompt: "What does your body do when red?" },
  { title: "Recycling truck cleanup story", channel: "Seeded vehicle catalog", reason: "Connects garbage truck interest to responsibility.", prompt: "What goes in the recycling bin?" },
  { title: "Basketball bounce and count", channel: "Seeded movement catalog", reason: "Sports heroes meet counting and rhythm.", prompt: "Count three quiet bounces?" },
];

function YouTubeMode({ approved, onApprove }: { approved: boolean; onApprove: () => void }) {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex items-center gap-3">
        <Truck className="h-7 w-7 opacity-70" />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] opacity-70">Guided learning videos</p>
          <h2 className="text-xl font-bold">Parent-approved set, with stop point</h2>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {videoCards.map((v, i) => (
          <article key={v.title} className="rounded-2xl border border-current/10 bg-white/70 p-4 text-[#1c211c] backdrop-blur">
            <div className={`mb-3 flex aspect-video items-center justify-center rounded-xl ${i === 0 ? "bg-rose-200" : i === 1 ? "bg-emerald-200" : "bg-amber-200"} text-4xl`}>
              <PlayCircle className="h-12 w-12 text-white drop-shadow" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#5f6f52]">{v.channel}</p>
            <h3 className="mt-1 text-base font-bold leading-5">{v.title}</h3>
            <p className="mt-2 text-xs leading-5 text-[#4d5748]">{v.reason}</p>
            <p className="mt-2 text-xs font-semibold">Ask: {v.prompt}</p>
          </article>
        ))}
      </div>
      <button
        onClick={onApprove}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#233325] px-5 py-3 text-base font-bold text-white"
      >
        <CheckCircle2 className="h-5 w-5" />
        {approved ? "Approved" : "Approve set"}
      </button>
    </div>
  );
}

function ToyMode({ approved, onApprove }: { approved: boolean; onApprove: () => void }) {
  const toy = toyCandidates[0];
  const approval = approved ? createMockPurchaseApproval(toy) : undefined;
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <article className="rounded-3xl border border-current/10 bg-gradient-to-br from-[#f0e6ff] to-[#dccaf4] p-7 text-[#3d1d6e] shadow-lg">
        <p className="text-xs font-bold uppercase tracking-[0.12em]">Hands-on extension</p>
        <div className="mt-3 flex items-start gap-5">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white text-6xl shadow-sm">🏀</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold">{toy.title}</h3>
            <p className="mt-2 text-base leading-7">{toy.learningReason}</p>
            <p className="mt-2 text-sm font-semibold opacity-80">{toy.safetyNote}</p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/60 p-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em]">Mock purchase</p>
            <p className="text-3xl font-bold">{toy.priceLabel}</p>
          </div>
          <button
            onClick={onApprove}
            className="inline-flex items-center gap-2 rounded-full bg-[#3d1d6e] px-5 py-3 text-sm font-bold text-white"
          >
            <CheckCircle2 className="h-4 w-4" />
            {approved ? "Receipt created" : "Approve"}
          </button>
        </div>
        {approval && (
          <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-xs font-semibold">{approval.auditNote}</p>
        )}
      </article>
    </div>
  );
}

// re-export for type
export type { Tone };
