"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { Issue } from "@/lib/mock-data";

export default function IssuesPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8001/api/issues")
      .then(res => res.json())
      .then(data => {
        setIssues(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch issues", err);
        setIsLoading(false);
      });
  }, []);
  
  const filteredIssues = issues.filter(issue => 
    statusFilter === "all" ? true : issue.status === statusFilter
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Issues</h1>
          <p className="text-muted-foreground">
            Track and resolve accessibility violations across your projects.
          </p>
        </div>
        <Button>Generate Report</Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            className="pl-8 bg-background"
          />
        </div>
        <Select value={statusFilter} onValueChange={(val: string | null) => setStatusFilter(val || '')}>
          <SelectTrigger className="w-[150px] bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[150px] bg-background">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 bg-card rounded-xl border shadow-sm flex flex-col overflow-hidden">
        <div className="border-b bg-muted/30 p-3 grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
          <div className="col-span-6 md:col-span-5 pl-4">Title</div>
          <div className="col-span-3 md:col-span-2 hidden md:block">Repository</div>
          <div className="col-span-2 md:col-span-2">Severity</div>
          <div className="col-span-3 md:col-span-2">Status</div>
          <div className="col-span-1 hidden md:block">Created</div>
        </div>
        <div className="divide-y overflow-auto flex-1">
          {filteredIssues.map((issue) => (
            <Link 
              href={`/issues/${issue.id}`} 
              key={issue.id}
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/50 transition-colors group"
            >
              <div className="col-span-6 md:col-span-5 flex flex-col gap-1 pr-4">
                <span className="font-semibold group-hover:text-primary transition-colors truncate">
                  {issue.title}
                </span>
                <span className="text-xs text-muted-foreground truncate">{issue.path}</span>
              </div>
              <div className="col-span-3 md:col-span-2 hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="font-normal truncate">
                  {issue.repositoryId}
                </Badge>
              </div>
              <div className="col-span-2 md:col-span-2">
                <Badge variant={issue.severity === "critical" ? "destructive" : issue.severity === "high" ? "default" : "secondary"}>
                  {issue.severity}
                </Badge>
              </div>
              <div className="col-span-3 md:col-span-2 flex items-center gap-2">
                <StatusIcon status={issue.status} />
                <span className="text-sm capitalize hidden sm:inline-block">
                  {issue.status.replace("_", " ")}
                </span>
              </div>
              <div className="col-span-1 hidden md:block text-sm text-muted-foreground">
                {new Date(issue.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
          {filteredIssues.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No issues found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "open":
      return <AlertCircle className="h-4 w-4 text-rose-500" />;
    case "in_progress":
      return <Clock className="h-4 w-4 text-amber-500" />;
    case "resolved":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
}
