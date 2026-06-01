CREATE TABLE `assessmentResponses` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`questionId` varchar(64) NOT NULL,
	`category` varchar(32) NOT NULL,
	`response` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assessmentResponses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatMessages` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`role` enum('user','ai') NOT NULL,
	`content` text NOT NULL,
	`feedback` varchar(8),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `checkIns` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`mood` varchar(32) NOT NULL,
	`intensity` varchar(16) NOT NULL,
	`note` text,
	`shared` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `checkIns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `compatibilityInsights` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`partnerId` bigint unsigned NOT NULL,
	`overallCompatibility` int,
	`communicationCompatibility` int,
	`conflictRepairCompatibility` int,
	`emotionalIntimacyCompatibility` int,
	`dynamicType` varchar(64),
	`strengthsAnalysis` text,
	`challengesAnalysis` text,
	`growthOpportunities` text,
	`recommendedPractices` text,
	`warningSigns` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `compatibilityInsights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`postId` bigint unsigned NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notificationSchedules` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`type` varchar(64) NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notificationSchedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partnerLinks` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`partnerId` bigint unsigned,
	`inviteCode` varchar(32) NOT NULL,
	`status` varchar(32) NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`acceptedAt` timestamp,
	CONSTRAINT `partnerLinks_id` PRIMARY KEY(`id`),
	CONSTRAINT `partnerLinks_inviteCode_unique` UNIQUE(`inviteCode`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`mood` varchar(32) NOT NULL,
	`content` text NOT NULL,
	`isAnonymous` boolean NOT NULL DEFAULT false,
	`likesCount` int NOT NULL DEFAULT 0,
	`commentsCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `psychProfiles` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`attachmentStyle` enum('secure','anxious','avoidant','disorganized'),
	`attachmentAnxiousScore` int,
	`attachmentAvoidantScore` int,
	`childhoodEmotionalNeglect` boolean DEFAULT false,
	`childhoodInvalidation` boolean DEFAULT false,
	`pastAbusiveRelationship` boolean DEFAULT false,
	`complexTraumaIndicators` boolean DEFAULT false,
	`adhdIndicators` boolean DEFAULT false,
	`anxietyIndicators` boolean DEFAULT false,
	`depressionIndicators` boolean DEFAULT false,
	`primaryCopingPattern` enum('withdrawal','pursuit','humor','over_explaining','fixing','freezing'),
	`windowOfTolerance` enum('wide','moderate','narrow'),
	`proofOfLoveFallacy` boolean DEFAULT false,
	`difficultyWithVulnerability` boolean DEFAULT false,
	`hypervigilanceInRelationships` boolean DEFAULT false,
	`selfAwarenessLevel` enum('beginner','developing','practiced','advanced') DEFAULT 'beginner',
	`serotoninPattern` enum('stable','fluctuating','low_baseline'),
	`cortisolPattern` enum('regulated','elevated','spiky'),
	`profileSummary` text,
	`assessmentCompleted` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `psychProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sharedLanguageSignals` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`partnerId` bigint unsigned NOT NULL,
	`signal` varchar(128) NOT NULL,
	`meaning` varchar(256) NOT NULL,
	`responseNeeded` varchar(256),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sharedLanguageSignals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`unionId` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(320),
	`avatar` text,
	`bio` text,
	`displayName` varchar(128),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	`lastSignInAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_unionId_unique` UNIQUE(`unionId`)
);
