"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function SpotlightCard({ children, className = "", delay = 0 }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Spotlight mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXSpring = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  function handleMouseLeave() {
    setIsHovered(false);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      // NOTE: No rotateX/rotateY/preserve-3d — 3D tilt was causing icon layout shifts
      className={`relative overflow-hidden ${className}`}
    >
      {/* Spotlight glow that follows the cursor */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          background: useTransform(
            [mouseXSpring, mouseYSpring],
            ([mx, my]) =>
              `radial-gradient(400px circle at ${mx}px ${my}px, rgba(124,92,252,0.15), transparent 40%)`
          ) as any,
        }}
      />

      {/* Content above spotlight */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}
