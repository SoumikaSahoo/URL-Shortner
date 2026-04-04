"use client";

import { useMemo, useState } from "react";

type ApiSuccess = {
  slug: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  expiresAt: string | null;
  isCustom: boolean;
};

type ApiFailure = {
  error: string;
};

export function ShortenerForm() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiSuccess | null>(null);

  const statsUrl = useMemo(() => {
    if (!result) {
      return null;
    }

    return `/stats/${result.slug}`;
  }, [result]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl,
          customSlug: customSlug || undefined,
          expiresAt: expiresAt || undefined,
        }),
      });

      const payload = (await response.json()) as ApiSuccess | ApiFailure;

      if (!response.ok) {
        setError("error" in payload ? payload.error : "Failed to create short link.");
        return;
      }

      setResult(payload as ApiSuccess);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard() {
    if (!result) {
      return;
    }

    await navigator.clipboard.writeText(result.shortUrl);
  }

  return (
    <div className="grid gap-6">
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-3xl border border-[#1f2a37]/10 bg-white p-6 shadow-sm"
      >
        <label className="grid gap-2 text-sm font-medium text-[#1f2a37]">
          Long URL
          <input
            required
            type="url"
            placeholder="https://example.com/very/long/link"
            value={originalUrl}
            onChange={(event) => setOriginalUrl(event.target.value)}
            className="rounded-xl border border-[#1f2a37]/20 px-4 py-3 text-sm outline-none ring-[#c7583b] transition focus:ring-2"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-[#1f2a37]">
            Custom slug (optional)
            <input
              type="text"
              placeholder="summer-sale"
              value={customSlug}
              onChange={(event) => setCustomSlug(event.target.value)}
              className="rounded-xl border border-[#1f2a37]/20 px-4 py-3 text-sm outline-none ring-[#c7583b] transition focus:ring-2"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-[#1f2a37]">
            Expiry (optional)
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
              className="rounded-xl border border-[#1f2a37]/20 px-4 py-3 text-sm outline-none ring-[#c7583b] transition focus:ring-2"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#1f2a37] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2f3d4f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating..." : "Shorten URL"}
        </button>
      </form>

      {error ? (
        <div className="rounded-2xl border border-[#c7583b]/30 bg-[#fff1ec] px-4 py-3 text-sm text-[#7a2f1d]">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="grid gap-3 rounded-3xl border border-[#1f2a37]/10 bg-[#eef2f7] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Short link ready</p>
          <a
            href={result.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="w-fit text-lg font-semibold text-[#1f2a37] underline decoration-[#c7583b] decoration-2 underline-offset-4"
          >
            {result.shortUrl}
          </a>
          <p className="text-sm text-[#374151]">Original: {result.originalUrl}</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyToClipboard}
              className="rounded-full border border-[#1f2a37]/20 bg-white px-4 py-2 text-sm font-medium text-[#1f2a37] transition hover:bg-[#f6f8fa]"
            >
              Copy
            </button>
            {statsUrl ? (
              <a
                href={statsUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#1f2a37]/20 bg-white px-4 py-2 text-sm font-medium text-[#1f2a37] transition hover:bg-[#f6f8fa]"
              >
                View stats
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
