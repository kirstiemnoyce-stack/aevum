export type * from "../db/schema";
export * from "./errors";

export const Session = {
  cookieName: "aevum_session",
  maxAgeMs: 1000 * 60 * 60 * 24 * 365, // 1 year, matches signSessionToken's expiry
};

export const Paths = {
  oauthCallback: "/api/oauth/callback",
};
