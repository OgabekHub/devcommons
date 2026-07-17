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
        <linearGradient id="cube-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="cube-left" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <linearGradient id="cube-right" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
        <filter id="cube-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="d-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      
      {/* Background shape glow */}
      <polygon points="20,5 35,12 35,28 20,35 5,28 5,12" fill="#8B5CF6" filter="url(#cube-glow)" fillOpacity="0.4" />

      {/* Cube Faces */}
      <polygon points="20,5 35,12.5 20,20 5,12.5" fill="url(#cube-top)" stroke="#C084FC" strokeWidth="0.75" strokeLinejoin="round" />
      <polygon points="5,12.5 20,20 20,35 5,27.5" fill="url(#cube-left)" stroke="#A855F7" strokeWidth="0.75" strokeLinejoin="round" />
      <polygon points="20,20 35,12.5 35,27.5 20,35" fill="url(#cube-right)" stroke="#60A5FA" strokeWidth="0.75" strokeLinejoin="round" />
      
      {/* Inner subtle lines to make it look like glass */}
      <line x1="20" y1="20" x2="20" y2="35" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1" />
      <line x1="20" y1="20" x2="5" y2="12.5" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1" />
      <line x1="20" y1="20" x2="35" y2="12.5" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1" />

      {/* Geometric 'D' overlaid */}
      <path 
        d="M 14 11 V 29 M 14 11 H 20 A 9 9 0 0 1 20 29 H 14" 
        stroke="url(#d-grad)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}
