/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Maximize2, Minimize2, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Hi! I'm your AI Accessibility Assistant. How can I help you fix violations today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMessage }] }),
      });

      if (!response.body) throw new Error("No body");

      setMessages(prev => [...prev, { role: 'assistant', content: "" }]);
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: !done });
          const lines = buffer.split('\n');
          // Keep the last incomplete line in the buffer
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data.trim() === '[DONE]') {
                done = true;
                break;
              }
              setMessages(prev => {
                const newMessages = [...prev];
                const lastIndex = newMessages.length - 1;
                newMessages[lastIndex] = {
                  ...newMessages[lastIndex],
                  content: newMessages[lastIndex].content + data
                };
                return newMessages;
              });
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-6 w-6" />
      </Button>
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
            "fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-xl border bg-background shadow-2xl",
            isExpanded && "bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2" // Centers if expanded
          )}
          style={isExpanded ? { right: '50%', bottom: '50%', transform: 'translate(50%, 50%)' } : {}}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Flex Pilot AI</h3>
                <p className="text-xs text-muted-foreground">Accessibility Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setIsOpen(false);
                  setIsExpanded(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex flex-col gap-1", msg.role === 'user' ? "items-end" : "items-start")}>
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                  msg.role === 'user' 
                    ? "bg-primary text-primary-foreground rounded-tr-sm" 
                    : "bg-muted rounded-tl-sm"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-1 items-center px-4 py-3">
                <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setInput("Fix WCAG contrast issues")}>Fix WCAG contrast issues</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setInput("Analyze current page")}>Analyze current page</Badge>
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t p-4 bg-background">
            <form className="relative flex items-center" onSubmit={handleSubmit}>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about accessibility fixes..."
                className="pr-12 bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary border-none shadow-none"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 h-8 w-8 rounded-full"
                variant="ghost"
                disabled={isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
