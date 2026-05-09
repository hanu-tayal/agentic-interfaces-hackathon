"use client";

import {
  BookOpen,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Headphones,
  Leaf,
  PlayCircle,
  Printer,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Truck,
  WandSparkles,
  Volume2,
} from "lucide-react";
import { useState } from "react";
import {
  createMockPurchaseApproval,
  toyCandidates,
} from "@/lib/bedtime/commerce";
import {
  createFallbackInterface,
  type GeneratedInterface,
  type GeneratedModule,
} from "@/lib/bedtime/generative-ui";
import { createVoicePlan } from "@/lib/bedtime/voice";

type Tone = "balanced" | "calmer" | "sillier";
type Duration = "7-minute" | "2-minute";
type Mode = "digital" | "print" | "voice" | "youtube" | "toy";

const sourceContext = {
  child: "Toddler",
  reportDate: "Today",
  weeklyTheme: "Move It Week 2",
  nextTheme: "Five Senses Week 1",
  characterTheme: "We Are Responsible",
  activities: [
    "hopping on lily pads",
    "sports heroes",
    "body language",
    "twist, twirl, and spin",
  ],
  meals: ["brown rice", "green beans", "watermelon", "zucchini bread"],
  homeInterests: [
    "garbage trucks",
    "recycling trucks",
    "basketball",
    "movement songs",
  ],
};

const videoCards = [
  {
    title: "Red Light, Green Light movement song",
    channel: "Seeded preschool catalog",
    reason: "Practices stop/go body control from Move It Week 2.",
    prompt: "Ask: What does your body do when the light turns red?",
  },
  {
    title: "Recycling truck cleanup story",
    channel: "Seeded vehicle-learning catalog",
    reason: "Connects garbage truck interest to responsibility and cleanup.",
    prompt: "Ask: What can our truck put in the recycling bin?",
  },
  {
    title: "Basketball bounce and count",
    channel: "Seeded movement catalog",
    reason: "Turns sports heroes into counting, rhythm, and gross motor play.",
    prompt: "Ask: Can you count three quiet bounces with your hands?",
  },
];

function ModuleIcon({ kind }: { kind: GeneratedModule["kind"] }) {
  const className = "h-4 w-4";
  if (kind === "story") return <BookOpen className={className} />;
  if (kind === "prompt") return <Sparkles className={className} />;
  if (kind === "food") return <Leaf className={className} />;
  if (kind === "movement") return <RefreshCcw className={className} />;
  if (kind === "print") return <Printer className={className} />;
  if (kind === "voice") return <Headphones className={className} />;
  if (kind === "youtube") return <PlayCircle className={className} />;
  return <CircleDollarSign className={className} />;
}

export default function HomePage() {
  const [tone, setTone] = useState<Tone>("balanced");
  const [duration, setDuration] = useState<Duration>("7-minute");
  const [mode, setMode] = useState<Mode>("digital");
  const [approvedVideo, setApprovedVideo] = useState(false);
  const [approvedToy, setApprovedToy] = useState(false);
  const [buildCount, setBuildCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedInterface, setGeneratedInterface] =
    useState<GeneratedInterface>(() =>
      createFallbackInterface({ tone: "balanced", duration: "7-minute" }),
    );

  const modules = generatedInterface.modules;
  const story = modules.find((module) => module.id === "story")!;

  async function buildBridge(nextTone = tone, nextDuration = duration) {
    setIsGenerating(true);
    setBuildCount((count) => count + 1);
    try {
      const response = await fetch("/api/bedtime/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tone: nextTone,
          duration: nextDuration,
          context: sourceContext,
        }),
      });
      const manifest = (await response.json()) as GeneratedInterface;
      setGeneratedInterface(manifest);
      setMode("digital");
    } catch {
      setGeneratedInterface(
        createFallbackInterface({ tone: nextTone, duration: nextDuration }),
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function speakStory() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(story.body);
    utterance.rate = tone === "calmer" ? 0.78 : 0.92;
    utterance.pitch = tone === "sillier" ? 1.15 : 0.95;
    window.speechSynthesis.speak(utterance);
  }

  function printPack() {
    if (typeof window !== "undefined") window.print();
  }

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#1c211c]">
      <section className="border-b border-[#d7d2c4] bg-[#fdfbf4]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-6 md:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5f6f52]">
                Agentic Interfaces Hackathon Demo
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-normal text-[#182018] md:text-6xl">
                Bedtime School Bridge
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#4d5748]">
                A generated bedtime interface from daycare context, home
                interests, and parent-approved learning rails.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => void buildBridge()}
                className="inline-flex items-center gap-2 rounded-md bg-[#233325] px-3 py-2 text-sm font-semibold text-white"
              >
                <WandSparkles className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Build bridge"}
              </button>
              <button
                onClick={() => {
                  setDuration("2-minute");
                  void buildBridge(tone, "2-minute");
                }}
                className="inline-flex items-center gap-2 rounded-md border border-[#c6beac] bg-white px-3 py-2 text-sm font-semibold"
              >
                <Sparkles className="h-4 w-4" />
                2-minute
              </button>
              <button
                onClick={() => {
                  setTone("calmer");
                  void buildBridge("calmer", duration);
                }}
                className="inline-flex items-center gap-2 rounded-md border border-[#c6beac] bg-white px-3 py-2 text-sm font-semibold"
              >
                <Headphones className="h-4 w-4" />
                Make calmer
              </button>
              <button
                onClick={() => {
                  setTone("sillier");
                  void buildBridge("sillier", duration);
                }}
                className="inline-flex items-center gap-2 rounded-md border border-[#c6beac] bg-white px-3 py-2 text-sm font-semibold"
              >
                <RefreshCcw className="h-4 w-4" />
                Make sillier
              </button>
              <button
                onClick={() => {
                  setTone("balanced");
                  setDuration("7-minute");
                  void buildBridge("balanced", "7-minute");
                }}
                className="inline-flex items-center gap-2 rounded-md border border-[#c6beac] bg-white px-3 py-2 text-sm font-semibold"
              >
                <RefreshCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            <ContextTile label="Theme" value={sourceContext.weeklyTheme} />
            <ContextTile label="Next" value={sourceContext.nextTheme} />
            <ContextTile label="Character" value={sourceContext.characterTheme} />
            <ContextTile label="Meals" value={sourceContext.meals.join(", ")} />
            <ContextTile
              label="Home interests"
              value={sourceContext.homeInterests.join(", ")}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-5 md:grid-cols-[280px_1fr] md:px-8">
        <aside className="space-y-4">
          <div className="rounded-lg border border-[#d7d2c4] bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#5f6f52]">
              <ShieldCheck className="h-4 w-4" />
              Source Safety
            </div>
            <p className="mt-2 text-sm leading-6 text-[#4d5748]">
              Demo uses sanitized structured fields. No raw Gmail, YouTube
              history, child photos, or private links are stored.
            </p>
          </div>

          <div className="rounded-lg border border-[#d7d2c4] bg-white p-4">
            <p className="text-sm font-semibold text-[#5f6f52]">
              Agent-generated modules
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a715f]">
              build #{buildCount}
            </p>
            <p className="mt-2 rounded-md bg-[#edf4ff] px-3 py-2 text-xs font-semibold leading-5 text-[#20446a]">
              Generated UI manifest: {generatedInterface.generatedBy}. Layout:{" "}
              {generatedInterface.layout.join(" -> ")}
            </p>
            <div className="mt-3 space-y-2">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => {
                    if (module.kind === "print") setMode("print");
                    else if (module.kind === "voice") setMode("voice");
                    else if (module.kind === "youtube") setMode("youtube");
                    else if (module.kind === "toy") setMode("toy");
                    else setMode("digital");
                  }}
                  className="flex w-full items-center gap-2 rounded-md border border-[#e2ddcf] px-3 py-2 text-left text-sm hover:bg-[#f4f2ea]"
                >
                  <ModuleIcon kind={module.kind} />
                  <span className="flex-1">{module.title}</span>
                  <code className="rounded bg-[#f4f2ea] px-1.5 py-0.5 text-[10px] font-semibold text-[#5a6257]">
                    {module.renderer}
                  </code>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          <div className="rounded-lg border border-[#d7d2c4] bg-white p-2">
            <div className="grid grid-cols-5 gap-1">
              {[
                ["digital", "Digital"],
                ["print", "Print"],
                ["voice", "Voice"],
                ["youtube", "YouTube"],
                ["toy", "Toy"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setMode(value as Mode)}
                  className={`rounded-md px-2 py-2 text-sm font-semibold ${
                    mode === value
                      ? "bg-[#233325] text-white"
                      : "text-[#4d5748] hover:bg-[#f4f2ea]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {mode === "digital" && <DigitalView modules={modules} />}
          {mode === "print" && <PrintView modules={modules} onPrint={printPack} />}
          {mode === "voice" && (
            <VoiceView story={story.body} onSpeak={speakStory} tone={tone} />
          )}
          {mode === "youtube" && (
            <YouTubeView
              approved={approvedVideo}
              onApprove={() => setApprovedVideo(true)}
            />
          )}
          {mode === "toy" && (
            <ToyView approved={approvedToy} onApprove={() => setApprovedToy(true)} />
          )}
        </div>
      </section>
    </main>
  );
}

function ContextTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#d7d2c4] bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7a715f]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold leading-5">{value}</p>
    </div>
  );
}

function DigitalView({ modules }: { modules: GeneratedModule[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {modules
        .filter((module) =>
          ["story", "prompt", "food", "movement"].includes(module.kind),
        )
        .map((module) => (
          <GeneratedCard key={module.id} module={module} />
        ))}
    </div>
  );
}

function GeneratedCard({ module }: { module: GeneratedModule }) {
  return (
    <article className="rounded-lg border border-[#d7d2c4] bg-white p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#5f6f52]">
        <ModuleIcon kind={module.kind} />
        {module.title}
      </div>
      <code className="mt-3 inline-flex rounded bg-[#edf4ff] px-2 py-1 text-xs font-semibold text-[#20446a]">
        renderer: {module.renderer}
      </code>
      <p className="mt-3 text-base leading-7 text-[#273025]">{module.body}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {module.evidence.map((item) => (
          <span
            key={item}
            className="rounded-md bg-[#e9f0dd] px-2 py-1 text-xs font-semibold text-[#45543d]"
          >
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}

function PrintView({
  modules,
  onPrint,
}: {
  modules: GeneratedModule[];
  onPrint: () => void;
}) {
  const story = modules.find((module) => module.id === "story")!;
  const prompts = modules.find((module) => module.id === "prompts")!;
  return (
    <section className="rounded-lg border border-[#d7d2c4] bg-white p-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5f6f52]">
            Print Pack Preview
          </p>
          <h2 className="mt-1 text-2xl font-semibold">Tonight's pages</h2>
        </div>
        <button
          onClick={onPrint}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#233325] px-4 py-2 text-sm font-semibold text-white"
        >
          <Printer className="h-4 w-4" />
          Print tonight
        </button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 print:grid-cols-1">
        <div className="min-h-[360px] rounded-lg border border-[#d7d2c4] bg-[#fdfbf4] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7a715f]">
            Child page
          </p>
          <h3 className="mt-3 text-3xl font-semibold leading-tight">
            {story.title}
          </h3>
          <p className="mt-5 text-xl leading-9">{story.body}</p>
        </div>
        <div className="min-h-[360px] rounded-lg border border-[#d7d2c4] bg-[#fdfbf4] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7a715f]">
            Parent page
          </p>
          <h3 className="mt-3 text-3xl font-semibold leading-tight">
            Read-aloud guide
          </h3>
          <p className="mt-5 text-xl leading-9">{prompts.body}</p>
          <p className="mt-6 text-lg leading-8">
            Morning follow-up: count three wheels on the way to school.
          </p>
        </div>
      </div>
    </section>
  );
}

function VoiceView({
  story,
  tone,
  onSpeak,
}: {
  story: string;
  tone: Tone;
  onSpeak: () => void;
}) {
  const voicePlan = createVoicePlan(tone);

  return (
    <section className="rounded-lg border border-[#d7d2c4] bg-white p-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5f6f52]">
            Voice Companion
          </p>
          <h2 className="mt-1 text-2xl font-semibold">Calm read-aloud mode</h2>
        </div>
        <button
          onClick={onSpeak}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#233325] px-4 py-2 text-sm font-semibold text-white"
        >
          <Volume2 className="h-4 w-4" />
          Listen
        </button>
      </div>
      <div className="mt-5 rounded-lg bg-[#f4f2ea] p-5">
        <p className="text-sm font-semibold text-[#5f6f52]">
          Transcript ({voicePlan.pace})
        </p>
        <p className="mt-3 text-lg leading-8">{story}</p>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#5a6257]">
        Provider: {voicePlan.provider}. Voice: {voicePlan.voiceName}.{" "}
        {voicePlan.safetyNote}
      </p>
    </section>
  );
}

function YouTubeView({
  approved,
  onApprove,
}: {
  approved: boolean;
  onApprove: () => void;
}) {
  const toyRecommendation = toyCandidates[0];
  const approval = approved
    ? createMockPurchaseApproval(toyRecommendation)
    : undefined;

  return (
    <section className="rounded-lg border border-[#d7d2c4] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5f6f52]">
            Guided YouTube Rail
          </p>
          <h2 className="mt-1 text-2xl font-semibold">
            Parent-approved learning set
          </h2>
        </div>
        <Truck className="h-7 w-7 text-[#5f6f52]" />
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {videoCards.map((video) => (
          <article
            key={video.title}
            className="rounded-lg border border-[#d7d2c4] bg-[#fdfbf4] p-4"
          >
            <p className="text-sm font-semibold text-[#5f6f52]">
              {video.channel}
            </p>
            <h3 className="mt-2 text-lg font-semibold leading-6">
              {video.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#4d5748]">
              {video.reason}
            </p>
            <p className="mt-3 text-sm font-semibold leading-6">
              {video.prompt}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-3 rounded-lg border border-[#d7d2c4] p-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-6 text-[#4d5748]">
          Stop point: watch one video, then print or play the follow-up
          recycling-truck cleanup game.
        </p>
        <button
          onClick={onApprove}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#233325] px-4 py-2 text-sm font-semibold text-white"
        >
          <CheckCircle2 className="h-4 w-4" />
          {approved ? "Approved" : "Approve set"}
        </button>
      </div>
    </section>
  );
}

function ToyView({
  approved,
  onApprove,
}: {
  approved: boolean;
  onApprove: () => void;
}) {
  const toyRecommendation = toyCandidates[0];
  const approval = approved
    ? createMockPurchaseApproval(toyRecommendation)
    : undefined;

  return (
    <section className="rounded-lg border border-[#d7d2c4] bg-white p-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5f6f52]">
          Mock Commerce Rail
        </p>
        <h2 className="mt-1 text-2xl font-semibold">
          Hands-on learning extension
        </h2>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_280px]">
        <article className="rounded-lg border border-[#d7d2c4] bg-[#fdfbf4] p-5">
          <p className="text-sm font-semibold text-[#5f6f52]">Toy match</p>
          <h3 className="mt-2 text-2xl font-semibold">
            {toyRecommendation.title}
          </h3>
          <p className="mt-3 text-base leading-7">
            {toyRecommendation.learningReason}
          </p>
          <p className="mt-4 text-sm font-semibold text-[#4d5748]">
            {toyRecommendation.safetyNote}
          </p>
          <p className="mt-4 text-sm leading-6 text-[#4d5748]">
            Next provider: Amazon handoff or protocol-native checkout when a
            merchant supports agentic commerce.
          </p>
        </article>
        <aside className="rounded-lg border border-[#d7d2c4] bg-[#fdfbf4] p-5">
          <p className="text-sm font-semibold text-[#5f6f52]">
            Purchase approval
          </p>
          <p className="mt-3 text-3xl font-semibold">
            {toyRecommendation.priceLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#4d5748]">
            Mock checkout only. No real money moves in the demo.
          </p>
          {approval && (
            <p className="mt-3 rounded-md bg-[#e9f0dd] px-3 py-2 text-xs font-semibold leading-5 text-[#45543d]">
              {approval.auditNote}
            </p>
          )}
          <button
            onClick={onApprove}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#233325] px-4 py-2 text-sm font-semibold text-white"
          >
            <FileText className="h-4 w-4" />
            {approved ? "Receipt created" : "Approve mock purchase"}
          </button>
        </aside>
      </div>
    </section>
  );
}
