/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Brain, Map, Wrench, CheckCircle2, GitPullRequest, ArrowRight, Play, Square, Activity, Sparkles } from "lucide-react";
import { SynchronizedPanels } from "@/components/demo/synchronized-panels";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FlexPilotLogo } from "@/components/ui/flex-pilot-logo";
import { Badge } from "@/components/ui/badge";
import { useSwarmStore } from "@/store/swarm-store";

const CHAPTERS = [
  { id: 1, title: "Understanding the Application", duration: 4000 },
  { id: 2, title: "Discovery", duration: 4000 },
  { id: 3, title: "Reasoning", duration: 4000 },
  { id: 4, title: "Repair", duration: 4000 },
  { id: 5, title: "Verification", duration: 4000 },
  { id: 6, title: "Evidence", duration: 6000 },
  { id: 7, title: "Delivery", duration: 5000 }
];

export default function DemoSequence() {
  const { runContext, logs, startRun, pauseRun, resumeRun, reset } = useSwarmStore();
  const backendChapter = runContext?.currentChapter ?? 0;
  const [previewChapter, setPreviewChapter] = useState<number | null>(null);
  const [uiState, setUiState] = useState({ chapter: 0, lastTransitionTime: Date.now() });
  const uiChapter = uiState.chapter;
  const lastTransitionTime = uiState.lastTransitionTime;

  // Refs to prevent interval cleanup and recreation on every single state render
  const uiChapterRef = useRef(uiChapter);
  const lastTransitionTimeRef = useRef(lastTransitionTime);
  const backendChapterRef = useRef(backendChapter);
  const runStatusRef = useRef(runContext?.status);

  // Sync refs with the latest values on every render cycle
  useEffect(() => {
    uiChapterRef.current = uiChapter;
    lastTransitionTimeRef.current = lastTransitionTime;
    backendChapterRef.current = backendChapter;
    runStatusRef.current = runContext?.status;
  }, [uiChapter, lastTransitionTime, backendChapter, runContext?.status]);

  // The chapter we are currently viewing
  const chapterIndex = previewChapter !== null ? previewChapter : uiChapter;
  const isPlaying = runContext?.status === "running" || runContext?.status === "initialized";
  const isAutoplayActive = isPlaying || (runContext?.status === "completed" && uiChapter < CHAPTERS.length - 1);
  const currentChapter = CHAPTERS[chapterIndex] || CHAPTERS[0];

  const [lastUiChapter, setLastUiChapter] = useState(uiChapter);
  
  if (uiChapter !== lastUiChapter) {
    setLastUiChapter(uiChapter);
    setPreviewChapter(null);
  }

  // Reset the store on mount to ensure a fresh demo run starts from Chapter 1, and clean up on unmount.
  useEffect(() => {
    reset();
    startRun("demo-react-store", "main");
    return () => {
      reset();
    };
  }, [reset, startRun]);

  // Sync / reset uiChapter on run start/initialization
  useEffect(() => {
    if (runContext?.status === "initialized" || !runContext) {
      setUiState({ chapter: 0, lastTransitionTime: Date.now() });
    }
  }, [runContext?.status, runContext?.runId]);

  // Keep uiChapter advancing sequentially using a single continuous timer
  useEffect(() => {
    const interval = setInterval(() => {
      // Use ref values inside the static interval callback closure
      const active = isPlaying || (runStatusRef.current === "completed" && uiChapterRef.current < CHAPTERS.length - 1);
      if (!active) return;
      if (uiChapterRef.current >= CHAPTERS.length - 1) return;

      const elapsed = Date.now() - lastTransitionTimeRef.current;
      const minDuration = CHAPTERS[uiChapterRef.current].duration;

      // Only advance if both:
      // 1. The minimum display duration for this chapter has elapsed.
      // 2. The backend has progressed past this chapter OR the backend has finished the whole run.
      const isBackendPast = backendChapterRef.current > uiChapterRef.current || runStatusRef.current === "completed";
      if (elapsed >= minDuration && isBackendPast) {
        const nextChapter = uiChapterRef.current + 1;
        
        // Mutate refs synchronously to prevent double triggering before React completes rendering
        uiChapterRef.current = nextChapter;
        lastTransitionTimeRef.current = Date.now();

        setUiState({
          chapter: nextChapter,
          lastTransitionTime: lastTransitionTimeRef.current
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);  // State derivation based on chapter and orchestrator metrics
  const metrics = runContext?.metrics || {
    initialScore: 72, finalScore: 72, issuesFound: 146, issuesFixed: 0, criticalFixed: 0
  };

  return (
    <div 
      className="min-h-screen bg-[#060608] text-white overflow-x-hidden font-sans relative selection:bg-primary/30 flex flex-col"
    >
      {/* Background Particles / Blur */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-blue-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-cyan-500/5 blur-[150px] rounded-full" />
      </div>

      {/* Top Controls (Cinematic vs Interactive) */}
      <div className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
           <FlexPilotLogo className="w-8 h-8" />
           <span className="font-semibold tracking-wide hidden sm:block">Flex Pilot</span>
           {isPlaying ? (
             <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 animate-pulse">Running</Badge>
           ) : (
             <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">Paused</Badge>
           )}
        </div>
        
        {/* Chapter Navigation inside Header */}
        <div className="flex items-center gap-4 hidden lg:flex">
          {CHAPTERS.map((ch, idx) => (
            <div key={ch.id} className="flex items-center gap-2">
              <button 
                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === chapterIndex ? 'bg-primary scale-125' : idx < chapterIndex ? 'bg-primary/50' : 'bg-white/20'}`}
                title={ch.title}
              />
              {idx < CHAPTERS.length - 1 && <div className={`w-8 h-px ${idx < chapterIndex ? 'bg-primary/50' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isPlaying ? (
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); pauseRun(); }} className="gap-2">
              <Square className="w-4 h-4" /> Pause
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); resumeRun(); }} className="gap-2">
              <Play className="w-4 h-4" /> Resume
            </Button>
          )}
          <Button variant="outline" size="sm" className="ml-2 border-white/20 hover:bg-white/10">
            <Link href="/">Exit Demo</Link>
          </Button>
        </div>
      </div>

      <main className="relative z-10 pt-24 px-8 pb-32 max-w-[1600px] mx-auto w-full flex-1 flex flex-col">
        
        {/* Top Progress Bar */}
        <div className="w-full max-w-4xl mx-auto mb-16 flex items-center justify-between relative hidden md:flex">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/10 -z-10 -translate-y-1/2" />
          <div 
            className="absolute left-0 top-1/2 h-0.5 bg-primary -z-10 -translate-y-1/2 transition-all duration-500" 
            style={{ width: `${(uiChapter / (CHAPTERS.length - 1)) * 100}%` }} 
          />
          {CHAPTERS.map((ch, idx) => {
            const isCompleted = idx < uiChapter;
            const isCurrent = idx === uiChapter;
            const isFuture = idx > uiChapter;
            const isPreviewing = idx === chapterIndex;

            return (
              <div 
                key={ch.id} 
                className={`flex flex-col items-center gap-3 relative group ${isFuture ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => {
                  if (isCompleted || isCurrent) {
                    setPreviewChapter(idx);
                  }
                }}
              >
                {/* Tooltip on Hover */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none flex flex-col items-center z-50">
                  <div className="bg-black/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg whitespace-nowrap text-xs shadow-xl flex items-center gap-2">
                    <span className="font-semibold text-white">{ch.title}</span>
                    <span className={`text-[10px] uppercase tracking-wider font-bold ${isCompleted ? 'text-emerald-400' : isCurrent ? 'text-primary' : 'text-slate-500'}`}>
                      {isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Upcoming'}
                    </span>
                  </div>
                  <div className="w-2 h-2 bg-black/90 border-b border-r border-white/10 rotate-45 -mt-1.5" />
                </div>

                <div 
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-500 z-10 
                    ${isPreviewing ? 'bg-primary border-primary scale-125 shadow-[0_0_15px_rgba(var(--primary),0.5)]' : 
                      isCompleted ? 'bg-primary border-primary' : 'bg-[#060608] border-white/20'}
                    ${!isFuture ? 'group-hover:scale-125 group-hover:shadow-[0_0_10px_rgba(var(--primary),0.3)]' : ''}
                  `}
                />
                <span className={`text-xs font-medium absolute -bottom-6 whitespace-nowrap transition-colors duration-300
                  ${isPreviewing ? 'text-white' : isCompleted ? 'text-primary' : 'text-slate-500'}`}>
                  {ch.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Chapter Header */}
        <motion.div 
          key={`header-${chapterIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-2 block">Chapter {currentChapter.id}</span>
          <h1 className="text-4xl font-bold tracking-tight text-white">{currentChapter.title}</h1>
        </motion.div>

        {/* Dynamic Content Area based on Chapter */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            
            {/* CHAPTER 1: Understanding the Application */}
            {chapterIndex === 0 && (
              <motion.div key="ch0" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Demo React Store</h2>
                    <p className="text-slate-400">Target: WCAG 2.1 AA</p>
                  </div>
                  <div className="flex justify-between items-end pb-4 border-b border-white/10">
                    <span className="text-slate-400">Initial Score</span>
                    <span className="text-5xl font-bold font-mono text-rose-500">{metrics.initialScore}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-slate-500">Total Issues</div>
                      <div className="text-2xl font-mono mt-1 text-slate-300">146</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Critical</div>
                      <div className="text-2xl font-mono mt-1 text-rose-500">18</div>
                    </div>
                  </div>
                </div>
                <div className="p-8 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-xl flex flex-col gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
                  <Sparkles className="w-8 h-8 text-primary" />
                  <h3 className="text-xl font-semibold text-white">Swarm Activated</h3>
                  <p className="text-slate-300 leading-relaxed">Flex Pilot is now mounting the repository. The AI will parse the React AST, analyze the DOM for WCAG violations, and prepare the environment for the agent swarm.</p>
                </div>
              </motion.div>
            )}

            {/* CHAPTER 2: Discovery */}
            {chapterIndex === 1 && (
              <motion.div key="ch1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-5xl flex gap-8">
                <div className="flex flex-col gap-4 w-72 shrink-0">
                  <div className="p-4 rounded-xl bg-primary/20 border border-primary/30 flex items-center gap-4">
                    <div className="p-2 bg-primary text-white rounded-full"><Search className="w-5 h-5"/></div>
                    <div>
                      <h4 className="font-semibold text-white">Scanner Agent</h4>
                      <p className="text-xs text-primary-foreground/80 mt-0.5">Active</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6 rounded-2xl bg-[#09090b] border border-white/10 font-mono text-sm">
                  <div className="flex items-center gap-2 text-slate-400 mb-4 border-b border-white/10 pb-4">
                    <Activity className="w-4 h-4" /> Live Activity Feed
                  </div>
                  <div className="space-y-4 text-slate-300 max-h-[300px] overflow-y-auto">
                    {logs.filter(l => l.agentId === 'scanner').reverse().map((log) => {
                      const timeStr = new Date(log.timestamp - (runContext?.startTime || log.timestamp)).toISOString().substring(14, 19);
                      return (
                        <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`flex gap-4 ${log.level === 'warning' ? 'text-amber-400' : ''}`}>
                          <span className={log.level === 'warning' ? 'text-amber-500/70' : 'text-primary/70'}>[{timeStr}]</span> 
                          <span>{log.message}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* CHAPTER 3: Reasoning */}
            {chapterIndex === 2 && (
              <motion.div key="ch2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full max-w-5xl grid grid-cols-3 gap-8">
                <div className="col-span-1 space-y-4">
                  <div className="p-4 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center gap-4">
                    <div className="p-2 bg-purple-500 text-white rounded-full"><Brain className="w-5 h-5"/></div>
                    <div>
                      <h4 className="font-semibold text-white">Analyzer Agent</h4>
                      <p className="text-xs text-purple-300 mt-0.5">Processing</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center gap-4">
                    <div className="p-2 bg-amber-500 text-white rounded-full"><Map className="w-5 h-5"/></div>
                    <div>
                      <h4 className="font-semibold text-white">Source Mapper</h4>
                      <p className="text-xs text-amber-300 mt-0.5">Processing</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 p-6 rounded-2xl bg-[#09090b] border border-white/10 relative overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                   <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-amber-500/5 pointer-events-none" />
                   <h3 className="font-semibold text-slate-300 mb-6 flex items-center gap-2"><Brain className="w-4 h-4 text-purple-400" /> AI Thinking Panel</h3>
                   <div className="space-y-4 font-mono text-sm max-h-[300px] overflow-y-auto">
                      {logs.filter(l => l.agentId === 'analyzer' || l.agentId === 'source-mapper').reverse().map((log) => (
                        <motion.div key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={log.agentId === 'source-mapper' ? 'pl-4 border-l-2 border-white/10' : ''}>
                          <span className={log.agentId === 'analyzer' ? 'text-purple-400' : 'text-amber-400'}>
                            [{log.agentId.toUpperCase()}]
                          </span> {log.message}
                        </motion.div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}

            {/* CHAPTER 4: Repair */}
            {chapterIndex === 3 && (
              <motion.div key="ch3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-4xl space-y-6 text-center">
                <div className="inline-flex p-4 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-400 mb-4 animate-bounce">
                  <Wrench className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Repair Agent Generating Fixes...</h3>
                <div className="p-8 rounded-2xl bg-[#09090b] border border-white/10 text-left overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-transparent" />
                  <pre className="font-mono text-sm leading-relaxed text-slate-400">
                    <div>export function SearchBar() {'{'}</div>
                    <div className="pl-4">return (</div>
                    <div className="pl-8">&lt;div className="search-container"&gt;</div>
                    <div className="pl-12">&lt;input type="text" placeholder="Search..." /&gt;</div>
                    <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ delay: 1.5, duration: 0.5 }} className="pl-12 bg-rose-500/10 text-rose-400 py-1">
                      - &lt;button className="bg-gray-200 text-gray-400"&gt;
                    </motion.div>
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ delay: 2, duration: 0.5 }} className="pl-12 bg-emerald-500/10 text-emerald-400 font-bold py-1 overflow-hidden">
                      + &lt;button className="bg-slate-800 text-white" aria-label="Submit Search"&gt;
                    </motion.div>
                    <div className="pl-16">Q</div>
                    <div className="pl-12">&lt;/button&gt;</div>
                    <div className="pl-8">&lt;/div&gt;</div>
                    <div className="pl-4">);</div>
                    <div>{'}'}</div>
                  </pre>
                </div>
              </motion.div>
            )}

            {/* CHAPTER 5: Verification */}
            {chapterIndex === 4 && (
              <motion.div key="ch4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full max-w-4xl grid grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="inline-flex p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mb-2">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Verification Agent Running</h3>
                  <p className="text-slate-400">Re-running Axe-core and Playwright tests on the patched React tree to ensure the repair passes WCAG standards without causing regressions.</p>
                  <div className="space-y-2 mt-4 font-mono text-sm text-emerald-400 max-h-[150px] overflow-y-auto">
                    {logs.filter(l => l.agentId === 'verification').reverse().map((log) => (
                      <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                        {log.message}
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Metrics improving animation */}
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">Metrics Transformation</h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-slate-300">Accessibility Score</span>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-mono text-rose-500 line-through opacity-50">72</span>
                        <ArrowRight className="w-4 h-4 text-slate-500" />
                        <motion.span key={metrics.finalScore} initial={{ scale: 2, color: '#fff' }} animate={{ scale: 1, color: '#10b981' }} className="text-4xl font-bold font-mono">{metrics.finalScore}</motion.span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Critical Issues</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-mono text-rose-500 opacity-50">18</span>
                        <ArrowRight className="w-4 h-4 text-slate-500" />
                        <motion.span key={metrics.criticalFixed} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold font-mono text-emerald-500">0</motion.span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CHAPTER 6: Evidence */}
            {chapterIndex === 5 && (
              <motion.div key="ch5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                <SynchronizedPanels />
              </motion.div>
            )}

            {/* CHAPTER 7: Delivery */}
            {chapterIndex === 6 && (
              <motion.div key="ch6" initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", damping: 25 }} className="w-full max-w-3xl">
                <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden relative">
                  {/* Celebration Confetti/Particles representation */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 200, opacity: [0, 1, 0] }} transition={{ duration: 2, times: [0, 0.2, 1] }} className="absolute left-1/4 w-2 h-2 bg-blue-500 rounded-full" />
                    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 200, opacity: [0, 1, 0] }} transition={{ duration: 2, delay: 0.2, times: [0, 0.2, 1] }} className="absolute left-1/2 w-2 h-2 bg-emerald-500 rounded-full" />
                    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 200, opacity: [0, 1, 0] }} transition={{ duration: 2, delay: 0.4, times: [0, 0.2, 1] }} className="absolute left-3/4 w-2 h-2 bg-purple-500 rounded-full" />
                  </div>

                  <div className="p-8 border-b border-[#30363d] bg-[#161b22] relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-3xl font-semibold text-[#e6edf3]">a11y: Fix accessibility issues in Demo React Store <span className="text-slate-500 font-light">#1</span></h2>
                    </div>
                    <div className="flex items-center gap-3 text-[#7d8590]">
                      <Badge className="bg-[#238636] hover:bg-[#238636] text-white border-none rounded-full px-4 py-1 gap-1.5 text-sm">
                        <GitPullRequest className="w-4 h-4" /> Open
                      </Badge>
                      <span className="font-medium text-[#e6edf3]">flex-pilot[bot]</span> wants to merge 1 commit into <code className="bg-[#1f2428] px-2 py-1 rounded text-[#e6edf3]">main</code>
                    </div>
                  </div>

                  <div className="p-8 space-y-8 relative z-10">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                        <div className="text-sm text-emerald-400 uppercase tracking-widest mb-1">Final Score</div>
                        <div className="text-4xl font-mono font-bold text-emerald-500">98</div>
                      </div>
                      <div className="p-4 rounded-xl bg-[#161b22] border-[#30363d] text-center border">
                        <div className="text-sm text-slate-400 uppercase tracking-widest mb-1">Fixes Applied</div>
                        <div className="text-4xl font-mono font-bold text-white">{metrics.issuesFixed}</div>
                      </div>
                    </div>
                    
                    <div className="prose prose-invert prose-lg max-w-none">
                      <p className="text-slate-300">This automated PR resolves accessibility violations detected during the latest run. It upgrades the repository to conform with WCAG 2.1 AA standards. All Axe-core regression tests passed successfully.</p>
                    </div>
                    
                    <div className="pt-8 border-t border-[#30363d] flex justify-center gap-6">
                      <Button size="lg" variant="outline" className="border-[#30363d] text-[#e6edf3] hover:bg-[#30363d] rounded-full px-8 h-12">
                        <Link href="/dashboard">Explore Dashboard</Link>
                      </Button>
                      <Button size="lg" className="bg-[#238636] text-white hover:bg-[#2ea043] border border-[rgba(240,246,252,0.1)] gap-2 rounded-full px-8 h-12 shadow-[0_0_20px_rgba(35,134,54,0.3)]">
                        <Link href="/dashboard">Start Your Own Scan <ArrowRight className="w-4 h-4"/></Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Floating Navigation (Interactive Mode) */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 p-2 rounded-full bg-[#0d1117]/80 backdrop-blur-xl border border-[#30363d] z-50 shadow-2xl">
          <Button 
            variant="ghost" 
            onClick={() => setPreviewChapter(Math.max(0, chapterIndex - 1))} 
            disabled={chapterIndex === 0}
            className="text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#21262d] rounded-full px-6"
          >
            Previous
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => isPlaying ? pauseRun() : resumeRun()}
            className={`rounded-full w-12 h-12 flex items-center justify-center transition-all ${isPlaying ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : 'bg-[#238636] text-white hover:bg-[#2ea043] shadow-[0_0_15px_rgba(35,134,54,0.4)]'}`}
            title={isPlaying ? "Pause Demo" : "Resume Demo"}
          >
            {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
          </Button>

          <Button 
            variant="ghost" 
            onClick={() => setPreviewChapter(Math.min(CHAPTERS.length - 1, chapterIndex + 1))} 
            disabled={chapterIndex >= backendChapter}
            className="text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#21262d] rounded-full px-6"
          >
            Next
          </Button>
        </div>

      </main>
    </div>
  );
}
