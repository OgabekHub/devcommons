import React from "react";
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiReact,
  SiRust,
  SiGo,
  SiCplusplus,
  SiPhp,
  SiRuby,
  SiSwift,
  SiKotlin,
  SiGnubash,
  SiYaml,
  SiJson,
} from "react-icons/si";
import { FaHtml5, FaCss3Alt, FaJava, FaDatabase } from "react-icons/fa";
import { TbBrandCSharp } from "react-icons/tb";

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
      return <SiJavascript className={className} style={{ color: "#F7DF1E" }} />;

    case "TypeScript":
    case "TS":
    case "typescript":
      return <SiTypescript className={className} style={{ color: "#3178C6" }} />;

    case "Python":
    case "python":
      return <SiPython className={className} style={{ color: "#3776AB" }} />;

    case "React":
    case "react":
    case "ReactJS":
      return <SiReact className={className} style={{ color: "#61DAFB" }} />;

    case "Rust":
    case "rust":
      return <SiRust className={className} style={{ color: "#F74C00" }} />;

    case "Go":
    case "golang":
    case "go":
      return <SiGo className={className} style={{ color: "#00ADD8" }} />;

    case "Java":
    case "java":
      return <FaJava className={className} style={{ color: "#F89820" }} />;

    case "C++":
    case "c++":
    case "cpp":
      return <SiCplusplus className={className} style={{ color: "#00599C" }} />;

    case "C#":
    case "c#":
    case "csharp":
      return <TbBrandCSharp className={className} style={{ color: "#9B4F96" }} />;

    case "PHP":
    case "php":
      return <SiPhp className={className} style={{ color: "#777BB4" }} />;

    case "Ruby":
    case "ruby":
      return <SiRuby className={className} style={{ color: "#CC342D" }} />;

    case "Swift":
    case "swift":
      return <SiSwift className={className} style={{ color: "#FA7343" }} />;

    case "Kotlin":
    case "kotlin":
      return <SiKotlin className={className} style={{ color: "#7F52FF" }} />;

    case "HTML":
    case "html":
      return <FaHtml5 className={className} style={{ color: "#E34F26" }} />;

    case "CSS":
    case "css":
      return <FaCss3Alt className={className} style={{ color: "#1572B6" }} />;

    case "SQL":
    case "sql":
      return <FaDatabase className={className} style={{ color: "#E38C00" }} />;

    case "Bash":
    case "bash":
    case "sh":
    case "Shell":
      return <SiGnubash className={className} style={{ color: "#4EAA25" }} />;

    case "YAML":
    case "yaml":
    case "yml":
      return <SiYaml className={className} style={{ color: "#14C8A6" }} />;

    case "JSON":
    case "json":
      return <SiJson className={className} style={{ color: "#F5C000" }} />;

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
