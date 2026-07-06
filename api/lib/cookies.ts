import { env } from "./env";

export interface SessionCookieOptions {
  httpOnly: boolean;
  path: string;
  sameSite: "Lax" | "None" | "Strict";
  secure: boolean;
}

// Native app shells (Capacitor) call the API cross-origin, which requires
// SameSite=None + Secure. Same-origin browser traffic can stay Lax.
export function getSessionCookieOptions(headers: Headers): SessionCookieOptions {
  const origin = headers.get("origin");
  const host = headers.get("host");
  const isCrossSite = !!origin && !!host && !origin.includes(host);

  return {
    httpOnly: true,
    path: "/",
    sameSite: isCrossSite ? "None" : "Lax",
    secure: isCrossSite || env.isProduction,
  };
}
