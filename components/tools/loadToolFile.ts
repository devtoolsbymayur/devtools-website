import { MAX_UPLOAD_BYTES } from "@/lib/constants";
import { readFileAsText } from "@/lib/json/format";

/** Same rules as JSON formatter: extension allow-list + 10MB, local read only. */
export async function loadToolFile(
  file: File,
  allowedExt: readonly string[]
): Promise<
  { ok: true; text: string; name: string } | { ok: false; error: string }
> {
  const name = file.name.toLowerCase();
  if (!allowedExt.some((ext) => name.endsWith(ext))) {
    return {
      ok: false,
      error: `Only ${allowedExt.join(", ")} files are allowed.`,
    };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "File is too large. Maximum size is 10MB." };
  }
  try {
    const text = await readFileAsText(file);
    return { ok: true, text, name: file.name };
  } catch {
    return { ok: false, error: "Could not read that file." };
  }
}
