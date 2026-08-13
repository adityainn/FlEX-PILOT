import { BaseAgent } from "../base-agent";
import { EvidenceArtifacts, VerificationResult } from "@/types";
import { aiService } from "@/services/ai";

export class EvidenceAgent extends BaseAgent<VerificationResult, EvidenceArtifacts> {
  constructor() {
    super("evidence", "Evidence Agent");
  }

  protected async performTask(runId: string, verification: VerificationResult): Promise<EvidenceArtifacts> {
    this.setStatus(runId, 'thinking');
    this.log(runId, `Generating synchronized verification artifacts...`);
    
    await this.checkpoint(runId);
    const summary = await aiService.getProvider().generateEvidenceSummary(verification);
    this.log(runId, `[Summary] ${summary}`);
    
    return {
      treeBefore: verification.artifacts.accessibilityTreeBefore || "button[name=\"\"]",
      treeAfter: verification.artifacts.accessibilityTreeAfter || "button[name=\"Submit\"]",
      readerBefore: "Button, empty",
      readerAfter: "Submit, button"
    };
  }
}
