import type { RecordInsert } from '@db/schema';
import type { EnrichedTweet } from '@integrations/twitter/utils';
import { formatDateToDbString } from '@shared/lib/formatting';

export const mapTweetToRecord = (tweet: EnrichedTweet): RecordInsert => {
  const record: RecordInsert = {
    type: 'artifact',
    title: '',
    slug: '',
    source: 'twitter',
    url: tweet.url,
  };

  const createdAt = new Date(tweet.created_at);
  const quotedTweet = tweet.quoted_tweet;

  record.content = tweet.text;

  if (tweet.quoted_tweet) {
    record.content = `${tweet.text}\n\nQuoting ${tweet.quoted_tweet.user.name}:\n\n${tweet.quoted_tweet.text}`;
  }

  record.url = tweet.url;
  record.title = `Tweet by ${tweet.user.name} (@${tweet.user.screen_name})`;

  if (quotedTweet) {
    record.title = `Tweet by ${tweet.user.name} (@${tweet.user.screen_name}) quoting ${quotedTweet.user.name} (@${quotedTweet.user.screen_name})`;
  }

  record.contentCreatedAt = formatDateToDbString(createdAt);

  const entities = tweet.entities;
  const urls = [];

  if (entities && entities.length > 0) {
    for (const entity of entities) {
      if (entity.type === 'url') {
        urls.push(entity.expanded_url);
      }
    }
  }

  record.notes = urls.join('\n');

  return record;
};
