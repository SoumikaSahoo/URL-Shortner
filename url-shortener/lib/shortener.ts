import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  generateRandomSlug,
  isReservedSlug,
  isValidCustomSlug,
  normalizeSlug,
} from "@/lib/slug";
import { isValidHttpUrl, parseOptionalExpiry } from "@/lib/validation";

const MAX_GENERATION_ATTEMPTS = 15;

function getDbErrorResponse(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return { error: "Slug already exists.", status: 409 as const };
    }

    if (error.code === "P2021") {
      return {
        error: "Database tables are missing. Run Prisma migrations on production.",
        status: 500 as const,
      };
    }
  }

  return {
    error: "Database error while creating short link. Please try again.",
    status: 500 as const,
  };
}

export type CreateLinkInput = {
  originalUrl: string;
  customSlug?: string;
  expiresAt?: string;
};

export async function createShortLink(input: CreateLinkInput) {
  const originalUrl = input.originalUrl?.trim();

  if (!originalUrl || !isValidHttpUrl(originalUrl)) {
    return { error: "Please provide a valid http/https URL.", status: 400 as const };
  }

  let normalizedCustomSlug: string | null = null;

  if (input.customSlug?.trim()) {
    normalizedCustomSlug = normalizeSlug(input.customSlug);

    if (!isValidCustomSlug(normalizedCustomSlug)) {
      return {
        error: "Custom slug must be 4-32 characters and only use a-z, 0-9, and -.",
        status: 400 as const,
      };
    }

    if (isReservedSlug(normalizedCustomSlug)) {
      return { error: "This custom slug is reserved.", status: 400 as const };
    }
  }

  let parsedExpiry: Date | null;
  try {
    parsedExpiry = parseOptionalExpiry(input.expiresAt);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Invalid expiry date.",
      status: 400 as const,
    };
  }

  if (normalizedCustomSlug) {
    const existing = await prisma.link.findUnique({
      where: { slug: normalizedCustomSlug },
      select: { id: true },
    });

    if (existing) {
      return { error: "Custom slug already exists.", status: 409 as const };
    }

    try {
      const link = await prisma.link.create({
        data: {
          originalUrl,
          slug: normalizedCustomSlug,
          isCustom: true,
          expiresAt: parsedExpiry,
        },
      });

      return { link, status: 201 as const };
    } catch (error) {
      return getDbErrorResponse(error);
    }
  }

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const candidate = generateRandomSlug();
    if (isReservedSlug(candidate)) {
      continue;
    }

    try {
      const link = await prisma.link.create({
        data: {
          originalUrl,
          slug: candidate,
          isCustom: false,
          expiresAt: parsedExpiry,
        },
      });

      return { link, status: 201 as const };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        continue;
      }

      return getDbErrorResponse(error);
    }
  }

  return {
    error: "Failed to generate a unique slug. Please try again.",
    status: 503 as const,
  };
}

export function getShortUrl(slug: string) {
  const base = process.env.SHORT_URL_BASE?.trim() || "http://localhost:3000";
  return `${base.replace(/\/+$/, "")}/${slug}`;
}
