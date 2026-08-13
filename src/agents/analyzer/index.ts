import { BaseAgent } from "../base-agent";
import { AccessibilityFinding, AnalyzedIssue } from "@/types";
import { aiService } from "@/services/ai";

export class AnalyzerAgent extends BaseAgent<AccessibilityFinding[], AnalyzedIssue[]> {
  constructor() {
    super("analyzer", "Analyzer Agent");
  }

  protected async performTask(runId: string, findings: AccessibilityFinding[]): Promise<AnalyzedIssue[]> {
    this.setStatus(runId, 'thinking');
    this.log(runId, `Analyzing ${findings.length} DOM structure violations...`);
    
    // Deduplicate findings by ruleId and target
    const grouped = new Map<string, AccessibilityFinding[]>();
    for (const f of findings) {
      const key = `${f.ruleId}-${f.target.join(',')}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(f);
    }
    
    const deduplicatedFindings = Array.from(grouped.values()).map(g => g[0]);
    this.log(runId, `Deduplicated to ${deduplicatedFindings.length} unique issues. Grouping and prioritizing...`);
    
    // Call AI Provider to generate structured JSON explanation
    const analyzedIssues = await aiService.getProvider().analyzeFindings(deduplicatedFindings);
    
    for (const issue of analyzedIssues) {
      this.log(runId, `Analyzed [${issue.severity.toUpperCase()}]: ${issue.rationale}`);
    }

    return analyzedIssues;
  }
}
