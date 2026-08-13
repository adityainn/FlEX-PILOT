import simpleGit, { SimpleGit } from 'simple-git';
import fs from 'fs';
import path from 'path';

export class RepositoryService {
  public async cloneRepository(repoUrl: string, targetDir: string): Promise<SimpleGit> {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const git = simpleGit();
    await git.clone(repoUrl, targetDir);
    return simpleGit(targetDir);
  }

  public async checkoutBranch(git: SimpleGit, branchName: string): Promise<void> {
    await git.checkout(branchName);
  }

  public async createBranch(git: SimpleGit, newBranch: string): Promise<void> {
    await git.checkoutLocalBranch(newBranch);
  }

  public async commitAndPush(git: SimpleGit, message: string, branch: string, repoUrlWithToken: string): Promise<void> {
    await git.add('.');
    await git.commit(message);
    await git.push(repoUrlWithToken, branch);
  }
}

export const repositoryService = new RepositoryService();
