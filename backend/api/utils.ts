import path from 'path';
import { UPLOADS_DIR } from '@shared/lib';
import trash from 'trash';

export async function deleteMediaFile(url: string) {
  const filePath = path.join(UPLOADS_DIR, url.replace('/uploads/', ''));

  try {
    await trash(filePath);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error deleting file from filesystem:', error);
  }
}
