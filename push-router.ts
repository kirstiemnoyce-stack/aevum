import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { checkIns } from "@db/schema";

export const checkinRouter = createRouter({
  // Create a new check-in
  create: authedQuery
    .input(
      z.object({
        mood: z.string().min(1).max(32),
        intensity: z.string().min(1).max(16),
        note: z.string().max(500).optional(),
        shared: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const result = await db.insert(checkIns).values({
        userId,
        mood: input.mood,
        intensity: input.intensity,
        note: input.note || null,
        shared: input.shared,
      });

      return { success: true, id: Number(result[0].insertId) };
    }),

  // List my check-ins
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    const rows = await db
      .select()
      .from(checkIns)
      .where(eq(checkIns.userId, userId))
      .orderBy(desc(checkIns.createdAt))
      .limit(50);

    return rows;
  }),

  // Get today's check-in
  today: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rows = await db
      .select()
      .from(checkIns)
      .where(eq(checkIns.userId, userId))
      .orderBy(desc(checkIns.createdAt))
      .limit(1);

    if (rows.length === 0) return null;

    const latest = rows[0];
    const latestDate = new Date(latest.createdAt);
    latestDate.setHours(0, 0, 0, 0);

    return latestDate.getTime() === today.getTime() ? latest : null;
  }),

  // Get partner's latest check-in (for real-time sync)
  partnerLatest: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    // Find partner link
    const { partnerLinks } = await import("@db/schema");
    const linkRows = await db
      .select()
      .from(partnerLinks)
      .where(
        and(
          eq(partnerLinks.status, "accepted"),
          eq(partnerLinks.userId, userId),
        ),
      )
      .limit(1);

    if (linkRows.length === 0) return null;

    const partnerId = linkRows[0].partnerId;
    if (!partnerId) return null;

    const rows = await db
      .select()
      .from(checkIns)
      .where(eq(checkIns.userId, partnerId))
      .orderBy(desc(checkIns.createdAt))
      .limit(1);

    return rows[0] || null;
  }),

  // Get weekly check-ins for chart data
  weekly: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const rows = await db
      .select()
      .from(checkIns)
      .where(eq(checkIns.userId, userId))
      .orderBy(desc(checkIns.createdAt))
      .limit(50);

    return rows;
  }),
});
