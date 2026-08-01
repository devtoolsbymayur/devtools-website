import type {
  IndentStyle,
  JsonErrorInfo,
  JsonWorkerRequest,
  JsonWorkerResponse,
} from "@/lib/json/types";
import { formatJson, minifyJson, validateJson } from "@/lib/json/format";

type Result =
  | { ok: true; result: string; parsed?: unknown }
  | { ok: false; error: JsonErrorInfo };

let worker: Worker | null = null;
let supported: boolean | null = null;

function canUseWorker(): boolean {
  if (supported !== null) return supported;
  supported =
    typeof window !== "undefined" &&
    typeof Worker !== "undefined";
  return supported;
}

function getWorker(): Worker | null {
  if (!canUseWorker()) return null;
  if (!worker) {
    try {
      worker = new Worker(
        new URL("../../workers/json.worker.ts", import.meta.url)
      );
    } catch {
      supported = false;
      return null;
    }
  }
  return worker;
}

function runLocal(
  type: JsonWorkerRequest["type"],
  text: string,
  indent: IndentStyle
): Result {
  if (type === "minify") {
    const r = minifyJson(text);
    return r.ok
      ? { ok: true, result: r.result, parsed: r.parsed }
      : { ok: false, error: r.error };
  }
  if (type === "validate" || type === "parse") {
    const r = validateJson(text);
    return r.ok
      ? { ok: true, result: text, parsed: r.parsed }
      : { ok: false, error: r.error };
  }
  const r = formatJson(text, indent);
  return r.ok
    ? { ok: true, result: r.result, parsed: r.parsed }
    : { ok: false, error: r.error };
}

function runInWorker(
  type: JsonWorkerRequest["type"],
  text: string,
  indent: IndentStyle
): Promise<Result> {
  const w = getWorker();
  if (!w) return Promise.resolve(runLocal(type, text, indent));

  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const request: JsonWorkerRequest =
    type === "format"
      ? { id, type, text, indent }
      : { id, type, text };

  return new Promise((resolve) => {
    const onMessage = (event: MessageEvent<JsonWorkerResponse>) => {
      if (event.data.id !== id) return;
      w.removeEventListener("message", onMessage);
      w.removeEventListener("error", onError);
      if (event.data.ok) {
        resolve({
          ok: true,
          result: event.data.result,
          parsed: event.data.parsed,
        });
      } else {
        resolve({ ok: false, error: event.data.error });
      }
    };
    const onError = () => {
      w.removeEventListener("message", onMessage);
      w.removeEventListener("error", onError);
      resolve(runLocal(type, text, indent));
    };
    w.addEventListener("message", onMessage);
    w.addEventListener("error", onError);
    w.postMessage(request);
  });
}

export function processJson(
  type: JsonWorkerRequest["type"],
  text: string,
  indent: IndentStyle = "2"
): Promise<Result> {
  return runInWorker(type, text, indent);
}
