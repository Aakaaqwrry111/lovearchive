"use client";

import { useEffect, useRef } from "react";

const createHearts = (count, width, height) =>
  Array.from({ length: count }, () => ({
    x: width / 2,
    y: height / 2,
    vx: (Math.random() - 0.5) * 6,
    vy: (Math.random() - 0.7) * 6,
    life: 1
  }));

export default function HeartExplosion({ active, onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    let animationFrame;
    let hearts = createHearts(28, canvas.width, canvas.height);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      hearts = createHearts(28, canvas.width, canvas.height);
    };

    const drawHeart = (x, y, size, opacity) => {
      if (!ctx) return;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size, size);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = "#FF2E63";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-2, -2, -5, 1, 0, 5);
      ctx.bezierCurveTo(5, 1, 2, -2, 0, 0);
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hearts.forEach((heart) => {
        heart.x += heart.vx;
        heart.y += heart.vy;
        heart.vy += 0.05;
        heart.life -= 0.01;
        drawHeart(heart.x, heart.y, 2.6, Math.max(heart.life, 0));
      });
      hearts = hearts.filter((heart) => heart.life > 0);

      if (!hearts.length) {
        onComplete?.();
        return;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-30 pointer-events-none"
      aria-hidden="true"
    />
  );
}
