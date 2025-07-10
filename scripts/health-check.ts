/* eslint-disable no-console */
import 'dotenv/config';
import Database from 'better-sqlite3';

const DB_PATH = `./${process.env.DATABASE_NAME}.db`;

function checkDatabaseIntegrity(): boolean {
  try {
    const db = new Database(DB_PATH);

    if (!db.open) {
      console.error('❌ Database file is not accessible');
      return false;
    }

    const result = db.prepare('PRAGMA integrity_check;').get() as { integrity_check: string };

    if (result.integrity_check === 'ok') {
      console.log('✅ Database integrity check passed');
      return true;
    } else {
      console.error('⚠️ Warning: Database integrity check failed');
      console.error(`Integrity check result: ${result.integrity_check}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error checking database integrity:', error);
    return false;
  }
}

const success = checkDatabaseIntegrity();
process.exit(success ? 0 : 1);
