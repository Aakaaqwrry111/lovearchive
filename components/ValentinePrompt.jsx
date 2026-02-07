"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import HeartExplosion from "./HeartExplosion";

const GIFS = {
  idle: "https://media1.tenor.com/m/fA246xW3u5AAAAAC/cute-cat.gif",
  plead: "https://media.tenor.com/K_wX3qCgYqgAAAAi/mocha-bear-hearts.gif",
  shock: "https://media.tenor.com/5mY0_O7NxlIAAAAi/mocha-bear-sad.gif",
  celebrate: "https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif"
};

const FloatingEmoji = ({ emoji, delay }) => (
  <motion.div
    initial={{ y: "110vh", opacity: 0 }}
    animate={{ y: "-10vh", opacity: [0, 1, 0] }}
    transition={{ duration: 10, repeat: Infinity, delay: delay, ease: "linear" }}
    className="absolute text-4xl pointer-events-none z-0"
    style={{ left: `${Math.random() * 100}%` }}
  >
    {emoji}
  </motion.div>
);

const getRandomOffset = (attempt) => {
  const intensity = Math.min(attempt * 20, 150);
  return {
    x: (Math.random() - 0.5) * intensity * 4,
    y: (Math.random() - 0.5) * intensity * 4,
    rotate: (Math.random() - 0.5) * 45
  };
};

export default function ValentinePrompt({ onClose }) {
  const router = useRouter();
  const [noBtnOffset, setNoBtnOffset] = useState({ x: 0, y: 0, rotate: 0 });
  const [exploding, setExploding] = useState(false);
  const [stage, setStage] = useState(0);
  const [noAttempts, setNoAttempts] = useState(0);

  const handleYes = () => {
    setExploding(true);
  };

  const handleNo = () => {
    setNoAttempts((prev) => prev + 1);
    setNoBtnOffset(getRandomOffset(noAttempts + 1));
    if (stage < 3) setStage((prev) => prev + 1);
  };

  const handleComplete = () => {
    setExploding(false);
    router.push("/vault");
  };

  const content = useMemo(() => {
    switch (stage) {
      case 0:
        return {
          title: "Aprajita, Status: Irresistible.",
          text: (
            <div className="space-y-4">
              <p>
                Hey. I’ve been running the numbers , and the probability of me crushing
                on you is currently <strong>101%</strong>.
              </p>
              <p>Ready to see what I built for you?</p>
            </div>
          ),
          gif: GIFS.idle,
          btnNo: "No, I'm busy"
        };
      case 1:
        return {
          title: "Wait, Permission Denied?",
          text: (
            <div className="space-y-4">
              <p>
                🛰️ I have logs, you know. I have the timestamps from <strong>MUN</strong>. I have the
                data on your smile.
              </p>
              <p>Don't make me deploy the "Cute Puppy Eyes" protocol.</p>
            </div>
          ),
          gif: GIFS.shock,
          btnNo: "Still No..."
        };
      case 2:
        return {
          title: "Okay, Flirt Mode: ON",
          text: (
            <div className="space-y-4">
              <p>
                🌸 If you were a playlist, I’d keep you on repeat: <em>Estranged by GNR</em>, loud, on
                a loop.
              </p>
              <p>
                You are the bug I never want to fix. The 4.0 GPA of my heart. Try clicking "No"
                again. I dare you. 😏
              </p>
            </div>
          ),
          gif: GIFS.plead,
          btnNo: "Try me"
        };
      case 3:
        return {
          title: "The Final Question",
          text: (
            <div className="space-y-4">
              <p>💫 In a universe of probabilities, every path leads to you.</p>
              <p>
                I don't just want to be a web dev; I want to be <em>your</em> dev.
              </p>
              <p className="block mt-4 text-2xl font-bold text-pink-300">Will you be my Valentine?</p>
            </div>
          ),
          gif: GIFS.plead,
          btnNo: "I can't click this..."
        };
      default:
        return {};
    }
  }, [stage]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <FloatingEmoji key={i} emoji={["💖", "🌹", "✨", "🍫", "👾"][i % 5]} delay={i * 1.5} />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-16 text-center">
        <AnimatePresence mode="wait">
          {!exploding ? (
            <motion.div
              key="stage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex w-full max-w-3xl flex-col items-center gap-8"
            >
              <motion.img
                key={content.gif}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={content.gif}
                alt="Cute Reaction"
                className="h-48 w-48 rounded-full bg-white object-cover shadow-2xl shadow-pink-500/30 sm:h-56 sm:w-56"
              />

              <div className="space-y-5 text-lg leading-relaxed text-gray-100 sm:text-xl">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-400 sm:text-4xl">
                  {content.title}
                </h2>
                {content.text}
              </div>

              <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleYes}
                  className="w-full rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-10 py-4 text-lg font-bold text-white shadow-lg shadow-rose-500/40 sm:w-auto"
                >
                  YES! 💖
                </motion.button>

                <motion.button
                  animate={noBtnOffset}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onMouseEnter={() => {
                    setNoAttempts((prev) => prev + 1);
                    setNoBtnOffset(getRandomOffset(noAttempts + 1));
                  }}
                  onTouchStart={() => {
                    setNoAttempts((prev) => prev + 1);
                    setNoBtnOffset(getRandomOffset(noAttempts + 1));
                  }}
                  onClick={handleNo}
                  className="w-full rounded-full border border-pink-400/50 px-10 py-4 text-lg font-medium text-pink-100 transition-colors hover:bg-pink-500/10 sm:w-auto"
                >
                  {content.btnNo || "No"}
                </motion.button>
              </div>

              <button onClick={onClose} className="text-xs text-white/40 hover:text-white">
                (Escape Hatch for Testing)
              </button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white">
              <motion.h1
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-4xl font-bold text-pink-400 sm:text-5xl"
              >
                SHE SAID YES! 🎉
              </motion.h1>
              <p className="mt-4 text-lg sm:text-xl">Initializing Love Protocol...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <HeartExplosion active={exploding} onComplete={handleComplete} />
      </div>
    </div>
  );
}
