import { prisma } from './db';
import { RunContext } from '@/types';

export class RunHistoryService {
  async createRun(context: RunContext) {
    let projectId = context.repositoryId;
    
    // For demo purposes, map the hardcoded name to the actual project ID
    if (projectId === 'demo-react-store') {
      const demoProject = await prisma.project.findFirst({
        where: { name: 'demo-react-store' }
      });
      if (demoProject) {
        projectId = demoProject.id;
        // Also update context so subsequent updates use the correct ID
        context.repositoryId = projectId;
      }
    }

    return prisma.run.create({
      data: {
        id: context.runId,
        projectId: projectId,
        branch: context.branchId,
        status: context.status,
        initialScore: context.metrics.initialScore,
        finalScore: context.metrics.finalScore,
        issuesFound: context.metrics.issuesFound,
        issuesFixed: context.metrics.issuesFixed,
        startTime: new Date(context.startTime),
      }
    });
  }

  async updateRun(context: RunContext) {
    return prisma.run.update({
      where: { id: context.runId },
      data: {
        status: context.status,
        initialScore: context.metrics.initialScore,
        finalScore: context.metrics.finalScore,
        issuesFound: context.metrics.issuesFound,
        issuesFixed: context.metrics.issuesFixed,
        endTime: context.endTime ? new Date(context.endTime) : undefined,
      }
    });
  }

  async getRunsForProject(projectId: string) {
    return prisma.run.findMany({
      where: { projectId },
      orderBy: { startTime: 'desc' }
    });
  }
}

export const runHistoryService = new RunHistoryService();
