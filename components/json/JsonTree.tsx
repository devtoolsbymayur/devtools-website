"use client";

import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { List, type RowComponentProps } from "react-window";
import {
  collectExpandablePaths,
  flattenTree,
  type FlatTreeNode,
} from "@/lib/json/tree";

type Props = {
  data: unknown;
  search: string;
};

type RowProps = {
  nodes: FlatTreeNode[];
  expanded: Set<string>;
  search: string;
  onToggle: (path: string) => void;
};

function valueClass(type: FlatTreeNode["type"]): string {
  switch (type) {
    case "string":
      return "text-[var(--code-str)]";
    case "number":
      return "text-[var(--code-num)]";
    case "boolean":
      return "text-[var(--code-bool)]";
    case "null":
      return "text-text-muted";
    default:
      return "text-text-muted";
  }
}

function TreeRow({
  index,
  style,
  nodes,
  expanded,
  search,
  onToggle,
}: RowComponentProps<RowProps>): ReactElement | null {
  const node = nodes[index];
  if (!node) return null;

  const isOpen = expanded.has(node.path);
  const q = search.trim().toLowerCase();
  const keyHit =
    q && node.keyName?.toLowerCase().includes(q) ? "bg-accent-soft" : "";
  const valHit =
    q && node.preview?.toLowerCase().includes(q) ? "bg-accent-soft" : "";

  return (
    <div style={style} className="flex items-center gap-1 font-mono text-[13px]">
      <span style={{ width: node.depth * 16 }} className="shrink-0" />
      {node.expandable ? (
        <button
          type="button"
          aria-label={isOpen ? "Collapse" : "Expand"}
          onClick={() => onToggle(node.path)}
          className="inline-flex h-5 w-5 items-center justify-center rounded text-text-muted hover:text-accent"
        >
          {isOpen ? "▾" : "▸"}
        </button>
      ) : (
        <span className="inline-block w-5" />
      )}
      {node.keyName !== null && (
        <>
          <span className={`text-[var(--code-key)] ${keyHit}`}>
            {node.keyName}
          </span>
          <span className="text-[var(--code-punc)]">:</span>
        </>
      )}
      {node.expandable ? (
        <span className="text-text-muted">
          {node.type === "array" ? "[" : "{"}
          {!isOpen && (
            <span className="ml-1">
              {node.childCount} {node.type === "array" ? "items" : "keys"}
              {node.type === "array" ? "]" : "}"}
            </span>
          )}
        </span>
      ) : (
        <span className={`${valueClass(node.type)} ${valHit}`}>
          {node.preview}
        </span>
      )}
    </div>
  );
}

export function JsonTree({ data, search }: Props) {
  const allPaths = useMemo(() => collectExpandablePaths(data), [data]);
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(["$", ...allPaths.slice(0, 40)])
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(320);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Use content-box height (clientHeight minus padding). Setting the list to
    // full clientHeight inside a padded, height:auto parent grows the parent
    // by the padding each frame → ResizeObserver feedback loop.
    const update = () => {
      const style = getComputedStyle(el);
      const padY =
        (Number.parseFloat(style.paddingTop) || 0) +
        (Number.parseFloat(style.paddingBottom) || 0);
      const next = Math.max(0, Math.floor(el.clientHeight - padY));
      if (next > 0) {
        setListHeight((prev) => (Math.abs(prev - next) > 1 ? next : prev));
      }
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const nodes = useMemo(
    () => flattenTree(data, expanded, search),
    [data, expanded, search]
  );

  function toggle(path: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  function expandAll() {
    setExpanded(new Set(allPaths));
  }

  function collapseAll() {
    setExpanded(new Set(["$"]));
  }

  const rowProps: RowProps = {
    nodes,
    expanded,
    search,
    onToggle: toggle,
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2">
        <button
          type="button"
          onClick={expandAll}
          className="rounded border border-border px-2 py-1 text-xs text-text-muted hover:text-accent"
        >
          Expand all
        </button>
        <button
          type="button"
          onClick={collapseAll}
          className="rounded border border-border px-2 py-1 text-xs text-text-muted hover:text-accent"
        >
          Collapse all
        </button>
        <span className="ml-auto text-xs text-text-muted">
          {nodes.length} nodes
        </span>
      </div>
      <div
        ref={containerRef}
        className="min-h-0 flex-1 overflow-hidden px-2 py-2"
      >
        {nodes.length === 0 ? (
          <p className="p-3 text-sm text-text-muted">No matches.</p>
        ) : (
          <List
            rowComponent={TreeRow}
            rowCount={nodes.length}
            rowHeight={28}
            rowProps={rowProps}
            style={{ height: listHeight, width: "100%" }}
          />
        )}
      </div>
    </div>
  );
}
