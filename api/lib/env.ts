function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  appId: required("APP_ID"),
  appSecret: required("APP_SECRET"),
  databaseUrl: required("DATABASE_URL"),
  kimiAuthUrl: process.env.KIMI_AUTH_URL || "https://auth.kimi.com",
  kimiOpenUrl: process.env.KIMI_OPEN_URL || "https://open.kimi.com",
  ownerUnionId: process.env.OWNER_UNION_ID || "",
  isProduction: process.env.NODE_ENV === "production",
};
