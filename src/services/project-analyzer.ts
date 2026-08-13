import fs from 'fs';
import path from 'path';

export interface ProjectMetadata {
  framework: 'Next.js' | 'Vite' | 'Create React App' | 'Unknown';
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun' | 'unknown';
  hasTypeScript: boolean;
}

export class ProjectAnalyzer {
  
  public analyzeProject(workspacePath: string): ProjectMetadata {
    const metadata: ProjectMetadata = {
      framework: 'Unknown',
      packageManager: 'unknown',
      hasTypeScript: false
    };

    // 1. Detect Package Manager
    if (fs.existsSync(path.join(workspacePath, 'package-lock.json'))) metadata.packageManager = 'npm';
    else if (fs.existsSync(path.join(workspacePath, 'yarn.lock'))) metadata.packageManager = 'yarn';
    else if (fs.existsSync(path.join(workspacePath, 'pnpm-lock.yaml'))) metadata.packageManager = 'pnpm';
    else if (fs.existsSync(path.join(workspacePath, 'bun.lockb'))) metadata.packageManager = 'bun';

    // 2. Detect TypeScript
    if (fs.existsSync(path.join(workspacePath, 'tsconfig.json'))) {
      metadata.hasTypeScript = true;
    }

    // 3. Detect Framework
    const pkgPath = path.join(workspacePath, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        
        if (deps['next']) metadata.framework = 'Next.js';
        else if (deps['vite']) metadata.framework = 'Vite';
        else if (deps['react-scripts']) metadata.framework = 'Create React App';
        
      } catch (e) {
        console.error("Failed to parse package.json for analysis", e);
      }
    }

    return metadata;
  }
}

export const projectAnalyzer = new ProjectAnalyzer();
