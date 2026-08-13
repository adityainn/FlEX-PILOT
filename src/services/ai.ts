import { AccessibilityFinding, AnalyzedIssue, RepairPatch, RepairPlan, SourceMapperOutput, VerificationResult } from "@/types";
import { GoogleGenerativeAI, Schema, SchemaType } from "@google/generative-ai";

export interface AIProvider {
  analyzeFindings(findings: AccessibilityFinding[]): Promise<AnalyzedIssue[]>;
  generateRepairPlan(issue: AnalyzedIssue, mapping: SourceMapperOutput): Promise<RepairPlan>;
  generateRepairPatch(plan: RepairPlan, snippet: string): Promise<RepairPatch>;
  generateEvidenceSummary(verification: VerificationResult): Promise<string>;
}

class MockProvider implements AIProvider {
  async delay(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }

  async analyzeFindings(findings: AccessibilityFinding[]): Promise<AnalyzedIssue[]> {
    await this.delay(1000);
    // Return a mocked structured JSON
    return findings.map((f, i) => ({
      id: `issue-${i}`,
      findings: [f],
      severity: f.impact || 'moderate',
      rationale: `The element ${f.target[0]} fails ${f.ruleId}. This causes barriers for assistive technologies.`,
      wcagGuideline: f.wcag?.join(', ') || 'WCAG 2.1 AA',
      affectedUsers: 'Screen reader users and keyboard-only users.',
      confidence: 0.95
    }));
  }

  async generateRepairPlan(issue: AnalyzedIssue, mapping: SourceMapperOutput): Promise<RepairPlan> {
    await this.delay(500);
    return {
      issueId: issue.id,
      strategy: `Add necessary ARIA attributes and fix semantics in ${mapping.componentName}`,
      filesToModify: [mapping.filePath],
      estimatedImprovement: "Resolves critical WCAG violation, improving screen reader navigation.",
      confidence: 0.92
    };
  }

  async generateRepairPatch(plan: RepairPlan, snippet: string): Promise<RepairPatch> { // snippet ignored in mock
    await this.delay(500);
    return {
      issueId: plan.issueId,
      plan,
      diff: `- <div onClick={handleClick}>Submit</div>\n+ <button onClick={handleClick} aria-label="Submit">Submit</button>`,
      explanation: "Replaced non-semantic div with a native button element for proper keyboard and screen reader support.",
      confidenceScore: 0.96
    };
  }

  async generateEvidenceSummary(verification: VerificationResult): Promise<string> {
    await this.delay(500);
    return `Automated repair successfully verified. Accessibility score improved from ${verification.scoreBefore} to ${verification.scoreAfter}.`;
  }
}

export class GeminiProvider implements AIProvider {
  private getGenAI(): GoogleGenerativeAI {
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }

  async analyzeFindings(findings: AccessibilityFinding[]): Promise<AnalyzedIssue[]> {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY found, falling back to mock");
      return new MockProvider().analyzeFindings(findings);
    }

    const model = this.getGenAI().getGenerativeModel({
      model: "gemini-3.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              severity: { type: SchemaType.STRING },
              rationale: { type: SchemaType.STRING },
              wcagGuideline: { type: SchemaType.STRING },
              affectedUsers: { type: SchemaType.STRING },
              confidence: { type: SchemaType.NUMBER }
            },
            required: ["id", "severity", "rationale", "wcagGuideline", "affectedUsers", "confidence"]
          }
        }
      }
    });

    const prompt = `Analyze these accessibility findings and group them into logical issues:
${JSON.stringify(findings, null, 2)}
Output a JSON array of issues that describe the rationale, WCAG guideline, affected users, and confidence score (0-1). Make the ID something unique based on the ruleId.`;

    
    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (e: any) {
      if (e.status === 429) {
        console.warn("Rate limited by Gemini, waiting 15s...");
        await new Promise(r => setTimeout(r, 15000));
        result = await model.generateContent(prompt);
      } else {
        throw e;
      }
    }

    const responseArray = JSON.parse(result.response.text());

    // Map back the original findings to the issues based on some heuristic or just map 1:1 for simplicity
    return findings.map((f, i) => {
      const aiIssue = responseArray[i % responseArray.length];
      return {
        id: `issue-${f.ruleId}-${i}`,
        findings: [f],
        severity: (aiIssue.severity || f.impact || 'moderate') as any,
        rationale: aiIssue.rationale || `The element ${f.target[0]} fails ${f.ruleId}.`,
        wcagGuideline: aiIssue.wcagGuideline || f.wcag?.join(', ') || 'WCAG 2.1 AA',
        affectedUsers: aiIssue.affectedUsers || 'Screen reader users',
        confidence: aiIssue.confidence || 0.95
      };
    });
  }

  async generateRepairPlan(issue: AnalyzedIssue, mapping: SourceMapperOutput): Promise<RepairPlan> {
    if (!process.env.GEMINI_API_KEY) return new MockProvider().generateRepairPlan(issue, mapping);

    const model = this.getGenAI().getGenerativeModel({
      model: "gemini-3.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            strategy: { type: SchemaType.STRING },
            estimatedImprovement: { type: SchemaType.STRING },
            confidence: { type: SchemaType.NUMBER }
          },
          required: ["strategy", "estimatedImprovement", "confidence"]
        }
      }
    });

    const prompt = `Create a repair plan for this accessibility issue in the React component ${mapping.componentName} located at ${mapping.filePath}.
Issue Rationale: ${issue.rationale}
Violations: ${JSON.stringify(issue.findings.map(f => ({ ruleId: f.ruleId, target: f.target, html: f.html })))}

Provide a strategy, estimatedImprovement, and a confidence score.`;

    
    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (e: any) {
      if (e.status === 429) {
        console.warn("Rate limited by Gemini, waiting 15s...");
        await new Promise(r => setTimeout(r, 15000));
        result = await model.generateContent(prompt);
      } else {
        throw e;
      }
    }

    const data = JSON.parse(result.response.text());

    return {
      issueId: issue.id,
      strategy: data.strategy,
      filesToModify: [mapping.filePath],
      estimatedImprovement: data.estimatedImprovement,
      confidence: data.confidence
    };
  }

  async generateRepairPatch(plan: RepairPlan, snippet: string): Promise<RepairPatch> {
    if (!process.env.GEMINI_API_KEY) return new MockProvider().generateRepairPatch(plan, snippet);

    const model = this.getGenAI().getGenerativeModel({
      model: "gemini-3.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            patchedSnippet: { type: SchemaType.STRING },
            explanation: { type: SchemaType.STRING },
            confidenceScore: { type: SchemaType.NUMBER }
          },
          required: ["patchedSnippet", "explanation", "confidenceScore"]
        }
      }
    });

    const prompt = `You are an expert accessibility engineer. Generate a patched code snippet to fix the following issue based on the repair plan.

Repair Plan:
Strategy: ${plan.strategy}

Source Code Snippet to patch:
\`\`\`tsx
${snippet}
\`\`\`

Return the full patched version of the snippet. Make sure it is syntactically valid React/TypeScript code. Do not include markdown ticks in the response string.`;

    
    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (e: any) {
      if (e.status === 429) {
        console.warn("Rate limited by Gemini, waiting 15s...");
        await new Promise(r => setTimeout(r, 15000));
        result = await model.generateContent(prompt);
      } else {
        throw e;
      }
    }

    const data = JSON.parse(result.response.text());

    return {
      issueId: plan.issueId,
      plan,
      diff: data.patchedSnippet, // We'll store it in diff for now, or we can update the type
      explanation: data.explanation,
      confidenceScore: data.confidenceScore
    };
  }

  async generateEvidenceSummary(verification: VerificationResult): Promise<string> {
    if (!process.env.GEMINI_API_KEY) return new MockProvider().generateEvidenceSummary(verification);
    
    return `Automated repair verified using Axe-core. Score changed from ${verification.scoreBefore} to ${verification.scoreAfter}.`;
  }
}

export class AiService {
  private provider: AIProvider;
  private forceMock: boolean = false;

  constructor() {
    this.provider = new GeminiProvider();
  }

  public getProvider(): AIProvider {
    if (this.forceMock) {
      return new MockProvider();
    }
    return this.provider;
  }

  public setForceMock(value: boolean) {
    this.forceMock = value;
  }
}

export const aiService = new AiService();

