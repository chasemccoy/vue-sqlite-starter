<template>
  <Head>
    <title>New record | Enchiridion</title>
  </Head>

  <div class="AddRecordView">
    <AddRecordForm
      v-model="record"
      @save="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import AddRecordForm from '@app/components/AddRecordForm.vue';
import useApiClient from '@app/composables/useApiClient';
import useRecord from '@app/composables/useRecord';
import type { LinkInsert, RecordInsert } from '@db/schema';
import { Head } from '@unhead/vue/components';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { FetchTweetAPIResponse } from '@api/twitter';
import { formatDateToDbString } from '@shared/lib/formatting';
import { getImagesFromTweet } from '@app/utils';

export type PartialLinkInsert = Omit<LinkInsert, 'sourceId'>;

export type NewRecordData = {
  record: RecordInsert;
  links?: PartialLinkInsert[];
  files?: File[];
};

const router = useRouter();
const route = useRoute();
const { fetch } = useApiClient();

const emptyRecord: RecordInsert = {
  type: 'artifact',
  title: '',
  slug: '',
  source: 'manual',
};

const record = ref<RecordInsert>(emptyRecord);

const { upsertRecord } = useRecord();
const { mutate: upsertRecordMutation } = upsertRecord();

function handleSubmit(data: NewRecordData) {
  const { record } = data;

  upsertRecordMutation(record, {
    onSuccess: () => {
      router.push(`/${record.slug}`);
    },
    onError: () => {
      // TODO: Fire toast
    },
  });
}

onMounted(async () => {
  const query = route.query;

  const populatedRecord = { ...emptyRecord };

  if (query.tweet && typeof query.tweet === 'string') {
    const tweet = query.tweet;
    const tweetId = tweet.match(/\/status\/(\d+)/)?.[1];

    populatedRecord.source = 'twitter';
    populatedRecord.url = tweet;

    const {
      data: tweetDetails,
      notFound,
      tombstone,
    } = await fetch<FetchTweetAPIResponse>(`/tweet/${tweetId}`);

    if (notFound || tombstone || !tweetDetails) return;

    const createdAt = new Date(tweetDetails.created_at);

    populatedRecord.content = tweetDetails.text;
    populatedRecord.url = tweetDetails.url;
    populatedRecord.title = `Tweet by ${tweetDetails.user.name} (@${tweetDetails.user.screen_name})`;
    populatedRecord.contentCreatedAt = formatDateToDbString(createdAt);

    const images = await getImagesFromTweet(tweetDetails);

    console.log(images);
  }

  if (query.type && typeof query.type === 'string') {
    if (['entity', 'concept', 'artifact'].includes(query.type)) {
      populatedRecord.type = query.type as 'entity' | 'concept' | 'artifact';
    }
  }

  if (query.title && typeof query.title === 'string') {
    populatedRecord.title = query.title;
  }

  if (query.url && typeof query.url === 'string') {
    populatedRecord.url = query.url;
  }

  if (query.summary && typeof query.summary === 'string') {
    populatedRecord.summary = query.summary;
  }

  if (query.content && typeof query.content === 'string') {
    populatedRecord.content = query.content;
  }

  if (query.notes && typeof query.notes === 'string') {
    populatedRecord.notes = query.notes;
  }

  record.value = populatedRecord;
});
</script>

<style scoped>
.AddRecordView {
  background-color: var(--ui-bg);
  padding: 32px 40px 32px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--ui-border);
  width: 100%;
  max-width: 40em;
  margin: auto;
}
</style>
