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
        <linearGradient id="logo-d-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" /> {/* purple-500 */}
          <stop offset="100%" stopColor="#4F46E5" /> {/* indigo-600 */}
        </linearGradient>
        <linearGradient id="logo-c-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" /> {/* cyan-500 */}
          <stop offset="100%" stopColor="#3B82F6" /> {/* blue-500 */}
        </linearGradient>
      </defs>
      
      {/* Background shape */}
      <rect width="40" height="40" rx="10" fill="url(#logo-d-grad)" fillOpacity="0.15" stroke="url(#logo-d-grad)" strokeOpacity="0.2" strokeWidth="1" />

      {/* D Curve */}
      <path 
        d="M 14 10 V 30 M 14 10 H 20 A 10 10 0 0 1 20 30 H 14" 
        stroke="url(#logo-d-grad)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* C Curve */}
      <path 
        d="M 31 13 A 10 10 0 1 0 31 27" 
        stroke="url(#logo-c-grad)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}
