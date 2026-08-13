import { BaseAgent } from "../base-agent";
import { RepairPatch, SourceMapperOutput, AnalyzedIssue } from "@/types";
import { aiService } from "@/services/ai";
import { runStateManager } from "@/services/run-state";
import fs from 'fs';
import path from 'path';

export interface RepairOutput {
  mappingId: string;
  patch: RepairPatch;
}

export interface RepairAgentInput {
  mappings: SourceMapperOutput[];
  issues: AnalyzedIssue[];
  workspacePath: string;
}

export class RepairAgent extends BaseAgent<RepairAgentInput, RepairPatch[]> {
  constructor() {
    super("repair", "Repair Agent");
  }

  protected async performTask(runId: string, input: RepairAgentInput): Promise<RepairPatch[]> {
    const { mappings, issues } = input;
    this.setStatus(runId, 'thinking');
    this.log(runId, `Formulating Repair Plans and generating semantic patches...`);
    
    const results: RepairPatch[] = [];
    
    // We need the AnalyzedIssues for generateRepairPlan, but mappings only have issueId.
    // In a real app we'd pass both, but for now we'll construct a mock issue or change the signature.
    // Let's pass the issue from the orchestrator if needed, but since AiService is mocked...
    
    for (const mapping of mappings) {
      // Find the actual AnalyzedIssue
      const issue = issues.find(i => i.id === mapping.issueId) || ({ id: mapping.issueId } as unknown as AnalyzedIssue);
      
      await this.checkpoint(runId);
      const plan = await aiService.getProvider().generateRepairPlan(issue, mapping);
      this.log(runId, `[Plan] ${plan.strategy}`);
      
      // 5. Repair Generator
      runStateManager.updateProgress(runId, 3, 'repair-generator', 'Generating');
      await this.checkpoint(runId);
      const patch = await aiService.getProvider().generateRepairPatch(plan, mapping.snippet);
      this.log(runId, `[Patch Generated] Confidence: ${(patch.confidenceScore * 100).toFixed(0)}%`);
      
      results.push(patch);

      // Apply the patch to the file system
      try {
        const cleanWorkspacePath = input.workspacePath.replace(/\/$/, "");
        const cleanCwd = process.cwd().replace(/\/$/, "");
        const isDemoWorkspace = cleanWorkspacePath === cleanCwd;
        const absPath = `${cleanWorkspacePath}/${mapping.filePath.replace(/^\//, "")}`;

        if (isDemoWorkspace) {
          this.log(runId, `[Demo] Simulated patch for ${mapping.filePath} (skipped file write to active project to prevent dev server crash)`);
        } else if (fs.existsSync(absPath)) {
          const content = fs.readFileSync(absPath, 'utf-8');
          // Replace the snippet with the patched diff
          const patchedContent = content.replace(mapping.snippet, patch.diff);
          fs.writeFileSync(absPath, patchedContent, 'utf-8');
          this.log(runId, `Applied patch to ${mapping.filePath}`);
        } else {
          this.log(runId, `Failed to apply patch: File not found ${absPath}`, 'warning');
        }
      } catch (err) {
        this.log(runId, `Failed to apply patch: ${(err as Error).message}`, 'warning');
      }
      
      // Go back to planner chapter if there are more
      runStateManager.updateProgress(runId, 3, 'repair-planner', 'Planning');
    }

    return results;
  }
}
