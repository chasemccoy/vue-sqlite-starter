CREATE TABLE `links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_id` integer NOT NULL,
	`target_id` integer NOT NULL,
	`predicate_id` integer NOT NULL,
	`notes` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`source_id`) REFERENCES `records`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`target_id`) REFERENCES `records`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`predicate_id`) REFERENCES `predicates`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `predicates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`role` text,
	`inverse_slug` text,
	`canonical` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`inverse_slug`) REFERENCES `predicates`(`slug`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `predicates_slug_unique` ON `predicates` (`slug`);--> statement-breakpoint
CREATE TABLE `records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`type` text DEFAULT 'artifact' NOT NULL,
	`title` text NOT NULL,
	`url` text,
	`is_curated` integer DEFAULT false NOT NULL,
	`summary` text,
	`content` text,
	`notes` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`content_created_at` text,
	`content_updated_at` text,
	CONSTRAINT "title_not_empty" CHECK("records"."title" != ''),
	CONSTRAINT "slug_not_empty" CHECK("records"."slug" != '')
);
--> statement-breakpoint
CREATE UNIQUE INDEX `records_slug_unique` ON `records` (`slug`);--> statement-breakpoint
CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_id` integer,
	`url` text NOT NULL,
	`alt_text` text,
	`format` text DEFAULT 'application',
	`content_type_string` text DEFAULT 'application/octet-stream' NOT NULL,
	`file_size` integer,
	`width` integer,
	`height` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`record_id`) REFERENCES `records`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `readwise_authors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`origin` text,
	`record_id` integer,
	`deleted_at` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`record_id`) REFERENCES `records`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `readwise_document_tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`document_id` text NOT NULL,
	`tag_id` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`document_id`) REFERENCES `readwise_documents`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `readwise_tags`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `readwise_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`source_url` text,
	`title` text,
	`author` text,
	`author_id` integer,
	`source` text,
	`content` text,
	`html_content` text,
	`category` text,
	`location` text,
	`tags` text,
	`site_name` text,
	`word_count` integer,
	`notes` text,
	`summary` text,
	`image_url` text,
	`parent_id` text,
	`reading_progress` integer,
	`published_date` text,
	`first_opened_at` text,
	`last_opened_at` text,
	`saved_at` text NOT NULL,
	`last_moved_at` text NOT NULL,
	`record_id` integer,
	`deleted_at` text,
	`content_created_at` text,
	`content_updated_at` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `readwise_authors`(`id`) ON UPDATE cascade ON DELETE set null,
	FOREIGN KEY (`parent_id`) REFERENCES `readwise_documents`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`record_id`) REFERENCES `records`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `readwise_tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tag` text NOT NULL,
	`record_id` integer,
	`deleted_at` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`record_id`) REFERENCES `records`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `readwise_tags_tag_unique` ON `readwise_tags` (`tag`);