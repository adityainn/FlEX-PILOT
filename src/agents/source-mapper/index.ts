import { BaseAgent } from "../base-agent";
import { AnalyzedIssue, SourceMapperOutput } from "@/types";
import { Project, SyntaxKind } from "ts-morph";
import fs from 'fs';
import path from 'path';

export interface SourceMapperInput {
  issues: AnalyzedIssue[];
  workspacePath: string;
}

export class SourceMapperAgent extends BaseAgent<SourceMapperInput, SourceMapperOutput[]> {
  constructor() {
    super("source-mapper", "Source Mapper Agent");
  }

  protected async performTask(runId: string, input: SourceMapperInput): Promise<SourceMapperOutput[]> {
    this.setStatus(runId, 'thinking');
    this.log(runId, `Correlating DOM nodes with React AST using ts-morph in ${input.workspacePath}...`);
    
    const results: SourceMapperOutput[] = [];
    
    const project = new Project();
    
    // Load files selectively (excluding node_modules, .next, backend, venv) to prevent huge parsing overhead
    const srcDir = path.join(input.workspacePath, 'src');
    if (fs.existsSync(srcDir)) {
      project.addSourceFilesAtPaths(path.join(srcDir, '**', '*.tsx'));
      project.addSourceFilesAtPaths(path.join(srcDir, '**', '*.ts'));
      project.addSourceFilesAtPaths(path.join(srcDir, '**', '*.jsx'));
    } else {
      // Fallback for non-src layouts, but explicitly avoiding large folders
      project.addSourceFilesAtPaths(path.join(input.workspacePath, 'app', '**', '*.tsx'));
      project.addSourceFilesAtPaths(path.join(input.workspacePath, 'app', '**', '*.ts'));
      project.addSourceFilesAtPaths(path.join(input.workspacePath, 'components', '**', '*.tsx'));
      project.addSourceFilesAtPaths(path.join(input.workspacePath, 'components', '**', '*.ts'));
    }

    for (const issue of input.issues) {
      const finding = issue.findings[0];
      const match = finding.html.match(/<([a-zA-Z0-9]+)[\s>]/);
      const tag = match ? match[1] : '';
      
      let found = false;

      if (tag) {
        for (const sourceFile of project.getSourceFiles()) {
          const elements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement);
          const selfClosing = sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement);
          
          const allElements = [...elements, ...selfClosing];
          const matchElement = allElements.find(e => e.getTagNameNode().getText() === tag);

          if (matchElement) {
            const component = matchElement.getFirstAncestorByKind(SyntaxKind.FunctionDeclaration) 
              || matchElement.getFirstAncestorByKind(SyntaxKind.VariableDeclaration);
            const componentName = component?.getName() || "UnknownComponent";

            results.push({
              issueId: issue.id,
              findingId: finding.id,
              confidence: 0.95,
              mappingMethod: "ts-morph AST",
              componentName,
              filePath: sourceFile.getFilePath().replace(input.workspacePath, ''),
              lineNumber: matchElement.getStartLineNumber(),
              snippet: matchElement.getParent()?.getText() || matchElement.getText()
            });
            
            this.log(runId, `↳ AST Match found for ${finding.ruleId} in ${componentName} (Confidence: 95%)`);
            found = true;
            break;
          }
        }
      }

      if (!found) {
        results.push({
          issueId: issue.id,
          findingId: finding.id,
          confidence: 0.40,
          mappingMethod: "fallback",
          componentName: "Unknown",
          filePath: "Unknown",
          lineNumber: 0,
          snippet: finding.html
        });
        this.log(runId, `↳ No exact AST match found for ${finding.ruleId}. Using fallback.`);
      }
    }

    return results;
  }
}
