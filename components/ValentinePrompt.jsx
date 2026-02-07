"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import HeartExplosion from "./HeartExplosion";

const randomPosition = () => ({
  x: Math.random() * 140 - 70,
  y: Math.random() * 120 - 60
});

export default function ValentinePrompt({ onClose }) {
  const router = useRouter();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [exploding, setExploding] = useState(false);

  const handleYes = () => {
    setExploding(true);
  };

  const handleComplete = () => {
    setExploding(false);
    router.push("/vault");
  };

  const overlay = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-20 flex items-center justify-center bg-midnight/80 px-4"
      >
        <div className="glass rounded-3xl p-8 max-w-lg w-full text-center space-y-6 relative">
          <p className="uppercase tracking-[0.3em] text-xs text-cyan">Valentine Protocol</p>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">In a universe of probabilities,</h2>
            <p className="text-white/80">
              every path keeps leading me back to you, Aprajita. Will you be my Valentine?
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={handleYes}
              className="rounded-full px-6 py-3 bg-crimson text-white font-semibold glow-crimson"
            >
              YES
            </button>
            <motion.button
              type="button"
              onMouseEnter={() => setOffset(randomPosition())}
              onTouchStart={() => setOffset(randomPosition())}
              animate={offset}
              transition={{ type: "spring", stiffness: 160, damping: 16 }}
              className="rounded-full px-6 py-3 border border-white/20"
            >
              NO
            </motion.button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-white/60 hover:text-white"
          >
            Close
          </button>
        </div>
        <HeartExplosion active={exploding} onComplete={handleComplete} />
      </motion.div>
    ),
    [exploding, handleComplete, offset, onClose]
  );

  return overlay;
}
