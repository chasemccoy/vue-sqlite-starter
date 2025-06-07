import { requireEnv } from '../utils/env';
import { logger } from './utils';

const API_BASE_URL = 'https://readwise.io/api/v3/list/';
const READWISE_TOKEN = requireEnv('READWISE_TOKEN');

/**
 * Main execution function when run as a standalone script
 */
const main = async (): Promise<void> => {
	try {
		logger.start('=== STARTING READWISE SYNC ===');
		// await runIntegration('readwise', syncReadwiseDocuments);
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

// export { syncReadwiseDocuments };
