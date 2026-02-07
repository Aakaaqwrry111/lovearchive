"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const OPTIONS = [
  "MUN at your school",
  "Near my school",
  "The winter garden bench",
  "The café by the river"
];

const correctAnswers = {
  origin: OPTIONS[0],
  topper: "4.00",
  frequency: "Estranged by GNR"
};

const STORAGE_KEY = "archive-clearance";

const playAudioHint = () => {
  if (typeof window === "undefined") return;
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = 392;
  gain.gain.value = 0.08;
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.4);
};

export default function Gate() {
  const router = useRouter();
  const [origin, setOrigin] = useState(OPTIONS[0]);
  const [topper, setTopper] = useState("");
  const [frequency, setFrequency] = useState("");
  const [error, setError] = useState("");
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000) {
        router.push("/logic");
      }
    }
  }, [router]);

  const canSubmit = useMemo(
    () => origin && topper.trim() && frequency.trim(),
    [origin, topper, frequency]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const isCorrect =
      origin === correctAnswers.origin &&
      topper.trim() === correctAnswers.topper &&
      frequency.trim().toLowerCase() === correctAnswers.frequency.toLowerCase();

    if (!isCorrect) {
      setError("Permission Denied — Try harder, I know you remember.");
      setShakeKey((prev) => prev + 1);
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ cleared: true, timestamp: Date.now() })
    );
    router.push("/logic");
  };

  return (
    <motion.section
      key={shakeKey}
      animate={error ? { x: [0, -12, 12, -8, 8, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass rounded-3xl p-8 w-full max-w-lg space-y-6 ${
        error ? "border border-crimson glow-crimson" : "border border-white/10"
      }`}
    >
      <div className="space-y-2 text-center">
        <p className="uppercase tracking-[0.3em] text-xs text-cyan">Encrypted Gate</p>
        <h1 className="text-3xl font-semibold">The Aprajita Archive</h1>
        <p className="text-sm text-white/70">Answer the memories to unlock the vault.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm">Puzzle 1 — The Origin Point</label>
          <select
            value={origin}
            onChange={(event) => setOrigin(event.target.value)}
            className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan"
          >
            {OPTIONS.map((option) => (
              <option key={option} value={option} className="bg-midnight">
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm">Puzzle 2 — The Topper&apos;s Code</label>
          <input
            type="text"
            inputMode="decimal"
            value={topper}
            onChange={(event) => setTopper(event.target.value)}
            placeholder="4.00"
            className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">Puzzle 3 — The Shared Frequency</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={playAudioHint}
              className="rounded-full px-4 py-2 border border-white/20 hover:border-cyan transition"
            >
              Play hint
            </button>
            <input
              type="text"
              value={frequency}
              onChange={(event) => setFrequency(event.target.value)}
              placeholder="Song title"
              className="flex-1 rounded-xl px-4 py-3 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan"
            />
          </div>
        </div>

        {error && <p className="text-sm text-crimson">{error}</p>}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-full px-4 py-3 bg-crimson text-white font-semibold transition disabled:opacity-40"
        >
          Request clearance
        </button>
      </form>
    </motion.section>
  );
}
