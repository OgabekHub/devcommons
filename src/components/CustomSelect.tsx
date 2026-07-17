"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CustomSelect({ options, value, onChange, placeholder }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#111111] px-4 py-2.5 text-sm text-gray-300 shadow-sm transition-all duration-200 hover:border-brand focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
      >
        <span>{value || placeholder}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#111111] p-1 shadow-2xl scrollbar-thin">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-brand/20 hover:text-brand ${
                value === option ? "bg-white/5 font-semibold text-brand" : "text-gray-400"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
