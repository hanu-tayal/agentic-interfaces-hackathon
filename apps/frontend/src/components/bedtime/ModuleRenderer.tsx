"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Sparkles,
  Leaf,
  PlayCircle,
  PauseCircle,
  Printer,
  CircleDollarSign,
  Heart,
  Wand2,
  Volume2,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Truck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { GeneratedModule } from "@/lib/bedtime/generative-ui";

// Toddler-first interactive renderers. Minimal text, big tap targets, sound on tap.

export function ModuleRenderer({ module: m, hero }: { module: GeneratedModule; hero?: boolean }) {
  const kind = (m.kind || m.renderer || "default").toLowerCase();
  if (kind === "story" || kind === "lullaby" || kind === "social-story" || kind === "bedtime-story") return <StoryScene module={m} hero={hero} />;
  if (kind === "prompt" || kind === "talk-prompts") return <PromptCards module={m} />;
  if (kind === "food" || kind === "food-card") return <FoodPlay module={m} />;
  if (kind === "movement" || kind === "movement-game" || kind === "sensory-warmup") return <MovementGame module={m} />;
  if (kind === "voice" || kind === "voice-player" || kind === "calm winding down" || kind === "calm-winding-down") return <VoiceMascot module={m} />;
  if (kind === "youtube" || kind === "youtube-rail") return <YoutubeRail module={m} />;
  if (kind === "toy" || kind === "commerce-approval") return <ToyPlay module={m} />;
  if (kind === "print" || kind === "print-pack") return <PrintPreview module={m} />;
  if (kind === "feelings-reset" || kind === "transition" || kind === "guest-mode") return <BreathingReset module={m} hero={hero} />;
  return <DefaultCard module={m} hero={hero} />;
}

// ---------- shells ----------

const fadeUp = {
  initial: { opacity: 0, y: 16, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
  transition: { duration: 0.4 },
};

function speak(text: string, opts?: { rate?: number; pitch?: number }) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = opts?.rate ?? 0.85;
  u.pitch = opts?.pitch ?? 1.0;
  window.speechSynthesis.speak(u);
}

function Shell({
  children,
  bg,
  border,
  hero,
  badge,
  badgeBg,
  className = "",
}: {
  children: React.ReactNode;
  bg: string;
  border: string;
  hero?: boolean;
  badge: React.ReactNode;
  badgeBg: string;
  className?: string;
}) {
  return (
    <motion.article
      {...fadeUp}
      className={`relative overflow-hidden rounded-3xl border ${border} ${bg} p-4 md:p-5 ${hero ? "ring-2 ring-white/30 shadow-2xl" : "shadow-md"} ${className}`}
    >
      <div className={`mb-3 inline-flex items-center gap-2 rounded-full ${badgeBg} px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]`}>
        {badge}
      </div>
      {children}
    </motion.article>
  );
}

// ---------- STORY: illustrated scene, minimal text, auto-TTS ----------

function StoryScene({ module: m, hero }: { module: GeneratedModule; hero?: boolean }) {
  const pages = splitIntoPages(m.body, 80);
  const [page, setPage] = useState(0);
  const heroEmoji = pickEmoji(m.body, m.evidence);
  const sceneBgs = [
    "from-[#fce8a4] via-[#f6cf6a] to-[#e8a428]", // golden meadow
    "from-[#cbe2f7] via-[#a6cbf0] to-[#7fb3e5]", // sky blue
    "from-[#fdc5cf] via-[#f59ab1] to-[#e16a8d]", // sunset pink
    "from-[#bce8c4] via-[#7dcf8c] to-[#3a9a4f]", // grass green
    "from-[#243a72] via-[#1a2a55] to-[#0c1632]", // night sky
  ];

  function nextPage() {
    if (page >= pages.length - 1) return;
    const next = page + 1;
    setPage(next);
    speak(pages[next], { rate: 0.78 });
  }
  function prevPage() {
    if (page === 0) return;
    setPage(page - 1);
    speak(pages[page - 1], { rate: 0.78 });
  }
  function readCurrent() {
    speak(pages[page], { rate: 0.78 });
  }

  const sceneIdx = page % sceneBgs.length;

  return (
    <Shell
      bg={`bg-gradient-to-br ${sceneBgs[sceneIdx]}`}
      border="border-white/40"
      hero={hero}
      badgeBg="bg-white/80 text-[#3d2f0c]"
      badge={<><BookOpen className="h-3.5 w-3.5" /> Bedtime book</>}
    >
      <div className="relative min-h-[280px] md:min-h-[340px]">
        {/* Ambient layered decorations — sit behind hero emoji (z-0) */}
        {/* Drifting cloud */}
        <motion.span
          animate={{ x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0 }}
          className="pointer-events-none absolute left-3 top-6 z-0 text-3xl opacity-60"
          aria-hidden
        >
          ☁️
        </motion.span>
        {/* Pulsing moon */}
        <motion.span
          animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.85, 0.55] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1.2 }}
          className="pointer-events-none absolute right-4 top-4 z-0 text-2xl"
          aria-hidden
        >
          🌙
        </motion.span>
        {/* Twinkling star 1 */}
        <motion.span
          animate={{ scale: [1, 1.4, 0.8, 1], opacity: [0.5, 1, 0.4, 0.5] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 0.4 }}
          className="pointer-events-none absolute left-[15%] top-[18%] z-0 text-lg"
          aria-hidden
        >
          ⭐
        </motion.span>
        {/* Twinkling star 2 */}
        <motion.span
          animate={{ scale: [0.9, 1.35, 0.9], opacity: [0.4, 0.9, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 1.8 }}
          className="pointer-events-none absolute right-[12%] top-[30%] z-0 text-base"
          aria-hidden
        >
          ⭐
        </motion.span>
        {/* Twinkling star 3 */}
        <motion.span
          animate={{ scale: [1, 1.3, 1], opacity: [0.35, 0.75, 0.35] }}
          transition={{ repeat: Infinity, duration: 4.1, ease: "easeInOut", delay: 0.9 }}
          className="pointer-events-none absolute left-[8%] top-[45%] z-0 text-sm"
          aria-hidden
        >
          ⭐
        </motion.span>
        {/* Alternate-rhythm sparkle */}
        <motion.span
          animate={{ scale: [1, 1.5, 0.9, 1], opacity: [0.6, 1, 0.5, 0.6], rotate: [0, 15, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3.7, ease: "easeInOut", delay: 2.5 }}
          className="pointer-events-none absolute right-[18%] top-[12%] z-0 text-xl"
          aria-hidden
        >
          ✨
        </motion.span>

        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            {/* Big illustrated scene */}
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="text-9xl md:text-[10rem]"
            >
              {heroEmoji[page % heroEmoji.length]}
            </motion.div>
            {/* Stars decorating */}
            <motion.span
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute right-2 top-2 text-3xl"
            >
              ✨
            </motion.span>
            <motion.span
              animate={{ scale: [1.2, 0.9, 1.2], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute left-2 bottom-2 text-2xl"
            >
              ⭐
            </motion.span>
            <p className="relative mt-4 max-w-md text-2xl font-bold leading-tight text-[#1c211c] md:text-3xl">
              {pages[page]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Big tap controls */}
      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={prevPage}
          disabled={page === 0}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg disabled:opacity-30 active:scale-90"
        >
          <ChevronLeft className="h-7 w-7 text-[#3d2f0c]" />
        </button>
        <button
          onClick={readCurrent}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3d2f0c] text-white shadow-lg active:scale-90"
        >
          <Volume2 className="h-7 w-7" />
        </button>
        <button
          onClick={nextPage}
          disabled={page >= pages.length - 1}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg disabled:opacity-30 active:scale-90"
        >
          <ChevronRight className="h-7 w-7 text-[#3d2f0c]" />
        </button>
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => { setPage(i); speak(pages[i], { rate: 0.78 }); }}
            className={`h-2.5 rounded-full transition-all ${i === page ? "w-10 bg-white" : "w-2.5 bg-white/40"}`}
          />
        ))}
      </div>
    </Shell>
  );
}

// ---------- PROMPT cards ----------

function PromptCards({ module: m }: { module: GeneratedModule }) {
  const lines = m.body.split(/(?<=[?!.])\s+/).filter((s) => s.trim().length > 4).slice(0, 4);
  return (
    <Shell
      bg="bg-gradient-to-br from-[#dbe8f5] via-[#cfdcef] to-[#bccde4]"
      border="border-[#9bb3d2]"
      badgeBg="bg-[#bcd0e6] text-[#1c3856]"
      badge={<><Sparkles className="h-3.5 w-3.5" /> Talk together</>}
    >
      <div className="space-y-2">
        {lines.map((line, i) => (
          <button
            key={i}
            onClick={() => speak(line, { rate: 0.85, pitch: 1.05 })}
            className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left shadow-sm transition active:scale-[0.98]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3a6da8] text-base font-bold text-white">
              {i + 1}
            </span>
            <span className="text-sm font-semibold leading-5 text-[#1c3856]">{line.trim()}</span>
            <Volume2 className="ml-auto h-4 w-4 text-[#3a6da8]/60" />
          </button>
        ))}
      </div>
    </Shell>
  );
}

// ---------- FOOD: tap to bounce + sound ----------

function FoodPlay({ module: m }: { module: GeneratedModule }) {
  const items = (m.body.match(/[a-z][a-z ]+(beans|rice|melon|bread|carrot|fruit)/gi) ?? []).slice(0, 3);
  const fallback = items.length > 0 ? items : ["green beans", "brown rice", "watermelon"];

  return (
    <Shell
      bg="bg-gradient-to-br from-[#e8f5d6] via-[#d8ecbf] to-[#c4dfa3]"
      border="border-[#9ec869]"
      badgeBg="bg-[#cfe6a8] text-[#3a4f1a]"
      badge={<><Leaf className="h-3.5 w-3.5" /> Tap to play</>}
    >
      <div className="grid grid-cols-3 gap-3">
        {fallback.map((item, i) => {
          return (
            <FoodTile key={i} name={item} index={i} />
          );
        })}
      </div>
    </Shell>
  );
}

function FoodTile({ name, index }: { name: string; index: number }) {
  const [bounces, setBounces] = useState(0);
  const emoji = pickFoodEmoji(name);
  function tap() {
    setBounces((b) => b + 1);
    speak(name, { rate: 0.7, pitch: 1.1 });
  }
  return (
    <button
      onClick={tap}
      className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl bg-white shadow-sm active:bg-white/80"
    >
      <motion.span
        key={bounces}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.4, 0.95, 1.1, 1], rotate: [0, -10, 10, -5, 0] }}
        transition={{ duration: 0.6 }}
        className="text-6xl"
      >
        {emoji}
      </motion.span>
      <span className="text-[10px] font-bold uppercase tracking-wide text-[#3a4f1a]">
        {name.split(" ").slice(-1)[0]}
      </span>
    </button>
  );
}

// ---------- MOVEMENT: giant tap-to-do steps ----------

function MovementGame({ module: m }: { module: GeneratedModule }) {
  const steps = m.body.split(/[,.;]/).map((s) => s.trim()).filter((s) => s.length > 4).slice(0, 4);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const completed = Object.values(done).filter(Boolean).length;
  const stepEmojis = ["🦘", "🤸", "🛑", "💤", "✨"];

  function toggle(i: number, step: string) {
    setDone((s) => ({ ...s, [i]: !s[i] }));
    if (!done[i]) speak("Yes! " + step.split(" ").slice(0, 4).join(" "), { rate: 0.9, pitch: 1.2 });
  }

  return (
    <Shell
      bg="bg-gradient-to-br from-[#fff1d6] via-[#ffdca8] to-[#ffc079]"
      border="border-[#f0a85c]"
      badgeBg="bg-[#ffd9a3] text-[#5a3306]"
      badge={
        <>
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          >🏀</motion.span>
          {completed}/{steps.length}
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => toggle(i, step)}
            className={`relative flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl text-center transition active:scale-95 ${done[i] ? "bg-[#3a4f1a] text-white" : "bg-white shadow-sm"}`}
          >
            <motion.span
              animate={done[i] ? { scale: [1, 1.5, 1], rotate: [0, 360] } : {}}
              transition={{ duration: 0.6 }}
              className="text-6xl"
            >
              {done[i] ? "✅" : stepEmojis[i % stepEmojis.length]}
            </motion.span>
            <span className={`text-xs font-bold leading-4 ${done[i] ? "text-white" : "text-[#5a3306]"}`}>
              {firstWords(step, 3)}
            </span>
          </button>
        ))}
      </div>
      {completed === steps.length && completed > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl bg-[#3a4f1a] py-3 text-center text-base font-bold text-white"
        >
          🎉 All done — sleep time!
        </motion.div>
      )}
    </Shell>
  );
}

// ---------- VOICE MASCOT: tap to play, bouncing character ----------

function VoiceMascot({ module: m }: { module: GeneratedModule }) {
  const [playing, setPlaying] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  function toggle() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(m.body);
    u.rate = 0.78;
    u.pitch = 0.95;
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
    utterRef.current = u;
    window.speechSynthesis.speak(u);
    setPlaying(true);
  }

  return (
    <Shell
      bg="bg-gradient-to-br from-[#1f2940] via-[#162038] to-[#0a1124]"
      border="border-[#3a4670]"
      badgeBg="bg-[#3a4670] text-[#cfd8ff]"
      badge={<><Volume2 className="h-3.5 w-3.5" /> Listen</>}
    >
      <div className="flex flex-col items-center py-2">
        <button
          onClick={toggle}
          className="relative flex h-32 w-32 items-center justify-center"
        >
          <motion.span
            animate={playing ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ repeat: playing ? Infinity : 0, duration: 0.8 }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7d8fc7] to-[#4a5798] shadow-[0_0_40px_rgba(125,143,199,0.5)]"
          />
          <span className="relative text-7xl">{playing ? "🎵" : "🌙"}</span>
        </button>
        <p className="mt-3 text-base font-bold text-[#e6e9f5]">
          {playing ? "Listening…" : "Tap to listen"}
        </p>
        <div className="mt-3 flex h-8 items-end gap-0.5">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.span
              key={i}
              className="w-1 rounded-full bg-[#7d8fc7]"
              animate={
                playing
                  ? { height: ["20%", `${30 + (Math.sin(i + Date.now() / 200) + 1) * 30}%`, "20%"] }
                  : { height: "20%" }
              }
              transition={{ repeat: playing ? Infinity : 0, duration: 1.2, delay: i * 0.04 }}
            />
          ))}
        </div>
      </div>
    </Shell>
  );
}

// ---------- BREATHING RESET ----------

function BreathingReset({ module: m, hero }: { module: GeneratedModule; hero?: boolean }) {
  const breaths = Number(m.customProps?.breaths ?? 3);
  const anchor = String(m.customProps?.anchorLine ?? "you are safe");
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);

  function startBreathing() {
    setActive(true);
    setCount(0);
    speak(anchor, { rate: 0.7 });
    const interval = setInterval(() => {
      setCount((c) => {
        if (c + 1 >= breaths) {
          clearInterval(interval);
          setActive(false);
          speak("All done. You are safe.", { rate: 0.7 });
          return breaths;
        }
        return c + 1;
      });
    }, 4500);
  }

  return (
    <Shell
      bg="bg-gradient-to-br from-[#ffe4ec] via-[#ffcfdb] to-[#fdb6c5]"
      border="border-[#d18298]"
      hero={hero}
      badgeBg="bg-[#fdc5cf] text-[#5e1830]"
      badge={<><Heart className="h-3.5 w-3.5 fill-[#5e1830]" /> Reset</>}
    >
      <div className="flex flex-col items-center py-2">
        <motion.button
          onClick={!active ? startBreathing : undefined}
          animate={active ? { scale: [1, 1.5, 1] } : { scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: active ? 4.5 : 2, ease: "easeInOut" }}
          className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-[#ffb3c7] to-[#e2738f] shadow-2xl active:scale-95"
        >
          <span className="absolute -inset-2 rounded-full bg-pink-200 opacity-30" />
          <Heart className="relative h-16 w-16 text-white" />
        </motion.button>
        <p className="mt-4 text-2xl font-bold text-[#5e1830]">
          {active ? `Breath ${Math.min(count + 1, breaths)} of ${breaths}` : count === breaths ? "Done. Safe." : `Tap to breathe`}
        </p>
        <p className="mt-1 text-sm italic text-[#5e1830]">&ldquo;{anchor}&rdquo;</p>
      </div>
    </Shell>
  );
}

// ---------- YOUTUBE ----------

function YoutubeRail({ module: m }: { module: GeneratedModule }) {
  const thumbs = [
    { color: "from-rose-300 to-rose-200", icon: "🚛" },
    { color: "from-emerald-300 to-emerald-200", icon: "🏀" },
    { color: "from-amber-300 to-amber-200", icon: "🎵" },
  ];
  return (
    <Shell
      bg="bg-gradient-to-br from-[#fff1f1] via-[#ffe1e1] to-[#ffcdcd]"
      border="border-[#e89898]"
      badgeBg="bg-[#ffd6d6] text-[#7a1e1e]"
      badge={<><PlayCircle className="h-3.5 w-3.5" /> Videos</>}
    >
      <div className="grid grid-cols-3 gap-2">
        {thumbs.map((t, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.95 }}
            className={`relative flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br ${t.color} text-5xl shadow-sm`}
          >
            {t.icon}
            <PlayCircle className="absolute h-10 w-10 text-white/90 drop-shadow" />
          </motion.button>
        ))}
      </div>
    </Shell>
  );
}

// ---------- TOY ----------

function ToyPlay({ module: m }: { module: GeneratedModule }) {
  const [bounces, setBounces] = useState(0);
  return (
    <Shell
      bg="bg-gradient-to-br from-[#f0e6ff] via-[#e4d2f8] to-[#cdb1f0]"
      border="border-[#a98cd6]"
      badgeBg="bg-[#dccaf4] text-[#3d1d6e]"
      badge={<><CircleDollarSign className="h-3.5 w-3.5" /> Hands-on</>}
    >
      <button
        onClick={() => { setBounces((b) => b + 1); speak("Basketball", { rate: 0.8, pitch: 1.1 }); }}
        className="flex w-full flex-col items-center gap-2"
      >
        <motion.span
          key={bounces}
          animate={{ y: [0, -30, 0], rotate: [0, 360] }}
          transition={{ duration: 0.7 }}
          className="text-9xl"
        >
          🏀
        </motion.span>
        <span className="text-xl font-bold text-[#3d1d6e]">Tap to play</span>
      </button>
    </Shell>
  );
}

// ---------- PRINT ----------

function PrintPreview({ module: m }: { module: GeneratedModule }) {
  return (
    <Shell
      bg="bg-[#fefcf2]"
      border="border-dashed border-[#7a715f]"
      badgeBg="bg-[#e8e2cf] text-[#4a4533]"
      badge={<><Printer className="h-3.5 w-3.5" /> Print</>}
    >
      <h3 className="text-base font-bold text-[#4a4533]">{m.title}</h3>
    </Shell>
  );
}

// ---------- DEFAULT ----------

function DefaultCard({ module: m, hero }: { module: GeneratedModule; hero?: boolean }) {
  return (
    <Shell
      bg="bg-gradient-to-br from-[#f4f2ea] to-[#e8e2cf]"
      border="border-[#c6beac]"
      hero={hero}
      badgeBg="bg-[#e8e2cf] text-[#4a4533]"
      badge={<><Wand2 className="h-3.5 w-3.5" /> {m.kind}</>}
    >
      <h3 className="text-lg font-bold text-[#1c211c]">{m.title}</h3>
    </Shell>
  );
}

// ---------- helpers ----------

function splitIntoPages(text: string, target: number): string[] {
  const parts = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
  const pages: string[] = [];
  let current = "";
  for (const part of parts) {
    if ((current + " " + part).trim().length > target && current.length > 0) {
      pages.push(current.trim());
      current = part;
    } else {
      current = (current + " " + part).trim();
    }
  }
  if (current) pages.push(current.trim());
  return pages.length > 0 ? pages : [text];
}

function pickEmoji(_body: string, evidence: string[]): string[] {
  const set: string[] = [];
  const text = (_body + " " + evidence.join(" ")).toLowerCase();
  if (/(truck|recycling|garbage)/.test(text)) set.push("🚛");
  if (/(basketball|sports|hoop)/.test(text)) set.push("🏀");
  if (/(moon|night|sleep)/.test(text)) set.push("🌙");
  if (/(green bean|bean|veg)/.test(text)) set.push("🫛");
  if (/(watermelon|fruit)/.test(text)) set.push("🍉");
  if (/(rice|grain)/.test(text)) set.push("🍚");
  if (/(hop|jump|move)/.test(text)) set.push("🦘");
  if (set.length === 0) set.push("🌙", "✨", "💫", "🐻", "🌟");
  return set;
}

function pickFoodEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("bean")) return "🫛";
  if (n.includes("rice")) return "🍚";
  if (n.includes("melon")) return "🍉";
  if (n.includes("bread") || n.includes("zucchini")) return "🍞";
  if (n.includes("carrot")) return "🥕";
  return "🥗";
}

function firstWords(s: string, n: number): string {
  return s.split(/\s+/).slice(0, n).join(" ");
}

export { Truck };
