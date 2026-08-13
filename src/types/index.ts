// ---------------------------------------------------------
// DOMAIN MODELS
// ---------------------------------------------------------

export interface Workspace {
  id: string;
  name: string;
  createdAt: number;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  repositoryUrl: string;
  framework: string;
  packageManager: string;
  hasTypeScript: boolean;
  createdAt: number;
}

export interface ScanRun {
  id: string;
  projectId: string;
  branch: string;
  status: 'running' | 'completed' | 'failed';
  startTime: number;
  endTime?: number;
  durationMs?: number;
  metrics: {
    initialScore: number;
    finalScore: number;
    issuesFound: number;
    issuesFixed: number;
    regressionRisk?: string;
  };
}

export type Severity = 'minor' | 'moderate' | 'serious' | 'critical';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AccessibilityFinding {
  id: string;
  ruleId: string;
  impact: Severity;
  description: string;
  html: string;
  target: string[]; // DOM Selectors
  help?: string;
  helpUrl?: string;
  wcag?: string[];
  xpath?: string;
  boundingBox?: BoundingBox;
  sourceMapping?: {
    confidence: number;
    mappingMethod: string;
    componentName: string;
    file: string;
    lineNumber: number;
  };
  screenshot?: string; // base64 or URL
  accessibilityTree?: string;
  aiRecommendation?: string;
}

export interface AnalyzedIssue {
  id: string;
  findings: AccessibilityFinding[];
  severity: Severity;
  rationale: string;
  wcagGuideline: string;
  affectedUsers: string;
  confidence: number;
}

export interface SourceMapperOutput {
  issueId: string;
  findingId: string;
  confidence: number;
  mappingMethod: string;
  componentName: string;
  filePath: string;
  lineNumber: number;
  snippet: string;
}

export interface RepairPlan {
  issueId: string;
  strategy: string;
  filesToModify: string[];
  estimatedImprovement: string;
  confidence: number;
}

export interface RepairPatch {
  issueId: string;
  plan: RepairPlan;
  diff: string;
  explanation: string;
  confidenceScore: number;
}

export interface ComparisonReport {
  resolvedIssues: AccessibilityFinding[];
  remainingIssues: AccessibilityFinding[];
  newIssues: AccessibilityFinding[]; // Regressions
  scoreDelta: number;
  wcagDelta: number;
  regressionRisk: "low" | "medium" | "high";
  keyboardAccessibilityDelta: number;
  screenReaderAccessibilityDelta: number;
}

export interface VerificationResult {
  passed: boolean;
  scoreBefore: number;
  scoreAfter: number;
  comparison: ComparisonReport;
  artifacts: {
    screenshotBefore?: string;
    screenshotAfter?: string;
    domSnapshotBefore?: string;
    domSnapshotAfter?: string;
    accessibilityTreeBefore?: string;
    accessibilityTreeAfter?: string;
  };
  executionMetrics: {
    timeTakenMs: number;
    testsRun: string[];
  };
  confidence: number;
}

export interface EvidenceArtifacts {
  treeBefore: string;
  treeAfter: string;
  readerBefore: string;
  readerAfter: string;
}

export interface PullRequest {
  id: string;
  title: string;
  url: string;
  summary: string;
}

// ---------------------------------------------------------
// RUN CONTEXT
// ---------------------------------------------------------

export interface RunMetrics {
  initialScore: number;
  finalScore: number;
  issuesFound: number;
  issuesFixed: number;
  criticalFixed: number;
}

export interface RunContext {
  runId: string;
  repositoryId: string;
  branchId: string;
  status: 'initialized' | 'running' | 'paused' | 'completed' | 'cancelled' | 'failed';
  currentChapter?: number;
  currentAgent?: string;
  currentStep?: string;
  metrics: RunMetrics;
  startTime: number;
  endTime?: number;
}

// ---------------------------------------------------------
// AGENT INTERFACES
// ---------------------------------------------------------

export type AgentStatus = 'idle' | 'running' | 'thinking' | 'completed' | 'failed';
export type LogLevel = 'info' | 'success' | 'warning' | 'error';

export interface AgentLog {
  id: string;
  timestamp: number;
  runId: string;
  agentId: string;
  message: string;
  level: LogLevel;
  metadata?: Record<string, unknown>;
}

export interface IAgent<TInput, TOutput> {
  id: string;
  name: string;
  status: AgentStatus;
  
  execute(runId: string, input: TInput): Promise<TOutput>;
}

// ---------------------------------------------------------
// EVENT BUS TYPES
// ---------------------------------------------------------

export type SwarmEvent = 
  | { type: 'RUN_STARTED'; payload: RunContext }
  | { type: 'RUN_COMPLETED'; payload: RunContext }
  | { type: 'METRICS_UPDATED'; payload: Partial<RunMetrics> }
  | { type: 'AGENT_STATUS_CHANGED'; payload: { runId: string; agentId: string; status: AgentStatus } }
  | { type: 'AGENT_LOG'; payload: AgentLog }
  | { type: 'RUN_PROGRESS'; payload: { runId: string; progress: number } }
  | { type: 'RUN_CHAPTER_CHANGED'; payload: { runId: string; chapter: number; agent: string; step: string } }
  | { type: 'RUN_PAUSED'; payload: { runId: string } }
  | { type: 'RUN_RESUMED'; payload: { runId: string } }
  | { type: 'RUN_CANCELLED'; payload: { runId: string } };
