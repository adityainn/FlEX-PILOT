/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2, BookOpen, PlayCircle, Rocket, Sparkles, Search, Code2, PenTool, CheckCircle2, GitPullRequest } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlexPilotLogo } from "@/components/ui/flex-pilot-logo";

const workflowSteps = [
  { icon: Search, label: "Scan", color: "text-blue-400" },
  { icon: Sparkles, label: "Analyze", color: "text-purple-400" },
  { icon: PenTool, label: "Fix", color: "text-pink-400" },
  { icon: CheckCircle2, label: "Verify", color: "text-emerald-400" },
  { icon: GitPullRequest, label: "Pull Request", color: "text-cyan-400" },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/30 overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-primary/10 blur-[150px] rounded-full" />
      </div>

      {/* Navbar */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-background/50 px-6 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 font-medium text-lg">
          <div className="w-8 h-8">
            <FlexPilotLogo />
          </div>
          <span className="tracking-wide">Flex Pilot</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block">
            Sign In
          </Link>
          <Button className="rounded-full shadow-lg shadow-primary/20">
            <Link href="/demo">Try Demo</Link>
          </Button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center pt-32 pb-24 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Introducing V2 Multi-Agent Architecture</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-5xl text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl"
        >
          Your Autonomous <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-cyan-400">
            Accessibility Engineer
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl font-light leading-relaxed"
        >
          Flex Pilot scans your application, understands accessibility issues, generates verified fixes, compares before and after results, and creates GitHub pull requests—all with AI agents working together.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-4 w-full sm:w-auto justify-center"
        >
          <Button size="lg" className="h-12 px-6 rounded-full shadow-xl shadow-primary/20 gap-2">
            <Link href="/demo" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" /> Try Live Demo
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-6 rounded-full bg-background/50 backdrop-blur-sm gap-2 hover:bg-muted/50">
            <Link href="/repositories" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" /> View Demo Report
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-6 rounded-full bg-background/50 backdrop-blur-sm gap-2 hover:bg-muted/50">
            <Link href="/showcase" className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4" /> Watch AI Repair
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-6 rounded-full gap-2 border-white/20 hover:bg-white/10 hover:text-white">
            <Link href="/docs" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Documentation
            </Link>
          </Button>
        </motion.div>

        {/* Animated Workflow Visualization */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-32 w-full max-w-6xl"
        >
          <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl p-8 overflow-hidden">
            {/* Shimmer effect inside the card */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] animate-[shimmer_3s_infinite]" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
              {workflowSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center gap-4 relative w-full md:w-auto">
                  {/* The icon circle */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: [0.8, 1.1, 1], opacity: 1, boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 30px rgba(165,243,252,0.3)", "0px 0px 0px rgba(0,0,0,0)"] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.4, repeatDelay: 1 }}
                    className="w-16 h-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center relative z-20"
                  >
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </motion.div>
                  <span className="text-sm font-medium text-slate-300">{step.label}</span>
                  
                  {/* Connecting lines for desktop */}
                  {index < workflowSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-[2px] bg-white/10 -z-10">
                      <motion.div 
                        initial={{ left: "0%" }}
                        animate={{ left: "100%" }}
                        transition={{ duration: 1, repeat: Infinity, delay: index * 0.4, repeatDelay: 1 }}
                        className="absolute top-0 w-8 h-full bg-gradient-to-r from-transparent via-primary to-transparent -translate-x-1/2"
                      />
                    </div>
                  )}
                  {/* Connecting lines for mobile */}
                  {index < workflowSteps.length - 1 && (
                    <div className="block md:hidden absolute top-[4rem] left-1/2 w-[2px] h-8 bg-white/10 -z-10">
                      <motion.div 
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 1, repeat: Infinity, delay: index * 0.4, repeatDelay: 1 }}
                        className="absolute left-0 w-full h-4 bg-gradient-to-b from-transparent via-primary to-transparent -translate-y-1/2"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-left p-6 rounded-xl bg-[#09090b] border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-muted-foreground" />
                  <span className="font-mono text-sm text-slate-400">Demo React Store / Fix contrast</span>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">Score: 72 → 98</span>
                </div>
              </div>
              <div className="font-mono text-sm text-slate-300 overflow-hidden">
                <span className="text-red-400">- &lt;button className="text-gray-400 bg-white"&gt;</span><br />
                <span className="text-emerald-400">+ &lt;button className="text-white bg-slate-900" aria-label="Purchase Item"&gt;</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
