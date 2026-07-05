import { z } from "zod";
import { createRouter, authedQuery, rateLimit } from "./middleware";

// Server-side image generation using OpenAI DALL-E
async function generateWithOpenAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not configured.");
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI image error: ${response.status}`);
  }

  const data = await response.json();
  return data.data[0]?.url;
}

export const imageRouter = createRouter({
  // Generate an image from a text prompt (server-side, uses app owner's API key)
  generate: authedQuery
    .use(rateLimit("image_generate"))
    .input(
      z.object({
        prompt: z.string().min(1).max(1000),
        size: z.enum(["1024x1024", "1024x1792", "1792x1024"]).default("1024x1024"),
      }),
    )
    .mutation(async ({ input }) => {
      const imageUrl = await generateWithOpenAI(input.prompt);
      return {
        success: true,
        imageUrl,
        prompt: input.prompt,
        provider: "openai" as const,
        model: "dall-e-3" as const,
      };
    }),

  // Generate an image using the user's own API key (if they prefer)
  generateWithKey: authedQuery
    .input(
      z.object({
        prompt: z.string().min(1).max(1000),
        apiKey: z.string().min(10),
        provider: z.enum(["openai", "stability", "replicate"]).default("openai"),
      }),
    )
    .mutation(async ({ input }) => {
      const { prompt, apiKey, provider } = input;

      if (provider === "openai") {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
            response_format: "url",
          }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error?.message || `OpenAI error: ${response.status}`);
        }

        const data = await response.json();
        return {
          success: true,
          imageUrl: data.data[0]?.url,
          prompt,
          provider: "openai" as const,
          model: "dall-e-3" as const,
        };
      }

      if (provider === "stability") {
        const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/sd3", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Accept": "image/*",
          },
          body: new URLSearchParams({
            prompt,
            output_format: "png",
            aspect_ratio: "1:1",
          }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.message || `Stability error: ${response.status}`);
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        return {
          success: true,
          imageUrl,
          prompt,
          provider: "stability" as const,
          model: "sd3" as const,
        };
      }

      // Replicate
      const startResponse = await fetch(
        "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${apiKey}`,
            "Prefer": "wait",
          },
          body: JSON.stringify({
            input: {
              prompt,
              aspect_ratio: "1:1",
              output_format: "png",
              output_quality: 80,
            },
          }),
        },
      );

      if (!startResponse.ok) {
        const err = await startResponse.json().catch(() => ({}));
        throw new Error(err.detail || `Replicate error: ${startResponse.status}`);
      }

      const prediction = await startResponse.json();
      const output = prediction.output;
      const imageUrl = Array.isArray(output) ? output[0] : output;

      return {
        success: true,
        imageUrl,
        prompt,
        provider: "replicate" as const,
        model: "flux-schnell" as const,
      };
    }),
});
