import React from 'react';

export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes pixelFlyIn {
            0% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
            100% { opacity: 1; transform: translate(0, 0) scale(1); }
          }
          .pixel {
            opacity: 0;
            animation: pixelFlyIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          }
          .logo-body {
            opacity: 0;
            animation: pixelFlyIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.5s forwards;
          }
        `}
      </style>

      {/* Animated Gathering Pixels */}
      <g fill="#7C5CFC">
        {/* Main attached jagged parts (forming the left edge) */}
        <rect x="30" y="25" width="10" height="15" rx="2" className="pixel" style={{ '--tx': '-20px', '--ty': '-10px', animationDelay: '0.1s' } as React.CSSProperties} />
        <rect x="25" y="45" width="15" height="12" rx="2" className="pixel" style={{ '--tx': '-30px', '--ty': '0px', animationDelay: '0.2s' } as React.CSSProperties} />
        <rect x="30" y="62" width="10" height="20" rx="2" className="pixel" style={{ '--tx': '-20px', '--ty': '20px', animationDelay: '0.3s' } as React.CSSProperties} />

        {/* Floating Pixels */}
        <rect x="18" y="15" width="10" height="10" rx="2" className="pixel" style={{ '--tx': '-40px', '--ty': '-30px', animationDelay: '0.4s' } as React.CSSProperties} />
        <rect x="8" y="32" width="12" height="12" rx="2" className="pixel" style={{ '--tx': '-50px', '--ty': '-10px', animationDelay: '0.5s' } as React.CSSProperties} />
        <rect x="12" y="55" width="15" height="15" rx="3" className="pixel" style={{ '--tx': '-40px', '--ty': '20px', animationDelay: '0.6s' } as React.CSSProperties} />
        <rect x="4" y="75" width="8" height="8" rx="1.5" className="pixel" style={{ '--tx': '-30px', '--ty': '40px', animationDelay: '0.7s' } as React.CSSProperties} />
        <rect x="20" y="82" width="12" height="12" rx="2" className="pixel" style={{ '--tx': '-20px', '--ty': '50px', animationDelay: '0.8s' } as React.CSSProperties} />
        <rect x="2" y="48" width="6" height="6" rx="1" className="pixel" style={{ '--tx': '-50px', '--ty': '5px', animationDelay: '0.9s' } as React.CSSProperties} />
      </g>

      {/* Main D Shape and Chat Bubble */}
      <g className="logo-body" style={{ '--tx': '20px', '--ty': '0px' } as React.CSSProperties}>
        {/* Solid D Body */}
        <path d="M 38 10 H 60 C 85 10, 100 25, 100 50 C 100 75, 85 90, 60 90 H 38 V 10 Z" fill="#7C5CFC" />
        
        {/* White Chat Bubble inside the D */}
        <path d="M 64 28 C 76.15 28 86 37.85 86 50 C 86 62.15 76.15 72 64 72 C 60 72 56.2 70.9 52.9 69 L 45 73 L 47.5 65 C 44 61 42 55.7 42 50 C 42 37.85 51.85 28 64 28 Z" fill="white" />
        
        {/* Code Symbols </ > inside the Bubble */}
        <g stroke="#7C5CFC" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M 56 42 L 48 50 L 56 58" />
          <path d="M 72 42 L 80 50 L 72 58" />
          <path d="M 67 38 L 61 62" />
        </g>
      </g>
    </svg>
  );
}
