import fs from 'fs';
import path from 'path';

export class ArtifactManager {
  private baseDir: string;

  constructor() {
    this.baseDir = path.join(process.cwd(), '.flexpilot', 'artifacts');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  public saveArtifact(runId: string, filename: string, content: Buffer | string): string {
    const runDir = path.join(this.baseDir, `run-${runId}`);
    if (!fs.existsSync(runDir)) {
      fs.mkdirSync(runDir, { recursive: true });
    }

    const filePath = path.join(runDir, filename);
    fs.writeFileSync(filePath, content);

    // Return the public URI for the frontend to consume
    return `/api/artifacts/${runId}/${filename}`;
  }

  public getArtifactPath(runId: string, filename: string): string {
    return path.join(this.baseDir, `run-${runId}`, filename);
  }
}

export const artifactManager = new ArtifactManager();
