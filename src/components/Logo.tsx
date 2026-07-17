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
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" /> {/* Cyan */}
          <stop offset="50%" stopColor="#3B82F6" /> {/* Blue */}
          <stop offset="100%" stopColor="#8B5CF6" /> {/* Purple */}
        </linearGradient>
        
        <mask id="hollow-nodes">
          <rect width="40" height="40" fill="white" />
          <circle cx="20" cy="6" r="3.5" fill="black" />
          <circle cx="20" cy="34" r="3.5" fill="black" />
          <circle cx="6" cy="20" r="3.5" fill="black" />
          <circle cx="34" cy="20" r="3.5" fill="black" />
        </mask>

        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Background ambient glow */}
      <circle cx="20" cy="20" r="14" fill="#3B82F6" fillOpacity="0.15" filter="url(#logo-glow)" />

      {/* Connecting lines */}
      <path 
        d="M 20 6 L 6 20 L 20 34 L 34 20 Z M 20 20 L 20 34" 
        fill="none" 
        stroke="url(#logo-grad)" 
        strokeWidth="3.5" 
        strokeLinejoin="round"
        strokeLinecap="round"
        mask="url(#hollow-nodes)"
      />

      {/* Hollow outer nodes */}
      <circle cx="20" cy="6" r="4.5" fill="none" stroke="url(#logo-grad)" strokeWidth="3" />
      <circle cx="20" cy="34" r="4.5" fill="none" stroke="url(#logo-grad)" strokeWidth="3" />
      <circle cx="6" cy="20" r="4.5" fill="none" stroke="url(#logo-grad)" strokeWidth="3" />
      <circle cx="34" cy="20" r="4.5" fill="none" stroke="url(#logo-grad)" strokeWidth="3" />

      {/* Solid center node */}
      <circle cx="20" cy="20" r="4.5" fill="url(#logo-grad)" />
    </svg>
  );
}
