type Counter = {
  count: number;
  expiresAt: number;
};

const counters = new Map<string, Counter>();
const WINDOW_MS = 60_000;
const LIMIT = 30;

function now() {
  return Date.now();
}

export function isRateLimited(key: string): boolean {
  const current = counters.get(key);
  const currentTime = now();

  if (!current || current.expiresAt < currentTime) {
    counters.set(key, {
      count: 1,
      expiresAt: currentTime + WINDOW_MS,
    });
    return false;
  }

  current.count += 1;
  counters.set(key, current);

  return current.count > LIMIT;
}
