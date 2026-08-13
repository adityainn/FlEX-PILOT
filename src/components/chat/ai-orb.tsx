/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2, Send, X, Sparkles, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';

export function AIOrb() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Hi! I'm your Autonomous Accessibility Engineer. I can analyze components, map issues to WCAG guidelines, and generate pull requests. What would you like to fix?" }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  const handleSubmit = async (e?: React.FormEvent, overrideInput?: string) => {
    e?.preventDefault();
    const query = overrideInput || input;
    if (!query.trim() || isProcessing) return;

    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setIsProcessing(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: query }] }),
      });

      if (!response.body) throw new Error("No response body");

      setMessages(prev => [...prev, { role: 'assistant', content: "" }]);
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunkString = decoder.decode(value, { stream: !done });
          setMessages(prev => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            newMessages[lastIndex] = {
              ...newMessages[lastIndex],
              content: newMessages[lastIndex].content + chunkString
            };
            return newMessages;
          });
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error connecting to the AI." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) {
    return (
      <div 
        className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 cursor-pointer"
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence>
          {(isProcessing || isHovered) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" } }}
              className="absolute inset-[-10px] rounded-full border-t-2 border-l-2 border-primary/30 pointer-events-none"
            />
          )}
        </AnimatePresence>

        <motion.div
          animate={{
            scale: isHovered ? 1.05 : [1, 1.05, 1],
            boxShadow: isHovered 
              ? "0 0 30px rgba(165, 243, 252, 0.6)" 
              : ["0 0 15px rgba(125, 211, 252, 0.2)", "0 0 25px rgba(125, 211, 252, 0.4)", "0 0 15px rgba(125, 211, 252, 0.2)"]
          }}
          transition={{
            scale: isHovered ? { duration: 0.2 } : { duration: 3, repeat: Infinity, ease: "easeInOut" },
            boxShadow: isHovered ? { duration: 0.2 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500/80 to-cyan-400/80 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg"
        >
          <Sparkles className="w-6 h-6 text-white drop-shadow-md" />
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            width: isExpanded ? "80vw" : "400px",
            height: isExpanded ? "80vh" : "600px",
          }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-xl border bg-background/95 backdrop-blur-xl shadow-2xl shadow-primary/10",
            isExpanded && "bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2"
          )}
          style={isExpanded ? { right: '50%', bottom: '50%', transform: 'translate(50%, 50%)' } : {}}
        >
          <div className="flex items-center justify-between border-b border-primary/10 bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Flex Pilot AI</h3>
                <p className="text-xs text-primary/80">Autonomous Repair Agent</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setIsOpen(false);
                  setIsExpanded(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex flex-col gap-1", msg.role === 'user' ? "items-end" : "items-start")}>
                <div className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                  msg.role === 'user' 
                    ? "bg-primary text-primary-foreground rounded-tr-sm" 
                    : "bg-primary/10 border border-primary/20 rounded-tl-sm prose prose-sm dark:prose-invert"
                )}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex gap-1 items-center px-4 py-3">
                <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            )}
            
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 border-primary/20" onClick={() => handleSubmit(undefined, "Review latest scan")}>Review latest scan</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 border-primary/20" onClick={() => handleSubmit(undefined, "Fix contrast issues")}>Fix contrast issues</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 border-primary/20" onClick={() => handleSubmit(undefined, "Explain Section 508")}>Explain Section 508</Badge>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-primary/10 p-4 bg-background/50">
            <form className="relative flex items-center" onSubmit={handleSubmit}>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Flex Pilot..."
                className="pr-12 bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary border-primary/10 shadow-inner rounded-full"
                disabled={isProcessing}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isProcessing}
                className={cn(
                  "absolute right-1 h-8 w-8 rounded-full transition-all",
                  isProcessing ? "bg-primary text-primary-foreground animate-pulse" : "bg-transparent text-muted-foreground hover:bg-primary/20 hover:text-primary"
                )}
              >
                {isProcessing ? <Sparkles className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
