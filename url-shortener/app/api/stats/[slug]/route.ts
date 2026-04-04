import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

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
    return Response.json({ error: "Short link not found." }, { status: 404 });
  }

  return Response.json(link);
}
