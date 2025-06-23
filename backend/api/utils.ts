import path from 'path';
import fs from 'fs/promises';
import { UPLOADS_DIR } from '@shared/lib';

export async function deleteMediaFile(url: string) {
  const filePath = path.join(UPLOADS_DIR, url.replace('/uploads/', ''));

  try {
    await fs.unlink(filePath);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error deleting file from filesystem:', error);
  }
}
