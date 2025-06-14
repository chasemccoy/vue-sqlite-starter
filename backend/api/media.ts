import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import crypto from 'crypto';
import { insertMedia, getMedia, deleteMedia } from '@db/queries/media';
import {
	IdParamSchema,
	IdSchema,
	SUPPORTED_IMAGE_TYPES,
	SUPPORTED_MEDIA_TYPES,
	SUPPORTED_PDF_TYPES,
	SUPPORTED_VIDEO_TYPES,
} from '@shared/types/api';
import { z } from 'zod/v4';

export const mediaRoutes = Router();

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const MediaUploadSchema = z.object({
	recordId: IdSchema.optional(),
	altText: z.string().optional(),
});

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const IMAGES_DIR = path.join(UPLOADS_DIR, 'images');
const VIDEOS_DIR = path.join(UPLOADS_DIR, 'videos');
const PDFS_DIR = path.join(UPLOADS_DIR, 'pdfs');

// Ensure upload directories exist
async function ensureUploadDirs() {
	for (const dir of [UPLOADS_DIR, IMAGES_DIR, VIDEOS_DIR, PDFS_DIR]) {
		try {
			await fs.access(dir);
		} catch {
			await fs.mkdir(dir, { recursive: true });
		}
	}
}

// Initialize upload directories
ensureUploadDirs().catch((error) => {
	// eslint-disable-next-line no-console
	console.error('Error creating upload directories:', error);
});

const storage = multer.memoryStorage();

const upload = multer({
	storage,
	limits: {
		fileSize: MAX_FILE_SIZE,
	},
	fileFilter: (_req, file, cb) => {
		if (SUPPORTED_MEDIA_TYPES.includes(file.mimetype as (typeof SUPPORTED_MEDIA_TYPES)[number])) {
			cb(null, true);
		} else {
			cb(new Error(`Unsupported file type: ${file.mimetype}`));
		}
	},
});

function getMediaDirectory(contentType: string): string {
	if (SUPPORTED_IMAGE_TYPES.includes(contentType as (typeof SUPPORTED_IMAGE_TYPES)[number])) {
		return IMAGES_DIR;
	} else if (
		SUPPORTED_VIDEO_TYPES.includes(contentType as (typeof SUPPORTED_VIDEO_TYPES)[number])
	) {
		return VIDEOS_DIR;
	} else if (SUPPORTED_PDF_TYPES.includes(contentType as (typeof SUPPORTED_PDF_TYPES)[number])) {
		return PDFS_DIR;
	}
	return UPLOADS_DIR;
}

function getMediaType(contentType: string): string {
	if (SUPPORTED_IMAGE_TYPES.includes(contentType as (typeof SUPPORTED_IMAGE_TYPES)[number])) {
		return 'image';
	} else if (
		SUPPORTED_VIDEO_TYPES.includes(contentType as (typeof SUPPORTED_VIDEO_TYPES)[number])
	) {
		return 'video';
	} else if (SUPPORTED_PDF_TYPES.includes(contentType as (typeof SUPPORTED_PDF_TYPES)[number])) {
		return 'application';
	}
	return 'application';
}

function getFileExtension(contentType: string): string {
	const extensions: Record<string, string> = {
		'image/jpeg': '.jpg',
		'image/png': '.png',
		'image/gif': '.gif',
		'image/webp': '.webp',
		'video/mp4': '.mp4',
		'video/quicktime': '.mov',
		'video/x-msvideo': '.avi',
		'application/pdf': '.pdf',
	};
	return extensions[contentType] || '';
}

async function getImageDimensions(
	buffer: Buffer,
	contentType: string,
): Promise<{ width?: number; height?: number }> {
	if (SUPPORTED_IMAGE_TYPES.includes(contentType as (typeof SUPPORTED_IMAGE_TYPES)[number])) {
		try {
			const metadata = await sharp(buffer).metadata();
			return {
				width: metadata.width,
				height: metadata.height,
			};
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('Error getting image dimensions:', error);
		}
	}
	return {};
}

// ============================================================================
// Routes
// ============================================================================

// POST /media - Upload new media file
mediaRoutes.post('/media', upload.single('file'), async (req, res, next) => {
	try {
		if (!req.file) {
			throw new Error('No file provided');
		}

		const uploadData = MediaUploadSchema.parse(req.body);

		// Generate unique filename
		const fileId = crypto.randomUUID();
		const extension = getFileExtension(req.file.mimetype);
		const filename = `${fileId}${extension}`;

		// Determine storage directory and type
		const mediaDir = getMediaDirectory(req.file.mimetype);
		const filePath = path.join(mediaDir, filename);
		const mediaType = getMediaType(req.file.mimetype);

		// Get image dimensions if applicable
		const dimensions = await getImageDimensions(req.file.buffer, req.file.mimetype);

		// Save file to filesystem
		await fs.writeFile(filePath, req.file.buffer);

		// Create relative URL for database storage
		const relativePath = path.relative(UPLOADS_DIR, filePath);
		const url = `/uploads/${relativePath.replace(/\\/g, '/')}`;

		// Insert media record
		const mediaRecord = await insertMedia({
			recordId: uploadData.recordId || null,
			url,
			altText: uploadData.altText || null,
			type: mediaType,
			contentTypeString: req.file.mimetype,
			fileSize: req.file.size,
			width: dimensions.width || null,
			height: dimensions.height || null,
		});

		res.status(201).json(mediaRecord);
	} catch (error) {
		next(error);
	}
});

// GET /media/:id - Get media metadata
mediaRoutes.get('/media/:id', async (req, res, next) => {
	try {
		const { id } = IdParamSchema.parse(req.params);
		const media = await getMedia(id);

		if (!media) {
			throw new Error('Media not found');
		}

		res.json(media);
	} catch (error) {
		next(error);
	}
});

// GET /media/:id/file - Serve actual file
// mediaRoutes.get('/media/:id/file', async (req, res, next) => {
// 	try {
// 		const { id } = IdParamSchema.parse(req.params);
// 		const media = await getMedia(id);

// 		if (!media) {
// 			throw new Error('Media not found');
// 		}

// 		const filePath = path.join(UPLOADS_DIR, media.url.replace('/uploads/', ''));

// 		if (!existsSync(filePath)) {
// 			throw new Error('File not found on filesystem');
// 		}

// 		res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache

// 		if (media.fileSize) {
// 			res.setHeader('Content-Length', media.fileSize);
// 		}

// 		// Handle range requests for video streaming
// 		const range = req.headers.range;
// 		if (range && media.fileSize) {
// 			const parts = range.replace(/bytes=/, '').split('-');
// 			const start = parseInt(parts[0], 10);
// 			const end = parts[1] ? parseInt(parts[1], 10) : media.fileSize - 1;
// 			const chunksize = end - start + 1;

// 			res.status(206);
// 			res.setHeader('Content-Range', `bytes ${start}-${end}/${media.fileSize}`);
// 			res.setHeader('Accept-Ranges', 'bytes');
// 			res.setHeader('Content-Length', chunksize);

// 			const stream = createReadStream(filePath, { start, end });
// 			stream.pipe(res);
// 		} else {
// 			// Serve full file
// 			const stream = createReadStream(filePath);
// 			stream.pipe(res);
// 		}
// 	} catch (error) {
// 		next(error);
// 	}
// });

// GET /media/record/:recordId - Get all media for a record
// mediaRoutes.get('/media/record/:recordId', async (req, res, next) => {
// 	try {
// 		const { recordId } = req.params;
// 		const recordIdNum = parseInt(recordId, 10);

// 		if (isNaN(recordIdNum)) {
// 			throw new Error('Invalid record ID');
// 		}

// 		const mediaList = await getMediaByRecordId(recordIdNum);
// 		res.json(mediaList);
// 	} catch (error) {
// 		next(error);
// 	}
// });

// DELETE /media/:id - Delete media file
mediaRoutes.delete('/media/:id', async (req, res, next) => {
	try {
		const { id } = IdParamSchema.parse(req.params);
		const media = await getMedia(id);

		if (!media) {
			throw new Error('Media not found');
		}

		// Delete file from filesystem
		const filePath = path.join(UPLOADS_DIR, media.url.replace('/uploads/', ''));
		try {
			await fs.unlink(filePath);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('Error deleting file from filesystem:', error);
			// Continue with database deletion even if file deletion fails
		}

		const deleted = await deleteMedia(id);

		if (!deleted) {
			throw new Error('Media not found');
		}

		res.json(deleted);
	} catch (error) {
		next(error);
	}
});

// PATCH /media/:id - Update media metadata
// mediaRoutes.patch('/media/:id', async (req, res, next) => {
// 	try {
// 		const { id } = IdParamSchema.parse(req.params);
// 		const updateData = MediaUploadSchema.parse(req.body);

// 		const updated = await updateMedia(id, updateData);

// 		if (!updated) {
// 			throw new Error('Media not found');
// 		}

// 		res.json(updated);
// 	} catch (error) {
// 		next(error);
// 	}
// });
