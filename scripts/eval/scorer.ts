import type { EvalScores } from "./types";

export function scoreOutput(
  output: string,
  componentName: string,
  descriptor: Record<string, unknown>,
): EvalScores {
  // Extract code block from output (handle ```tsx ... ``` or raw code)
  const codeMatch = output.match(/```(?:tsx?|jsx?|react)?\s*\n([\s\S]*?)```/);
  const code = codeMatch ? codeMatch[1] : output;

  // 1. Prop correctness: check which descriptor props appear in the code
  const descriptorProps = Object.keys(descriptor.props as Record<string, unknown>);
  const usedCorrectly = descriptorProps.filter((prop) => {
    if (prop === "children" || prop === "className") return true; // Always considered correct if component renders
    return code.includes(prop);
  });
  // Don't require ALL props — just check that used props are valid
  // Check for hallucinated props (props used that aren't in descriptor)
  const jsxPropPattern = new RegExp(`<${componentName}[^>]*\\b(\\w+)=`, "g");
  const usedProps: string[] = [];
  let match: RegExpExecArray | null = null;
  match = jsxPropPattern.exec(code);
  while (match !== null) {
    if (match[1]) usedProps.push(match[1]);
    match = jsxPropPattern.exec(code);
  }
  const validProps = usedProps.filter(
    (p) => descriptorProps.includes(p) || p === "key" || p === "ref" || p === "style",
  );
  const propCorrectness = usedProps.length === 0 ? 0.5 : validProps.length / usedProps.length;

  // 2. Import correctness
  const importCorrectness =
    code.includes(`from "@ui-universe/ui"`) ||
    code.includes(`from "@ui-universe/ui/`) ||
    code.includes(`from '@ui-universe/ui'`) ||
    code.includes(`from '@ui-universe/ui/`);

  // 3. Motion tokenization: check if code uses token names vs hardcoded values
  const tokenNames = [
    "fadeUp",
    "fadeIn",
    "fadeDown",
    "scaleIn",
    "popIn",
    "blur",
    "slideUp",
    "slideDown",
    "fadeLeft",
    "fadeRight",
    "smooth",
    "snappy",
    "dramatic",
    "decel",
    "spring",
    "instant",
    "fast",
    "normal",
    "slow",
    "tight",
    "relaxed",
    "subtle",
    "pronounced",
  ];
  const hasTokenRef = tokenNames.some((t) => code.includes(`"${t}"`) || code.includes(`'${t}'`));
  const hardcodedMotion = /duration:\s*\d|ease:\s*\[|transition:\s*\{/.test(code);
  const motionTokenized = hasTokenRef || !hardcodedMotion;

  // 4. TypeScript validity (basic check — no actual compiler)
  // Check for common issues: missing imports, invalid JSX
  const hasImport = code.includes("import");
  const hasJSX = code.includes("<") && code.includes("/>");
  const hasExport = code.includes("export");
  const typescriptValid = hasImport && hasJSX && hasExport;

  // Overall score
  const scores = [
    propCorrectness,
    importCorrectness ? 1 : 0,
    motionTokenized ? 1 : 0,
    typescriptValid ? 1 : 0,
  ];
  const overall = scores.reduce((a, b) => a + b, 0) / scores.length;

  return { propCorrectness, importCorrectness, motionTokenized, typescriptValid, overall };
}
