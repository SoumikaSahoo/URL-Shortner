import { ShortenerForm } from "@/components/shortener-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#ffd9b7,_#f5f4ef_42%,_#edf2f7)] px-6 py-12 text-[#1f2a37]">
      <div className="mx-auto grid w-full max-w-3xl gap-8">
        <section className="grid gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c7583b]">Anonymous URL Shortener</p>
          <h1 className="text-4xl font-semibold leading-tight text-[#111827] sm:text-5xl">
            Shrink long links into clean slugs.
          </h1>
          <p className="max-w-2xl text-sm text-[#374151] sm:text-base">
            Generate a random short slug instantly, or choose a custom one. No login required.
          </p>
        </section>

        <ShortenerForm />

        <section className="grid gap-2 rounded-3xl border border-[#1f2a37]/10 bg-white/85 p-6 text-sm text-[#374151] backdrop-blur-sm">
          <p className="font-semibold text-[#111827]">Rules</p>
          <p>Custom slug: 4-32 chars, lowercase letters, numbers, and hyphen.</p>
          <p>Reserved slugs are blocked (`api`, `admin`, `stats`, and others).</p>
          <p>Default random slug length: 5 characters.</p>
        </section>
      </div>
    </main>
  );
}
