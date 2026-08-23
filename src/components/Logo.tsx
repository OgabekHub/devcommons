import React from 'react';
import Image from 'next/image';

export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <Image 
      src="/new-logo.png" 
      alt="DevCommons Logo" 
      width={32} 
      height={32} 
      className={className} 
    />
  );
}
