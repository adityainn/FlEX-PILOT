import { Octokit } from '@octokit/rest';

export interface GitHubPullRequest {
  title: string;
  description: string;
  branch: string;
}

export interface IGitHubService {
  listRepositories(): Promise<unknown[]>;
  createPullRequest(owner: string, repo: string, pr: GitHubPullRequest): Promise<string>;
}

class MockGitHubService implements IGitHubService {
  async listRepositories() {
    return [
      { id: 1, name: 'demo-react-store', full_name: 'acme/demo-react-store', default_branch: 'main' }
    ];
  }

  async createPullRequest(owner: string, repo: string, pr: GitHubPullRequest) {
    console.log(`[Mock GitHub] Created PR in ${owner}/${repo}: ${pr.title}`);
    return `https://github.com/${owner}/${repo}/pull/mock`;
  }
}

class PreviewGitHubService implements IGitHubService {
  private octokit = new Octokit(); // Unauthenticated, can only list public stuff

  async listRepositories() {
    return [
      { id: 1, name: 'demo-react-store', full_name: 'acme/demo-react-store', default_branch: 'main' }
    ];
  }

  async createPullRequest(owner: string, repo: string, pr: GitHubPullRequest) {
    console.log(`[Preview GitHub] Would create PR in ${owner}/${repo}:`);
    console.log(`Title: ${pr.title}`);
    console.log(`Branch: ${pr.branch}`);
    console.log(`Description:\n${pr.description}`);
    return `https://github.com/${owner}/${repo}/pull/preview`;
  }
}

class LiveGitHubService implements IGitHubService {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
  }

  async listRepositories() {
    try {
      const { data } = await this.octokit.rest.repos.listForAuthenticatedUser();
      return data;
    } catch (error) {
      console.error("Failed to list repos. Using mock fallback.", error);
      return [
        { id: 1, name: 'demo-react-store', full_name: 'acme/demo-react-store', default_branch: 'main' }
      ];
    }
  }

  async createPullRequest(owner: string, repo: string, pr: GitHubPullRequest) {
    try {
      // In a real implementation we would:
      // 1. Get branch ref
      // 2. Create tree
      // 3. Create commit
      // 4. Update ref
      // For this phase, we assume RepositoryService has already pushed the branch natively via simple-git.
      
      const { data } = await this.octokit.rest.pulls.create({
        owner,
        repo,
        head: pr.branch,
        base: 'main',
        title: pr.title,
        body: pr.description
      });
      return data.html_url;
    } catch (error) {
      console.error("Failed to create PR via Octokit:", error);
      return `https://github.com/${owner}/${repo}/pull/mock-after-failure`;
    }
  }
}

export class GitHubServiceFactory {
  public static getService(): IGitHubService {
    const mode = process.env.GITHUB_MODE || 'mock';
    if (mode === 'live' && process.env.GITHUB_TOKEN) return new LiveGitHubService();
    if (mode === 'preview') return new PreviewGitHubService();
    return new MockGitHubService();
  }
}

export const githubService = GitHubServiceFactory.getService();
