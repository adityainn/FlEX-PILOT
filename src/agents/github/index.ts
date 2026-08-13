import { BaseAgent } from "../base-agent";
import { VerificationResult, PullRequest } from "@/types";
import { githubService } from "@/services/github";
import { aiService } from "@/services/ai";

export interface GitHubAgentInput {
  verification: VerificationResult;
  workspacePath: string;
  repositoryUrl: string;
  branchId: string;
}

export class GitHubAgent extends BaseAgent<GitHubAgentInput, PullRequest> {
  constructor() {
    super("github", "GitHub Agent");
  }

  protected async performTask(runId: string, input: GitHubAgentInput): Promise<PullRequest> {
    this.setStatus(runId, 'running');
    this.log(runId, `Formulating Pull Request strategy...`);
    
    const branchName = `flexpilot/a11y-run-${runId}`;
    
    this.log(runId, `Creating branch '${branchName}' and committing patches in ${input.workspacePath}...`);
    
    await this.checkpoint(runId);
    const summary = await aiService.getProvider().generateEvidenceSummary(input.verification);
    const prTitle = `a11y: Resolve WCAG Violations (Score +${input.verification.comparison.scoreDelta})`;
    
    try {
      const { repositoryService } = await import('@/services/repository-service');
      const git = await repositoryService.cloneRepository('', input.workspacePath);
      await repositoryService.createBranch(git, branchName);
      
      const token = process.env.GITHUB_TOKEN;
      if (token) {
        // Construct the authenticated URL (assuming https://github.com/...)
        const urlObj = new URL(input.repositoryUrl);
        urlObj.username = 'x-access-token';
        urlObj.password = token;
        const repoUrlWithToken = urlObj.toString();
        
        this.log(runId, `Committing and pushing branch ${branchName}...`);
        await repositoryService.commitAndPush(git, prTitle, branchName, repoUrlWithToken);
      } else {
        this.log(runId, `No GITHUB_TOKEN found. Skipping git push.`, 'warning');
      }
    } catch (e) {
      console.error("Git commit failed:", e);
      this.log(runId, `Git push failed: ${(e as Error).message}`, 'error');
    }
    
    await this.checkpoint(runId);
    
    // Parse owner and repo from repositoryUrl (e.g. https://github.com/owner/repo)
    const match = input.repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/.]+)/);
    const owner = match ? match[1] : 'acme';
    const repo = match ? match[2] : 'demo-react-store';

    const prUrl = await githubService.createPullRequest(owner, repo, {
      title: prTitle,
      description: summary,
      branch: branchName
    });

    this.log(runId, `Pull Request delivered successfully!`, 'success');

    return {
      id: `pr-${runId}`,
      title: prTitle,
      url: prUrl,
      summary
    };
  }
}
