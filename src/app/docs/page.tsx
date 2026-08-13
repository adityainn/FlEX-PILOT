import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlexPilotLogo } from "@/components/ui/flex-pilot-logo";

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-background/50 px-6 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 font-medium text-lg">
          <div className="w-8 h-8">
            <FlexPilotLogo />
          </div>
          <span className="tracking-wide">Flex Pilot</span>
        </Link>
        <Link href="/">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-8">
          <BookOpen className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Documentation</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          We are currently writing the comprehensive guides and API references for Flex Pilot V2. 
          Check back soon for the full documentation!
        </p>
        <Link href="/dashboard">
          <Button size="lg">Go to Dashboard</Button>
        </Link>
      </main>
    </div>
  );
}
