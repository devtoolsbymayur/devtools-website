"use client";

import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { forwardRef, useMemo } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  onDropFile?: (file: File) => void;
};

export const JsonEditor = forwardRef<ReactCodeMirrorRef, Props>(
  function JsonEditor({ value, onChange, readOnly, onDropFile }, ref) {
    const extensions = useMemo(
      () => [
        json(),
        EditorView.lineWrapping,
        EditorView.theme({
          "&": {
            backgroundColor: "var(--bg)",
            color: "var(--text)",
          },
          ".cm-content": {
            caretColor: "var(--accent)",
            minHeight: "320px",
          },
          ".cm-gutters": {
            backgroundColor: "var(--surface)",
            color: "var(--text-muted)",
            borderRight: "1px solid var(--border)",
          },
          ".cm-activeLine": {
            backgroundColor: "color-mix(in srgb, var(--accent) 8%, transparent)",
          },
          ".cm-activeLineGutter": {
            backgroundColor: "color-mix(in srgb, var(--accent) 8%, transparent)",
          },
          "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
            backgroundColor:
              "color-mix(in srgb, var(--accent) 28%, transparent) !important",
          },
        }),
      ],
      []
    );

    return (
      <div
        className="h-full min-h-[320px] overflow-hidden"
        onDragOver={(e) => {
          if (!onDropFile) return;
          e.preventDefault();
        }}
        onDrop={(e) => {
          if (!onDropFile) return;
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) onDropFile(file);
        }}
      >
        <CodeMirror
          ref={ref}
          value={value}
          height="100%"
          minHeight="320px"
          theme="none"
          editable={!readOnly}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
            bracketMatching: true,
          }}
          extensions={extensions}
          onChange={onChange}
          className="h-full text-[13px]"
        />
      </div>
    );
  }
);
