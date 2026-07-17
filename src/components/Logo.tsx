import React from 'react';

export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ribbon-curve" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" /> {/* Cyan */}
          <stop offset="50%" stopColor="#3B82F6" /> {/* Blue */}
          <stop offset="100%" stopColor="#8B5CF6" /> {/* Purple */}
        </linearGradient>
        <linearGradient id="ribbon-stem" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" /> {/* Purple */}
          <stop offset="100%" stopColor="#22D3EE" /> {/* Cyan */}
        </linearGradient>
        <linearGradient id="spark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        
        <filter id="ribbon-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="0" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.4" />
        </filter>
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Background ambient glow */}
      <circle cx="20" cy="20" r="14" fill="#3B82F6" fillOpacity="0.15" filter="url(#neon-glow)" />

      {/* The Curve (Back part of the ribbon) */}
      <path 
        d="M 14 10 H 20 C 27 10 32 14.5 32 20 C 32 25.5 27 30 20 30 H 14" 
        stroke="url(#ribbon-curve)" 
        strokeWidth="5" 
        strokeLinecap="round" 
      />

      {/* The Stem (Front part of the ribbon, overlapping the curve) */}
      <path 
        d="M 14 31 V 9" 
        stroke="url(#ribbon-stem)" 
        strokeWidth="5" 
        strokeLinecap="round" 
        filter="url(#ribbon-shadow)"
      />

      {/* AI Spark / Magic Star */}
      <path 
        d="M 32 4 Q 32 10 38 10 Q 32 10 32 16 Q 32 10 26 10 Q 32 10 32 4 Z" 
        fill="url(#spark-grad)" 
        filter="url(#neon-glow)"
      />
    </svg>
  );
}
