export function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseOptionalExpiry(rawValue?: string): Date | null {
  if (!rawValue || !rawValue.trim()) {
    return null;
  }

  const expiresAt = new Date(rawValue);
  if (Number.isNaN(expiresAt.valueOf())) {
    throw new Error("Invalid expiry date.");
  }

  if (expiresAt.getTime() <= Date.now()) {
    throw new Error("Expiry date must be in the future.");
  }

  return expiresAt;
}
