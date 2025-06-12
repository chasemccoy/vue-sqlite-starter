import { listRecords } from '@db/queries/records';
import { Router } from 'express';

export const searchRoutes = Router();

// ============================================================================
// GET
// ============================================================================

searchRoutes.get('/search', async (req, res, next) => {
	try {
		const { q } = req.query;
		const results = await listRecords({ filters: { text: q as string } });
		res.json(results);
	} catch (error) {
		next(error);
	}
});
