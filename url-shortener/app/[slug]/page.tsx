import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { createHash } from "node:crypto";

type RedirectPageProps = {
  params: Promise<{ slug: string }>;
};

function hashIp(rawIp: string) {
  const salt = process.env.IP_HASH_SALT ?? "dev-salt";
  return createHash("sha256").update(`${rawIp}:${salt}`).digest("hex");
}

function getClientIp(headerStore: Headers) {
  const forwardedFor = headerStore.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return headerStore.get("x-real-ip") ?? "unknown";
}

export default async function RedirectPage({ params }: RedirectPageProps) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();

  const link = await prisma.link.findUnique({
    where: { slug: normalizedSlug },
    select: {
      id: true,
      originalUrl: true,
      expiresAt: true,
      isActive: true,
    },
  });

  if (!link) {
    notFound();
  }

  if (!link.isActive) {
    notFound();
  }

  if (link.expiresAt && link.expiresAt.getTime() <= Date.now()) {
    notFound();
  }

  const headerStore = await headers();
  const userAgent = headerStore.get("user-agent");
  const referrer = headerStore.get("referer");
  const clientIpHash = hashIp(getClientIp(headerStore));

  await prisma.$transaction([
    prisma.link.update({
      where: { id: link.id },
      data: { clickCount: { increment: 1 } },
    }),
    prisma.clickEvent.create({
      data: {
        linkId: link.id,
        ipHash: clientIpHash,
        userAgent,
        referrer,
      },
    }),
  ]);

  redirect(link.originalUrl);
}
