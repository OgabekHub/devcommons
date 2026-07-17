import React from 'react';
import Image from 'next/image';

export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div className={`relative ${className} overflow-hidden rounded-xl`}>
      <Image 
        src="/logo.png" 
        alt="DevCommons Logo" 
        fill
        className="object-cover mix-blend-screen scale-[1.3]"
        priority
      />
    </div>
  );
}
