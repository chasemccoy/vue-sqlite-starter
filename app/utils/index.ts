import type { EnrichedTweet } from '@integrations/twitter/utils';
import type { RecordType } from '@shared/types';

export function getIconForRecordType(type: RecordType) {
  switch (type) {
    case 'artifact':
      return 'i-lucide-box';
    case 'concept':
      return 'i-lucide-brain';
    case 'entity':
      return 'i-lucide-users';
  }
}

export function getOriginOfUrl(urlString: string) {
  const url = new URL(urlString);
  return url.hostname.replace('www.', '');
}

const fetchImage = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], url, { type: blob.type });
  return file;
};

export async function getImagesFromTweet(tweet: EnrichedTweet) {
  const mediaDetails = tweet.mediaDetails;
  const images = [];

  if (!mediaDetails || mediaDetails.length === 0) return [];

  for (const mediaDetail of mediaDetails) {
    if (mediaDetail.type === 'photo' && mediaDetail.media_url_https) {
      const file = await fetchImage(mediaDetail.media_url_https);
      images.push(file);
    }
  }

  return images;
}
