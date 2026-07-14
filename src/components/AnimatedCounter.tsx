"use client";

import { useState } from "react";

interface CounterProps {
  end: number;
  suffix?: string;
  label: string;
}

export default function AnimatedCounter({ end, suffix = "", label }: CounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  const startAnimation = () => {
    if (hasAnimated) return;
    setHasAnimated(true);

    const duration = 1500;
    const steps = 40;
    const increment = end / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      // Easing — tezroq boshlanadi, sekinroq tugaydi
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.round(eased * end);

      setCount(current);
      if (step >= steps) {
        setCount(end);
        clearInterval(timer);
      }
    }, duration / steps);
  };

  return (
    <div
      className="group text-center"
      ref={(el) => {
        if (!el) return;
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              startAnimation();
              observer.unobserve(el);
            }
          },
          { threshold: 0.5 }
        );
        observer.observe(el);
      }}
    >
      <div className="text-4xl font-extrabold text-gradient sm:text-5xl">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-sm font-medium text-gray-500">
        {label}
      </div>
    </div>
  );
}
