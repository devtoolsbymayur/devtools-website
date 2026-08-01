"use client";

import { useRef, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef<number | null>(null);

  function ensureStarted() {
    if (startedAt.current === null) {
      startedAt.current = Date.now();
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError(null);
    ensureStarted();

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          message: String(data.get("message") ?? ""),
          // Obscure honeypot — browsers often autofill fields named "website"
          fax_number_hp: String(data.get("fax_number_hp") ?? ""),
          formStartedAt: startedAt.current,
        }),
      });
      const json = (await res.json()) as { error?: string; ok?: boolean };
      if (!res.ok) {
        setState("error");
        setError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setState("success");
      form.reset();
      startedAt.current = null;
    } catch {
      setState("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      onFocusCapture={ensureStarted}
      className="mt-8 space-y-4"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-text-muted">Name</span>
          <input
            name="name"
            required
            maxLength={120}
            className="mt-1 w-full rounded-[var(--radius)] border border-border bg-surface px-3 py-2 text-text"
            autoComplete="name"
          />
        </label>
        <label className="block text-sm">
          <span className="text-text-muted">Email</span>
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            className="mt-1 w-full rounded-[var(--radius)] border border-border bg-surface px-3 py-2 text-text"
            autoComplete="email"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-text-muted">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          maxLength={5000}
          className="mt-1 w-full rounded-[var(--radius)] border border-border bg-surface px-3 py-2 text-text"
        />
      </label>
      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <label>
          Fax
          <input
            name="fax_number_hp"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
      {state === "success" && (
        <p role="status" className="text-sm text-success">
          Message sent. Thanks for reaching out.
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="rounded-[var(--radius)] bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
      >
        {state === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
