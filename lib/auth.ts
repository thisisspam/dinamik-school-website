import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "dinamik_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

// Local-dev-only fallbacks so `npm run dev` works with zero setup.
// Username: admin — Password: dinamik123
// Before deploying for real, set real environment variables:
//   ADMIN_USERNAME, ADMIN_PASSWORD_HASH (sha256 hex of the password), SESSION_SECRET
const DEV_USERNAME = "admin";
const DEV_PASSWORD_HASH = "19de6c1f870c9c30830c06fcb2472b7a0db70eb64122487676f983cd7123ed64";
const DEV_SESSION_SECRET = "dinamik-local-dev-secret-do-not-use-in-production";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const expectedUsername = process.env.ADMIN_USERNAME ?? DEV_USERNAME;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH ?? DEV_PASSWORD_HASH;
  if (!timingSafeEqual(username, expectedUsername)) return false;
  const candidateHash = await sha256Hex(password);
  return timingSafeEqual(candidateHash, expectedHash);
}

/** Verifies a raw session cookie value (used by middleware, which reads cookies itself). */
export async function verifySessionValue(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  const secret = process.env.SESSION_SECRET ?? DEV_SESSION_SECRET;
  const expectedSignature = await hmac(secret, payload);
  if (!timingSafeEqual(signature, expectedSignature)) return false;
  try {
    const { exp } = JSON.parse(atob(payload)) as { exp: number };
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

/** Call from a Server Action after successful login. */
export async function createSession(): Promise<void> {
  const secret = process.env.SESSION_SECRET ?? DEV_SESSION_SECRET;
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = btoa(JSON.stringify({ exp: expiresAt }));
  const signature = await hmac(secret, payload);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, `${payload}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

/** Call from a Server Action to log out. */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/** Call from Server Components/Actions to check the current request's session. */
export async function hasValidSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}
