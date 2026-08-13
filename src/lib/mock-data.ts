export type Severity = "critical" | "high" | "medium" | "low";
export type Status = "open" | "in_progress" | "resolved";
export type Standard = "WCAG 2.1 AA" | "WCAG 2.2 AA" | "Section 508";

export interface Repository {
  id: string;
  name: string;
  provider: "github" | "gitlab" | "bitbucket" | "demo";
  url: string;
  lastScanned: string;
  healthScore: number;
  openIssues: number;
  isDemo?: boolean;
}

export interface VerificationData {
  accessibilityTreeBefore: string;
  accessibilityTreeAfter: string;
  screenReaderBefore: string;
  screenReaderAfter: string;
  testsPassed: string[];
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: Status;
  repositoryId: string;
  createdAt: string;
  standard: Standard;
  path: string;
  snippet: string;
  verification?: VerificationData;
  impact?: {
    usersAffected: string;
    guideline: string;
    whyItMatters: string;
  };
}

export interface Scan {
  id: string;
  repositoryId: string;
  startedAt: string;
  completedAt: string;
  status: "completed" | "running" | "failed";
  issuesFound: number;
  score: number;
}

export interface PullRequest {
  id: string;
  title: string;
  url: string;
  status: "open" | "merged" | "closed";
  repositoryId: string;
  issueId: string;
  createdAt: string;
}

export const mockRepositories: Repository[] = [
  {
    id: "repo-demo",
    name: "Demo React Store",
    provider: "demo",
    url: "https://demo.flexpilot.com/store",
    lastScanned: "2026-08-12T10:00:00Z",
    healthScore: 98,
    openIssues: 0,
    isDemo: true,
  },
  {
    id: "repo-1",
    name: "acme-corp/marketing-site",
    provider: "github",
    url: "https://github.com/acme-corp/marketing-site",
    lastScanned: "2026-08-12T10:00:00Z",
    healthScore: 78,
    openIssues: 12,
  },
  {
    id: "repo-2",
    name: "acme-corp/customer-dashboard",
    provider: "github",
    url: "https://github.com/acme-corp/customer-dashboard",
    lastScanned: "2026-08-11T14:30:00Z",
    healthScore: 92,
    openIssues: 3,
  },
  {
    id: "repo-3",
    name: "acme-corp/internal-tools",
    provider: "github",
    url: "https://github.com/acme-corp/internal-tools",
    lastScanned: "2026-08-10T09:15:00Z",
    healthScore: 65,
    openIssues: 28,
  },
];

export const mockIssues: Issue[] = [
  {
    id: "issue-demo-1",
    title: "Insufficient color contrast for Add to Cart button",
    description: "The contrast ratio of the white text against the light gray background is 2.8:1, which fails the WCAG AA requirement of 4.5:1 for normal text.",
    severity: "critical",
    status: "resolved",
    repositoryId: "repo-demo",
    createdAt: "2026-08-12T09:00:00Z",
    standard: "WCAG 2.1 AA",
    path: "src/components/AddToCartButton.tsx",
    snippet: "<button className=\"text-white bg-gray-300\">Add to Cart</button>",
    verification: {
      accessibilityTreeBefore: "button \"Add to Cart\"\n  Text: \"Add to Cart\" (Contrast: 2.8:1 - FAIL)",
      accessibilityTreeAfter: "button \"Add to Cart\"\n  Text: \"Add to Cart\" (Contrast: 7.2:1 - PASS)",
      screenReaderBefore: "\"Add to Cart, button\"",
      screenReaderAfter: "\"Add to Cart, button\"",
      testsPassed: ["axe-core: color-contrast", "pa11y: Principle 1 - Perceivable"]
    },
    impact: {
      usersAffected: "Users with low vision or color blindness (approx. 8% of population).",
      guideline: "1.4.3 Contrast (Minimum)",
      whyItMatters: "Without sufficient contrast, text is unreadable for many users, directly impacting sales conversions on the store."
    }
  },
  {
    id: "issue-101",
    title: "Insufficient color contrast for secondary text",
    description: "The contrast ratio of the secondary text against its background is 3.1:1, which fails the WCAG AA requirement of 4.5:1 for normal text.",
    severity: "high",
    status: "open",
    repositoryId: "repo-1",
    createdAt: "2026-08-12T10:05:00Z",
    standard: "WCAG 2.1 AA",
    path: "src/components/Hero.tsx",
    snippet: "<p className=\"text-gray-400 bg-white\">Learn more about our features</p>",
    verification: {
      accessibilityTreeBefore: "paragraph\n  Text: \"Learn more about our features\" (Contrast: 3.1:1 - FAIL)",
      accessibilityTreeAfter: "paragraph\n  Text: \"Learn more about our features\" (Contrast: 12.5:1 - PASS)",
      screenReaderBefore: "\"Learn more about our features\"",
      screenReaderAfter: "\"Learn more about our features\"",
      testsPassed: ["axe-core: color-contrast"]
    },
    impact: {
      usersAffected: "Low vision users",
      guideline: "1.4.3 Contrast (Minimum)",
      whyItMatters: "Low contrast text causes eye strain and is completely invisible to users with certain visual impairments."
    }
  },
  {
    id: "issue-102",
    title: "Missing alt text on user profile images",
    description: "Images must have alternate text to be accessible to screen readers.",
    severity: "critical",
    status: "in_progress",
    repositoryId: "repo-2",
    createdAt: "2026-08-11T14:35:00Z",
    standard: "WCAG 2.1 AA",
    path: "src/components/UserProfile.tsx",
    snippet: "<img src={user.avatarUrl} className=\"rounded-full\" />",
    verification: {
      accessibilityTreeBefore: "image (no accessible name)",
      accessibilityTreeAfter: "image \"User profile avatar\"",
      screenReaderBefore: "\"Unlabeled image\"",
      screenReaderAfter: "\"User profile avatar, image\"",
      testsPassed: ["axe-core: image-alt"]
    },
    impact: {
      usersAffected: "Screen reader users (blind or severe visual impairment)",
      guideline: "1.1.1 Non-text Content",
      whyItMatters: "Screen reader users rely on alt text to understand the context and content of images."
    }
  },
  {
    id: "issue-103",
    title: "Focus indicator missing on interactive elements",
    description: "Buttons and links must have a visible focus indicator for keyboard users.",
    severity: "medium",
    status: "open",
    repositoryId: "repo-1",
    createdAt: "2026-08-10T11:20:00Z",
    standard: "WCAG 2.1 AA",
    path: "src/components/Navigation.tsx",
    snippet: "<button className=\"focus:outline-none\">Menu</button>"
  }
];

export const mockScans: Scan[] = [
  {
    id: "scan-demo-1",
    repositoryId: "repo-demo",
    startedAt: "2026-08-12T08:55:00Z",
    completedAt: "2026-08-12T09:00:00Z",
    status: "completed",
    issuesFound: 146,
    score: 72
  },
  {
    id: "scan-demo-2",
    repositoryId: "repo-demo",
    startedAt: "2026-08-12T09:05:00Z",
    completedAt: "2026-08-12T09:10:00Z",
    status: "completed",
    issuesFound: 0,
    score: 98
  },
  {
    id: "scan-201",
    repositoryId: "repo-1",
    startedAt: "2026-08-12T09:55:00Z",
    completedAt: "2026-08-12T10:00:00Z",
    status: "completed",
    issuesFound: 12,
    score: 78
  },
];

export const mockPullRequests: PullRequest[] = [
  {
    id: "pr-demo-1",
    title: "a11y: Massive accessibility overhaul (146 fixes)",
    url: "https://github.com/demo/react-store/pull/1",
    status: "merged",
    repositoryId: "repo-demo",
    issueId: "issue-demo-1",
    createdAt: "2026-08-12T09:02:00Z"
  },
  {
    id: "pr-301",
    title: "a11y: Fix color contrast in Hero component",
    url: "https://github.com/acme-corp/marketing-site/pull/42",
    status: "open",
    repositoryId: "repo-1",
    issueId: "issue-101",
    createdAt: "2026-08-12T10:15:00Z"
  }
];
