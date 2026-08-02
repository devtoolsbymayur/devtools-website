export type ToolFaqItem = { question: string; answer: string };

export const VALIDATOR_FAQ: ToolFaqItem[] = [
  {
    question: "How do I validate JSON online?",
    answer:
      "Paste JSON into the editor (or upload a .json file) and click Validate or press Ctrl+Enter. The tool highlights syntax problems with an approximate line and column.",
  },
  {
    question: "Is my JSON uploaded when I validate?",
    answer:
      "No. Validation runs locally in your browser with the native JSON parser. Your data is not sent to our server for validation.",
  },
  {
    question: "What errors can a JSON validator catch?",
    answer:
      "Common issues include missing commas, unquoted keys, trailing commas, mismatched brackets, and invalid escape sequences in strings.",
  },
  {
    question: "Can I jump to the error line?",
    answer:
      "Yes. When validation fails, use the jump control on the error message to move the cursor to the reported line in the editor.",
  },
];

export const MINIFIER_FAQ: ToolFaqItem[] = [
  {
    question: "What does JSON minify mean?",
    answer:
      "Minifying JSON removes unnecessary whitespace and line breaks while keeping the same data. The result is smaller for APIs, storage, and network transfer.",
  },
  {
    question: "Is minified JSON still valid?",
    answer:
      "Yes. Minified output is valid JSON with the same structure and values—only formatting whitespace is removed.",
  },
  {
    question: "When should I minify JSON?",
    answer:
      "Minify after editing, before shipping payloads to production APIs or embedding config where size matters. Use the formatter when you need readability again.",
  },
  {
    question: "Can I copy or download minified JSON?",
    answer:
      "Yes. After minifying, use Copy or Download to save the compact JSON from the output panel.",
  },
];

export const VIEWER_FAQ: ToolFaqItem[] = [
  {
    question: "What is a JSON viewer / tree view?",
    answer:
      "A JSON viewer shows objects and arrays as a collapsible tree so you can expand nodes, scan keys, and explore nested structure more easily than raw text.",
  },
  {
    question: "Can I paste JSON to explore the tree?",
    answer:
      "Yes. Paste or type valid JSON in the input panel—the tree updates automatically. You can also upload a .json file or press Ctrl+Enter to refresh.",
  },
  {
    question: "Can I search inside the JSON tree?",
    answer:
      "Yes. Use the search box above the tree to highlight matching keys and values while browsing large documents.",
  },
  {
    question: "Is viewer data uploaded to a server?",
    answer:
      "No. Parsing and tree rendering run locally in your browser. We do not upload your JSON for the public viewer tool.",
  },
];
