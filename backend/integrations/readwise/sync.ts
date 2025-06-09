import type { ReadwiseArticle } from './types';
import { runIntegration } from '@integrations/utils/runIntegration';
import {
	createReadwiseAuthors,
	createReadwiseTags,
	fetchReadwiseDocuments,
	getMostRecentUpdateTime,
	logger,
	mapReadwiseArticleToDocument,
	sortDocumentsByHierarchy,
} from '@integrations/readwise/utils';
import { db } from '@db/index';
import { readwiseDocuments } from '@db/schema';
import { sql } from 'drizzle-orm';
import {
	createRecordsFromReadwiseAuthors,
	createRecordsFromReadwiseDocuments,
	createRecordsFromReadwiseTags,
} from '@integrations/readwise/records';

/**
 * Synchronizes Readwise documents with the database
 *
 * This function:
 * 1. Determines the last sync point
 * 2. Fetches new or updated documents from the API
 * 3. Processes and stores the documents
 * 4. Creates related entities (authors, tags, records)
 *
 * @returns The number of successfully processed documents
 * @throws Error if API requests fail
 */
async function syncReadwiseDocuments(integrationRunId: number): Promise<number> {
	try {
		logger.start('Starting Readwise documents sync');

		// Step 1: Determine last sync point
		const lastUpdateTime = await getMostRecentUpdateTime();

		// Step 2: Fetch all documents
		logger.info('Fetching documents from Readwise API');
		const allDocuments: ReadwiseArticle[] = [];
		let nextPageCursor: string | null = null;

		do {
			const response = await fetchReadwiseDocuments(
				nextPageCursor ?? undefined,
				lastUpdateTime ?? undefined,
			);
			allDocuments.push(...response.results);
			nextPageCursor = response.nextPageCursor;

			logger.info(`Retrieved ${response.results.length} documents (total: ${allDocuments.length})`);
		} while (nextPageCursor);

		// Step 3: Process documents
		let successCount = 0;
		if (allDocuments.length > 0) {
			logger.info(`Processing ${allDocuments.length} documents`);

			// Sort documents to ensure parents are processed before children
			const sortedDocuments = sortDocumentsByHierarchy(allDocuments);

			// Process each document
			for (const doc of sortedDocuments) {
				try {
					// Map and insert the document
					const documentToInsert = mapReadwiseArticleToDocument(doc, integrationRunId);
					await db
						.insert(readwiseDocuments)
						.values(documentToInsert)
						.onConflictDoUpdate({
							target: readwiseDocuments.id,
							set: { ...documentToInsert, recordUpdatedAt: sql`(CURRENT_TIMESTAMP)` },
						});

					successCount++;

					// Log progress periodically
					if (successCount % 20 === 0) {
						logger.info(`Processed ${successCount} of ${sortedDocuments.length} documents`);
					}
				} catch (error) {
					logger.error('Error processing document', {
						documentId: doc.id,
						error: error instanceof Error ? error.message : String(error),
					});
				}
			}

			// Step 4: Create related entities
			logger.info('Creating related entities');
			await createReadwiseAuthors();
			await createReadwiseTags(integrationRunId);
			await createRecordsFromReadwiseAuthors();
			await createRecordsFromReadwiseTags();
			await createRecordsFromReadwiseDocuments();
		}

		logger.complete('Processed documents', successCount);
		return successCount;
	} catch (error) {
		logger.error('Error syncing Readwise documents', error);
		throw error;
	}
}

/**
 * Main execution function when run as a standalone script
 */
const main = async (): Promise<void> => {
	try {
		logger.start('=== STARTING READWISE SYNC ===');
		await runIntegration('readwise', syncReadwiseDocuments);
		logger.complete('=== READWISE SYNC COMPLETED ===');
		logger.info('-'.repeat(50));
		process.exit(0);
	} catch (error) {
		logger.error('Error in Readwise sync main function', error);
		logger.error('=== READWISE SYNC FAILED ===');
		logger.info('-'.repeat(50));
		process.exit(1);
	}
};

// Execute main function if this file is run directly
if (import.meta.url === import.meta.resolve('./sync.ts')) {
	main();
}
