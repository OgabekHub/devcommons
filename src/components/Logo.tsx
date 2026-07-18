import React from 'react';

export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <img 
      src="/logo.png" 
      alt="DevCommons Logo" 
      className={className} 
    />
  );
}
