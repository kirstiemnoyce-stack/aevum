import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { psychProfiles, assessmentResponses } from "@db/schema";

// Assessment questions based on neuroscience document
export const assessmentQuestions = [
  // Attachment Style Questions (anxious dimension)
  { id: "att_a1", category: "attachment", text: "I worry that my partner doesn't love me as much as I love them.", anxious: true },
  { id: "att_a2", category: "attachment", text: "I need a lot of reassurance that my partner cares about me.", anxious: true },
  { id: "att_a3", category: "attachment", text: "When my partner is distant, I feel a sense of panic or urgency.", anxious: true },
  { id: "att_a4", category: "attachment", text: "I often check my phone hoping to hear from my partner.", anxious: true },
  { id: "att_a5", category: "attachment", text: "I fear being abandoned or left alone.", anxious: true },
  // Attachment Style Questions (avoidant dimension)
  { id: "att_v1", category: "attachment", text: "I prefer to handle my emotions on my own rather than sharing them.", avoidant: true },
  { id: "att_v2", category: "attachment", text: "When conflicts get intense, I feel an urge to withdraw or leave.", avoidant: true },
  { id: "att_v3", category: "attachment", text: "I value my independence and sometimes feel suffocated in close relationships.", avoidant: true },
  { id: "att_v4", category: "attachment", text: "I find it hard to fully trust others with my vulnerabilities.", avoidant: true },
  { id: "att_v5", category: "attachment", text: "I tend to minimize my needs so I don't appear dependent.", avoidant: true },
  // Trauma indicators
  { id: "trm_1", category: "trauma", text: "In my childhood, my emotional needs were often dismissed or ignored.", trauma: "childhoodInvalidation" },
  { id: "trm_2", category: "trauma", text: "I experienced emotional neglect during my upbringing.", trauma: "childhoodEmotionalNeglect" },
  { id: "trm_3", category: "trauma", text: "I've been in a relationship where I felt controlled, belittled, or unsafe.", trauma: "pastAbusiveRelationship" },
  { id: "trm_4", category: "trauma", text: "I often feel like I'm 'too much' or that my needs are a burden to others.", trauma: "complexTrauma" },
  { id: "trm_5", category: "trauma", text: "I sometimes react to situations with a level of emotion that feels bigger than the moment.", trauma: "complexTrauma" },
  // Mental health awareness
  { id: "mh_1", category: "mental_health", text: "I often struggle to focus or find myself jumping between tasks.", mentalHealth: "adhd" },
  { id: "mh_2", category: "mental_health", text: "I experience racing thoughts that are hard to quiet.", mentalHealth: "anxiety" },
  { id: "mh_3", category: "mental_health", text: "I frequently feel a sense of dread or worry even when things seem fine.", mentalHealth: "anxiety" },
  { id: "mh_4", category: "mental_health", text: "I've lost interest in activities I used to enjoy.", mentalHealth: "depression" },
  { id: "mh_5", category: "mental_health", text: "I feel emotionally numb or disconnected from my feelings at times.", mentalHealth: "depression" },
  // Coping patterns
  { id: "cp_1", category: "coping", text: "When upset, I tend to go quiet and shut down.", pattern: "withdrawal" },
  { id: "cp_2", category: "coping", text: "When upset, I push for immediate resolution and reassurance.", pattern: "pursuit" },
  { id: "cp_3", category: "coping", text: "When upset, I try to make jokes or change the subject.", pattern: "humor" },
  { id: "cp_4", category: "coping", text: "When upset, I explain my perspective in great detail.", pattern: "over_explaining" },
  { id: "cp_5", category: "coping", text: "When upset, I immediately try to fix the problem.", pattern: "fixing" },
  // Nervous system / window of tolerance
  { id: "ns_1", category: "nervous_system", text: "I can stay calm and think clearly during disagreements.", reverse: true },
  { id: "ns_2", category: "nervous_system", text: "My heart races and I feel physically activated during conflicts.", reverse: false },
  { id: "ns_3", category: "nervous_system", text: "I often feel overwhelmed by my partner's emotional intensity.", reverse: false },
  { id: "ns_4", category: "nervous_system", text: "I need time away to calm down after arguments.", reverse: false },
  { id: "ns_5", category: "nervous_system", text: "Small frustrations in my relationship rarely escalate into big fights.", reverse: true },
  // Relationship patterns
  { id: "rp_1", category: "relationship", text: "I believe my partner should intuitively understand my needs without me having to explain.", pattern: "proofOfLove" },
  { id: "rp_2", category: "relationship", text: "I find it difficult to express my deeper, more vulnerable feelings.", pattern: "difficultyVulnerability" },
  { id: "rp_3", category: "relationship", text: "I'm constantly scanning for signs that my partner might be pulling away.", pattern: "hypervigilance" },
  { id: "rp_4", category: "relationship", text: "I can ask for what I need without fear of rejection.", pattern: "secure", reverse: true },
  { id: "rp_5", category: "relationship", text: "I believe conflict is a normal part of relationships and doesn't mean we're failing.", pattern: "secure", reverse: true },
] as const;

// Score interpretation based on neuroscience document
function interpretProfile(scores: {
  anxiousTotal: number;
  avoidantTotal: number;
  traumaFlags: Record<string, boolean>;
  mentalHealthFlags: Record<string, boolean>;
  copingPattern: string;
  nervousSystemScore: number;
  relationshipPatterns: Record<string, number>;
}) {
  const anxiousPercent = Math.min(100, Math.round((scores.anxiousTotal / 25) * 100));
  const avoidantPercent = Math.min(100, Math.round((scores.avoidantTotal / 25) * 100));

  let attachmentStyle: string;
  if (anxiousPercent < 35 && avoidantPercent < 35) {
    attachmentStyle = "secure";
  } else if (anxiousPercent >= avoidantPercent) {
    attachmentStyle = anxiousPercent > 60 && avoidantPercent > 60 ? "disorganized" : "anxious";
  } else {
    attachmentStyle = anxiousPercent > 60 && avoidantPercent > 60 ? "disorganized" : "avoidant";
  }

  let windowOfTolerance: string;
  if (scores.nervousSystemScore >= 8) windowOfTolerance = "wide";
  else if (scores.nervousSystemScore >= 5) windowOfTolerance = "moderate";
  else windowOfTolerance = "narrow";

  let selfAwareness: string;
  const totalFlags = Object.values(scores.traumaFlags).filter(Boolean).length +
    Object.values(scores.mentalHealthFlags).filter(Boolean).length;
  if (totalFlags <= 1) selfAwareness = "advanced";
  else if (totalFlags <= 3) selfAwareness = "practiced";
  else if (totalFlags <= 5) selfAwareness = "developing";
  else selfAwareness = "beginner";

  // Generate profile summary
  const summaries: Record<string, string> = {
    secure: "Your attachment system shows a foundation of earned or developed security. You can navigate conflict without it feeling catastrophic, and you're generally able to ask for your needs to be met without overwhelming fear of rejection.",
    anxious: "Your nervous system learned that love requires vigilance. You likely experienced inconsistent caregiving, and your attachment system hyperactivates when you sense distance. This isn't neediness—it's a protective pattern that once helped you survive.",
    avoidant: "Your nervous system learned that needing others leads to disappointment. You likely experienced emotional unavailability early on and developed self-reliance as protection. Your withdrawal isn't indifference—it's what safety-seeking looks like in your body.",
    disorganized: "Your nervous system carries a fundamental conflict: desperate desire for closeness alongside terror of it. This often develops when caregivers were simultaneously sources of comfort and fear. Relationships may feel like navigating contradictory needs.",
  };

  return {
    attachmentStyle,
    anxiousScore: anxiousPercent,
    avoidantScore: avoidantPercent,
    windowOfTolerance,
    selfAwarenessLevel: selfAwareness,
    summary: summaries[attachmentStyle] || summaries.secure,
  };
}

export const psychRouter = createRouter({
  // Get assessment questions
  questions: authedQuery.query(() => {
    return assessmentQuestions.map((q) => ({
      id: q.id,
      category: q.category,
      text: q.text,
    }));
  }),

  // Submit assessment responses and generate profile
  submitAssessment: authedQuery
    .input(
      z.object({
        responses: z.record(z.string(), z.number().min(1).max(5)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;
      const responses = input.responses;

      // Save individual responses
      for (const [questionId, response] of Object.entries(responses)) {
        const q = assessmentQuestions.find((aq) => aq.id === questionId);
        if (q) {
          await db.insert(assessmentResponses).values({
            userId,
            questionId,
            category: q.category,
            response,
          });
        }
      }

      // Calculate scores
      let anxiousTotal = 0;
      let avoidantTotal = 0;
      const traumaFlags: Record<string, boolean> = {};
      const mentalHealthFlags: Record<string, boolean> = {};
      let nervousSystemScore = 0;
      const patternCounts: Record<string, number> = {};
      const relationshipPatterns: Record<string, number> = {};

      for (const [qid, value] of Object.entries(responses)) {
        const q = assessmentQuestions.find((aq) => aq.id === qid);
        if (!q) continue;

        if (q.category === "attachment") {
          if ("anxious" in q && q.anxious) anxiousTotal += value;
          if ("avoidant" in q && q.avoidant) avoidantTotal += value;
        }
        if (q.category === "trauma" && "trauma" in q) {
          if (value >= 3) traumaFlags[q.trauma as string] = true;
        }
        if (q.category === "mental_health" && "mentalHealth" in q) {
          if (value >= 3) mentalHealthFlags[q.mentalHealth as string] = true;
        }
        if (q.category === "coping" && "pattern" in q) {
          patternCounts[q.pattern as string] = (patternCounts[q.pattern as string] || 0) + value;
        }
        if (q.category === "nervous_system") {
          if ("reverse" in q && q.reverse) {
            nervousSystemScore += (6 - value); // reverse scored
          } else {
            nervousSystemScore += value;
          }
        }
        if (q.category === "relationship") {
          if ("pattern" in q) {
            const score = ("reverse" in q && q.reverse) ? (6 - value) : value;
            relationshipPatterns[q.pattern as string] = (relationshipPatterns[q.pattern as string] || 0) + score;
          }
        }
      }

      // Determine primary coping pattern
      let primaryCoping = "withdrawal";
      let maxScore = 0;
      for (const [pattern, score] of Object.entries(patternCounts)) {
        if (score > maxScore) {
          maxScore = score;
          primaryCoping = pattern;
        }
      }

      const interpretation = interpretProfile({
        anxiousTotal,
        avoidantTotal,
        traumaFlags,
        mentalHealthFlags,
        copingPattern: primaryCoping,
        nervousSystemScore,
        relationshipPatterns,
      });

      // Delete old profile if exists, then save new one
      await db.delete(psychProfiles).where(eq(psychProfiles.userId, userId));
      await db.insert(psychProfiles).values({
        userId,
        attachmentStyle: interpretation.attachmentStyle as "secure" | "anxious" | "avoidant" | "disorganized",
        attachmentAnxiousScore: interpretation.anxiousScore,
        attachmentAvoidantScore: interpretation.avoidantScore,
        childhoodEmotionalNeglect: !!traumaFlags["childhoodEmotionalNeglect"],
        childhoodInvalidation: !!traumaFlags["childhoodInvalidation"],
        pastAbusiveRelationship: !!traumaFlags["pastAbusiveRelationship"],
        complexTraumaIndicators: !!traumaFlags["complexTrauma"],
        adhdIndicators: !!mentalHealthFlags["adhd"],
        anxietyIndicators: !!mentalHealthFlags["anxiety"],
        depressionIndicators: !!mentalHealthFlags["depression"],
        primaryCopingPattern: primaryCoping as "withdrawal" | "pursuit" | "humor" | "over_explaining" | "fixing" | "freezing",
        windowOfTolerance: interpretation.windowOfTolerance as "wide" | "moderate" | "narrow",
        selfAwarenessLevel: interpretation.selfAwarenessLevel as "beginner" | "developing" | "practiced" | "advanced",
        proofOfLoveFallacy: (relationshipPatterns["proofOfLove"] || 0) >= 3,
        difficultyWithVulnerability: (relationshipPatterns["difficultyVulnerability"] || 0) >= 3,
        hypervigilanceInRelationships: (relationshipPatterns["hypervigilance"] || 0) >= 3,
        profileSummary: interpretation.summary,
        assessmentCompleted: true,
      });

      return {
        success: true,
        profile: interpretation,
      };
    }),

  // Get my psychological profile
  myProfile: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const rows = await db
      .select()
      .from(psychProfiles)
      .where(eq(psychProfiles.userId, ctx.user.id))
      .limit(1);
    return rows[0] || null;
  }),

  // Get partner's psychological profile
  partnerProfile: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    // Find partner link
    const { partnerLinks } = await import("@db/schema");
    const linkRows = await db
      .select()
      .from(partnerLinks)
      .where(
        and(
          eq(partnerLinks.status, "accepted"),
          eq(partnerLinks.userId, ctx.user.id),
        ),
      )
      .limit(1);

    if (linkRows.length === 0) return null;

    const partnerId = linkRows[0].partnerId;
    if (!partnerId) return null;

    const rows = await db
      .select()
      .from(psychProfiles)
      .where(eq(psychProfiles.userId, partnerId))
      .limit(1);

    return rows[0] || null;
  }),
});
