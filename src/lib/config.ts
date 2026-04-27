// Public site configuration. Read at build time from env vars where useful;
// otherwise change the constant and redeploy.

// Number of remaining spots shown in the countdown counter.
// Update via NEXT_PUBLIC_SPOTS_REMAINING env var, or fall back to this constant.
const parsed = Number(process.env.NEXT_PUBLIC_SPOTS_REMAINING);
export const SPOTS_REMAINING: number =
  Number.isFinite(parsed) && parsed >= 0 ? parsed : 8;

export const TOTAL_SPOTS = 10;

// Instagram handle (without the @). Update via NEXT_PUBLIC_INSTAGRAM_HANDLE.
export const INSTAGRAM_HANDLE: string =
  process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'olin.bike';

export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;
