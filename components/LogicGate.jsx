"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";


const lines = [
  "Scanning compatibility parameters…",
  "Data point found: MUN at her school, where Aprajita became the signal.",
  "Conclusion: Standard friendship protocols insufficient.",
  "Execute ‘Upgrade to Relationship’?"
];

const randomOffset = () => ({
  x: Math.random() * 120 - 60,
  y: Math.random() * 80 - 40
});

export default function LogicGate() {
  const [visibleLines, setVisibleLines] = useState([]);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setVisibleLines((prev) => [...prev, lines[index]]);
      index += 1;
      if (index >= lines.length) {
        clearInterval(interval);
      }
    }, 900);

    return () => clearInterval(interval);
  }, []);

  const ready = useMemo(() => visibleLines.length === lines.length, [visibleLines]);

  return (
    <section className="w-full max-w-2xl glass rounded-3xl p-8 space-y-8">
      <div className="space-y-3 terminal text-green-200 text-sm">
        {visibleLines.map((line) => (
          <motion.p
            key={line}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      {ready && (
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button
            type="button"
            onClick={() => window.location.assign("/valentine")}
            className="rounded-full px-6 py-3 bg-cyan text-midnight font-semibold shadow-cyan animate-pulse"
          >
            YES / TRUE
          </button>
          <motion.button
            type="button"
            onMouseEnter={() => setNoOffset(randomOffset())}
            onTouchStart={() => setNoOffset(randomOffset())}
            animate={noOffset}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="rounded-full px-6 py-3 border border-white/20 hover:border-crimson"
          >
            NO / FALSE
          </motion.button>
        </div>
      )}
    </section>
  );
}
