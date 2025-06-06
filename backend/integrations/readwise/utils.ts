import { eq, sql } from "drizzle-orm";
import { db } from "../../api/db";
import { readwiseAuthors, readwiseDocuments, type ReadwiseAuthorSelect, type ReadwiseDocumentInsert, type RecordInsert } from "../../db/schema";
import { requireEnv } from "../utils/env";
import { createIntegrationLogger } from "../utils/log";

const API_BASE_URL = 'https://readwise.io/api/v3/list/';
const RETRY_DELAY_BASE = 1000; // 1 second in milliseconds
const READWISE_TOKEN = requireEnv('READWISE_TOKEN');

export const logger = createIntegrationLogger('readwise', 'sync');

/**
 * Retrieves the most recent update time from the database
 *
 * This is used to determine the cutoff point for fetching new documents
 *
 * @returns The date of the most recently updated document, or null if none exists
 */
export async function getMostRecentUpdateTime(): Promise<Date | null> {
  const mostRecent = await db.query.readwiseDocuments.findFirst({
    columns: {
      contentUpdatedAt: true,
    },
    orderBy: {
      contentUpdatedAt: 'desc',
    },
  });

  if (mostRecent) {
    logger.info(
      `Last known readwise date: ${mostRecent.contentUpdatedAt?.toLocaleString() ?? 'none'}`
    );

    return new Date(mostRecent.contentUpdatedAt);
  }

  logger.info('No existing documents found');
  return null;
}

/**
 * Fetches documents from the Readwise API
 *
 * This function handles pagination and rate limiting automatically.
 *
 * @param pageCursor - Optional cursor for pagination
 * @param updatedAfter - Optional date to filter documents updated after this time
 * @returns Promise resolving to the API response with documents
 * @throws Error if the API request fails
 */
export async function fetchReadwiseDocuments(
  pageCursor?: string,
  updatedAfter?: Date
): Promise<ReadwiseArticlesResponse> {
  const params = new URLSearchParams();
  if (pageCursor) params.append('pageCursor', pageCursor);
  if (updatedAfter) {
    const afterDate = new Date(updatedAfter.getTime() + 1);
    params.append('updatedAfter', afterDate.toISOString());
  }
  params.append('withHtmlContent', 'true');

  let attempt = 0;
  while (true) {
    logger.info(`Fetching Readwise documents${pageCursor ? ' (with cursor)' : ''}`);
    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      headers: {
        Authorization: `Token ${READWISE_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return ReadwiseArticlesResponseSchema.parse(data);
    }

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
      logger.warn(`Rate limit hit, waiting ${retryAfter} seconds before retrying...`);
      await new Promise((r) => setTimeout(r, retryAfter * RETRY_DELAY_BASE));
      continue;
    }

    attempt++;
    if (attempt >= 3) {
      throw new Error(
        `Failed to fetch Readwise documents: ${response.statusText} (${response.status})`
      );
    }

    logger.warn(`Request failed with status ${response.status}, retrying...`);
    await new Promise((r) => setTimeout(r, RETRY_DELAY_BASE));
  }
}

/**
 * Maps a Readwise article to a document format for database insertion
 *
 * This function validates URLs and handles null values appropriately.
 *
 * @param article - The Readwise article to map
 * @returns A document object ready for database insertion
 */
export const mapReadwiseArticleToDocument = (article: ReadwiseArticle): ReadwiseDocumentInsert => {
  let validSourceUrl: string | null = null;
  if (article.source_url) {
    try {
      if (/^https?:\/\//.test(article.source_url)) {
        new URL(article.source_url);
        validSourceUrl = article.source_url;
      }
    } catch {
      logger.warn(`Skipping invalid source_url: ${article.source_url}`);
    }
  }

  let validImageUrl: string | null = null;
  if (article.image_url) {
    try {
      if (/^https?:\/\//.test(article.image_url)) {
        new URL(article.image_url);
        validImageUrl = article.image_url;
      }
    } catch {
      logger.warn(`Skipping invalid image_url: ${article.image_url}`);
    }
  }

  return {
    id: article.id,
    parentId: article.parent_id,
    url: article.url,
    title: article.title || null,
    author: article.author || null,
    source: article.source,
    category: article.category,
    location: article.location,
    tags: article.tags,
    siteName: article.site_name || null,
    wordCount: article.word_count,
    summary: article.summary || null,
    content: article.content || null,
    htmlContent: article.html_content || null,
    notes: article.notes || null,
    imageUrl: validImageUrl,
    sourceUrl: validSourceUrl,
    readingProgress: article.reading_progress.toString(),
    firstOpenedAt: article.first_opened_at,
    lastOpenedAt: article.last_opened_at,
    savedAt: article.saved_at,
    lastMovedAt: article.last_moved_at,
    publishedDate: article.published_date
      ? article.published_date.toISOString().split('T')[0]
      : null,
    contentCreatedAt: article.created_at,
    contentUpdatedAt: article.updated_at,
  };
};

/**
 * Sorts documents by their hierarchical relationship
 *
 * This ensures that parent documents are processed before their children.
 *
 * @param documents - The documents to sort
 * @returns Sorted array of documents
 */
export function sortDocumentsByHierarchy(documents: ReadwiseArticle[]): ReadwiseArticle[] {
  // Create a map of id to document for quick lookup
  const idToDocument = new Map(documents.map((doc) => [doc.id, doc]));

  // Helper function to get the ancestry chain for a document
  function getAncestryChain(doc: ReadwiseArticle): string[] {
    const chain: string[] = [];
    let current = doc;
    while (current.parent_id) {
      const parent = idToDocument.get(current.parent_id);
      if (!parent) break;
      chain.push(current.parent_id);
      current = parent;
    }
    return chain;
  }

  // Sort by ancestry chain length (parents first), then by creation date
  return [...documents].sort((a, b) => {
    const aChain = getAncestryChain(a);
    const bChain = getAncestryChain(b);
    if (aChain.length !== bChain.length) {
      return aChain.length - bChain.length;
    }
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
}

/**
 * Creates authors from Readwise documents that don't have associated authors yet
 */
export async function createReadwiseAuthors() {
  logger.start('Creating authors from Readwise documents');

  const documentsWithoutAuthors = await db.query.readwiseDocuments.findMany({
    where: {
      author: {
        isNotNull: true,
      },
      authorId: {
        isNull: true,
      },
    },
  });
  if (documentsWithoutAuthors.length === 0) {
    logger.skip('No documents without authors found');
    return;
  }

  logger.info(`Found ${documentsWithoutAuthors.length} documents without authors`);

  for (const document of documentsWithoutAuthors) {
    if (!document.author) {
      logger.warn(`Document ${document.id} has no author`);
      continue;
    }

    let origin: string | null = null;

    try {
      if (document.sourceUrl) {
        const url = new URL(document.sourceUrl);
        origin = url.origin;
      }
    } catch {
      logger.warn(`Skipping invalid author: ${document.author}`);
      continue;
    }

    const [newRecord] = await db
      .insert(readwiseAuthors)
      .values({
        name: document.author,
        origin,
      })
      .onConflictDoUpdate({
        target: [readwiseAuthors.name, readwiseAuthors.origin],
        set: {
          recordUpdatedAt: sql`CURRENT_TIMESTAMP`,
        },
      })
      .returning();

    if (!newRecord) {
      logger.error(`Failed to create author ${document.author}`);
      continue;
    }

    logger.info(`Linked document ${document.id} to author ${newRecord.id}`);

    await db
      .update(readwiseDocuments)
      .set({ authorId: newRecord.id })
      .where(eq(readwiseDocuments.id, document.id));
  }

  logger.complete(`Processed ${documentsWithoutAuthors.length} documents without authors`);
}

/**
 * Maps a Readwise author to a record
 *
 * @param author - The Readwise author to map
 * @returns A record insert object
 */
export const mapReadwiseAuthorToRecord = (author: ReadwiseAuthorSelect): RecordInsert => {
  return {
    id: author.recordId ?? undefined,
    type: 'entity',
    title: author.name,
    // TODO: add url
    // url: author.origin ? mapUrl(author.origin) : undefined,
    // sources: ['readwise'],
    isCurated: false,
    // isPrivate: false,
    recordCreatedAt: author.recordCreatedAt,
    recordUpdatedAt: author.recordUpdatedAt,
  };
};