"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { AIOrb } from "@/components/chat/ai-orb";
import { CommandPalette } from "@/components/layout/command-palette";
import { Session } from "next-auth";

export function AppLayout({ children, session }: { children: React.ReactNode, session?: Session | null }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <CommandPalette />
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header session={session} />
        <main className="flex-1 overflow-y-auto bg-muted/10 p-6 lg:p-8">
          {children}
        </main>
      </div>
      <AIOrb />
    </div>
  );
}
