import { ScannerAgent } from "@/agents/scanner";
import { AnalyzerAgent } from "@/agents/analyzer";
import { SourceMapperAgent } from "@/agents/source-mapper";
import { RepairAgent } from "@/agents/repair";
import { VerificationAgent } from "@/agents/verification";
import { EvidenceAgent } from "@/agents/evidence";
import { GitHubAgent } from "@/agents/github";
import { eventBus } from "./event-bus";
import { RunContext } from "@/types";
import { runStateManager } from "./run-state";

import { aiService } from "./ai";

export class SwarmOrchestrator {
  private scanner = new ScannerAgent();
  private analyzer = new AnalyzerAgent();
  private mapper = new SourceMapperAgent();
  private repair = new RepairAgent();
  private verification = new VerificationAgent();
  private evidence = new EvidenceAgent();
  private github = new GitHubAgent();

  public async startRun(repositoryUrl: string, branchId: string, runId: string) {
    // If it's the demo project, force using the mock AI provider to bypass API quotas
    const isDemo = repositoryUrl.includes("demo-react-store");
    aiService.setForceMock(isDemo);

    const context: RunContext = {
      runId,
      repositoryId: repositoryUrl,
      branchId,
      status: 'running',
      startTime: Date.now(),
      metrics: {
        initialScore: 72,
        finalScore: 72,
        issuesFound: 0,
        issuesFixed: 0,
        criticalFixed: 0
      }
    };

    eventBus.emit({ type: 'RUN_STARTED', payload: context });

    try {
      runStateManager.set(runId, { status: 'running' });
      await import('./run-history-service').then(m => m.runHistoryService.createRun(context).catch(console.error));

      // 0. Understanding
      runStateManager.updateProgress(runId, 0, 'orchestrator', 'Understanding');
      
      const { workspaceManager } = await import('./workspace-manager');
      this.log(runId, `Preparing workspace for ${repositoryUrl} on branch ${branchId}...`);
      const workspace = await workspaceManager.prepareWorkspace(runId, repositoryUrl, branchId);
      
      await runStateManager.waitUntilRunning(runId);

      // 1. Scan -> Discovery
      runStateManager.updateProgress(runId, 1, 'scanner', 'Discovery');
      // Pass the workspace port to the Scanner Agent
      const scanUrl = repositoryUrl.includes('demo-react-store') ? 'http://localhost:3000/demo-app' : `http://localhost:${workspace.port}`;
      const findings = await this.scanner.execute(runId, { url: scanUrl });
      eventBus.emit({ type: 'METRICS_UPDATED', payload: { issuesFound: findings.length } });
      
      // 2. Analyze & Map -> Reasoning
      runStateManager.updateProgress(runId, 2, 'analyzer', 'Reasoning');
      const analyzed = await this.analyzer.execute(runId, findings);
      
      // Pass the workspace path to Source Mapper Agent
      const mappings = await this.mapper.execute(runId, { issues: analyzed, workspacePath: workspace.workspacePath });
      
      // 3. Repair Planner & Generator -> Repair
      runStateManager.updateProgress(runId, 3, 'repair', 'Repairing');
      const repairs = await this.repair.execute(runId, { mappings, issues: analyzed, workspacePath: workspace.workspacePath });
      
      // 4. Verify -> Verification
      runStateManager.updateProgress(runId, 4, 'verification', 'Verifying');
      const verificationResult = await this.verification.execute(runId, { url: scanUrl, repairs, beforeFindings: findings });
      
      // 5. Evidence
      runStateManager.updateProgress(runId, 5, 'evidence', 'Evidence');
      await this.evidence.execute(runId, verificationResult);
      
      // 6. GitHub PR -> Delivery
      runStateManager.updateProgress(runId, 6, 'github', 'Delivery');
      // Pass the workspace path and repository URL to GitHub Agent
      const pr = await this.github.execute(runId, { verification: verificationResult, workspacePath: workspace.workspacePath, repositoryUrl, branchId });
      
      runStateManager.set(runId, { status: 'completed' });
      
      const completedContext = { ...context, status: 'completed' as const, endTime: Date.now() };
      
      await import('./run-history-service').then(m => m.runHistoryService.updateRun(completedContext).catch(console.error));
      await workspaceManager.cleanupWorkspace(runId).catch(console.error);

      // Complete
      eventBus.emit({ 
        type: 'RUN_COMPLETED', 
        payload: completedContext 
      });

      return { runId, pr };
    } catch (error) {
      console.error("Swarm execution failed", error);
      const failedContext = { ...context, status: 'failed' as const, endTime: Date.now() };
      await import('./run-history-service').then(m => m.runHistoryService.updateRun(failedContext).catch(console.error));
      
      const { workspaceManager } = await import('./workspace-manager');
      await workspaceManager.cleanupWorkspace(runId).catch(console.error);
      
      eventBus.emit({ 
        type: 'RUN_COMPLETED', 
        payload: failedContext 
      });
      throw error;
    }
  }
  
  private log(runId: string, message: string) {
    eventBus.emit({
      type: 'AGENT_LOG',
      payload: { id: Math.random().toString(), timestamp: Date.now(), runId, agentId: 'orchestrator', message, level: 'info' }
    });
  }
}

export const swarmOrchestrator = new SwarmOrchestrator();
