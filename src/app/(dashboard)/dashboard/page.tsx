"use client";

import { StatCard } from "@/components/ui/stat-card";
import { Activity, CheckCircle2, GitPullRequest, AlertCircle, FileCode, Search, Wrench, BarChart } from "lucide-react";
import { mockRepositories, mockIssues, mockScans } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const criticalIssues = mockIssues.filter(i => i.severity === "critical" || i.severity === "high");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. Here is your organization's accessibility overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Avg Accessibility Score" 
          value="85/100" 
          description="+7 from last month" 
          icon={<Activity className="h-4 w-4 text-primary" />} 
          trend={{ value: 7, isPositive: true }}
        />
        <StatCard 
          title="Auto-Fixed Repairs" 
          value="1,248" 
          description="Across 14 active projects" 
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />} 
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Verification Pass Rate" 
          value="94%" 
          description="AI fixes passing regression" 
          icon={<Activity className="h-4 w-4 text-emerald-500" />} 
          trend={{ value: 2, isPositive: true }}
        />
        <StatCard 
          title="Generated Pull Requests" 
          value="342" 
          description="+18 this week" 
          icon={<GitPullRequest className="h-4 w-4 text-cyan-500" />} 
          trend={{ value: 18, isPositive: true }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 shadow-sm border-primary/5">
          <CardHeader>
            <CardTitle>Recent Accessibility Runs</CardTitle>
            <CardDescription>
              Latest automated agent scans across your repositories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockScans.map((scan) => {
                const repo = mockRepositories.find(r => r.id === scan.repositoryId);
                return (
                  <div key={scan.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Search className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          <Link href={`/repo/${scan.repositoryId}`} className="hover:underline text-primary">
                            {repo?.name || scan.repositoryId}
                          </Link>
                        </p>
                        <p className="text-xs text-muted-foreground">{new Date(scan.completedAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs font-medium">{scan.issuesFound} found</p>
                        <p className="text-xs text-muted-foreground">Issues</p>
                      </div>
                      <Badge variant="outline" className="w-12 justify-center font-mono">{scan.score}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-sm border-primary/5">
          <CardHeader>
            <CardTitle>Prioritized Repairs</CardTitle>
            <CardDescription>
              Issues requiring immediate attention.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criticalIssues.slice(0, 4).map((issue) => {
                return (
                  <div key={issue.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors gap-4">
                    <div className="flex items-start gap-4 flex-1 overflow-hidden">
                      <div className={`p-2 rounded-full mt-0.5 shrink-0 ${issue.severity === 'critical' ? 'bg-rose-500/10' : 'bg-amber-500/10'}`}>
                        <AlertCircle className={`h-4 w-4 ${issue.severity === 'critical' ? 'text-rose-500' : 'text-amber-500'}`} />
                      </div>
                      <div className="min-w-0">
                        <Link href={`/issues/${issue.id}`} className="font-medium text-sm hover:underline hover:text-primary truncate block">
                          {issue.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                            {issue.severity}
                          </Badge>
                          <span className="text-xs text-muted-foreground truncate">{issue.path}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="shrink-0 capitalize" variant={issue.status === 'open' ? 'destructive' : 'secondary'}>
                      {issue.status.replace("_", " ")}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
