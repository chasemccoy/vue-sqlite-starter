/* eslint-disable no-console */

import { fetchTweet } from './fetchTweet';

/**
 * A CLI tool to fetch tweet data from Twitter
 *
 * Usage:
 *   node main.js <tweet_id>
 *
 * Example:
 *   node main.js 1234567890
 *
 * The tweet ID can be found in the URL of a tweet:
 * https://twitter.com/username/status/1234567890
 *                                    ^^^^^^^^^^
 */
async function main() {
  const tweetId = process.argv[2];

  if (!tweetId) {
    console.error('Please provide a tweet ID as a command line argument');
    process.exit(1);
  }

  try {
    const result = await fetchTweet(tweetId);

    if (result.notFound) {
      console.log('Tweet not found');
    } else if (result.tombstone) {
      console.log('Tweet was removed');
    } else if (result.data) {
      console.log(JSON.stringify(result.data, null, 2));
    }
  } catch (error) {
    console.error('Error fetching tweet:', error);
    process.exit(1);
  }
}

main();
