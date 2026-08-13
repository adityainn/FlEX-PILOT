"use client";

import { motion } from "framer-motion";
import { StatCard } from "@/components/ui/stat-card";
import { Activity, CheckCircle2, GitPullRequest, Search, FileCode } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export function InteractiveDashboard({ runs, projects, avgScore, totalFixed }: { runs: any[], projects: any[], avgScore: number, totalFixed: number }) {
  
  // Transform runs into chart data
  const chartData = [...runs].reverse().map((run, i) => ({
    name: `Run ${i + 1}`,
    score: run.finalScore,
    issues: run.issuesFound
  }));

  const container: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      
      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item} whileHover={{ y: -5 }} className="transition-all">
          <StatCard 
            title="Avg Accessibility Score" 
            value={`${avgScore}/100`} 
            description="+7 from last month" 
            icon={<Activity className="h-4 w-4 text-primary" />} 
            trend={{ value: 7, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={item} whileHover={{ y: -5 }} className="transition-all">
          <StatCard 
            title="Auto-Fixed Repairs" 
            value={totalFixed.toString()} 
            description={`Across ${projects.length} active projects`} 
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />} 
            trend={{ value: 12, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={item} whileHover={{ y: -5 }} className="transition-all">
          <StatCard 
            title="Verification Pass Rate" 
            value="94%" 
            description="AI fixes passing regression" 
            icon={<Activity className="h-4 w-4 text-emerald-500" />} 
            trend={{ value: 2, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={item} whileHover={{ y: -5 }} className="transition-all">
          <StatCard 
            title="Generated Pull Requests" 
            value="342" 
            description="+18 this week" 
            icon={<GitPullRequest className="h-4 w-4 text-cyan-500" />} 
            trend={{ value: 18, isPositive: true }}
          />
        </motion.div>
      </div>

      {/* Chart Section */}
      <motion.div variants={item}>
        <Card className="border-primary/5 shadow-md overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
          <CardHeader>
            <CardTitle>Accessibility Score Trend</CardTitle>
            <CardDescription>Continuous monitoring of your repository's WCAG compliance over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lists Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={item}>
          <Card className="col-span-1 shadow-sm border-primary/5 h-full">
            <CardHeader>
              <CardTitle>Recent Accessibility Runs</CardTitle>
              <CardDescription>Latest automated agent scans across your repositories.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {runs.slice(0, 5).map((scan, i) => {
                  const repo = projects.find(r => r.id === scan.projectId);
                  return (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + 0.4 }}
                      key={scan.id} 
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                      className="flex items-center justify-between p-3 border rounded-lg transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                          <Search className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            <Link href={`/repo/${scan.projectId}`} className="group-hover:text-primary transition-colors">
                              {repo?.name || scan.projectId}
                            </Link>
                          </p>
                          <p className="text-xs text-muted-foreground">{new Date(scan.startTime).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs font-medium">{scan.issuesFound} found</p>
                          <p className="text-xs text-emerald-400/80">{scan.issuesFixed} fixed</p>
                        </div>
                        <Badge variant="outline" className={`w-12 justify-center font-mono ${scan.finalScore > 90 ? 'border-emerald-500/50 text-emerald-400' : ''}`}>
                          {scan.finalScore}
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="col-span-1 shadow-sm border-primary/5 h-full">
            <CardHeader>
              <CardTitle>Monitored Projects</CardTitle>
              <CardDescription>Repositories currently integrated with Flex Pilot.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((proj, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.4 }}
                    key={proj.id} 
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                    className="flex items-center justify-between p-3 border rounded-lg transition-colors gap-4 cursor-pointer group"
                  >
                    <div className="flex items-start gap-4 flex-1 overflow-hidden">
                      <div className="p-2 rounded-full mt-0.5 shrink-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                        <FileCode className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate block group-hover:text-blue-400 transition-colors">{proj.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-black/20">{proj.framework}</Badge>
                          <span className="text-xs text-muted-foreground truncate">{proj.hasTypeScript ? 'TypeScript' : 'JavaScript'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
