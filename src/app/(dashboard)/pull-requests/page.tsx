"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitPullRequest, GitMerge, CheckCircle2, Search, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PullRequest, Repository } from "@/lib/mock-data";

export default function PullRequestsPage() {
  const [prs, setPrs] = useState<PullRequest[]>([]);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8001/api/pull-requests").then(r => r.json()),
      fetch("http://127.0.0.1:8001/api/projects").then(r => r.json())
    ]).then(([prData, repoData]) => {
      setPrs(prData);
      setRepos(repoData);
      setLoading(false);
    });
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pull Requests</h1>
          <p className="text-muted-foreground">
            Review and merge AI-generated accessibility fixes.
          </p>
        </div>
        <Button className="gap-2">
          New Automation Rule
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open PRs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Merged PRs (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Issues Fixed Automatically</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pull requests..."
            className="pl-8 bg-background"
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="divide-y">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading pull requests...</div>
          ) : prs.map((pr) => {
            const repo = repos.find(r => r.id === pr.repositoryId);
            return (
              <div key={pr.id} className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {pr.status === "open" ? (
                      <GitPullRequest className="h-5 w-5 text-emerald-500" />
                    ) : pr.status === "merged" ? (
                      <GitMerge className="h-5 w-5 text-purple-500" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <a href={pr.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-base hover:text-primary transition-colors flex items-center gap-2">
                      {pr.title}
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{repo?.name || pr.repositoryId}</span>
                      <span>•</span>
                      <span>Created {new Date(pr.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <Link href={`/issues/${pr.issueId}`} className="hover:underline text-primary/80">
                        Fixes #{pr.issueId.split('-')[1]}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Badge variant={pr.status === "open" ? "default" : "secondary"} className="capitalize">
                    {pr.status}
                  </Badge>
                  {pr.status === "open" && (
                    <Button size="sm" variant="outline">
                      <a href={pr.url} target="_blank" rel="noopener noreferrer">Review</a>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
