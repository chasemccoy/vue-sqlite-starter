import { Router } from 'express';
import { fetchTweet } from '@integrations/twitter/fetchTweet';
import type { APIResponse } from '@shared/types/api';

export const twitterRoutes = Router();

// ============================================================================
// GET
// ============================================================================

twitterRoutes.get('/tweet/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const tweet = await fetchTweet(id);
    res.json(tweet);
  } catch (error) {
    next(error);
  }
});

export type FetchTweetAPIResponse = APIResponse<typeof fetchTweet>;
