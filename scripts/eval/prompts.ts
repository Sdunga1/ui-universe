import type { EvalPrompt } from "./types";

export const evalPrompts: EvalPrompt[] = [
  {
    name: "basic-usage",
    template: (name, descriptor) =>
      `Write a React component that uses ${name} from @ui-universe/ui with default settings. The component should render it with some example content inside. Import it correctly. Export a default function component called Example.`,
  },
  {
    name: "prop-customization",
    template: (name, descriptor) => {
      // Pick 2-3 customizable props from the descriptor
      const props = Object.entries(
        descriptor.props as Record<
          string,
          { type: string; default?: unknown; description: string }
        >,
      )
        .filter(
          ([key, val]) => key !== "children" && key !== "className" && val.default !== undefined,
        )
        .slice(0, 3);
      const propInstructions = props
        .map(
          ([key, val]) =>
            `- ${key}: set to a non-default value (current default: ${JSON.stringify(val.default)})`,
        )
        .join("\n");
      return `Write a React component that uses ${name} from @ui-universe/ui with the following prop customizations:\n${propInstructions}\nInclude example content. Import it correctly. Export a default function component called Example.`;
    },
  },
  {
    name: "composition",
    template: (name, descriptor) => {
      const recommended = (descriptor.recommendedWith as string[]) || [];
      const companion = recommended[0] || "FadeUp";
      return `Write a React component that combines ${name} with ${companion} (both from @ui-universe/ui) to create a visually appealing section. Import both correctly. Export a default function component called Example.`;
    },
  },
];
