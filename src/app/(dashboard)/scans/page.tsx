"use client";

import { mockScans, mockRepositories } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Play, Search, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

export default function ScansPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scans</h1>
          <p className="text-muted-foreground">
            View accessibility audit history and trigger manual scans.
          </p>
        </div>
        <Button className="gap-2">
          <Play className="h-4 w-4" />
          Run New Scan
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search scans..."
            className="pl-8 bg-background"
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Repository</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Health Score</TableHead>
              <TableHead>Issues Found</TableHead>
              <TableHead>Completed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockScans.map((scan) => {
              const repo = mockRepositories.find(r => r.id === scan.repositoryId);
              return (
                <TableRow key={scan.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <Link href={`/repo/${scan.repositoryId}`} className="font-medium hover:underline text-primary">
                      {repo?.name || scan.repositoryId}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={scan.status === "completed" ? "default" : "secondary"} className="capitalize">
                      {scan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium w-6">{scan.score}</span>
                      <Progress value={scan.score} className="h-2 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {scan.issuesFound > 0 ? (
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      )}
                      <span>{scan.issuesFound}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(scan.completedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
