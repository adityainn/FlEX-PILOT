"use client";

import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";

import { signIn, signOut } from "next-auth/react";

/**
 * Header Component
 *
 * Renders the top navigation bar containing breadcrumbs, search,
 * notifications, theme toggle, and user profile settings.
 * 
 * Note: DropdownMenuTrigger inherently renders a `<button>`. 
 * To prevent React hydration errors ("button cannot be a descendant of button"),
 * we use the `buttonVariants` utility to style the trigger directly instead 
 * of wrapping a `<Button>` component inside it.
 */
export function Header({ session }: { session?: Session | null }) {
  const { setTheme } = useTheme();
  const pathname = usePathname();

  // Basic breadcrumb logic based on pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumb = pathSegments.length > 0 
    ? pathSegments.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" / ")
    : "Overview";

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-6 lg:h-[60px]">
      <div className="flex flex-1 items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground hidden md:flex items-center gap-2">
          Flex Pilot <span className="text-border">/</span> <span className="text-foreground">{breadcrumb}</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          className="hidden lg:flex items-center gap-2 text-muted-foreground w-64 justify-between bg-muted/20 border-white/5"
          onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
        >
          <span>Search issues...</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative text-muted-foreground")}>
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            <span className="sr-only">Toggle notifications</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <div className="flex flex-col gap-1 p-2 max-h-64 overflow-y-auto">
              <div className="flex flex-col gap-1 rounded-md p-2 hover:bg-muted cursor-pointer transition-colors">
                <span className="text-sm font-medium">Scan Completed</span>
                <span className="text-xs text-muted-foreground">demo-react-store scan finished with 83 fixes.</span>
              </div>
              <div className="flex flex-col gap-1 rounded-md p-2 hover:bg-muted cursor-pointer transition-colors opacity-60">
                <span className="text-sm font-medium">New PR Opened</span>
                <span className="text-xs text-muted-foreground">AI Fixes PR #42 is ready for review.</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center w-full justify-center text-xs">
              Mark all as read
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "relative h-8 w-8 rounded-full p-0")}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image || "/placeholder-avatar.jpg"} alt={session.user.name || "User"} />
                <AvatarFallback>{session.user.name?.substring(0, 2).toUpperCase() || "AE"}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="cursor-pointer">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })} variant="default" size="sm">
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
