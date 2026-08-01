import { normalizeJsonError } from "@/lib/json/errors";
import { indentUnit } from "@/lib/json/format";
import type { JsonWorkerRequest, JsonWorkerResponse } from "@/lib/json/types";

self.onmessage = (event: MessageEvent<JsonWorkerRequest>) => {
  const request = event.data;
  try {
    const parsed = JSON.parse(request.text) as unknown;
    let result = request.text;

    if (request.type === "format") {
      result = JSON.stringify(parsed, null, indentUnit(request.indent));
    } else if (request.type === "minify") {
      result = JSON.stringify(parsed);
    }

    const response: JsonWorkerResponse = {
      id: request.id,
      ok: true,
      type: request.type,
      result,
      parsed,
    };
    self.postMessage(response);
  } catch (error) {
    const response: JsonWorkerResponse = {
      id: request.id,
      ok: false,
      type: request.type,
      error: normalizeJsonError(error, request.text),
    };
    self.postMessage(response);
  }
};

export {};
