"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeNode?: React.ReactNode;
  afterNode?: React.ReactNode;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeNode,
  afterNode,
  className,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", () => setIsDragging(false));
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", () => setIsDragging(false));
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", () => setIsDragging(false));
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", () => setIsDragging(false));
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full aspect-video min-h-[300px] overflow-hidden rounded-xl border bg-muted select-none",
        className
      )}
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      {/* After (Base layer) */}
      <div className="absolute inset-0">
        {afterImage ? (
          <Image
            src={afterImage}
            alt="After"
            fill
            className="object-cover"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6 bg-green-500/10 text-green-700 dark:text-green-400">
            {afterNode || "After Fix (Compliant)"}
          </div>
        )}
      </div>

      {/* Before (Clipped overlay) */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="absolute inset-y-0 left-0 w-full" style={{ width: "100%", minWidth: "100vw" }}>
          {/* We need to render the before image/node such that it doesn't squish when clipping. 
              To do that properly with ReactNodes, it's a bit tricky. For images, object-cover works. 
              For nodes, we force the container to the width of the parent using absolute positioning.
          */}
          <div className="w-[1000px] max-w-[100vw] h-full flex items-center p-6 bg-red-500/10 text-red-700 dark:text-red-400 border-r-0">
            {beforeNode || "Before Fix (Violation)"}
          </div>
        </div>
        {beforeImage && (
          <div className="absolute inset-0 h-full w-[1000px] max-w-[100vw]">
            <Image
              src={beforeImage}
              alt="Before"
              fill
              className="object-cover"
              draggable={false}
            />
          </div>
        )}
      </div>

      {/* Slider Handle */}
      <div
        className="absolute inset-y-0 -ml-[2px] w-1 cursor-ew-resize bg-white shadow-xl hover:bg-primary transition-colors z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-md text-slate-900">
          <GripVertical className="h-4 w-4" />
        </div>
      </div>
      
      {/* Badges */}
      <div className="absolute bottom-4 left-4 rounded-md bg-background/80 px-2 py-1 text-xs font-semibold backdrop-blur-md border shadow-sm">
        Before
      </div>
      <div className="absolute bottom-4 right-4 rounded-md bg-background/80 px-2 py-1 text-xs font-semibold backdrop-blur-md border shadow-sm">
        After
      </div>
    </div>
  );
}
