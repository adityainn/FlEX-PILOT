"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Brain, Map, Wrench, CheckCircle2, GitPullRequest, ArrowRight, PlayCircle, BarChart2, Sparkles, Code2, Terminal, ShieldCheck, ChevronLeft, ChevronRight, X, RotateCcw } from "lucide-react";
import Link from "next/link";
import { FlexPilotLogo } from "@/components/ui/flex-pilot-logo";
import { Button } from "@/components/ui/button";

const SHOWCASE_STAGES = [
  { id: "repo", title: "Repository Loading", duration: 5000 },
  { id: "scan", title: "Accessibility Scan", duration: 5000 },
  { id: "analysis", title: "AI Reasoning", duration: 5000 },
  { id: "mapping", title: "Source Mapping", duration: 5000 },
  { id: "patch", title: "Patch Generation", duration: 6000 },
  { id: "verify", title: "Verification Checks", duration: 5000 },
  { id: "comparison", title: "Before & After", duration: 6000 },
  { id: "github", title: "GitHub Delivery", duration: 5000 },
  { id: "summary", title: "Success Summary", duration: 8000 }
];

export default function ShowcasePage() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const stage = SHOWCASE_STAGES[currentStageIndex];
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<number>(0);

  // Handle auto-advancing progress bar
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const duration = stage.duration;
    const intervalTime = 50; // Update progress every 50ms
    const increment = (intervalTime / duration) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          handleNextStage();
          return 0;
        }
        progressRef.current = next;
        return next;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentStageIndex, isPlaying]);

  const handleNextStage = () => {
    setProgress(0);
    setCurrentStageIndex((prev) => {
      if (prev < SHOWCASE_STAGES.length - 1) {
        return prev + 1;
      } else {
        // Loop back to start
        return 0;
      }
    });
  };

  const handlePrevStage = () => {
    setProgress(0);
    setCurrentStageIndex((prev) => {
      if (prev > 0) return prev - 1;
      return SHOWCASE_STAGES.length - 1;
    });
  };

  const selectStage = (index: number) => {
    setProgress(0);
    setCurrentStageIndex(index);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans overflow-hidden flex flex-col relative selection:bg-cyan-500/30">
      {/* Immersive background glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[150px] rounded-full" />
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-purple-500/5 blur-[180px] rounded-full" />
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-white/5 bg-black/40 px-8 backdrop-blur-xl relative">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 transition-transform group-hover:scale-105">
              <FlexPilotLogo />
            </div>
            <span className="font-medium tracking-wide text-lg text-slate-200">Flex Pilot</span>
          </Link>
          <div className="h-4 w-px bg-white/10 mx-2" />
          <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-full border border-cyan-400/20">
            Cinematic AI Showcase
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={togglePlay} className="border-white/10 bg-white/5 hover:bg-white/10 text-xs">
            {isPlaying ? "Pause Showcase" : "Play Showcase"}
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-white/5 text-slate-400 hover:text-white">
            <Link href="/" className="flex items-center gap-2">
              <X className="w-4 h-4" /> Exit
            </Link>
          </Button>
        </div>
      </header>

      {/* Story Progress Indicators (Stripe/Apple style) */}
      <div className="w-full max-w-[1400px] mx-auto px-8 pt-6 z-10 flex gap-2">
        {SHOWCASE_STAGES.map((s, idx) => {
          let fillPercent = 0;
          if (idx < currentStageIndex) fillPercent = 100;
          if (idx === currentStageIndex) fillPercent = progress;

          return (
            <div 
              key={s.id} 
              onClick={() => selectStage(idx)}
              className="flex-1 h-1.5 rounded-full bg-white/5 cursor-pointer relative overflow-hidden group transition-all"
            >
              <div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all ease-linear"
                style={{ width: `${fillPercent}%` }}
              />
              {/* Tooltip on hover */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/90 border border-white/10 px-2 py-1 rounded text-[10px] font-medium text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                {s.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Immersive Slide Area */}
      <main className="flex-1 flex items-center justify-center px-8 py-12 max-w-[1400px] mx-auto w-full z-10 relative">
        {/* Navigation Arrows on edges */}
        <button 
          onClick={handlePrevStage}
          className="absolute left-4 p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors z-20 group"
          aria-label="Previous step"
        >
          <ChevronLeft className="w-6 h-6 text-slate-400 group-hover:text-white" />
        </button>
        <button 
          onClick={handleNextStage}
          className="absolute right-4 p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors z-20 group"
          aria-label="Next step"
        >
          <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-white" />
        </button>

        <div className="w-full h-full max-w-5xl flex items-center justify-center min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStageIndex}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center text-center justify-center"
            >
              {/* Dynamic Slides render block */}
              
              {/* STAGE 1: REPOSITORY_LOADING */}
              {currentStageIndex === 0 && (
                <div className="space-y-8 max-w-2xl">
                  <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                    <motion.div 
                      className="absolute inset-0 border border-cyan-500/20 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div 
                      className="absolute inset-2 border-2 border-dashed border-blue-500/30 rounded-full"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="w-20 h-20">
                      <FlexPilotLogo />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <span className="text-sm font-mono text-cyan-400 uppercase tracking-widest">Stage 1: Initialization</span>
                    <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Connecting to acme/demo-react-store</h2>
                    <p className="text-lg text-slate-400 font-light max-w-lg mx-auto">
                      Flex Pilot clones the repository, checks compile states, and prepares an isolated container environment to run accessibility diagnostics.
                    </p>
                  </div>
                  <div className="bg-[#09090c] border border-white/5 rounded-xl p-4 font-mono text-left text-xs max-w-md mx-auto text-slate-400 shadow-xl">
                    <p className="text-cyan-400">$ git clone https://github.com/acme/demo-react-store.git ...</p>
                    <p className="text-slate-500 mt-1">Cloning into 'workspace-demo-react-store'...</p>
                    <p className="text-emerald-400 mt-1">✓ Repository prepared on branch: main</p>
                  </div>
                </div>
              )}

              {/* STAGE 2: ACCESSIBILITY_SCAN */}
              {currentStageIndex === 1 && (
                <div className="space-y-8 w-full max-w-4xl">
                  <div className="space-y-3">
                    <span className="text-sm font-mono text-cyan-400 uppercase tracking-widest">Stage 2: Discovery</span>
                    <h2 className="text-4xl font-bold tracking-tight">Scanning the Live DOM Tree</h2>
                    <p className="text-slate-400 font-light max-w-xl mx-auto">
                      Our Headless Scanner loads the application using Playwright, injects Axe-core, and scans every DOM node for WCAG violations.
                    </p>
                  </div>

                  <div className="relative rounded-2xl border border-white/10 bg-black/60 p-6 shadow-2xl overflow-hidden max-w-2xl mx-auto">
                    {/* Running Laser Sweep scanner animation */}
                    <motion.div 
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-20"
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="flex items-center gap-4 pb-4 border-b border-white/5 mb-4 text-xs font-mono text-slate-500">
                      <Search className="w-4 h-4 text-cyan-400" />
                      <span>Scanning Route: /demo-app</span>
                      <motion.span 
                        className="ml-auto text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        5 Violations Found
                      </motion.span>
                    </div>

                    <div className="space-y-3 text-left">
                      <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-lg flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="font-mono text-xs text-rose-300">button (no accessible name) fails: name-role-value</span>
                      </div>
                      <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="font-mono text-xs text-amber-300">html tag lacks language identifier fails: page-has-heading-one</span>
                      </div>
                      <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-lg flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="font-mono text-xs text-rose-300">div element lacks region landmark fails: region</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 3: AI_ANALYSIS */}
              {currentStageIndex === 2 && (
                <div className="space-y-8 max-w-4xl w-full">
                  <div className="space-y-3">
                    <span className="text-sm font-mono text-cyan-400 uppercase tracking-widest">Stage 3: Reasoning</span>
                    <h2 className="text-4xl font-bold tracking-tight">AI Deduplication & Categorization</h2>
                    <p className="text-slate-400 font-light max-w-xl mx-auto">
                      Gemini analyzes the raw scan telemetry, de-duplicates noise, groups identical DOM failures, and ranks severity dynamically.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    <motion.div 
                      whileHover={{ scale: 1.03 }}
                      className="p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-xl space-y-3 text-left"
                    >
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold border border-rose-500/30 bg-rose-500/20 text-rose-400 w-fit inline-block">Critical</span>
                      <h3 className="font-semibold text-white">Missing Form Labels</h3>
                      <p className="text-xs text-slate-400">Low-vision keyboard users cannot identify input controls or forms.</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.03 }}
                      className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-xl space-y-3 text-left"
                    >
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold border border-amber-500/30 bg-amber-500/20 text-amber-400 w-fit inline-block">Moderate</span>
                      <h3 className="font-semibold text-white">Color Contrast</h3>
                      <p className="text-xs text-slate-400">Gray fonts on white background fail standard readability tests.</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.03 }}
                      className="p-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-xl space-y-3 text-left"
                    >
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold border border-cyan-500/30 bg-cyan-500/20 text-cyan-400 w-fit inline-block">High</span>
                      <h3 className="font-semibold text-white">Region Landmarks</h3>
                      <p className="text-xs text-slate-400">Screen readers cannot quickly jump sections of the pages.</p>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* STAGE 4: SOURCE_MAPPING */}
              {currentStageIndex === 3 && (
                <div className="space-y-8 max-w-3xl">
                  <div className="space-y-3">
                    <span className="text-sm font-mono text-cyan-400 uppercase tracking-widest">Stage 4: Source Mapping</span>
                    <h2 className="text-4xl font-bold tracking-tight">Tracing DOM Nodes to Source AST</h2>
                    <p className="text-slate-400 font-light max-w-xl mx-auto">
                      Instead of guess-fixing code, we correlate runtime HTML elements directly to React/TypeScript AST structures in your workspace.
                    </p>
                  </div>

                  <div className="bg-[#09090c] border border-white/10 rounded-2xl p-6 shadow-2xl relative max-w-xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs">
                      {/* DOM Selector */}
                      <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 w-full text-center">
                        <p className="text-[10px] text-rose-400/80 mb-1">DOM ELEMENT</p>
                        <p className="font-semibold">div.visible &gt; button</p>
                      </div>

                      {/* Bridge Arrow */}
                      <div className="flex items-center gap-1 text-cyan-400 animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <ArrowRight className="w-5 h-5" />
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      </div>

                      {/* Source Node */}
                      <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 w-full text-center">
                        <p className="text-[10px] text-emerald-400/80 mb-1">REACT AST NODE</p>
                        <p className="font-semibold">src/app/page.tsx:L102</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 5: REPAIR_GENERATION */}
              {currentStageIndex === 4 && (
                <div className="space-y-8 w-full max-w-4xl">
                  <div className="space-y-3">
                    <span className="text-sm font-mono text-cyan-400 uppercase tracking-widest">Stage 5: Patch Generation</span>
                    <h2 className="text-4xl font-bold tracking-tight">Writing Semantic Patches</h2>
                    <p className="text-slate-400 font-light max-w-xl mx-auto">
                      AI agents construct specific TSX code diffs, addressing semantic naming and tags, while preserving visual styles.
                    </p>
                  </div>

                  <div className="bg-[#09090c] border border-white/10 rounded-2xl p-6 shadow-2xl font-mono text-left max-w-2xl mx-auto overflow-hidden">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4 text-xs text-slate-500">
                      <Code2 className="w-4 h-4 text-primary" />
                      <span>Patching src/app/page.tsx</span>
                      <span className="ml-auto text-emerald-400 font-semibold">96% confidence</span>
                    </div>

                    <div className="space-y-1 text-sm overflow-x-auto whitespace-nowrap">
                      <div className="text-slate-500">@@ -100,6 +100,7 @@ export default function Landing() &#123;</div>
                      <div className="text-slate-500">&nbsp; return (</div>
                      <div className="text-slate-500">&nbsp;&nbsp;&nbsp; &lt;div className="hero"&gt;</div>
                      <motion.div 
                        className="bg-rose-950/40 text-rose-300 py-1"
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        -&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;div onClick=&#123;handleClick&#125;&gt;Submit&lt;/div&gt;
                      </motion.div>
                      <motion.div 
                        className="bg-emerald-950/40 text-emerald-300 py-1 font-bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        +&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;button onClick=&#123;handleClick&#125; aria-label="Submit"&gt;Submit&lt;/button&gt;
                      </motion.div>
                      <div className="text-slate-500">&nbsp;&nbsp;&nbsp; &lt;/div&gt;</div>
                      <div className="text-slate-500">&nbsp; );</div>
                      <div className="text-slate-500">&#125;</div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 6: VERIFICATION */}
              {currentStageIndex === 5 && (
                <div className="space-y-8 w-full max-w-4xl">
                  <div className="space-y-3">
                    <span className="text-sm font-mono text-cyan-400 uppercase tracking-widest">Stage 6: Verification</span>
                    <h2 className="text-4xl font-bold tracking-tight">Executing Verification Checks</h2>
                    <p className="text-slate-400 font-light max-w-xl mx-auto">
                      A separate validation agent spins up a clean test container, compiles changes, and reruns accessibility checks to prevent regressions.
                    </p>
                  </div>

                  <div className="bg-[#050507] border border-white/10 rounded-2xl p-6 shadow-2xl text-left max-w-xl mx-auto relative font-mono text-xs">
                    <div className="flex items-center gap-2 text-slate-500 pb-3 border-b border-white/5 mb-3">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      <span>Verification Terminal</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-400">$ playwright test verify-patches.spec.ts</p>
                      <p className="text-slate-500">Launching headless Chrome...</p>
                      <p className="text-emerald-400 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> ✓ Resolved contrast: Contrast now 8.5:1 (PASS)
                      </p>
                      <p className="text-emerald-400 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> ✓ Resolved accessibility tags: aria-label present (PASS)
                      </p>
                      <p className="text-slate-300 font-semibold border-t border-white/5 pt-2 mt-2">
                        All checks passed. Building production site:
                      </p>
                      <p className="text-emerald-400 font-bold">✓ Next.js build completed with exit code 0.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 7: COMPARISON (Before / After) */}
              {currentStageIndex === 6 && (
                <div className="space-y-8 w-full max-w-4xl">
                  <div className="space-y-3">
                    <span className="text-sm font-mono text-cyan-400 uppercase tracking-widest">Stage 7: Comparison</span>
                    <h2 className="text-4xl font-bold tracking-tight">Before vs After Analysis</h2>
                    <p className="text-slate-400 font-light max-w-xl mx-auto">
                      Accessibility score is recalculated after patches are verified. We compare score increases and highlight solved warnings.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto items-center">
                    <div className="p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl relative">
                      <div className="absolute top-3 left-3 bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded text-[10px] border border-rose-500/20 font-bold">
                        Before fix
                      </div>
                      <div className="text-5xl font-extrabold text-slate-400 tracking-tight my-6">72</div>
                      <p className="text-xs text-rose-300">5 critical screen-reader violations detected</p>
                    </div>

                    <div className="p-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-xl relative shadow-[0_0_50px_rgba(34,211,238,0.1)]">
                      <div className="absolute top-3 left-3 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] border border-emerald-500/20 font-bold">
                        After fix
                      </div>
                      <div className="text-5xl font-extrabold text-cyan-400 tracking-tight my-6">98</div>
                      <p className="text-xs text-emerald-300">✓ All critical violations successfully resolved</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 8: GITHUB_DELIVERY */}
              {currentStageIndex === 7 && (
                <div className="space-y-8 max-w-3xl">
                  <div className="space-y-3">
                    <span className="text-sm font-mono text-cyan-400 uppercase tracking-widest">Stage 8: Pull Request</span>
                    <h2 className="text-4xl font-bold tracking-tight">Auto-creating GitHub Pull Request</h2>
                    <p className="text-slate-400 font-light max-w-xl mx-auto">
                      Instead of auto-committing directly to main, we commit code changes to a secure patch branch and issue a pull request.
                    </p>
                  </div>

                  <div className="bg-[#09090c] border border-white/10 rounded-2xl p-6 shadow-2xl max-w-xl mx-auto text-left relative overflow-hidden">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/5 mb-4">
                      <GitPullRequest className="w-5 h-5 text-cyan-400" />
                      <div className="text-xs">
                        <p className="font-semibold text-white">a11y: Resolve WCAG Violations (Score +26)</p>
                        <p className="text-slate-500 mt-0.5">acme:flexpilot/a11y-fix-main ← acme:main</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>All verification check suites passed</span>
                      </div>
                      <div className="bg-[#030303] p-3 rounded-lg text-[10px] text-slate-400 font-mono">
                        This PR resolves 5 accessibility issues identified by Flex Pilot:<br/>
                        - Added aria-label descriptors to navigation items<br/>
                        - Converted non-semantic click actions to button elements
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 9: SUCCESS_SUMMARY */}
              {currentStageIndex === 8 && (
                <div className="space-y-8 max-w-3xl">
                  <div className="relative w-20 h-20 mx-auto bg-cyan-500/10 border border-cyan-400/30 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                    <Sparkles className="w-10 h-10 text-cyan-400" />
                  </div>
                  <div className="space-y-3">
                    <span className="text-sm font-mono text-cyan-400 uppercase tracking-widest">Pipeline Completed</span>
                    <h2 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-primary to-cyan-300">
                      Accessibility Restored
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto font-light">
                      The automated multi-agent run solved accessibility errors and verified them within a clean container in under 36 seconds.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto pt-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-mono uppercase">Score Delta</p>
                      <p className="text-2xl font-bold text-cyan-400 mt-1">72 → 98</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-mono uppercase">Issues Repaired</p>
                      <p className="text-2xl font-bold text-white mt-1">5 / 5</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-mono uppercase">Verification</p>
                      <p className="text-2xl font-bold text-emerald-400 mt-1">PASS</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-mono uppercase">Build Exit Code</p>
                      <p className="text-2xl font-bold text-slate-300 mt-1">0 (Clean)</p>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center pt-8">
                    <Button size="lg" className="rounded-full shadow-lg shadow-cyan-500/20" onClick={() => selectStage(0)}>
                      <RotateCcw className="w-4 h-4 mr-2" /> Replay Showcase
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full bg-background/50 backdrop-blur-sm">
                      <Link href="/">
                        Return to Home
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="h-16 border-t border-white/5 bg-black/20 flex items-center justify-between px-8 text-xs text-slate-500 z-10 relative">
        <span className="font-mono">Current Agent: {stage.id.toUpperCase()}_AGENT</span>
        <div className="flex items-center gap-6">
          <span className="hidden sm:inline">Chapter {currentStageIndex + 1} of {SHOWCASE_STAGES.length}</span>
          <span className="text-slate-400">Auto-playing presentation mode</span>
        </div>
      </footer>
    </div>
  );
}
