import type { EvalCondition } from "./types";

export const evalConditions: EvalCondition[] = [
  {
    name: "blind",
    buildContext: (componentName) =>
      `You are building React components. Use the component called ${componentName} from the @ui-universe/ui library. You don't have documentation — use your best judgment about the API.`,
  },
  {
    name: "descriptor+source",
    buildContext: (componentName, descriptorJson, sourceCode) =>
      `You are building React components using the @ui-universe/ui library.\n\nHere is the descriptor (machine-readable contract) for ${componentName}:\n\`\`\`json\n${descriptorJson}\n\`\`\`\n\nHere is the source code:\n\`\`\`tsx\n${sourceCode}\n\`\`\`\n\nAlways follow the descriptor for props, types, and usage patterns.`,
  },
  {
    name: "descriptor-only",
    buildContext: (componentName, descriptorJson) =>
      `You are building React components using the @ui-universe/ui library.\n\nHere is the descriptor (machine-readable contract) for ${componentName}:\n\`\`\`json\n${descriptorJson}\n\`\`\`\n\nAlways follow the descriptor for props, types, and usage patterns. Do not guess — only use props listed in the descriptor.`,
  },
];
