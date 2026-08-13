"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, LifeBuoy, Send, CheckCircle2 } from "lucide-react";

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
      form.reset();
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Support Center</h2>
        <p className="text-muted-foreground mt-1">Get help, report issues, and contact the Flex Pilot team.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-primary/20 shadow-md">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" /> Contact Support
              </CardTitle>
              <CardDescription>Send a message directly to our engineering team.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isSuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-6 rounded-lg flex flex-col items-center justify-center space-y-3 py-12">
                  <CheckCircle2 className="w-12 h-12" />
                  <p className="font-medium text-lg">Message Sent Successfully!</p>
                  <p className="text-sm text-emerald-500/80 text-center max-w-sm">
                    We've received your query and will get back to you at adityakumar726a@gmail.com shortly.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" defaultValue="adityakumar726a@gmail.com" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" placeholder="How can we help you?" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      name="message"
                      placeholder="Please describe your issue or query in detail..." 
                      className="min-h-[150px]"
                      required 
                    />
                  </div>
                </>
              )}
            </CardContent>
            {!isSuccess && (
              <CardFooter className="bg-muted/30 border-t py-4">
                <Button type="submit" className="ml-auto" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"} <Send className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            )}
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> Flex Pilot AI
              </CardTitle>
              <CardDescription>Instant answers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Don't forget you can ask our Autonomous Accessibility Engineer any technical questions using the chat orb in the bottom right!
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5" /> Documentation
              </CardTitle>
              <CardDescription>Self-serve guides.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Browse our comprehensive documentation for setup instructions, API references, and best practices.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
