import React from "react";

interface Props {
  language: string;
  className?: string;
}

export default function LanguageLogo({ language, className = "h-4 w-4 shrink-0" }: Props) {
  const langClean = language?.trim() || "Other";

  switch (langClean) {
    case "JavaScript":
    case "JS":
    case "javascript":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#F7DF1E" />
          <path d="M15.4 17c.7.7 1.4 1.1 2.5 1.1 1 0 1.5-.5 1.5-1.2 0-1-.9-1.4-1.8-1.8l-.2-.1c-1.4-.6-2.6-1.2-2.6-3.3 0-1.9 1.4-3.1 3.3-3.1 1.3 0 2.3.5 3.1 1.3l-1.3 1.4c-.5-.6-1.1-.9-1.8-.9-.6 0-1 .4-1 .9 0 .7.7 1 1.7 1.5l.2.1c1.5.6 2.7 1.3 2.7 3.5 0 2.1-1.4 3.4-3.7 3.4-1.6 0-3-.7-3.9-1.8L15.4 17ZM10.5 17.3c.6.7 1.1 1 1.9 1 .8 0 1.3-.5 1.3-1.7V8.8h2.3v7.9c0 2.1-1.5 3.4-3.7 3.4-1.5 0-2.5-.7-3.2-1.5l1.4-1.3Z" fill="#000000" />
        </svg>
      );

    case "TypeScript":
    case "TS":
    case "typescript":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#3178C6" />
          <path d="M15.4 17c.7.7 1.4 1.1 2.5 1.1 1 0 1.5-.5 1.5-1.2 0-1-.9-1.4-1.8-1.8l-.2-.1c-1.4-.6-2.6-1.2-2.6-3.3 0-1.9 1.4-3.1 3.3-3.1 1.3 0 2.3.5 3.1 1.3l-1.3 1.4c-.5-.6-1.1-.9-1.8-.9-.6 0-1 .4-1 .9 0 .7.7 1 1.7 1.5l.2.1c1.5.6 2.7 1.3 2.7 3.5 0 2.1-1.4 3.4-3.7 3.4-1.6 0-3-.7-3.9-1.8L15.4 17ZM13.1 10.4v9.4h-2.3v-9.4H7.5V8.6h8.8v1.8h-3.2Z" fill="#FFFFFF" />
        </svg>
      );

    case "Python":
    case "python":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.9 2c-5.3 0-5 2.3-5 2.3l.01 2.38h5.08V7.75H4.55C1.99 7.75 1 9.48 1 12.18c0 2.7.89 4.21 3.33 4.21h1.97V13.84c0-2.82 2.39-3.23 2.39-3.23h5.45c1.79 0 2.72-.97 2.72-2.67V3.98c0-1.78-1.13-1.97-4.94-1.97zm-2.52 1.49a.92.92 0 110 1.84.92.92 0 010-1.84z" fill="#387EB8" />
          <path d="M12.08 22c5.32 0 5.01-2.3 5.01-2.3l-.01-2.38h-5.09v-1.07h7.45c2.56 0 3.55-1.72 3.55-4.43 0-2.7-.89-4.21-3.33-4.21h-1.97v2.55c0 2.83-2.39 3.23-2.39 3.23h-5.45c-1.78 0-2.72.97-2.72 2.67v3.96c0 1.78 1.13 1.97 4.94 1.97zm2.52-1.49a.92.92 0 110-1.84.92.92 0 010 1.84z" fill="#FFE052" />
        </svg>
      );

    case "React":
    case "react":
    case "ReactJS":
      return (
        <svg viewBox="-11.5 -10.232 23 20.463" className={className} fill="#61DAFB" xmlns="http://www.w3.org/2000/svg">
          <circle r="2.05" fill="#61DAFB" />
          <g stroke="#61DAFB" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );

    case "Rust":
    case "rust":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#DEA584" fillOpacity="0.15" stroke="#DEA584" strokeWidth="2" strokeDasharray="3 2" />
          <path d="M9 7h4.5c1.66 0 3 1.34 3 3s-1.34 3-3 3H12v4H9V7zm3 4h1.5c.55 0 1-.45 1-1s-.45-1-1-1H12v2zm2 2l2.5 4H14l-2-4h2z" fill="#DEA584" />
        </svg>
      );

    case "Go":
    case "golang":
    case "go":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="#00ADD8" fillOpacity="0.15" stroke="#00ADD8" strokeWidth="1.5" />
          <path d="M7 14c-.83 0-1.5-.67-1.5-1.5S6.17 11 7 11c.39 0 .74.15 1 .39l-.71.71c-.08-.06-.18-.1-.29-.1-.41 0-.75.34-.75.75s.34.75.75.75c.35 0 .64-.25.72-.59H7v-.91h1.74c.02.12.03.24.03.37 0 .93-.76 1.63-1.77 1.63Zm5-3.13c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5Zm0 2.25c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75Z" fill="#00ADD8" />
        </svg>
      );

    case "Java":
    case "java":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 17c3.33 1.33 8 0 8 0s-1 2-5 2c-3 0-5-1-3-2zm1-2.5c2.67.67 7 0 7 0s-.8 1.5-4 1.5c-2.8 0-5-.5-3-1.5zm.5-2.5c2.2.4 5.5 0 5.5 0s-.6 1.2-3.2 1.2c-2.3 0-4.1-.4-2.3-1.2zM15.5 8c0 .8-2 1.5-5 1.5s-4-.8-4-2c0-1.5 3-2 3-2.5s-2.5-.5-2.5-1.8C7 1.8 11.5 1 11.5 1s-1.5 1.3-1.5 2c0 1 3.5 1.2 3.5 3.2 0 .5-1 .8-1 1 0 .5 3 .3 3 .8zM6 19.5c5 2 13 0 13 0s-2.5 3-7.5 3C6.5 22.5 5 20.5 6 19.5z" fill="#F89820" />
        </svg>
      );

    case "C++":
    case "c++":
    case "cpp":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#00599C" fillOpacity="0.2" stroke="#00599C" strokeWidth="1.5" />
          <path d="M11 10.5c-.8-.5-1.8-.5-2.5 0-.7.6-.7 1.6 0 2.2.7.5 1.7.5 2.5 0M14 10v4M12 12h4M18 10v4M16 12h4" stroke="#00599C" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case "C#":
    case "c#":
    case "csharp":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#9B4F96" fillOpacity="0.2" stroke="#9B4F96" strokeWidth="1.5" />
          <path d="M11 10.5c-.8-.5-1.8-.5-2.5 0-.7.6-.7 1.6 0 2.2.7.5 1.7.5 2.5 0M14 9.5v5M16.5 9.5v5M13 11h4.5M13 13.5h4.5" stroke="#9B4F96" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );

    case "PHP":
    case "php":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="12" rx="11" ry="6" fill="#777BB4" fillOpacity="0.2" stroke="#777BB4" strokeWidth="1.5" />
          <path d="M7.5 10h2c.8 0 1.2.4 1.2 1s-.4 1-1.2 1h-1v2H7.5v-4zm1 1.3h.8c.2 0 .4-.1.4-.3s-.2-.3-.4-.3H8.5v.6zM12 10h1v1.5h1.5V10H16v4h-1v-1.7h-1.5V14H12v-4zM16.5 10h2c.8 0 1.2.4 1.2 1s-.4 1-1.2 1h-1v2h-1v-4zm1 1.3h.8c.2 0 .4-.1.4-.3s-.2-.3-.4-.3h-.8v.6z" fill="#777BB4" />
        </svg>
      );

    case "Ruby":
    case "ruby":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 8l8-6 8 6-8 14L4 8z" fill="#CC342D" fillOpacity="0.2" stroke="#CC342D" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M4 8h16M12 2v20M8 5l-4 3 4 10M16 5l4 3-4 10" stroke="#CC342D" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      );

    case "Swift":
    case "swift":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 4C14 4 10 7 8 11C11 8 15 8 17 9C12 9 8 12 7 17C10 13 15 13 18 14C14 15 9 17 7 20C4 20 2 17 2 14C2 10 5 6 9 4C6 6 5 9 6 12C9 7 14 4 19 4Z" fill="#FA7343" />
        </svg>
      );

    case "Kotlin":
    case "kotlin":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 22H2L12 12 22 2 12 2 2 12V2h10L2 22h10l10-10v10z" fill="#7F52FF" />
          <path d="M2 22h10L2 12v10zM12 22h10L12 12v10z" fill="#FF7800" fillOpacity="0.8" />
        </svg>
      );

    case "HTML":
    case "html":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 2l1.5 17L12 22l7.5-3L21 2H3zm14.3 5.5l-.3 3.5H9.8l.2 2.5h6.8l-.6 6-4.2 1.2-4.2-1.2-.4-4.5h3.2l.2 1.8 1.2.3 1.2-.3.2-2.3H6.7L6 7.5h11.3z" fill="#E34F26" />
        </svg>
      );

    case "CSS":
    case "css":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 2l1.5 17L12 22l7.5-3L21 2H3zm14.3 5.5H7.5l.3 3.5h9.2l-.6 6-4.4 1.2-4.4-1.2-.3-3.5h3.2l.1 1.3 1.4.4 1.4-.4.2-2H8.1L7.5 7.5h9.8z" fill="#1572B6" />
        </svg>
      );

    case "SQL":
    case "sql":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="6" rx="9" ry="3" fill="#E38C00" fillOpacity="0.2" stroke="#E38C00" strokeWidth="1.8" />
          <path d="M3 6v6c0 1.66 4.03 3 9 3s9-1.34 9-3V6M3 12v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" stroke="#E38C00" strokeWidth="1.8" />
        </svg>
      );

    case "Bash":
    case "bash":
    case "sh":
    case "Shell":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="4" width="20" height="16" rx="3" fill="#4EAA25" fillOpacity="0.15" stroke="#4EAA25" strokeWidth="1.8" />
          <path d="M7 9l4 3-4 3M13 15h4" stroke="#4EAA25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "YAML":
    case "yaml":
    case "yml":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 5l3 5v8H8v-7L5 5h2zm5 0h2l3 5v8h-2v-7l-3-5zm-2 6h4" stroke="#14C8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "JSON":
    case "json":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 4C6 4 5 5 5 7v3c0 1.5-1 2-2 2 1 0 2 .5 2 2v3c0 2 1 3 3 3M16 4c2 0 3 1 3 3v3c0 1.5 1 2 2 2-1 0-2 .5-2 2v3c0 2-1 3-3 3" stroke="#F5C000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "ALL":
    case "All":
    case "all":
      return <span className="text-sm leading-none">✨</span>;

    default:
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 9l-5 3 5 3M16 9l5 3-5 3M13 6l-2 12" stroke="#8B949E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}
