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

export const XML_FAQ: ToolFaqItem[] = [
  {
    question: "Is my XML data safe?",
    answer:
      "Yes. Formatting, validation, minify, and XML↔JSON conversion run locally in your browser. Your XML is not uploaded to our server.",
  },
  {
    question: "Can I validate malformed XML?",
    answer:
      "Yes. Validate uses the browser XML parser and reports parse errors so you can fix unclosed tags and syntax issues.",
  },
  {
    question: "Can I convert XML to JSON?",
    answer:
      "Yes. Use XML → JSON to turn elements and attributes into structured JSON, or JSON → XML to go the other way — useful when APIs mix both formats.",
  },
  {
    question: "How do I minify XML?",
    answer:
      "Click Minify to remove insignificant whitespace between tags while keeping a valid document. Use Format again when you need readable indentation.",
  },
];

export const CSV_FAQ: ToolFaqItem[] = [
  {
    question: "What is CSV to JSON conversion?",
    answer:
      "CSV to JSON turns spreadsheet-style rows and columns into structured JSON objects — useful for feeding exports into APIs, scripts, or JavaScript apps.",
  },
  {
    question: "Can I convert JSON back to CSV?",
    answer:
      "Yes. Paste a JSON array of objects and use JSON → CSV to export a spreadsheet-friendly file with headers from object keys.",
  },
  {
    question: "Does it support tab or semicolon delimiters?",
    answer:
      "Yes. Choose comma, tab, or semicolon, or use auto-detect based on the first lines of your file.",
  },
  {
    question: "Can I upload Excel files?",
    answer:
      "This tool accepts CSV/TSV text (paste or .csv upload). Export Excel sheets as CSV first, then convert locally in the browser.",
  },
];

export const URL_FAQ: ToolFaqItem[] = [
  {
    question: "What is URL encoding?",
    answer:
      "URL encoding (percent-encoding) converts characters like spaces, &, and ? into a safe format so URLs and query strings transmit correctly across browsers and servers.",
  },
  {
    question: "When do I need URL encoding?",
    answer:
      "Whenever a query parameter contains spaces, special characters, or another URL. Use component mode for single values and URI mode when encoding a full URL path.",
  },
  {
    question: "What is the difference between encodeURI and encodeURIComponent?",
    answer:
      "encodeURIComponent encodes reserved characters like /, ?, and & — best for query values. encodeURI leaves URL structure characters intact — better for whole URLs.",
  },
  {
    question: "Can I inspect query parameters?",
    answer:
      "Yes. The query breakdown table lists decoded key/value pairs from a URL’s query string so you can debug parameters quickly.",
  },
];

export const TIMESTAMP_FAQ: ToolFaqItem[] = [
  {
    question: "What is a Unix timestamp?",
    answer:
      "A Unix timestamp counts seconds (or milliseconds) since January 1, 1970 UTC — a compact, timezone-independent way systems store and exchange date/time values.",
  },
  {
    question: "Does this support milliseconds?",
    answer:
      "Yes. Seconds and millisecond-precision timestamps are detected automatically from the number of digits.",
  },
  {
    question: "Can I convert a date to a timestamp?",
    answer:
      "Yes. Paste an ISO date or use the human-readable field, pick a timezone (UTC, local, or IST), and convert both directions.",
  },
  {
    question: "Is conversion done on a server?",
    answer:
      "No. All conversions run locally in your browser using your device clock and timezone data.",
  },
];
