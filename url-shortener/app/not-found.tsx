import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f5f4ef] px-6 py-20 text-[#1f2a37]">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-3xl border border-[#1f2a37]/10 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#c7583b]">404</p>
        <h1 className="text-3xl font-semibold">Link not found or expired</h1>
        <p className="text-base text-[#374151]">
          This short URL is invalid, inactive, or has already expired.
        </p>
        <Link
          href="/"
          className="inline-flex w-fit rounded-full bg-[#1f2a37] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f3d4f]"
        >
          Create a new short link
        </Link>
      </div>
    </main>
  );
}
