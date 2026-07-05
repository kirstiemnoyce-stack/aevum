import { z } from "zod";
import { eq, or } from "drizzle-orm";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { partnerLinks, users } from "@db/schema";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 3; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  code += "-";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const partnerRouter = createRouter({
  // Get my partner link status
  status: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    const rows = await db
      .select()
      .from(partnerLinks)
      .where(
        or(
          eq(partnerLinks.userId, userId),
          eq(partnerLinks.partnerId, userId),
        ),
      )
      .limit(1);

    if (rows.length === 0) {
      return { status: "none" as const, inviteCode: null, partner: null };
    }

    const link = rows[0];

    if (link.status === "pending") {
      if (link.userId === userId) {
        return { status: "pending" as const, inviteCode: link.inviteCode, partner: null };
      } else {
        // Someone invited me
        const inviter = await db
          .select()
          .from(users)
          .where(eq(users.id, link.userId))
          .limit(1);
        return {
          status: "invited" as const,
          inviteCode: link.inviteCode,
          partner: inviter[0] ? { id: inviter[0].id, name: inviter[0].name } : null,
        };
      }
    }

    // Accepted - get partner info
    const partnerId = link.userId === userId ? link.partnerId : link.userId;
    if (!partnerId) {
      return { status: "none" as const, inviteCode: null, partner: null };
    }

    const partnerUser = await db
      .select()
      .from(users)
      .where(eq(users.id, partnerId))
      .limit(1);

    return {
      status: "connected" as const,
      inviteCode: link.inviteCode,
      partner: partnerUser[0]
        ? { id: partnerUser[0].id, name: partnerUser[0].name, avatar: partnerUser[0].avatar }
        : null,
    };
  }),

  // Generate invite code
  generateCode: authedQuery.mutation(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    // Check if already has a pending link
    const existing = await db
      .select()
      .from(partnerLinks)
      .where(eq(partnerLinks.userId, userId))
      .limit(1);

    if (existing.length > 0 && existing[0].status === "pending") {
      return { inviteCode: existing[0].inviteCode };
    }

    // Delete any existing link for this user
    if (existing.length > 0) {
      await db.delete(partnerLinks).where(eq(partnerLinks.userId, userId));
    }

    const code = generateInviteCode();
    await db.insert(partnerLinks).values({
      userId,
      inviteCode: code,
      status: "pending",
    });

    return { inviteCode: code };
  }),

  // Accept an invite
  accept: authedQuery
    .input(z.object({ code: z.string().min(4).max(10) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const rows = await db
        .select()
        .from(partnerLinks)
        .where(eq(partnerLinks.inviteCode, input.code.toUpperCase()))
        .limit(1);

      if (rows.length === 0) {
        throw new Error("Invalid invite code");
      }

      const link = rows[0];
      if (link.userId === userId) {
        throw new Error("Cannot accept your own invite");
      }

      await db
        .update(partnerLinks)
        .set({ partnerId: userId, status: "accepted", acceptedAt: new Date() })
        .where(eq(partnerLinks.id, link.id));

      return { success: true };
    }),

  // Unlink partner
  unlink: authedQuery.mutation(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    await db
      .delete(partnerLinks)
      .where(
        or(
          eq(partnerLinks.userId, userId),
          eq(partnerLinks.partnerId, userId),
        ),
      );

    return { success: true };
  }),
});
