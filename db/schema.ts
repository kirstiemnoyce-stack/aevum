import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  int,
  bigint,
} from "drizzle-orm/mysql-core";

// Core user table (managed by auth system)
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  bio: text("bio"),
  displayName: varchar("displayName", { length: 128 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

// Partner linking for shared relationship insights
export const partnerLinks = mysqlTable("partnerLinks", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  partnerId: bigint("partnerId", { mode: "number", unsigned: true }),
  inviteCode: varchar("inviteCode", { length: 32 }).notNull().unique(),
  status: varchar("status", { length: 32 }).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  acceptedAt: timestamp("acceptedAt"),
});

// Check-ins (emotional state entries)
export const checkIns = mysqlTable("checkIns", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  mood: varchar("mood", { length: 32 }).notNull(),
  intensity: varchar("intensity", { length: 16 }).notNull(),
  note: text("note"),
  shared: boolean("shared").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Social feed posts
export const posts = mysqlTable("posts", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  mood: varchar("mood", { length: 32 }).notNull(),
  content: text("content").notNull(),
  isAnonymous: boolean("isAnonymous").default(false).notNull(),
  likesCount: int("likesCount").default(0).notNull(),
  commentsCount: int("commentsCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

// Post likes
export const likes = mysqlTable("likes", {
  id: serial("id").primaryKey(),
  postId: bigint("postId", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// AI Chat messages
export const chatMessages = mysqlTable("chatMessages", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  role: mysqlEnum("role", ["user", "ai"]).notNull(),
  content: text("content").notNull(),
  feedback: varchar("feedback", { length: 8 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ==================== PSYCHOLOGICAL PROFILE SYSTEM ====================

// User psychological profile - the core assessment result
export const psychProfiles = mysqlTable("psychProfiles", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  
  // Attachment Style (primary)
  attachmentStyle: mysqlEnum("attachmentStyle", [
    "secure", 
    "anxious", 
    "avoidant", 
    "disorganized"
  ]),
  
  // Attachment sub-scores (0-100)
  attachmentAnxiousScore: int("attachmentAnxiousScore"),
  attachmentAvoidantScore: int("attachmentAvoidantScore"),
  
  // Trauma indicators (not diagnosis - awareness flags)
  childhoodEmotionalNeglect: boolean("childhoodEmotionalNeglect").default(false),
  childhoodInvalidation: boolean("childhoodInvalidation").default(false),
  pastAbusiveRelationship: boolean("pastAbusiveRelationship").default(false),
  complexTraumaIndicators: boolean("complexTraumaIndicators").default(false),
  
  // Mental health awareness (not diagnosis)
  adhdIndicators: boolean("adhdIndicators").default(false),
  anxietyIndicators: boolean("anxietyIndicators").default(false),
  depressionIndicators: boolean("depressionIndicators").default(false),
  
  // Personality / coping patterns
  primaryCopingPattern: mysqlEnum("primaryCopingPattern", [
    "withdrawal",      // go quiet, shut down
    "pursuit",         // seek reassurance, push for resolution
    "humor",           // deflect with jokes
    "over_explaining", // explain extensively
    "fixing",          // try to solve immediately
    "freezing",        // become unable to act/decide
  ]),
  
  // Nervous system profile
  windowOfTolerance: mysqlEnum("windowOfTolerance", [
    "wide",      // handles stress well
    "moderate",  // average stress capacity
    "narrow",    // gets flooded easily
  ]),
  
  // Relationship patterns
  proofOfLoveFallacy: boolean("proofOfLoveFallacy").default(false), // believes partner should just "know"
  difficultyWithVulnerability: boolean("difficultyWithVulnerability").default(false),
  hypervigilanceInRelationships: boolean("hypervigilanceInRelationships").default(false),
  
  // Self-awareness level
  selfAwarenessLevel: mysqlEnum("selfAwarenessLevel", [
    "beginner",
    "developing", 
    "practiced",
    "advanced",
  ]).default("beginner"),
  
  // Neurotransmitter tendencies (self-reported patterns)
  serotoninPattern: mysqlEnum("serotoninPattern", [
    "stable",
    "fluctuating",
    "low_baseline",
  ]),
  
  cortisolPattern: mysqlEnum("cortisolPattern", [
    "regulated",
    "elevated",
    "spiky",
  ]),
  
  // Profile summary generated by AI
  profileSummary: text("profileSummary"),
  
  // Assessment completed
  assessmentCompleted: boolean("assessmentCompleted").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

// Individual assessment responses
export const assessmentResponses = mysqlTable("assessmentResponses", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  questionId: varchar("questionId", { length: 64 }).notNull(),
  category: varchar("category", { length: 32 }).notNull(), // attachment, trauma, mental_health, coping, nervous_system
  response: int("response").notNull(), // 1-5 scale
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Compatibility insights between partners
export const compatibilityInsights = mysqlTable("compatibilityInsights", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  partnerId: bigint("partnerId", { mode: "number", unsigned: true }).notNull(),
  
  // Compatibility scores (0-100)
  overallCompatibility: int("overallCompatibility"),
  communicationCompatibility: int("communicationCompatibility"),
  conflictRepairCompatibility: int("conflictRepairCompatibility"),
  emotionalIntimacyCompatibility: int("emotionalIntimacyCompatibility"),
  
  // Dynamic analysis
  dynamicType: varchar("dynamicType", { length: 64 }), // e.g. "anxious-avoidant", "secure-secure"
  
  // AI-generated insights
  strengthsAnalysis: text("strengthsAnalysis"),
  challengesAnalysis: text("challengesAnalysis"),
  growthOpportunities: text("growthOpportunities"),
  
  // Personalized recommendations
  recommendedPractices: text("recommendedPractices"),
  warningSigns: text("warningSigns"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

// Shared language / communication signals between partners
export const sharedLanguageSignals = mysqlTable("sharedLanguageSignals", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  partnerId: bigint("partnerId", { mode: "number", unsigned: true }).notNull(),
  
  signal: varchar("signal", { length: 128 }).notNull(), // e.g. "I'm starting to spiral"
  meaning: varchar("meaning", { length: 256 }).notNull(), // what it means
  responseNeeded: varchar("responseNeeded", { length: 256 }), // how partner should respond
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Notification schedules
export const notificationSchedules = mysqlTable("notificationSchedules", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  type: varchar("type", { length: 64 }).notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type PartnerLink = typeof partnerLinks.$inferSelect;
export type InsertPartnerLink = typeof partnerLinks.$inferInsert;
export type CheckIn = typeof checkIns.$inferSelect;
export type InsertCheckIn = typeof checkIns.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;
export type Like = typeof likes.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type PsychProfile = typeof psychProfiles.$inferSelect;
export type AssessmentResponse = typeof assessmentResponses.$inferSelect;
export type CompatibilityInsight = typeof compatibilityInsights.$inferSelect;
export type SharedLanguageSignal = typeof sharedLanguageSignals.$inferSelect;
export type NotificationSchedule = typeof notificationSchedules.$inferSelect;
