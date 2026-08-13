import { cn } from "@/lib/utils";

export function FlexPilotLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full", className)}
    >
      <defs>
        {/* Core Glow */}
        <radialGradient id="coreGlow" cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A5F3FC" stopOpacity="0.8" />
          <stop offset="0.5" stopColor="#7DD3FC" stopOpacity="0.3" />
          <stop offset="1" stopColor="#A5F3FC" stopOpacity="0" />
        </radialGradient>

        {/* Glass Gradients */}
        <linearGradient id="glassTop" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="glassBottom" x1="80" y1="80" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DD3FC" stopOpacity="0.6" />
          <stop offset="1" stopColor="#A5F3FC" stopOpacity="0.1" />
        </linearGradient>
        
        {/* Shimmer/Sweep Effect Mask */}
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="200%" y2="200%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        <filter id="blurGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background Pulse / Radar effect */}
      <circle cx="50" cy="50" r="40" fill="url(#coreGlow)" filter="url(#blurGlow)" />
      <circle cx="50" cy="50" r="30" stroke="#7DD3FC" strokeWidth="0.5" strokeOpacity="0.5" strokeDasharray="4 4" />
      <circle cx="50" cy="50" r="42" stroke="#A5F3FC" strokeWidth="0.5" strokeOpacity="0.3" />

      {/* Layered Glass Panels */}
      {/* Outer Hexagon/Diamond Abstract Shape */}
      <path
        d="M50 15 L80 32.5 L80 67.5 L50 85 L20 67.5 L20 32.5 Z"
        fill="url(#glassBottom)"
        stroke="url(#glassTop)"
        strokeWidth="1.5"
        style={{ backdropFilter: "blur(4px)" }}
      />
      
      {/* Inner Floating Shape representing AI Core/Brain */}
      <path
        d="M50 28 L68 38 L68 62 L50 72 L32 62 L32 38 Z"
        fill="url(#glassTop)"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeOpacity="0.8"
      />

      {/* Neural Lines converging on the core */}
      <path d="M50 15 L50 28" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
      <path d="M50 85 L50 72" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
      <path d="M20 32.5 L32 38" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
      <path d="M80 67.5 L68 62" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
      <path d="M80 32.5 L68 38" stroke="#7DD3FC" strokeWidth="2" strokeOpacity="0.8" strokeLinecap="round" />
      <path d="M20 67.5 L32 62" stroke="#7DD3FC" strokeWidth="2" strokeOpacity="0.8" strokeLinecap="round" />

      {/* Central AI Eye / Focus Point */}
      <circle cx="50" cy="50" r="8" fill="#FFFFFF" filter="url(#blurGlow)" />
      <circle cx="50" cy="50" r="4" fill="#7DD3FC" />
    </svg>
  );
}
