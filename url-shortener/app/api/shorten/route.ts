import { createShortLink, getShortUrl } from "@/lib/shortener";
import { isRateLimited } from "@/lib/rate-limit";
import { type NextRequest } from "next/server";

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

type ShortenRequest = {
  originalUrl?: string;
  customSlug?: string;
  expiresAt?: string;
};

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  let payload: ShortenRequest;
  try {
    payload = (await request.json()) as ShortenRequest;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  let result;
  try {
    result = await createShortLink({
      originalUrl: payload.originalUrl ?? "",
      customSlug: payload.customSlug,
      expiresAt: payload.expiresAt,
    });
  } catch {
    return Response.json(
      { error: "Unexpected server error while creating short link." },
      { status: 500 },
    );
  }

  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  return Response.json(
    {
      id: result.link.id,
      slug: result.link.slug,
      shortUrl: getShortUrl(result.link.slug),
      originalUrl: result.link.originalUrl,
      expiresAt: result.link.expiresAt,
      createdAt: result.link.createdAt,
      isCustom: result.link.isCustom,
    },
    { status: result.status },
  );
}
