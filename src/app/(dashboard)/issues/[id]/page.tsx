/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, GitPullRequest, Code2, AlertTriangle, CheckCircle2, Search, Brain, Map, Wrench, Info, Users, BookOpen, Activity, Volume2, X } from "lucide-react";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Issue, Repository } from "@/lib/mock-data";
const LOG_LINES = [
  { className: "text-blue-400", content: "[SCANNER] Analyzing DOM structure for violations..." },
  { className: "text-emerald-400 pl-4", content: "Found: Insufficient color contrast on <button> element. (2.8:1)" },
  { className: "text-purple-400 mt-2", content: "[ANALYZER] Correlating DOM node with React Virtual DOM..." },
  { className: "text-emerald-400 pl-4", content: "Match found in AddToCartButton.tsx (Lines 42-45)" },
  { className: "text-pink-400 mt-2", content: "[REPAIR] Generating semantic HTML and Tailwind utility classes..." },
  { className: "pl-4 text-red-400", content: "- className=\"text-white bg-gray-300\"" },
  { className: "pl-4 text-green-400", content: "+ className=\"text-white bg-slate-900\" aria-label=\"Purchase Item\"" },
  { className: "text-cyan-400 mt-2", content: "[VERIFICATION] Running headless pa11y tests on patched branch..." },
  { className: "text-emerald-400 pl-4", content: "PASS: Principle 1 - Perceivable" },
  { className: "text-emerald-400 pl-4", content: "PASS: Color Contrast (7.2:1)" },
  { className: "text-slate-400 mt-2", content: "[GITHUB] Committing changes and creating Pull Request..." }
];

function AgentBrainLogs() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount < LOG_LINES.length) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, 400 + Math.random() * 600); // Random delay between 400ms and 1000ms
      return () => clearTimeout(timer);
    }
  }, [visibleCount]);

  return (
    <div className="p-4 space-y-1 h-[400px] overflow-y-auto font-mono text-xs md:text-sm">
      {LOG_LINES.slice(0, visibleCount).map((log, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={log.className}
        >
          {log.content}
        </motion.div>
      ))}
      {visibleCount < LOG_LINES.length && (
        <motion.div 
          animate={{ opacity: [1, 0] }} 
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-2 h-4 bg-emerald-500 mt-1"
        />
      )}
    </div>
  );
}

export default function IssueDetailsPage() {
  const params = useParams();
  const issueId = params.id as string;
  
  const [issue, setIssue] = useState<Issue | null>(null);
  const [repo, setRepo] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch(`http://127.0.0.1:8001/api/issues/${issueId}`).then(r => r.ok ? r.json() : null),
      fetch(`http://127.0.0.1:8001/api/projects`).then(r => r.json())
    ]).then(([issueData, projectsData]) => {
      // Fallback for demo if issueId not found
      const finalIssue = issueData || projectsData[0]; // just a fallback
      setIssue(issueData);
      if (issueData) {
        setRepo(projectsData.find((p: any) => p.id === issueData.repositoryId) || null);
      }
      setLoading(false);
    });
  }, [issueId]);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading issue details...</div>;
  }

  if (!issue) {
    return <div className="p-8 text-center text-muted-foreground">Issue not found</div>;
  }

  // The AI Timeline steps
  const timelineSteps = [
    { label: "Scanner detected", icon: Search, desc: "Axe-core scan completed." },
    { label: "Analyzer identified root cause", icon: Brain, desc: "AST parsed." },
    { label: `Source Mapper located`, icon: Map, desc: `Found ${issue.path.split('/').pop()}` },
    { label: "Repair generated", icon: Wrench, desc: "Generated accessible Tailwind classes." },
    { label: "Verification confirmed", icon: CheckCircle2, desc: "Score improved. Tests passed." },
    { label: "PR created", icon: GitPullRequest, desc: "Pushed to GitHub." },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/repositories/${repo?.id}`} className="text-sm font-medium text-muted-foreground hover:text-primary">
              {repo?.name || issue.repositoryId}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-mono text-muted-foreground">{issue.path}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{issue.title}</h1>
          <div className="flex items-center gap-3 mt-3">
            <Badge variant={issue.status === 'resolved' ? 'default' : 'destructive'} className="capitalize">
              {issue.status.replace("_", " ")}
            </Badge>
            <Badge variant="outline" className="uppercase text-xs font-semibold">
              {issue.severity}
            </Badge>
            <span className="text-xs text-muted-foreground border border-border/50 rounded-full px-2 py-0.5">
              {issue.standard}
            </span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" className="gap-2">
            <Code2 className="h-4 w-4" /> View in IDE
          </Button>
          <Button className="gap-2">
            <GitPullRequest className="h-4 w-4" /> Review PR
          </Button>
        </div>
      </div>

      <Tabs defaultValue="repair" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-4">
          <TabsTrigger value="repair" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3">
            AI Repair Timeline
          </TabsTrigger>
          <TabsTrigger value="verification" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3">
            Verification & Before/After
          </TabsTrigger>
          <TabsTrigger value="impact" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3">
            Impact Analysis
          </TabsTrigger>
        </TabsList>
        
        {/* REPAIR TIMELINE */}
        <TabsContent value="repair" className="mt-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Timeline Sequence */}
            <div className="md:col-span-1 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" /> AI Execution Trace
              </h3>
              <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {timelineSteps.map((step, index) => {
                  const isActive = index === activeStep;
                  const isDone = index < activeStep;
                  return (
                    <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active" onClick={() => setActiveStep(index)}>
                      {/* Icon */}
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow transition-colors cursor-pointer z-10 
                        ${isActive ? 'bg-primary border-primary text-primary-foreground animate-pulse' : isDone ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-[#09090b] border-white/20 text-muted-foreground'}`}>
                        <step.icon className="w-4 h-4" />
                      </div>
                      
                      {/* Card */}
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm cursor-pointer hover:bg-white/10 transition-colors">
                        <div className="flex flex-col">
                          <span className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-slate-300'}`}>{step.label}</span>
                          <span className="text-xs text-muted-foreground mt-1">{step.desc}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex gap-2 pt-4">
                <Button size="sm" variant="outline" onClick={() => setActiveStep(Math.max(0, activeStep - 1))}>Prev Step</Button>
                <Button size="sm" onClick={() => setActiveStep(Math.min(timelineSteps.length - 1, activeStep + 1))}>Next Step</Button>
              </div>
            </div>

            {/* AI Thinking Panel */}
            <div className="md:col-span-2">
              <Card className="h-full bg-[#09090b] border-primary/20 shadow-2xl relative overflow-hidden">
                {/* Glowing border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-[shimmer_5s_infinite] pointer-events-none" />
                <CardHeader className="border-b border-white/5 bg-white/5 relative z-10">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Agent Brain Logs
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 font-mono text-xs md:text-sm text-slate-300 relative z-10">
                  <AgentBrainLogs />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* VERIFICATION & BEFORE/AFTER */}
        <TabsContent value="verification" className="mt-6 space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Visual Comparison */}
            <Card className="overflow-hidden border-primary/20 shadow-lg">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" /> Visual Comparison
                </CardTitle>
                <CardDescription>Drag the slider to see the fix applied.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <BeforeAfterSlider 
                  beforeNode={
                    <div className="flex w-full h-full flex-col items-center justify-center bg-white p-8 space-y-4">
                      <h3 className="text-xl font-bold text-gray-300">Checkout</h3>
                      <p className="text-gray-400 text-center">Complete your purchase to finish the order.</p>
                      <button className="px-6 py-2 bg-gray-200 text-white font-medium rounded shadow-sm">Confirm Order</button>
                    </div>
                  }
                  afterNode={
                    <div className="flex w-full h-full flex-col items-center justify-center bg-white p-8 space-y-4">
                      <h3 className="text-xl font-bold text-gray-900">Checkout</h3>
                      <p className="text-gray-700 text-center">Complete your purchase to finish the order.</p>
                      <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded shadow-md hover:bg-blue-700 transition-colors">Confirm Order</button>
                    </div>
                  }
                />
              </CardContent>
            </Card>

            {/* How We Know It's Fixed */}
            <Card className="border-emerald-500/30 shadow-xl relative overflow-hidden bg-gradient-to-b from-[#09090b] to-[#0a100d]">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              <CardHeader className="border-b border-emerald-500/10 bg-emerald-500/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2 text-emerald-400">
                      <ShieldCheck className="w-5 h-5" /> Verification Report
                    </CardTitle>
                    <CardDescription className="text-emerald-500/70 mt-1">Automated post-fix validation results.</CardDescription>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Safe
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {issue.verification ? (
                  <>
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Accessibility Tree Diff
                      </h4>
                      <div className="grid grid-cols-2 overflow-hidden rounded-md border border-white/10 bg-black/40 text-xs font-mono">
                        <div className="p-4 border-r border-white/5 space-y-2">
                          <div className="text-white/40 uppercase tracking-widest text-[10px] mb-2 flex items-center gap-1">
                            <X className="w-3 h-3 text-red-500" /> Before
                          </div>
                          <div className="text-red-400/80 whitespace-pre-wrap">{issue.verification.accessibilityTreeBefore}</div>
                        </div>
                        <div className="p-4 bg-emerald-950/20 space-y-2">
                          <div className="text-emerald-500/70 uppercase tracking-widest text-[10px] mb-2 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> After
                          </div>
                          <div className="text-emerald-400 whitespace-pre-wrap">{issue.verification.accessibilityTreeAfter}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Volume2 className="w-4 h-4" /> Screen Reader Announcement
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-start gap-3 p-3 rounded-md bg-red-950/10 border border-red-500/10 text-sm">
                          <div className="mt-0.5 bg-red-500/20 p-1.5 rounded-full"><X className="w-3 h-3 text-red-400" /></div>
                          <div>
                            <span className="text-red-400/60 block text-xs mb-1">Previous Output</span>
                            <span className="text-slate-300 italic">"{issue.verification.screenReaderBefore}"</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-md bg-emerald-950/20 border border-emerald-500/20 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                          <div className="mt-0.5 bg-emerald-500/20 p-1.5 rounded-full"><Volume2 className="w-3 h-3 text-emerald-400" /></div>
                          <div>
                            <span className="text-emerald-500/80 block text-xs mb-1">New Output</span>
                            <span className="text-white font-medium">"{issue.verification.screenReaderAfter}"</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-white/5">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Passing Rules</h4>
                      <div className="flex flex-wrap gap-2">
                        {issue.verification.testsPassed.map((test, i) => (
                          <Badge key={i} variant="secondary" className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3 mr-1.5 opacity-70" /> {test}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                   <div className="flex items-center justify-center p-8 text-muted-foreground bg-white/5 rounded border border-white/10 border-dashed animate-pulse">
                     Verification data loading...
                   </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* IMPACT ANALYSIS */}
        <TabsContent value="impact" className="mt-6 space-y-6">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" /> Impact & Rationale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {issue.impact ? (
                <>
                  <div className="flex gap-4 items-start">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Who is affected?</h4>
                      <p className="text-muted-foreground mt-1 leading-relaxed">{issue.impact.usersAffected}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">WCAG Guideline</h4>
                      <p className="text-muted-foreground mt-1 leading-relaxed">{issue.impact.guideline}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Why It Matters</h4>
                      <p className="text-muted-foreground mt-1 leading-relaxed">{issue.impact.whyItMatters}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p>Impact data unavailable.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
