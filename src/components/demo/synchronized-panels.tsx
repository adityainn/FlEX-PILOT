/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Image as ImageIcon, Network, Lightbulb, ShieldCheck } from "lucide-react";

export function SynchronizedPanels() {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  // Define the regions and their corresponding data
  const highlightData = {
    "search-button": {
      explanation: "The Search Button lacked an aria-label and had insufficient contrast (3.1:1), making it invisible to screen readers and difficult to see for low-vision users.",
      rule: "WCAG 1.4.3 Contrast (Minimum), WCAG 4.1.2 Name, Role, Value",
      verification: "PASS: Color contrast now 8.5:1. Aria-label present."
    },
    "nav-links": {
      explanation: "Navigation links lacked visible focus indicators, trapping keyboard-only users.",
      rule: "WCAG 2.4.7 Focus Visible",
      verification: "PASS: Focus ring visible on Tab navigation."
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Top Left: Before Screenshot */}
        <div className="rounded-xl border border-white/10 bg-black/50 overflow-hidden relative group">
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-slate-300 flex items-center gap-2 z-10 border border-white/10">
            <ImageIcon className="w-3 h-3" /> Before Snapshot
          </div>
          <div className="relative w-full h-[300px] bg-slate-900 flex items-center justify-center p-8">
            {/* Mock UI */}
            <div className="w-full max-w-sm bg-white rounded-lg p-4 shadow-xl flex items-center gap-4">
              <div 
                className="w-full h-10 bg-gray-100 rounded flex items-center px-3 relative cursor-crosshair transition-colors"
                onMouseEnter={() => setHoveredElement("search-button")}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <span className="text-gray-300">Search products...</span>
                <div className="ml-auto w-6 h-6 bg-gray-200 rounded text-center text-gray-400">Q</div>
                
                {/* Highlight Overlay */}
                <AnimatePresence>
                  {hoveredElement === "search-button" && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-[-4px] border-2 border-rose-500 bg-rose-500/10 rounded-lg pointer-events-none"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Top Right: After Screenshot */}
        <div className="rounded-xl border border-white/10 bg-black/50 overflow-hidden relative group">
          <div className="absolute top-2 left-2 bg-emerald-500/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-emerald-400 flex items-center gap-2 z-10 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3" /> Repaired Snapshot
          </div>
          <div className="relative w-full h-[300px] bg-slate-900 flex items-center justify-center p-8">
            <div className="w-full max-w-sm bg-white rounded-lg p-4 shadow-xl flex items-center gap-4">
              <div 
                className="w-full h-10 bg-slate-100 border border-slate-300 rounded flex items-center px-3 relative cursor-crosshair transition-colors"
                onMouseEnter={() => setHoveredElement("search-button")}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <span className="text-slate-600 font-medium">Search products...</span>
                <div className="ml-auto w-6 h-6 bg-slate-800 rounded text-center text-white">Q</div>
                
                {/* Highlight Overlay */}
                <AnimatePresence>
                  {hoveredElement === "search-button" && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-[-4px] border-2 border-emerald-500 bg-emerald-500/10 rounded-lg pointer-events-none shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left: Code Diff */}
        <div className="rounded-xl border border-white/10 bg-[#09090b] overflow-hidden relative">
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-slate-300 flex items-center gap-2 border border-white/10">
            <Code2 className="w-3 h-3" /> Code Diff
          </div>
          <div className="w-full h-[250px] p-6 pt-12 overflow-auto font-mono text-[13px] leading-relaxed">
            <div className="text-slate-500">export function SearchBar() {'{'}</div>
            <div className="text-slate-500 pl-4">return (</div>
            <div className="text-slate-500 pl-8">&lt;div className="search-container"&gt;</div>
            <div className="text-slate-500 pl-12">&lt;input type="text" placeholder="Search products..." /&gt;</div>
            
            <div 
              className={`relative transition-colors rounded ${hoveredElement === 'search-button' ? 'bg-primary/20' : ''}`}
              onMouseEnter={() => setHoveredElement("search-button")}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <div className="text-rose-400 pl-12 bg-rose-500/10">- &lt;button className="bg-gray-200 text-gray-400"&gt;</div>
              <div className="text-emerald-400 pl-12 bg-emerald-500/10 font-bold">+ &lt;button className="bg-slate-800 text-white" aria-label="Submit Search"&gt;</div>
              <div className="text-slate-500 pl-16">Q</div>
              <div className="text-slate-500 pl-12">&lt;/button&gt;</div>
            </div>

            <div className="text-slate-500 pl-8">&lt;/div&gt;</div>
            <div className="text-slate-500 pl-4">);</div>
            <div className="text-slate-500">{'}'}</div>
          </div>
        </div>

        {/* Bottom Right: A11y Tree Diff */}
        <div className="rounded-xl border border-white/10 bg-[#09090b] overflow-hidden relative">
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-slate-300 flex items-center gap-2 border border-white/10">
            <Network className="w-3 h-3" /> Accessibility Tree
          </div>
          <div className="w-full h-[250px] p-6 pt-12 overflow-auto font-mono text-[13px] leading-relaxed">
            <div className="text-slate-400">group</div>
            <div className="text-slate-400 pl-4">textbox "Search products..."</div>
            
            <div 
              className={`relative transition-colors rounded py-2 ${hoveredElement === 'search-button' ? 'bg-primary/20' : ''}`}
              onMouseEnter={() => setHoveredElement("search-button")}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <div className="text-rose-400/70 line-through pl-4">button (no accessible name)</div>
              <div className="text-emerald-400 font-bold pl-4">button "Submit Search"</div>
              <div className="text-emerald-400/80 pl-8">↳ text "Q"</div>
            </div>
          </div>
        </div>
      </div>

      {/* Synchronized Explanation Panel */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={hoveredElement || "empty"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-md p-6 min-h-[140px] flex items-start gap-4 shadow-[0_0_40px_rgba(56,189,248,0.1)]"
        >
          <div className="p-3 bg-primary/20 rounded-full shrink-0">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          {hoveredElement ? (
            <div className="space-y-2">
              <h3 className="font-semibold text-white">AI Analysis & Rationale</h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                {highlightData[hoveredElement as keyof typeof highlightData].explanation}
              </p>
              <div className="flex gap-4 pt-2">
                <span className="text-xs text-amber-400 font-mono bg-amber-400/10 px-2 py-1 rounded">
                  {highlightData[hoveredElement as keyof typeof highlightData].rule}
                </span>
                <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded">
                  {highlightData[hoveredElement as keyof typeof highlightData].verification}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center h-full text-slate-400">
              <p>Hover over elements in any panel to view synchronized analysis.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
