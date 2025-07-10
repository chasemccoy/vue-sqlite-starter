#!/usr/bin/env tsx

/* eslint-disable no-console */

import 'dotenv/config';
import { createBackup } from './sqlite-diffable';

const DATABASE_PATH = `./${process.env.DATABASE_NAME}.db`;
const BACKUP_DIR = './backup';

async function main() {
  const args = process.argv.slice(2);

  let excludeTables: string[] = [];
  let includePragma = true;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--exclude':
      case '-e':
        excludeTables = args[++i]?.split(',') || [];
        break;
      case '--no-pragma':
        includePragma = false;
        break;
      case '--help':
      case '-h':
        printUsage();
        process.exit(0);
      /* eslint-disable-next-line no-fallthrough */
      default:
        console.error(`Unknown option: ${args[i]}`);
        printUsage();
        process.exit(1);
    }
  }

  try {
    console.log('🗄️  Starting database backup...');
    console.log(`📁 Database: ${DATABASE_PATH}`);
    console.log(`📁 Output: ${BACKUP_DIR}`);

    if (excludeTables.length > 0) {
      console.log(`🚫 Excluding tables: ${excludeTables.join(', ')}`);
    }

    // Create the backup
    const result = await createBackup(DATABASE_PATH, BACKUP_DIR, {
      excludeTables,
      includePragma,
      includeSchema: true,
    });

    // Report results
    console.log('\n✅ Backup completed successfully!');
    console.log(`📊 Tables backed up: ${result.tables.length}`);
    console.log(`📈 Total rows: ${result.totalRows.toLocaleString()}`);
    console.log(`⏰ Timestamp: ${result.timestamp}`);
    console.log(`📁 Location: ${result.outputDir}`);

    // List backed up tables
    console.log('\n📋 Backed up tables:');
    result.tables.forEach((table) => {
      console.log(`   • ${table}`);
    });

    // Get backup size
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      const { stdout } = await execAsync(`du -sh "${BACKUP_DIR}"`);
      const size = stdout.split('\t')[0];
      console.log(`💾 Backup size: ${size}`);
    } catch {
      // Size calculation failed, but backup succeeded
    }

    console.log('\n📖 Usage:');
    console.log(`   Restore: npm run db:restore -- "${BACKUP_DIR}"`);
    console.log(`   Compare: npm run db:compare -- "${BACKUP_DIR}" "other-backup"`);
  } catch (error) {
    console.error('\n❌ Backup failed:', error);
    process.exit(1);
  }
}

function printUsage() {
  console.log(`
Usage: npm run db:backup [options]

Options:
  -e, --exclude <tables>      Comma-separated list of tables to exclude
  --no-pragma                 Skip database pragma information
  -h, --help                  Show this help message

Examples:
  npm run db:backup
  npm run db:backup -- --exclude "temp_data,cache_table"
  npm run db:backup -- --no-pragma

The backup will be created in ./backup/ and will overwrite any existing backup.
`);
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main();
