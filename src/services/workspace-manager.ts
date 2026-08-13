import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import portfinder from 'portfinder';
import { repositoryService } from './repository-service';

import { ChildProcess } from 'child_process';

export interface WorkspaceContext {
  workspacePath: string;
  port: number;
  serverProcess?: ChildProcess;
}

export class WorkspaceManager {
  private activeWorkspaces: Map<string, WorkspaceContext> = new Map();

  public async prepareWorkspace(runId: string, repositoryUrl: string, branch: string): Promise<WorkspaceContext> {
    // Intercept demo project to prevent real git clone failures
    if (repositoryUrl.includes('demo-react-store')) {
      return {
        workspacePath: process.cwd(), // Just use current directory for demo
        port: 3000,
        serverProcess: undefined
      };
    }

    const workspacePath = path.join('/tmp', 'flexpilot-workspaces', runId);
    
    if (fs.existsSync(workspacePath)) {
      fs.rmSync(workspacePath, { recursive: true, force: true });
    }

    // 1. Clone repository
    const git = await repositoryService.cloneRepository(repositoryUrl, workspacePath);
    await repositoryService.checkoutBranch(git, branch);

    // 2. Install dependencies
    await this.runCommand('npm install --legacy-peer-deps', workspacePath);

    // 3. Start dev server
    const port = await portfinder.getPortPromise({ port: 3000 });
    
    // Detect framework based on package.json
    const pkgPath = path.join(workspacePath, 'package.json');
    let startCmd = 'npm start';
    
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkg.scripts?.dev) {
        startCmd = `npm run dev -- -p ${port}`;
      } else if (pkg.scripts?.start) {
        startCmd = `npm start -- -p ${port}`;
      }
    }

    const serverProcess = exec(startCmd, { cwd: workspacePath });
    
    // Wait for the server to be ready (naive wait for demo purposes)
    await new Promise(resolve => setTimeout(resolve, 5000));

    const context: WorkspaceContext = {
      workspacePath,
      port,
      serverProcess,
    };

    this.activeWorkspaces.set(runId, context);
    return context;
  }

  public async cleanupWorkspace(runId: string): Promise<void> {
    const context = this.activeWorkspaces.get(runId);
    if (!context) return;

    if (context.serverProcess) {
      context.serverProcess.kill();
    }

    if (fs.existsSync(context.workspacePath)) {
      fs.rmSync(context.workspacePath, { recursive: true, force: true });
    }

    this.activeWorkspaces.delete(runId);
  }

  public getWorkspace(runId: string): WorkspaceContext | undefined {
    return this.activeWorkspaces.get(runId);
  }

  private runCommand(command: string, cwd: string): Promise<void> {
    return new Promise((resolve, reject) => {
      exec(command, { cwd }, (error) => {
        if (error) {
          console.error(`Command failed: ${command}`, error);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

export const workspaceManager = new WorkspaceManager();
