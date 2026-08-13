"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  FolderGit2,
  GitPullRequest,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Target,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/repositories"))}>
            <FolderGit2 className="mr-2 h-4 w-4" />
            <span>Projects</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/agents"))}>
            <Activity className="mr-2 h-4 w-4" />
            <span>View AI Agents</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => router.push("/scans"))}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span>Trigger Accessibility Run</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/issues"))}>
            <Target className="mr-2 h-4 w-4" />
            <span>View Repairs</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/pull-requests"))}>
            <GitPullRequest className="mr-2 h-4 w-4" />
            <span>Review AI Pull Requests</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
