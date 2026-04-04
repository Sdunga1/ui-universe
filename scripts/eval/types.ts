export interface EvalCondition {
  name: "blind" | "descriptor+source" | "descriptor-only";
  buildContext: (componentName: string, descriptorJson: string, sourceCode: string) => string;
}

export interface EvalPrompt {
  name: string;
  template: (componentName: string, descriptor: Record<string, unknown>) => string;
}

export interface EvalScores {
  /** Fraction of props used correctly (0-1) */
  propCorrectness: number;
  /** Whether the import path is correct */
  importCorrectness: boolean;
  /** Whether motion tokens are used instead of hardcoded values */
  motionTokenized: boolean;
  /** Whether the code compiles with TypeScript */
  typescriptValid: boolean;
  /** Overall score (0-1) */
  overall: number;
}

export interface EvalResult {
  component: string;
  prompt: string;
  condition: string;
  output: string;
  scores: EvalScores;
  inputTokens: number;
  outputTokens: number;
}

export interface EvalReport {
  timestamp: string;
  model: string;
  results: EvalResult[];
  summary: {
    byCondition: Record<
      string,
      {
        avgOverall: number;
        avgPropCorrectness: number;
        importRate: number;
        tokenRate: number;
        tsRate: number;
        avgInputTokens: number;
      }
    >;
  };
}
