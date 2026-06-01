import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { chatMessages } from "@db/schema";

// Simple AI response generator
function generateAIResponse(userMessage: string): string {
  const responses: Record<string, string> = {
    "Discuss today's check-ins": "I see you both checked in today. That's a beautiful combination of emotions. Would you like to explore what might be contributing to these feelings?",
    "Explore a conversation topic": "Here's a thought: When did you last tell your partner something you genuinely admire about them? Sharing specific appreciations can deepen your connection.",
    "Get advice on a tension": "I understand tensions can feel overwhelming. A helpful approach is to use 'I feel' statements rather than 'You always' accusations. Would you like to practice reframing a specific situation?",
    "Plan something special": "How about planning a 'no-phone' evening this week? Cook together, play a game, or simply sit and talk. The key is being fully present with each other.",
  };

  return (
    responses[userMessage] ||
    "Thank you for sharing that with me. It sounds like this is something that matters deeply to you. Would you like to explore how you might communicate this feeling to your partner?"
  );
}

export const chatRouter = createRouter({
  // List chat history for current user
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();

    const rows = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, ctx.user.id))
      .orderBy(desc(chatMessages.createdAt))
      .limit(100);

    return rows.reverse();
  }),

  // Send a message and get AI response
  send: authedQuery
    .input(z.object({ content: z.string().min(1).max(2000) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      // Save user message
      await db.insert(chatMessages).values({
        userId,
        role: "user",
        content: input.content,
      });

      // Generate AI response
      const aiContent = generateAIResponse(input.content);

      // Save AI message
      const result = await db.insert(chatMessages).values({
        userId,
        role: "ai",
        content: aiContent,
      });

      return {
        success: true,
        message: {
          id: Number(result[0].insertId),
          role: "ai" as const,
          content: aiContent,
          feedback: null,
          createdAt: new Date(),
        },
      };
    }),

  // Submit feedback on an AI message
  feedback: authedQuery
    .input(
      z.object({
        messageId: z.number(),
        feedback: z.enum(["up", "down"]),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      await db
        .update(chatMessages)
        .set({ feedback: input.feedback })
        .where(eq(chatMessages.id, input.messageId));

      return { success: true };
    }),
});
