export interface ToolDefinition {
  name: string;
  slug: string;
  url: string;
  description: string;
  authMethod: "JWT_EXCHANGE" | "REDIRECT" | "IFRAME" | "TBD";
  icon: string;
  color: string;
  available: boolean;
  repositoryUrl: string;
  category: string;
}

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: "AHP Studio",
    slug: "ahp-studio",
    url: "https://ahpstudio.com",
    description:
      "Compare criteria and alternatives using the Analytic Hierarchy Process.",
    authMethod: "JWT_EXCHANGE",
    icon: "Scale",
    color: "#57068C",
    available: true,
    repositoryUrl: "https://github.com/jrmst102/ahpstudio",
    category: "Decision analysis",
  },
  {
    name: "Airlines Sim",
    slug: "airlines-sim",
    url: "https://airlines-sim.com",
    description:
      "Manage pricing, capacity, and strategy in a competitive airline simulation.",
    authMethod: "REDIRECT",
    icon: "Plane",
    color: "#0369A1",
    available: true,
    repositoryUrl: "https://github.com/jrmst102/airline_sim",
    category: "Competitive strategy",
  },
  {
    name: "Dynamic Pricing Sandbox",
    slug: "dynamic-pricing",
    url: "https://pricingsandbox.com",
    description:
      "Test dynamic pricing across four industry scenarios.",
    authMethod: "IFRAME",
    icon: "TrendingUp",
    color: "#059669",
    available: true,
    repositoryUrl: "https://github.com/jrmst102/dynamic_sandbox",
    category: "Pricing strategy",
  },
  {
    name: "Negotiation Sim",
    slug: "negotiation-sim",
    url: "https://negotiationsim-lofem.ondigitalocean.app",
    description:
      "Practice AI-powered negotiations with structured rounds and scoring.",
    authMethod: "REDIRECT",
    icon: "Handshake",
    color: "#D97706",
    available: true,
    repositoryUrl: "https://github.com/jrmst102/negotiationsim",
    category: "Negotiation",
  },
  {
    name: "Scenario Sim",
    slug: "scenario-sim",
    url: "https://scenariomanager-6m53a.ondigitalocean.app",
    description:
      "Develop and compare scenarios for decisions under uncertainty.",
    authMethod: "REDIRECT",
    icon: "GitBranch",
    color: "#DC2626",
    available: true,
    repositoryUrl: "https://github.com/jrmst102/scenariomanager",
    category: "Scenario planning",
  },
  {
    name: "Decision Trees",
    slug: "decision-trees",
    url: "",
    description:
      "Build and analyze decision trees with probability nodes, expected values, and sensitivity analysis.",
    authMethod: "TBD",
    icon: "Network",
    color: "#7C3AED",
    available: false,
    repositoryUrl: "",
    category: "Decision analysis",
  },
];
