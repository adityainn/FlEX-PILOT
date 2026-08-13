import { AccessibilityFinding, ComparisonReport } from "@/types";

export class ComparisonService {
  
  public compare(before: AccessibilityFinding[], after: AccessibilityFinding[]): ComparisonReport {
    
    // Find resolved issues: present in before, absent in after (matching by ruleId + target)
    const resolvedIssues = before.filter(
      b => !after.some(a => a.ruleId === b.ruleId && a.target.join(',') === b.target.join(','))
    );

    // Find remaining issues: present in both
    const remainingIssues = before.filter(
      b => after.some(a => a.ruleId === b.ruleId && a.target.join(',') === b.target.join(','))
    );

    // Find new issues (regressions): present in after, absent in before
    const newIssues = after.filter(
      a => !before.some(b => b.ruleId === a.ruleId && b.target.join(',') === a.target.join(','))
    );

    const scoreBefore = this.calculateScore(before);
    const scoreAfter = this.calculateScore(after);

    let regressionRisk: "low" | "medium" | "high" = "low";
    if (newIssues.length > 0) {
      const hasCritical = newIssues.some(i => i.impact === 'critical' || i.impact === 'serious');
      regressionRisk = hasCritical ? "high" : "medium";
    }

    // Keyboard delta heuristic
    const keyboardRules = ['keyboard', 'tabindex', 'focus'];
    const keyboardBefore = before.filter(i => keyboardRules.some(r => i.ruleId.includes(r))).length;
    const keyboardAfter = after.filter(i => keyboardRules.some(r => i.ruleId.includes(r))).length;

    // Screen reader delta heuristic
    const srRules = ['aria', 'role', 'name', 'alt'];
    const srBefore = before.filter(i => srRules.some(r => i.ruleId.includes(r))).length;
    const srAfter = after.filter(i => srRules.some(r => i.ruleId.includes(r))).length;

    return {
      resolvedIssues,
      remainingIssues,
      newIssues,
      scoreDelta: scoreAfter - scoreBefore,
      wcagDelta: resolvedIssues.length - newIssues.length, // Rough heuristic
      regressionRisk,
      keyboardAccessibilityDelta: keyboardBefore - keyboardAfter,
      screenReaderAccessibilityDelta: srBefore - srAfter
    };
  }

  public calculateScore(findings: AccessibilityFinding[]): number {
    let score = 100;
    for (const f of findings) {
      if (f.impact === 'critical') score -= 5;
      else if (f.impact === 'serious') score -= 3;
      else if (f.impact === 'moderate') score -= 1.5;
      else score -= 0.5;
    }
    return Math.max(0, Math.round(score));
  }
}

export const comparisonService = new ComparisonService();
