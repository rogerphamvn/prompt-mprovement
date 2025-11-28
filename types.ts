export interface TechniqueRecommendation {
  techniques: string[];
  framework: string | null;
}

export interface AppliedTechnique {
  name: string;
  reason: string;
}

export interface OptimizationReport {
  id: string;
  timestamp: string;
  analysis: {
    purpose: string;
    strengths: string;
    weaknesses: string;
  };
  appliedTechniques: AppliedTechnique[];
  optimizedPrompt: string;
  improvementsSummary: string;
}

export interface CustomizationOptions {
  name: string;
  themeColor: string;
  backgroundColor: string;
  textColor: string;
  codeBackgroundColor: string;
  fontFamily: string;
}
