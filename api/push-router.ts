import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import webPush from "web-push";

// Configure VAPID keys — generate a persistent pair with:
// npx web-push generate-vapid-keys
// and set VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY in the environment.
// Falls back to a freshly generated pair so the server doesn't crash when
// they're unset, but push subscriptions won't survive a restart in that case.
const VAPID_SUBJECT = "mailto:support@aevum.app";
const vapidKeys =
  process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY
    ? { publicKey: process.env.VAPID_PUBLIC_KEY, privateKey: process.env.VAPID_PRIVATE_KEY }
    : webPush.generateVAPIDKeys();

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.warn(
    "[push] VAPID_PUBLIC_KEY/VAPID_PRIVATE_KEY not set — generated an ephemeral pair. " +
      "Push subscriptions will be invalidated on every restart until real keys are configured.",
  );
}

const VAPID_PUBLIC_KEY = vapidKeys.publicKey;
const VAPID_PRIVATE_KEY = vapidKeys.privateKey;

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
