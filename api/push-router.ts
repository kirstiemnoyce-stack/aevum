import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import webPush from "web-push";

// Configure VAPID keys — in production, generate with:
// npx web-push generate-vapid-keys
// For now, use a derived key pair (replace with proper keys)
const VAPID_PUBLIC_KEY = "BEl62iJMgib5xYlgN5z7oRH_Tp2HfH8_f8J4xHvI2xL2K2Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4";
const VAPID_PRIVATE_KEY = "aK2Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q";
const VAPID_SUBJECT = "mailto:support@aevum.app";

webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// In-memory subscription store (use database in production)
// Key: userId, Value: PushSubscription[]
const subscriptions = new Map<number, webPush.PushSubscription[]>();

export const pushRouter = createRouter({
  // Get VAPID public key (needed by frontend to subscribe)
  vapidKey: publicQuery.query(() => ({
    publicKey: VAPID_PUBLIC_KEY,
  })),

  // Subscribe to push notifications
  subscribe: authedQuery
    .input(
      z.object({
        subscription: z.object({
          endpoint: z.string().url(),
          expirationTime: z.number().nullable().optional(),
          keys: z.object({
            p256dh: z.string(),
            auth: z.string(),
          }),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const subs = subscriptions.get(userId) || [];

      // Prevent duplicates
      const exists = subs.some((s) => s.endpoint === input.subscription.endpoint);
      if (!exists) {
        subs.push(input.subscription as webPush.PushSubscription);
        subscriptions.set(userId, subs);
      }

      return { success: true, subscribed: true };
    }),

  // Unsubscribe from push notifications
  unsubscribe: authedQuery
    .input(
      z.object({
        endpoint: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const subs = subscriptions.get(userId) || [];
      const filtered = subs.filter((s) => s.endpoint !== input.endpoint);
      subscriptions.set(userId, filtered);

      return { success: true };
    }),

  // Send a test notification (to self)
  sendTest: authedQuery.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;
    const subs = subscriptions.get(userId) || [];

    if (subs.length === 0) {
      return { success: false, message: "No subscriptions found" };
    }

    const payload = JSON.stringify({
      title: "Aevum Test",
      body: "Push notifications are working!",
      tag: "test",
      url: "/",
    });

    const results = await Promise.allSettled(
      subs.map((sub) => webPush.sendNotification(sub, payload)),
    );

    return { success: true, delivered: results.filter((r) => r.status === "fulfilled").length };
  }),

  // Admin: Send notification to a specific user (for mood reminders, etc.)
  sendToUser: authedQuery
    .input(
      z.object({
        userId: z.number(),
        title: z.string().min(1),
        body: z.string().min(1),
        tag: z.string().optional(),
        url: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const subs = subscriptions.get(input.userId) || [];

      if (subs.length === 0) {
        return { success: false, message: "User has no subscriptions" };
      }

      const payload = JSON.stringify({
        title: input.title,
        body: input.body,
        tag: input.tag || "aevum-notification",
        url: input.url || "/",
      });

      const results = await Promise.allSettled(
        subs.map((sub) => webPush.sendNotification(sub, payload)),
      );

      return { success: true, delivered: results.filter((r) => r.status === "fulfilled").length };
    }),
});

// Export for scheduled tasks (e.g., daily mood reminders)
export async function sendPushToUser(userId: number, title: string, body: string, url?: string) {
  const subs = subscriptions.get(userId) || [];
  if (subs.length === 0) return { delivered: 0 };

  const payload = JSON.stringify({ title, body, tag: "aevum-reminder", url: url || "/" });

  const results = await Promise.allSettled(
    subs.map((sub) => webPush.sendNotification(sub, payload)),
  );

  return { delivered: results.filter((r) => r.status === "fulfilled").length };
}

export { VAPID_PUBLIC_KEY };
