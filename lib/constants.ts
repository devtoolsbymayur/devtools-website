export const SITE_NAME = "json.";
/** Brand signal for Open Graph / schema (clearer than logo-style "json."). */
export const SITE_BRAND = "JSON Formatter";
export const SITE_TITLE =
  "JSON Formatter Online — Beautify, Validate & Minify JSON";
export const SITE_DESCRIPTION =
  "Free online JSON formatter & validator. Paste or upload JSON, beautify, minify, and fix errors by line — processed locally in your browser. No signup required.";
/** Shorter title for social share cards. */
export const SITE_OG_TITLE =
  "Free JSON Formatter & Validator — Private & Local";

export const EXAMPLE_JSON = `{
  "name": "John Doe",
  "age": 30,
  "active": true,
  "skills": ["JavaScript", "React", "Next.js"]
}`;

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const AUTO_FORMAT_DEBOUNCE_MS = 400;

export const STORAGE_KEYS = {
  theme: "json-formatter-theme",
  input: "json-formatter-input",
  autoFormat: "json-formatter-auto-format",
  consent: "json-formatter-consent",
  visitorId: "json-formatter-visitor-id",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "JSON Formatter" },
  { href: "/json-validator", label: "JSON Validator" },
  { href: "/json-minifier", label: "JSON Minifier" },
  { href: "/json-viewer", label: "JSON Viewer" },
] as const;

export const FOOTER_TOOLS = [
  { href: "/", label: "JSON Formatter" },
  { href: "/json-validator", label: "JSON Validator" },
  { href: "/json-minifier", label: "JSON Minifier" },
  { href: "/json-viewer", label: "JSON Viewer" },
] as const;

export const FOOTER_MORE_TOOLS = [
  { href: "/xml-formatter", label: "XML Formatter" },
  { href: "/csv-to-json", label: "CSV to JSON" },
  { href: "/base64-encoder", label: "Base64 Encoder" },
  { href: "/jwt-decoder", label: "JWT Decoder" },
] as const;

export const FOOTER_COMPANY = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
] as const;

export const RELATED_TOOLS = [
  { href: "/", label: "JSON Formatter" },
  { href: "/json-validator", label: "JSON Validator" },
  { href: "/json-minifier", label: "JSON Minifier" },
  { href: "/json-viewer", label: "JSON Viewer" },
  { href: "/xml-formatter", label: "XML Formatter" },
  { href: "/csv-to-json", label: "CSV to JSON" },
  { href: "/base64-encoder", label: "Base64 Encoder" },
  { href: "/url-encoder", label: "URL Encoder" },
  { href: "/jwt-decoder", label: "JWT Decoder" },
  { href: "/timestamp-converter", label: "Timestamp Converter" },
] as const;

export const FAQ_ITEMS = [
  {
    question: "How do I format JSON online?",
    answer:
      "Paste your JSON (or upload a .json file) into the editor, choose indentation (2 spaces, 4 spaces, or Tab), then click Format or press Ctrl+Enter. Our free JSON formatter beautifies the data instantly in your browser.",
  },
  {
    question: "What is the difference between JSON format and JSON formatter?",
    answer:
      "JSON format refers to the JSON data structure itself. A JSON formatter (beautifier) takes unreadable or minified JSON and rewrites it with clear indentation and line breaks so you can read and debug it easily.",
  },
  {
    question: "What is JSON?",
    answer:
      "JSON (JavaScript Object Notation) is a lightweight data-interchange format used by APIs and apps. It is easy for humans to read when formatted, and easy for machines to parse and generate.",
  },
  {
    question: "How do I validate JSON?",
    answer:
      "Paste JSON and click Validate. The tool uses the browser's native JSON parser and highlights syntax errors with approximate line and column so you can fix invalid JSON quickly.",
  },
  {
    question: "How do I beautify or pretty-print JSON?",
    answer:
      "Use Format to pretty-print JSON with your preferred indentation. You can also enable auto-format while typing for continuous JSON formatting.",
  },
  {
    question: "How do I minify JSON?",
    answer:
      "Click Minify to remove unnecessary whitespace. Minified JSON is smaller for APIs, storage, and network transfer while keeping the same data.",
  },
  {
    question: "Is this JSON formatter free?",
    answer:
      "Yes. You can format, validate, beautify, and minify JSON online for free — no account required.",
  },
  {
    question: "Is my JSON data uploaded or stored?",
    answer:
      "No. JSON formatting and validation run locally in your browser. Your JSON is not uploaded to our server for these tools.",
  },
  {
    question: "Can I format large JSON files?",
    answer:
      "Yes. Parsing and formatting run in a Web Worker so the UI stays responsive for larger files. Tree view uses virtualized rendering for big objects and arrays.",
  },
  {
    question: "Which JSON format tools are included?",
    answer:
      "This site includes a JSON formatter, JSON validator, JSON minifier, JSON viewer (tree view), plus related developer tools like Base64 and JWT decoder.",
  },
] as const;
