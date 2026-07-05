import { createRouter, authedQuery } from "./middleware";
import { getRateLimitStatus, DEFAULT_LIMITS } from "./lib/rateLimiter";

export const statusRouter = createRouter({
  // Get current user's rate limit status (credits)
  credits: authedQuery.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    return {
      aiChat: {
        ...getRateLimitStatus(userId, "ai_chat"),
        label: "AI Chat Messages",
      },
      imageGen: {
        ...getRateLimitStatus(userId, "image_generate"),
        label: "Image Generations",
      },
      checkin: {
        ...getRateLimitStatus(userId, "checkin"),
        label: "Check-ins",
      },
    };
  }),

  // Get all rate limits for reference
  limits: authedQuery.query(() => {
    return {
      aiChat: { limit: DEFAULT_LIMITS.ai_chat.maxRequests, windowMinutes: DEFAULT_LIMITS.ai_chat.windowMs / 60000 },
      imageGen: { limit: DEFAULT_LIMITS.image_generate.maxRequests, windowMinutes: DEFAULT_LIMITS.image_generate.windowMs / 60000 },
      checkin: { limit: DEFAULT_LIMITS.checkin.maxRequests, windowMinutes: DEFAULT_LIMITS.checkin.windowMs / 60000 },
    };
  }),
});
