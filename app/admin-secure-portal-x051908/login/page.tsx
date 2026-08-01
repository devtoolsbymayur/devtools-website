"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: searchParams.get("callbackUrl") || ADMIN_BASE_PATH,
    });

    setBusy(false);

    if (!result) {
      setError("Login failed. Check that the app server is running.");
      return;
    }

    if (result.error) {
      setError(
        result.error === "CredentialsSignin"
          ? "Invalid email or password."
          : result.error
      );
      return;
    }

    router.replace(result.url || ADMIN_BASE_PATH);
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <div className="mb-6 flex justify-end">
        <ThemeToggle />
      </div>
      <div className="mb-8 text-center">
        <BrandLogo href="/" />
        <h1 className="mt-6 text-2xl font-semibold">Admin login</h1>
        <p className="mt-2 text-sm text-text-muted">
          Authorized access only.
        </p>
      </div>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-[var(--radius)] border border-border bg-surface p-6 shadow-[var(--shadow)]"
      >
        <label className="block text-sm">
          <span className="text-text-muted">Email</span>
          <input
            name="email"
            type="text"
            inputMode="email"
            autoComplete="username"
            required
            className="mt-1 w-full rounded-[var(--radius)] border border-border bg-bg px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="text-text-muted">Password</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-[var(--radius)] border border-border bg-bg px-3 py-2"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-[var(--radius)] bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md py-20 text-center text-text-muted">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
