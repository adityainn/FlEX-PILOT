"use client";

import { useState, useEffect } from "react";
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
import { FolderGit2, Search, Settings2, GitBranch, Plus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Repository } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  // Connection Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [repoName, setRepoName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<"github" | "gitlab" | "bitbucket">("github");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8001/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((data: Repository[]) => {
        const stored = localStorage.getItem("flexpilot_repos");
        const extraRepos: Repository[] = stored ? JSON.parse(stored) : [];
        const merged = [...extraRepos, ...data.filter((d: Repository) => !extraRepos.some((er: Repository) => er.id === d.id))];
        setRepos(merged);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        const stored = localStorage.getItem("flexpilot_repos");
        const extraRepos: Repository[] = stored ? JSON.parse(stored) : [];
        import("@/lib/mock-data").then(({ mockRepositories }) => {
          const merged = [...extraRepos, ...mockRepositories.filter((d: Repository) => !extraRepos.some((er: Repository) => er.id === d.id))];
          setRepos(merged);
          setLoading(false);
        });
      });
  }, []);

  const handleConnectRepository = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoName.trim()) return;

    setIsConnecting(true);
    setConnectionStatus("Initializing handshake...");
    await new Promise((r) => setTimeout(r, 600));

    setConnectionStatus("Scanning accessibility configuration...");
    await new Promise((r) => setTimeout(r, 800));

    setConnectionStatus("Injecting Flex Pilot webhooks...");
    await new Promise((r) => setTimeout(r, 600));

    const providerUrl = repoUrl.trim() || `https://${selectedProvider}.com/${repoName.trim()}`;
    const newRepo: Repository = {
      id: `repo-${Date.now()}`,
      name: repoName.trim(),
      provider: selectedProvider,
      url: providerUrl,
      lastScanned: new Date().toISOString(),
      healthScore: Math.floor(Math.random() * 15) + 85, // 85 to 100
      openIssues: Math.floor(Math.random() * 8),
    };

    // Save to local storage
    const stored = localStorage.getItem("flexpilot_repos");
    const currentStored = stored ? JSON.parse(stored) : [];
    const updatedStored = [newRepo, ...currentStored];
    localStorage.setItem("flexpilot_repos", JSON.stringify(updatedStored));

    // Update UI state
    setRepos((prev) => [newRepo, ...prev]);

    // Cleanup and close
    setIsConnecting(false);
    setConnectionStatus("");
    setRepoName("");
    setRepoUrl("");
    setSelectedProvider("github");
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground">
            Manage and monitor your connected codebases.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 h-8 gap-1.5 px-2.5 bg-primary text-primary-foreground hover:bg-primary/80">
            <Plus className="h-4 w-4" />
            Connect Repository
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Connect Repository</DialogTitle>
              <DialogDescription className="text-zinc-400 text-sm">
                Integrate your VCS with Flex Pilot for continuous accessibility scanning.
              </DialogDescription>
            </DialogHeader>

            {isConnecting ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm font-medium text-zinc-300 animate-pulse">{connectionStatus}</p>
              </div>
            ) : (
              <form onSubmit={handleConnectRepository} className="space-y-6 pt-4">
                {/* Provider Selector */}
                <div className="space-y-2">
                  <Label className="text-zinc-300 text-sm">Select Provider</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "github", name: "GitHub" },
                      { id: "gitlab", name: "GitLab" },
                      { id: "bitbucket", name: "Bitbucket" },
                    ].map((prov) => {
                      const isSelected = selectedProvider === prov.id;
                      return (
                        <button
                          key={prov.id}
                          type="button"
                          onClick={() => setSelectedProvider(prov.id as "github" | "gitlab" | "bitbucket")}
                          className={`
                            py-3 px-2 rounded-lg border text-sm font-medium transition-all flex flex-col items-center gap-2
                            ${
                              isSelected
                                ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
                                : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                            }
                          `}
                        >
                          <GitBranch className="h-4 w-4" />
                          {prov.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Repo Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="repo-name" className="text-zinc-300 text-sm">
                      Repository Path
                    </Label>
                    <Input
                      id="repo-name"
                      placeholder="e.g., acme-corp/marketing-site"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      required
                      className="bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 rounded-lg h-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="repo-url" className="text-zinc-300 text-sm">
                      Repository URL <span className="text-zinc-500 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="repo-url"
                      placeholder={`e.g., https://${selectedProvider}.com/acme-corp/marketing-site`}
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className="bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 rounded-lg h-9"
                    />
                  </div>
                </div>

                <DialogFooter className="flex gap-2 justify-end pt-4 border-t border-zinc-900 -mx-4 -mb-4 px-4 bg-zinc-900/30">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsDialogOpen(false)}
                    className="rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="rounded-lg shadow-lg shadow-primary/20">
                    Connect
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search repositories..."
            className="pl-8 bg-background rounded-lg h-9 border-zinc-800"
          />
        </div>
        <Button variant="outline" size="icon" className="rounded-lg border-zinc-800">
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50 border-b border-zinc-800">
            <TableRow className="border-b border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Repository</TableHead>
              <TableHead className="text-zinc-400">Provider</TableHead>
              <TableHead className="text-zinc-400">Health Score</TableHead>
              <TableHead className="text-zinc-400">Open Issues</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Loading repositories...
                </TableCell>
              </TableRow>
            ) : repos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No repositories connected.
                </TableCell>
              </TableRow>
            ) : (
              repos.map((repo) => (
                <TableRow key={repo.id} className="border-b border-zinc-900 hover:bg-zinc-900/20 transition-colors">
                  <TableCell>
                    <Link href={repo.url} target="_blank" className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-primary/10 text-primary">
                        <FolderGit2 className="h-4 w-4" />
                      </div>
                      <span className="font-medium hover:underline text-zinc-100">{repo.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground text-zinc-400">
                      <GitBranch className="h-4 w-4" />
                      <span className="capitalize">{repo.provider}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={repo.healthScore > 80 ? "secondary" : "destructive"}>
                      {repo.healthScore}/100
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm text-zinc-400">
                    {repo.openIssues}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
