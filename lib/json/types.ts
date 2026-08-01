export type IndentStyle = "2" | "4" | "tab";

export type JsonWorkerRequest =
  | { id: string; type: "format"; text: string; indent: IndentStyle }
  | { id: string; type: "minify"; text: string }
  | { id: string; type: "validate"; text: string }
  | { id: string; type: "parse"; text: string };

export type JsonErrorInfo = {
  message: string;
  line?: number;
  column?: number;
  position?: number;
};

export type JsonWorkerSuccess = {
  id: string;
  ok: true;
  type: JsonWorkerRequest["type"];
  result: string;
  parsed?: unknown;
};

export type JsonWorkerFailure = {
  id: string;
  ok: false;
  type: JsonWorkerRequest["type"];
  error: JsonErrorInfo;
};

export type JsonWorkerResponse = JsonWorkerSuccess | JsonWorkerFailure;
