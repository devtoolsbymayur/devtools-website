export type JsonToolMode =
  | "formatter"
  | "validator"
  | "minifier"
  | "viewer";

export type ToolAction =
  | "format"
  | "minify"
  | "validate"
  | "copy"
  | "download"
  | "upload"
  | "clear";

export const TOOL_MODE_CONFIG: Record<
  JsonToolMode,
  {
    primaryAction: ToolAction;
    actions: ToolAction[];
    showIndent: boolean;
    showAutoFormat: boolean;
    showOutputPanel: boolean;
    defaultOutputView: "text" | "tree";
    shortcutHint: string;
    storageSuffix: string;
  }
> = {
  formatter: {
    primaryAction: "format",
    actions: [
      "format",
      "minify",
      "validate",
      "copy",
      "download",
      "upload",
      "clear",
    ],
    showIndent: true,
    showAutoFormat: true,
    showOutputPanel: true,
    defaultOutputView: "text",
    shortcutHint: "Ctrl+Enter to format",
    storageSuffix: "formatter",
  },
  validator: {
    primaryAction: "validate",
    actions: ["validate", "upload", "clear"],
    showIndent: false,
    showAutoFormat: false,
    showOutputPanel: false,
    defaultOutputView: "text",
    shortcutHint: "Ctrl+Enter to validate",
    storageSuffix: "validator",
  },
  minifier: {
    primaryAction: "minify",
    actions: ["minify", "copy", "download", "upload", "clear"],
    showIndent: false,
    showAutoFormat: false,
    showOutputPanel: true,
    defaultOutputView: "text",
    shortcutHint: "Ctrl+Enter to minify",
    storageSuffix: "minifier",
  },
  viewer: {
    primaryAction: "validate",
    actions: ["upload", "clear"],
    showIndent: false,
    showAutoFormat: false,
    showOutputPanel: true,
    defaultOutputView: "tree",
    shortcutHint: "Upload a .json file to explore",
    storageSuffix: "viewer",
  },
};
