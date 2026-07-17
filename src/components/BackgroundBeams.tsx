"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function BackgroundBeams() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const beams: {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      angle: number;
    }[] = [];

    // Create initial beams
    for (let i = 0; i < 15; i++) {
      beams.push({
        x: Math.random() * w,
        y: Math.random() * h,
        length: Math.random() * 150 + 50,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        angle: (Math.random() * 15 - 7.5) * (Math.PI / 180), // Slight angle
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      
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

        // Move beam
        beam.x += Math.cos(beam.angle) * beam.speed;
        beam.y += Math.sin(beam.angle) * beam.speed;

        // Reset if off screen
        if (beam.x > w + beam.length || beam.y > h + beam.length || beam.y < -beam.length) {
          beam.x = Math.random() > 0.5 ? -beam.length : Math.random() * w;
          beam.y = Math.random() * h;
          beam.opacity = Math.random() * 0.5 + 0.1;
          beam.speed = Math.random() * 2 + 0.5;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 -z-20 overflow-hidden pointer-events-none"
    >
      <canvas ref={canvasRef} className="w-full h-full opacity-60" />
      {/* Vignette mask to fade out edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_100%)]" />
    </motion.div>
  );
}
