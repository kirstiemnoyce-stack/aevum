import { authRouter } from "./auth-router";
import { checkinRouter } from "./checkin-router";
import { partnerRouter } from "./partner-router";
import { feedRouter } from "./feed-router";
import { chatRouter } from "./chat-router";
import { psychRouter } from "./psych-router";
import { aiRouter } from "./ai-router";
import { imageRouter } from "./image-router";
import { pushRouter } from "./push-router";
import { statusRouter } from "./status-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  checkin: checkinRouter,
  partner: partnerRouter,
  feed: feedRouter,
  chat: chatRouter,
  psych: psychRouter,
  ai: aiRouter,
  image: imageRouter,
  push: pushRouter,
  status: statusRouter,
});

export type AppRouter = typeof appRouter;
