"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class JsonErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("JSON tool crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="rounded-[var(--radius)] border border-error bg-error-soft p-6 text-sm text-text"
        >
          <p className="font-medium">Something went wrong with the JSON tool.</p>
          <p className="mt-1 text-text-muted">
            Reload the page to continue. Your last input may still be in local
            storage.
          </p>
          <button
            type="button"
            className="mt-4 rounded-[var(--radius)] bg-accent px-3 py-2 text-sm font-medium text-white"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
