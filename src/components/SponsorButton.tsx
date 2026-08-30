"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";

interface SponsorButtonProps {
  authorName: string;
}

export default function SponsorButton({ authorName }: SponsorButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href="https://github.com/sponsors"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-fg transition-all duration-300 rounded-xl overflow-hidden mt-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradients */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-600 via-rose-600 to-orange-600 opacity-0 group-hover:opacity-100 scale-105 transition-all duration-300" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2 drop-shadow-sm">
        <Heart 
          className={`h-4 w-4 ${isHovered ? "fill-white animate-pulse" : "fill-transparent"}`} 
          strokeWidth={2.5}
        />
        Sponsor {authorName}
      </span>

      {/* Shine effect */}
      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
    </a>
  );
}
