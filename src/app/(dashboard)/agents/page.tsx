"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Brain, Map, Wrench, CheckCircle2, SplitSquareHorizontal, GitBranch, Activity, Clock, FileCode, Play } from "lucide-react";

// Mock Agents Data
const AGENTS = [
  { id: "scanner", name: "Scanner", icon: Search, color: "text-blue-400", bgColor: "bg-blue-400/10", borderColor: "border-blue-400/30" },
  { id: "analyzer", name: "Analyzer", icon: Brain, color: "text-purple-400", bgColor: "bg-purple-400/10", borderColor: "border-purple-400/30" },
  { id: "repair", name: "Repair", icon: Wrench, color: "text-pink-400", bgColor: "bg-pink-400/10", borderColor: "border-pink-400/30" },
  { id: "verification", name: "Verification", icon: CheckCircle2, color: "text-emerald-400", bgColor: "bg-emerald-400/10", borderColor: "border-emerald-400/30" },
  { id: "comparison", name: "Comparison", icon: SplitSquareHorizontal, color: "text-cyan-400", bgColor: "bg-cyan-400/10", borderColor: "border-cyan-400/30" },
  { id: "github", name: "GitHub", icon: GitBranch, color: "text-slate-400", bgColor: "bg-slate-400/10", borderColor: "border-slate-400/30" },
];

export default function AgentsPage() {
  const [activeNode, setActiveNode] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto progression simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % AGENTS.length);
    }, 3000); // Move to next agent every 3 seconds
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      
      {/* Visualizer Panel */}
      <div className="flex-1 flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agent Swarm</h1>
            <p className="text-muted-foreground">Live visualization of autonomous agents repairing your codebase.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? "Pause Simulation" : "Resume"}
          </Button>
        </div>

        <div className="relative flex-1 bg-[#09090b] rounded-2xl border border-white/5 shadow-inner overflow-hidden p-8 flex flex-col items-center justify-center min-h-[500px]">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          
          <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4 px-4">
            {AGENTS.map((agent, index) => {
              const isActive = index === activeNode;
              const isCompleted = index < activeNode;
              const isPending = index > activeNode;

              return (
                <div key={agent.id} className="flex items-center flex-1 w-full justify-center">
                  <motion.div
                    onClick={() => setSelectedAgent(agent)}
                    className={`
                      relative cursor-pointer transition-all duration-300 w-32 p-4 rounded-xl flex flex-col items-center gap-3 backdrop-blur-md z-10 shrink-0
                      ${isActive ? `scale-110 border ${agent.borderColor} ${agent.bgColor} shadow-[0_0_30px_rgba(255,255,255,0.1)] shadow-${agent.color.split('-')[1]}-500/20` : 'border border-transparent'}
                      ${isCompleted ? 'border-white/10 bg-white/5 opacity-80' : ''}
                      ${isPending ? 'border-white/5 bg-transparent opacity-40' : ''}
                      hover:border-white/30 hover:bg-white/5
                    `}
                  >
                    <div className={`p-3 rounded-full ${isActive ? 'animate-pulse bg-white/10' : 'bg-transparent'}`}>
                      <agent.icon className={`w-8 h-8 ${isActive ? agent.color : isCompleted ? 'text-muted-foreground' : 'text-slate-600'}`} />
                    </div>
                    <span className={`text-sm font-semibold text-center leading-tight ${isActive ? 'text-white' : 'text-slate-400'}`}>{agent.name}</span>
                    
                    {/* Status Badge */}
                    <div className="absolute -bottom-3 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                      <Badge variant="outline" className={`
                        text-[10px] uppercase tracking-wider bg-[#09090b] border
                        ${isActive ? 'border-primary text-primary' : isCompleted ? 'border-emerald-500/50 text-emerald-500' : 'border-slate-800 text-slate-500'}
                      `}>
                        {isActive ? "Running" : isCompleted ? "Done" : "Wait"}
                      </Badge>
                    </div>
                  </motion.div>

                  {/* Connecting Line with Animated Particle */}
                  {index < AGENTS.length - 1 && (
                    <div className="relative flex-1 h-0.5 min-w-[20px] md:min-w-[40px] bg-white/10 hidden md:block">
                       {/* Animated Particle traveling when the source node is active or recently completed */}
                       {(isActive || isCompleted) && (
                         <motion.div 
                           className={`absolute top-1/2 -translate-y-1/2 h-1.5 w-8 rounded-full blur-[1px] ${isActive ? 'bg-white' : 'bg-white/20'}`}
                           initial={{ left: "0%", opacity: 0 }}
                           animate={{ 
                             left: isActive ? ["0%", "100%", "0%"] : "100%", 
                             opacity: isActive ? [0, 1, 0] : 0 
                           }}
                           transition={{ 
                             duration: isActive ? 1.5 : 0,
                             repeat: isActive ? Infinity : 0,
                             ease: "linear" 
                           }}
                         />
                       )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Inspector Panel */}
      <div className="w-full lg:w-96 flex flex-col gap-4">
        <Card className="flex-1 bg-card/50 backdrop-blur-md border-primary/10 shadow-lg">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-md ${selectedAgent.bgColor} ${selectedAgent.color}`}>
                <selectedAgent.icon className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>{selectedAgent.name} Agent</CardTitle>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Activity className="w-3 h-3 text-emerald-500" /> System Online
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Current Task</h4>
              <p className="text-sm font-medium">
                {selectedAgent.id === "scanner" && "Crawling /store routes for WCAG 2.1 AA violations using axe-core."}
                {selectedAgent.id === "analyzer" && "Parsing AST to understand component hierarchy for color contrast failure."}
                {selectedAgent.id === "repair" && "Generating accessible Tailwind class replacements (bg-gray-300 -> bg-slate-900)."}
                {selectedAgent.id === "verification" && "Running headless browser tests with pa11y to verify contrast passes 4.5:1."}
                {selectedAgent.id === "comparison" && "Generating Before/After screenshots and accessibility tree diff."}
                {selectedAgent.id === "github" && "Creating pull request with fix commit and attached verification artifacts."}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                <Clock className="w-3 h-3" /> Execution Time
              </h4>
              <p className="text-2xl font-mono">
                {selectedAgent.id === "scanner" && "4.2s"}
                {selectedAgent.id === "analyzer" && "1.8s"}
                {selectedAgent.id === "repair" && "3.1s"}
                {selectedAgent.id === "verification" && "5.4s"}
                {selectedAgent.id === "comparison" && "2.2s"}
                {selectedAgent.id === "github" && "1.1s"}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                <FileCode className="w-3 h-3" /> Live Artifacts
              </h4>
              <div className="rounded-md bg-[#09090b] border border-white/10 p-3 font-mono text-[10px] text-slate-400 overflow-x-auto">
                <pre>
                  {selectedAgent.id === "scanner" && "{\n  \"violations\": 146,\n  \"critical\": 12,\n  \"path\": \"/product/1\"\n}"}
                  {selectedAgent.id === "analyzer" && "{\n  \"node\": \"button\",\n  \"classes\": \"text-white bg-gray-300\",\n  \"computedContrast\": 2.8\n}"}
                  {selectedAgent.id === "repair" && "diff --git a/AddToCartButton.tsx\n- <button className=\"text-white bg-gray-300\">\n+ <button className=\"text-white bg-slate-900\">"}
                  {selectedAgent.id === "verification" && "PASS: color-contrast (7.2:1)\nPASS: aria-label presence\nTests completed: 2/2"}
                  {selectedAgent.id === "comparison" && "Uploading screenshots...\nTree diff generated."}
                  {selectedAgent.id === "github" && "PR #1 Created successfully.\nBranch: flex-pilot/fix-contrast"}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
