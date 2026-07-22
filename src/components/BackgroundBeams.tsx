"use client";

import { useEffect, useRef } from "react";

export default function BackgroundBeams() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use smaller canvas dimensions — render at 0.5x for performance
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = canvas.width = window.innerWidth * dpr;
    let h = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.scale(dpr, dpr);

    const beams: {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      angle: number;
    }[] = [];

    // Fewer beams for perf
    const beamCount = window.innerWidth < 768 ? 6 : 12;
    for (let i = 0; i < beamCount; i++) {
      beams.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        length: Math.random() * 150 + 50,
        speed: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.4 + 0.08,
        angle: (Math.random() * 15 - 7.5) * (Math.PI / 180),
      });
    }

    let animationFrameId: number;
    let lastTime = 0;
    const FPS_LIMIT = 40; // Cap at 40fps — saves CPU, imperceptible to user
    const INTERVAL = 1000 / FPS_LIMIT;

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);
      const delta = time - lastTime;
      if (delta < INTERVAL) return;
      lastTime = time - (delta % INTERVAL);

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "screen";

      beams.forEach((beam) => {
        ctx.beginPath();
        ctx.moveTo(beam.x, beam.y);
        ctx.lineTo(
          beam.x + Math.cos(beam.angle) * beam.length,
          beam.y + Math.sin(beam.angle) * beam.length
        );

        const gradient = ctx.createLinearGradient(
          beam.x, beam.y,
          beam.x + Math.cos(beam.angle) * beam.length,
          beam.y + Math.sin(beam.angle) * beam.length
        );

        gradient.addColorStop(0, `rgba(124, 92, 252, 0)`);
        gradient.addColorStop(0.5, `rgba(124, 92, 252, ${beam.opacity})`);
        gradient.addColorStop(1, `rgba(124, 92, 252, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        beam.x += Math.cos(beam.angle) * beam.speed;
        beam.y += Math.sin(beam.angle) * beam.speed;

        if (beam.x > window.innerWidth + beam.length || beam.y > window.innerHeight + beam.length || beam.y < -beam.length) {
          beam.x = Math.random() > 0.5 ? -beam.length : Math.random() * window.innerWidth;
          beam.y = Math.random() * window.innerHeight;
          beam.opacity = Math.random() * 0.4 + 0.08;
          beam.speed = Math.random() * 1.5 + 0.3;
        }
      });
    };

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      const w2 = window.innerWidth;
      const h2 = window.innerHeight;
      canvas.width = w2 * dpr;
      canvas.height = h2 * dpr;
      canvas.style.width = w2 + "px";
      canvas.style.height = h2 + "px";
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-50"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_100%)]" />
    </div>
  );
}
