const BASE62_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const DEFAULT_RANDOM_LENGTH = 5;

export const RESERVED_SLUGS = new Set([
  "api",
  "admin",
  "stats",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "health",
  "new",
]);

const CUSTOM_SLUG_REGEX = /^[a-z0-9-]{4,32}$/;

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function generateRandomSlug(length = DEFAULT_RANDOM_LENGTH): string {
  let slug = "";

  for (let i = 0; i < length; i += 1) {
    slug += BASE62_ALPHABET[randomInt(BASE62_ALPHABET.length)];
  }

  return slug.toLowerCase();
}

export function normalizeSlug(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidCustomSlug(slug: string): boolean {
  return CUSTOM_SLUG_REGEX.test(slug);
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug);
}
