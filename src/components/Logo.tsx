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
        <linearGradient id="grad-main" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" /> {/* Cyan */}
          <stop offset="50%" stopColor="#3B82F6" /> {/* Blue */}
          <stop offset="100%" stopColor="#8B5CF6" /> {/* Purple */}
        </linearGradient>
        <linearGradient id="grad-alt" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        
        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="logo-glow-sm" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Infinity Loop Paths */}
      <path 
        d="M 28 8 C 36 8 36 20 28 20 H 12 C 4 20 4 32 12 32 H 28" 
        fill="none" 
        stroke="url(#grad-main)" 
        strokeWidth="5.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        filter="url(#logo-glow-sm)" 
      />
      
      <path 
        d="M 12 32 C 4 32 4 20 12 20 H 28 C 36 20 36 8 28 8" 
        fill="none" 
        stroke="url(#grad-alt)" 
        strokeWidth="5.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        opacity="0.9" 
        filter="url(#logo-glow)" 
      />
    </svg>
  );
}
