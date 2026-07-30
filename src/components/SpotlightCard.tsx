"use client";

import React from "react";
import { motion } from "framer-motion";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function SpotlightCard({ children, className = "", delay = 0 }: SpotlightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
}
