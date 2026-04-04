import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type StatsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function StatsPage({ params }: StatsPageProps) {
  const { slug } = await params;

  const link = await prisma.link.findUnique({
    where: { slug: slug.toLowerCase() },
    select: {
      slug: true,
      originalUrl: true,
      clickCount: true,
      isCustom: true,
      createdAt: true,
      expiresAt: true,
      isActive: true,
    },
  });

  if (!link) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f5f4ef] px-6 py-16 text-[#1f2a37]">
      <div className="mx-auto grid w-full max-w-2xl gap-6 rounded-3xl border border-[#1f2a37]/10 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-[#111827]">Short Link Stats</h1>
        <dl className="grid gap-4 text-sm">
          <div className="grid gap-1">
            <dt className="font-semibold text-[#111827]">Slug</dt>
            <dd>{link.slug}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-semibold text-[#111827]">Original URL</dt>
            <dd className="break-all">{link.originalUrl}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-semibold text-[#111827]">Total Clicks</dt>
            <dd>{link.clickCount}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-semibold text-[#111827]">Type</dt>
            <dd>{link.isCustom ? "Custom slug" : "Random slug"}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-semibold text-[#111827]">Created</dt>
            <dd>{link.createdAt.toISOString()}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-semibold text-[#111827]">Expires</dt>
            <dd>{link.expiresAt ? link.expiresAt.toISOString() : "Never"}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-semibold text-[#111827]">Status</dt>
            <dd>{link.isActive ? "Active" : "Inactive"}</dd>
          </div>
        </dl>

        <Link
          href="/"
          className="inline-flex w-fit rounded-full bg-[#1f2a37] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f3d4f]"
        >
          Create another link
        </Link>
      </div>
    </main>
  );
}
