export type FlatTreeNode = {
  id: string;
  depth: number;
  keyName: string | null;
  value: unknown;
  type: "object" | "array" | "string" | "number" | "boolean" | "null";
  expandable: boolean;
  path: string;
  preview?: string;
  childCount?: number;
};

function valueType(value: unknown): FlatTreeNode["type"] {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value as FlatTreeNode["type"];
}

function previewOf(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "string") {
    return value.length > 48 ? `"${value.slice(0, 48)}…"` : `"${value}"`;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) return `Array(${value.length})`;
  if (typeof value === "object") {
    return `Object(${Object.keys(value as object).length})`;
  }
  return String(value);
}

export function flattenTree(
  data: unknown,
  expanded: Set<string>,
  search: string
): FlatTreeNode[] {
  const nodes: FlatTreeNode[] = [];
  const q = search.trim().toLowerCase();

  function walk(
    value: unknown,
    keyName: string | null,
    path: string,
    depth: number
  ) {
    const type = valueType(value);
    const expandable = type === "object" || type === "array";
    const childCount = expandable
      ? type === "array"
        ? (value as unknown[]).length
        : Object.keys(value as object).length
      : undefined;

    const keyMatch = keyName?.toLowerCase().includes(q);
    const valueMatch =
      !expandable && previewOf(value).toLowerCase().includes(q);
    const matches = !q || keyMatch || valueMatch;

    if (matches || expandable) {
      nodes.push({
        id: path,
        depth,
        keyName,
        value,
        type,
        expandable,
        path,
        preview: expandable ? undefined : previewOf(value),
        childCount,
      });
    }

    if (!expandable || !expanded.has(path)) return;

    if (type === "array") {
      (value as unknown[]).forEach((child, index) => {
        walk(child, String(index), `${path}[${index}]`, depth + 1);
      });
      return;
    }

    Object.entries(value as Record<string, unknown>).forEach(([k, child]) => {
      walk(child, k, path ? `${path}.${k}` : k, depth + 1);
    });
  }

  walk(data, null, "$", 0);

  if (!q) return nodes;

  // Keep ancestors of matches so the tree remains navigable
  const keep = new Set(nodes.map((n) => n.path));
  return nodes.filter((n) => {
    if (!q) return true;
    if (keep.has(n.path)) return true;
    return false;
  });
}

export function collectExpandablePaths(
  data: unknown,
  maxNodes = 5000
): string[] {
  const paths: string[] = [];

  function walk(value: unknown, path: string) {
    if (paths.length >= maxNodes) return;
    if (value !== null && typeof value === "object") {
      paths.push(path);
      if (Array.isArray(value)) {
        value.forEach((child, i) => walk(child, `${path}[${i}]`));
      } else {
        Object.entries(value as Record<string, unknown>).forEach(([k, child]) => {
          walk(child, `${path}.${k}`);
        });
      }
    }
  }

  walk(data, "$");
  return paths;
}

export function countKeys(data: unknown): { keys: number; arrays: number } {
  let keys = 0;
  let arrays = 0;

  function walk(value: unknown) {
    if (Array.isArray(value)) {
      arrays += 1;
      value.forEach(walk);
      return;
    }
    if (value !== null && typeof value === "object") {
      const entries = Object.entries(value as Record<string, unknown>);
      keys += entries.length;
      entries.forEach(([, v]) => walk(v));
    }
  }

  walk(data);
  return { keys, arrays };
}
