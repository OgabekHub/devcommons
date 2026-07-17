"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { ReactNode } from "react";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.15, smoothWheel: true, wheelMultiplier: 1.5, syncTouch: true }}>
      {children}
    </ReactLenis>
  );
}
