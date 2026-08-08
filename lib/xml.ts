export type XmlIndent = "2" | "4" | "tab";

export type XmlResult =
  | { ok: true; result: string }
  | { ok: false; error: string };

function indentUnit(indent: XmlIndent): string {
  if (indent === "tab") return "\t";
  return " ".repeat(Number(indent));
}

function getParser(): DOMParser {
  if (typeof DOMParser === "undefined") {
    throw new Error("XML parsing requires a browser DOMParser");
  }
  return new DOMParser();
}

function parseErrorMessage(doc: Document): string | null {
  const err = doc.querySelector("parsererror");
  if (!err) return null;
  const text = (err.textContent ?? "Invalid XML").replace(/\s+/g, " ").trim();
  return text.slice(0, 280) || "Invalid XML";
}

export function parseXml(text: string): { ok: true; doc: Document } | { ok: false; error: string } {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, error: "XML input is empty." };
  try {
    const doc = getParser().parseFromString(trimmed, "application/xml");
    const err = parseErrorMessage(doc);
    if (err) return { ok: false, error: err };
    return { ok: true, doc };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to parse XML",
    };
  }
}

export function validateXml(text: string): XmlResult {
  const parsed = parseXml(text);
  if (!parsed.ok) return parsed;
  return { ok: true, result: text.trim() };
}

function serializeNode(node: Node, depth: number, unit: string, minify: boolean): string {
  if (node.nodeType === Node.TEXT_NODE) {
    const value = (node.textContent ?? "").replace(/\s+/g, " ");
    if (minify) return value.trim();
    return value;
  }
  if (node.nodeType === Node.CDATA_SECTION_NODE) {
    return `<![CDATA[${node.textContent ?? ""}]]>`;
  }
  if (node.nodeType === Node.COMMENT_NODE) {
    return `<!--${node.textContent ?? ""}-->`;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const el = node as Element;
  const name = el.tagName;
  let attrs = "";
  for (const attr of Array.from(el.attributes)) {
    attrs += ` ${attr.name}="${attr.value.replace(/"/g, "&quot;")}"`;
  }

  const children = Array.from(el.childNodes).filter((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      return (child.textContent ?? "").trim().length > 0;
    }
    return (
      child.nodeType === Node.ELEMENT_NODE ||
      child.nodeType === Node.CDATA_SECTION_NODE ||
      child.nodeType === Node.COMMENT_NODE
    );
  });

  if (children.length === 0) {
    return `<${name}${attrs}/>`;
  }

  const onlyText =
    children.length === 1 && children[0]!.nodeType === Node.TEXT_NODE;
  if (onlyText) {
    const text = (children[0]!.textContent ?? "").trim();
    return `<${name}${attrs}>${text}</${name}>`;
  }

  if (minify) {
    const inner = children
      .map((child) => serializeNode(child, depth + 1, unit, true))
      .join("");
    return `<${name}${attrs}>${inner}</${name}>`;
  }

  const pad = unit.repeat(depth);
  const childPad = unit.repeat(depth + 1);
  const inner = children
    .map((child) => {
      const serialized = serializeNode(child, depth + 1, unit, false);
      if (child.nodeType === Node.TEXT_NODE) {
        return `${childPad}${serialized.trim()}`;
      }
      return `${childPad}${serialized}`;
    })
    .join("\n");
  return `<${name}${attrs}>\n${inner}\n${pad}</${name}>`;
}

function serializeDocument(doc: Document, indent: XmlIndent, minify: boolean): string {
  const root = doc.documentElement;
  if (!root) return "";
  const unit = indentUnit(indent);
  const xmlDecl = `<?xml version="1.0" encoding="UTF-8"?>`;
  const body = serializeNode(root, 0, unit, minify);
  if (minify) return `${xmlDecl}${body}`;
  return `${xmlDecl}\n${body}`;
}

export function formatXml(text: string, indent: XmlIndent = "2"): XmlResult {
  const parsed = parseXml(text);
  if (!parsed.ok) return parsed;
  return { ok: true, result: serializeDocument(parsed.doc, indent, false) };
}

export function minifyXml(text: string): XmlResult {
  const parsed = parseXml(text);
  if (!parsed.ok) return parsed;
  return { ok: true, result: serializeDocument(parsed.doc, "2", true) };
}

function elementToJson(el: Element): unknown {
  const obj: Record<string, unknown> = {};
  for (const attr of Array.from(el.attributes)) {
    obj[`@${attr.name}`] = attr.value;
  }

  const childElements = Array.from(el.children);
  const text = Array.from(el.childNodes)
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => (n.textContent ?? "").trim())
    .filter(Boolean)
    .join(" ");

  if (childElements.length === 0) {
    if (Object.keys(obj).length === 0) return text;
    if (text) obj["#text"] = text;
    return obj;
  }

  for (const child of childElements) {
    const value = elementToJson(child);
    const key = child.tagName;
    if (key in obj) {
      const existing = obj[key];
      obj[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      obj[key] = value;
    }
  }
  if (text) obj["#text"] = text;
  return obj;
}

export function xmlToJson(text: string, pretty = true): XmlResult {
  const parsed = parseXml(text);
  if (!parsed.ok) return parsed;
  const root = parsed.doc.documentElement;
  if (!root) return { ok: false, error: "XML has no root element." };
  const data = { [root.tagName]: elementToJson(root) };
  return {
    ok: true,
    result: pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data),
  };
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonValueToXml(name: string, value: unknown, depth: number, unit: string): string {
  const pad = unit.repeat(depth);
  if (value === null || value === undefined) {
    return `${pad}<${name}/>`;
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => jsonValueToXml(name, item, depth, unit))
      .join("\n");
  }
  if (typeof value !== "object") {
    return `${pad}<${name}>${escapeXml(String(value))}</${name}>`;
  }

  const record = value as Record<string, unknown>;
  const attrs: string[] = [];
  const children: Array<[string, unknown]> = [];
  let text = "";

  for (const [key, child] of Object.entries(record)) {
    if (key === "#text") {
      text = String(child ?? "");
    } else if (key.startsWith("@")) {
      attrs.push(`${key.slice(1)}="${escapeXml(String(child ?? ""))}"`);
    } else {
      children.push([key, child]);
    }
  }

  const attrStr = attrs.length ? ` ${attrs.join(" ")}` : "";
  if (children.length === 0) {
    if (!text) return `${pad}<${name}${attrStr}/>`;
    return `${pad}<${name}${attrStr}>${escapeXml(text)}</${name}>`;
  }

  const inner = children
    .map(([key, child]) => jsonValueToXml(key, child, depth + 1, unit))
    .join("\n");
  const textLine = text ? `\n${unit.repeat(depth + 1)}${escapeXml(text)}` : "";
  return `${pad}<${name}${attrStr}>${textLine}\n${inner}\n${pad}</${name}>`;
}

export function jsonToXml(text: string, indent: XmlIndent = "2"): XmlResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    return { ok: false, error: "Invalid JSON input." };
  }

  const unit = indentUnit(indent);
  let body: string;
  if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
    const entries = Object.entries(parsed as Record<string, unknown>);
    if (entries.length === 1) {
      const [name, value] = entries[0]!;
      body = jsonValueToXml(name, value, 0, unit);
    } else {
      body = jsonValueToXml("root", parsed, 0, unit);
    }
  } else {
    body = jsonValueToXml("root", parsed, 0, unit);
  }

  return {
    ok: true,
    result: `<?xml version="1.0" encoding="UTF-8"?>\n${body}`,
  };
}
