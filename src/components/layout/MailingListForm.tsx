"use client";

import { useState } from "react";

export function MailingListForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/mailing-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("success");
        setEmail("");
        setWebsite("");
      }
    } catch {
      setErrorMsg("Could not connect. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm text-brand-ink font-medium">
        Thank you — you&rsquo;re on the list!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="h-9 min-w-0 flex-1 rounded-md border border-border bg-white px-3 text-sm text-ink placeholder:text-muted focus:border-brand-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-9 shrink-0 rounded-md bg-brand-ink px-4 text-sm font-medium text-white transition-colors hover:bg-ink disabled:opacity-60"
        >
          {status === "loading" ? "..." : "Join"}
        </button>
      </div>

      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      {status === "error" && (
        <p className="text-xs text-red-500">{errorMsg}</p>
      )}
    </form>
  );
}
