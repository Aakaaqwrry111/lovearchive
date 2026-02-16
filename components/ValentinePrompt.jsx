"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import HeartExplosion from "./HeartExplosion";

const GIFS = {
  intro: "/gifs/gif1.gif",
  mun: "https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif",
  yap: "/gifs/gif6.gif",
  art: "/gifs/gif2.gif",
  sick: "/gifs/gif3.gif", 
  lucky: "/gifs/lucky.gif", 
  final: "/gifs/gif5.gif" 
};

const PARTS = [
  {
    heading: "Hey Dabba... wait, scratch that. 💌",
    body: "It's been exactly a year of us talking, and I think it's officially time to upgrade your nickname. 'Dabba' is cute, but I'm aiming for something a bit more... Bae-material.",
    accent: "System update: Nickname upgrade pending...",
    gif: GIFS.intro,
    cta: "Proceed to upgrade 🚀"
  },
  {
    heading: "Chapter 1: The SRES MUN 🌸",
    body: "We haven't seen each other in person since that MUN at your school. But somehow, spending this whole year talking to you through a screen has been my favorite plot twist.",
    accent: "From passing delegates to my favorite notification.",
    gif: GIFS.mun,
    cta: "Keep scrolling 💗"
  },
  {
    heading: "My Favorite Yapper 🗣️",
    body: "You claim you're an introvert, but the way you yap about your entire day to me? It literally breathes life into my routine. I wouldn't trade your voice notes for anything.",
    accent: "Please never stop yapping.",
    gif: GIFS.yap,
    cta: "Tell me more 🎧"
  },
  {
    heading: "The 4'11\" Masterpiece 🎨",
    body: "You write beautiful poems, you draw, you sing... you're basically a walking, talking, 4-foot-11 piece of art. (Yes, I had to mention the height, down there).",
    accent: "Short height, impossibly huge talent.",
    gif: GIFS.art,
    cta: "Next slide, Picasso ✨"
  },
  {
    heading: "Virtual Soup & Hugs 🍲",
    body: "I know your immune system likes to take random vacations and you get sick way too often. Since I can't be there to take care of you right now, consider this page a permanent, virtual warm hug.",
    accent: "Stay healthy for me, okay?",
    gif: GIFS.sick,
    cta: "Aww, next 🥺"
  },
  {
    heading: "My Personal Lucky Charm 🍀",
    body: "Ever since you walked into my life, I've been winning contests left and right. Coincidence? Nope. You make me feel so lively, Aprajita. You're my literal lucky charm.",
    accent: "Bringing me luck, making me smile.",
    gif: GIFS.lucky,
    cta: "Almost there 🌙"
  },
  {
    heading: "The Final Upgrade",
    body: "So, to the girl who yaps to me, brings me luck, owes me a real-life meetup, and has completely stolen my attention... Will you be my Valentine ?",
    accent: "Upgrading Dabba ➡️ Bae.Say yes to see what i've built for you (ACTUALLY, IT WAS MEANT TO BE REVEAL ON PROPOSE DAY UNFORTUNATELY DUE TO MY PROCRASTINATION YK",
    gif: GIFS.final,
    cta: "Yes, obviously! 💍"
  }
];

const FloatingEmoji = ({ emoji, delay }) => (
  <motion.div
    initial={{ y: "110vh", opacity: 0, x: 0 }}
    animate={{ 
      y: "-10vh", 
      opacity: [0, 1, 0],
      x: [0, Math.random() * 50 - 25, 0],
      rotate: [0, Math.random() * 360]
    }}
    transition={{ duration: 10 + Math.random() * 5, repeat: Infinity, delay, ease: "linear" }}
    className="absolute pointer-events-none text-3xl sm:text-4xl"
    style={{ left: `${Math.random() * 100}%` }}
  >
    {emoji}
  </motion.div>
);

const getRandomOffset = (attempt) => {
  const intensity = Math.min(attempt * 25, 180);
  return {
    x: (Math.random() - 0.5) * intensity * 4,
    y: (Math.random() - 0.5) * intensity * 3,
    rotate: (Math.random() - 0.5) * 40
  };
};

export default function ValentinePrompt({ onClose }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [noAttempts, setNoAttempts] = useState(0);
  const [noBtnOffset, setNoBtnOffset] = useState({ x: 0, y: 0, rotate: 0 });
  const [exploding, setExploding] = useState(false);

  const current = useMemo(() => PARTS[step], [step]);
  const isFinal = step === PARTS.length - 1;

  const handlePrimaryClick = () => {
    if (isFinal) {
      setExploding(true);
      return;
    }
    setStep((prev) => Math.min(prev + 1, PARTS.length - 1));
  };

  const handleNo = () => {
    setNoAttempts((prev) => prev + 1);
    setNoBtnOffset(getRandomOffset(noAttempts + 1));
  };

  const handleComplete = () => {
    setExploding(false);
    router.push("/vault");
  };

  return (
    <div className="relative min-h-screen w-full overflow-y-auto bg-gradient-to-br from-pink-50 via-rose-100 to-red-50 font-sans selection:bg-rose-200 selection:text-rose-900">
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        {[...Array(18)].map((_, index) => (
          <FloatingEmoji
            key={index}
            emoji={["💖", "🍀", "🎨", "🎤", "🍲", "🫶", "🌸"][index % 7]}
            delay={index * 0.6}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10 text-center">
        <AnimatePresence mode="wait">
          {!exploding ? (
            <motion.section
              key={step}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-3xl rounded-[2.5rem] border border-white/60 bg-white/70 p-8 sm:p-12 backdrop-blur-xl shadow-2xl shadow-rose-200/50"
            >
              <p className="mb-6 text-sm font-medium uppercase tracking-widest text-rose-400/80">
                Level {step + 1} of 7 ✨
              </p>

              <motion.img
                key={current.gif}
                initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                src={current.gif}
                alt="cute reaction"
                className="mx-auto mb-8 h-32 w-32 rounded-full border-4 border-white bg-white object-cover shadow-lg shadow-rose-300/40 sm:h-40 sm:w-40"
              />

              <h2 className="text-3xl font-bold tracking-tight text-rose-900 sm:text-5xl font-serif">
                {current.heading}
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-rose-700 sm:text-2xl">
                {current.body}
              </p>

              <p className="mt-5 text-base font-medium italic text-rose-500 sm:text-lg">
                "{current.accent}"
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrimaryClick}
                  className="min-w-[220px] rounded-full bg-gradient-to-r from-rose-400 to-pink-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-rose-300/50 transition-all hover:shadow-rose-400/60"
                >
                  {current.cta}
                </motion.button>

                {isFinal && (
                  <motion.button
                    type="button"
                    animate={noBtnOffset}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    onMouseEnter={handleNo}
                    onTouchStart={handleNo}
                    onClick={handleNo}
                    className="absolute sm:relative rounded-full border-2 border-rose-200 px-8 py-4 text-lg font-medium text-rose-500 transition-colors hover:bg-rose-50 bg-white sm:bg-transparent"
                  >
                    Nope 🙈
                  </motion.button>
                )}
              </div>
            </motion.section>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="z-20 text-center"
            >
              <motion.h1
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="text-5xl font-bold text-rose-900 sm:text-7xl font-serif"
              >
                Upgraded to Bae! 💖
              </motion.h1>
              <p className="mt-6 text-2xl font-medium text-rose-700">
                Saving our new relationship status...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <HeartExplosion active={exploding} onComplete={handleComplete} />
      </div>
    </div>
  );
}