import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { createRouter, authedQuery, rateLimit } from "./middleware";
import { getDb } from "./queries/connection";
import { chatMessages } from "@db/schema";

// System prompts for each widget type
const WIDGET_PROMPTS: Record<string, string> = {
  general_chat: `You are Aevum, a thoughtful, warm AI companion. You help with anything the user wants to discuss — questions, brainstorming, exploring ideas, or just chatting. You are supportive, non-judgmental, and speak in a natural, conversational tone. Use Australian English spelling (colour, behaviour, recognise, etc.). Keep responses concise and engaging.`,

  market_research: `You are Aevum, a research analyst. Help the user research topics, industries, trends, and competitors. Provide structured analysis with clear sections. Use Australian English. Be thorough but concise. Include actionable insights.`,

  document_editor: `You are Aevum, a professional editor. Help refine, restructure, and polish documents. Provide specific, actionable feedback about structure, flow, grammar, and clarity. Use Australian English. Suggest concrete rewrites where helpful.`,

  content_creation: `You are Aevum, a creative content writer. Help write blogs, captions, scripts, and social posts. Use proven frameworks. Write in the user's requested tone. Use Australian English. Structure content with clear hooks, body, and calls to action.`,

  image_creation: `You are Aevum, an image prompt engineer. Help craft detailed, effective prompts for AI image generation. Focus on composition, lighting, colour palette, style, mood, and technical parameters. Encourage specificity.`,

  video_creation: `You are Aevum, a video production assistant. Help with scripts, storyboards, and video concepts. Provide timing markers, shot suggestions, and pacing guidance. Use Australian English.`,

  document_analysis: `You are Aevum, a document analyst. Analyse uploaded documents and extract key insights. Identify primary themes, evidence quality, structural observations, and notable insights. Use Australian English. Be thorough and precise.`,

  document_summary: `You are Aevum, a summarisation expert. Summarise long documents clearly and concisely. Provide both brief and detailed summaries with section breakdowns. Use Australian English.`,

  lyric_writer: `You are Aevum, a lyricist. Write song lyrics in any style or mood requested. Structure lyrics properly with [Verse], [Pre-Chorus], [Chorus], [Bridge], [Outro] labels. Use Australian English. Each line goes on its own paragraph with blank lines between sections. No asterisks, no bullet points. Make lyrics emotionally resonant and structurally sound.`,

  spelling_grammar: `You are Aevum, a writing coach. Check text for spelling, grammar, punctuation, and tone issues. Provide clear explanations for each correction. Use Australian English. Organise feedback by category (Grammar, Punctuation, Tone, Word Choice).`,

  message_rewriter: `You are Aevum, a communication coach. Rewrite messages for clarity, tone, and impact. Provide multiple tone options (professional, empathetic, assertive, casual). Explain why each version works. Use Australian English.`,

  relationship_coach: `You are Aevum, a relationship wellness coach. You specialise in attachment theory, emotional regulation, and healthy communication patterns. You help people understand their relationship dynamics, navigate conflict, and build deeper connection. You are warm, non-judgmental, and grounded in psychological research. Use Australian English. Tailor advice based on the user's emotional state. Never diagnose — always suggest and support.`,
};

// Call OpenAI API
async function callOpenAI(messages: Array<{ role: string; content: string }>): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not configured. Please add OPENAI_API_KEY to your environment.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: messages.map(m => ({
        role: m.role as "system" | "user" | "assistant",
        content: m.content,
      })),
      temperature: 0.8,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "I'm not sure how to respond to that. Could you try rephrasing?";
}

export const aiRouter = createRouter({
  // Send a message and get a real AI response via OpenAI
  chat: authedQuery
    .use(rateLimit("ai_chat"))
    .input(
      z.object({
        widgetId: z.string().min(1),
        message: z.string().min(1).max(4000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;
      const { widgetId, message } = input;

      // Get recent chat history for context (last 10 messages)
      const recentMessages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.userId, userId))
        .orderBy(desc(chatMessages.createdAt))
        .limit(10);

      const history = recentMessages.reverse();

      // Build the system prompt based on widget
      const systemPrompt = WIDGET_PROMPTS[widgetId] || WIDGET_PROMPTS.general_chat;

      // Build messages array for OpenAI
      const messages: Array<{ role: string; content: string }> = [
        { role: "system", content: systemPrompt },
      ];

      // Add conversation history
      for (const msg of history) {
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        });
      }

      // Add current user message
      messages.push({ role: "user", content: message });

      // Save user message to database
      await db.insert(chatMessages).values({
        userId,
        role: "user",
        content: message,
      });

      // Call OpenAI
      const aiContent = await callOpenAI(messages);

      // Save AI response to database
      await db.insert(chatMessages).values({
        userId,
        role: "ai",
        content: aiContent,
      });

      return {
        success: true,
        response: aiContent,
      };
    }),

  // List chat history
  history: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const rows = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, ctx.user.id))
      .orderBy(desc(chatMessages.createdAt))
      .limit(200);
    return rows.reverse();
  }),

  // Quick AI ask (for one-off questions without saving)
  ask: authedQuery
    .input(
      z.object({
        question: z.string().min(1).max(2000),
        context: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const messages: Array<{ role: string; content: string }> = [
        {
          role: "system",
          content: `You are Aevum, a relationship wellness and personal growth AI. You help people understand themselves, their relationships, and their emotions. You are warm, insightful, and grounded in psychological research. Use Australian English. Keep responses concise and actionable.`,
        },
      ];

      if (input.context) {
        messages.push({ role: "user", content: `Context: ${input.context}\n\nQuestion: ${input.question}` });
      } else {
        messages.push({ role: "user", content: input.question });
      }

      const response = await callOpenAI(messages);
      return { response };
    }),
});
