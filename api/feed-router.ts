import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { posts, likes, users } from "@db/schema";

export const feedRouter = createRouter({
  // List all community posts
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();

    const rows = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(50);

    // Get user info for each post
    const results = await Promise.all(
      rows.map(async (post) => {
        let authorName = "Anonymous";
        if (!post.isAnonymous) {
          const userRows = await db
            .select()
            .from(users)
            .where(eq(users.id, post.userId))
            .limit(1);
          if (userRows[0]) {
            authorName = userRows[0].name || "User";
          }
        }

        // Check if current user liked this post
        const likeRows = await db
          .select()
          .from(likes)
          .where(eq(likes.postId, post.id))
          .limit(100);

        const likedByMe = likeRows.some((l) => l.userId === ctx.user.id);

        return {
          ...post,
          authorName,
          liked: likedByMe,
          likes: likeRows.length,
        };
      }),
    );

    return results;
  }),

  // Create a new post
  create: authedQuery
    .input(
      z.object({
        mood: z.string().min(1).max(32),
        content: z.string().min(1).max(500),
        isAnonymous: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      const result = await db.insert(posts).values({
        userId: ctx.user.id,
        mood: input.mood,
        content: input.content,
        isAnonymous: input.isAnonymous,
      });

      return { success: true, id: Number(result[0].insertId) };
    }),

  // Toggle like on a post
  toggleLike: authedQuery
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      // Check if already liked
      const existing = await db
        .select()
        .from(likes)
        .where(eq(likes.postId, input.postId))
        .limit(100);

      const myLike = existing.find((l) => l.userId === userId);

      if (myLike) {
        // Unlike
        await db.delete(likes).where(eq(likes.id, myLike.id));
        return { liked: false };
      } else {
        // Like
        await db.insert(likes).values({
          postId: input.postId,
          userId,
        });
        return { liked: true };
      }
    }),
});
