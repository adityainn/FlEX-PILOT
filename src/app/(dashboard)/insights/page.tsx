/* eslint-disable react/no-unescaped-entities */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart, Line, LineChart } from "recharts";

const scoreData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 68 },
  { month: "Mar", score: 72 },
  { month: "Apr", score: 71 },
  { month: "May", score: 85 },
  { month: "Jun", score: 89 },
  { month: "Jul", score: 92 },
  { month: "Aug", score: 98 },
];

const violationData = [
  { name: "Contrast", count: 42 },
  { name: "Alt Text", count: 28 },
  { name: "Focus State", count: 18 },
  { name: "ARIA Labels", count: 12 },
  { name: "Keyboard Nav", count: 8 },
];

const verificationTime = [
  { day: "Mon", time: 4.2 },
  { day: "Tue", time: 3.8 },
  { day: "Wed", time: 4.5 },
  { day: "Thu", time: 3.1 },
  { day: "Fri", time: 2.9 },
  { day: "Sat", time: 2.5 },
  { day: "Sun", time: 2.4 },
];

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground">
          Analytics and trends for your organization's accessibility health.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Accessibility Score Over Time</CardTitle>
            <CardDescription>Average WCAG compliance score across all projects.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.5 0.25 285)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.5 0.25 285)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(1 0 0 / 10%)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="score" stroke="oklch(0.5 0.25 285)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Violations Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Violations</CardTitle>
            <CardDescription>Most common WCAG failures.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={violationData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="oklch(1 0 0 / 10%)" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', borderRadius: '8px' }}
                  cursor={{ fill: 'oklch(1 0 0 / 5%)' }}
                />
                <Bar dataKey="count" fill="oklch(0.6 0.2 25)" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Verification Time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Mean Verification Time (Seconds)</CardTitle>
            <CardDescription>Average time for agents to verify a generated fix.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={verificationTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(1 0 0 / 10%)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="time" stroke="oklch(0.7 0.15 150)" strokeWidth={3} dot={{ r: 4, fill: '#09090b', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Auto-Fix Success Rate</CardTitle>
            <CardDescription>Percentage of generated fixes that pass verification without human intervention.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[250px]">
            <div className="relative flex items-center justify-center w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-muted stroke-current" strokeWidth="10" cx="50" cy="50" r="40" fill="transparent" />
                <circle className="text-emerald-500 stroke-current" strokeWidth="10" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.94)} transform="rotate(-90 50 50)" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">94%</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Success</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
