<template>
  <div v-if="isError">Error: {{ error }}</div>

  <Head>
    <title v-if="record?.title">{{ record.title }} | Enchiridion</title>
  </Head>

  <RecordDetail
    v-if="record"
    :modelValue="record"
    :links="links"
    @fileUpload="handleFileUpload"
    @fileDelete="handleMediaDelete"
    @createLink="handleCreateLink"
    @deleteLink="handleDeleteLink"
    @updatePredicate="handleUpdatePredicate"
  />
</template>

<script setup lang="ts">
import RecordDetail from '@app/components/RecordDetail.vue';
import useRecord from '@app/composables/useRecord';
import useMedia from '@app/composables/useMedia';
import { computed, ref, toRaw, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Head } from '@unhead/vue/components';
import type { GetRecordBySlugQueryResponse } from '@db/queries/records';
import { useDebounceFn } from '@vueuse/core';
import type { LinkInsert, LinkSelect, PredicateSelect, RecordInsert } from '@db/schema';
import useLink from '@app/composables/useLink';
import type { DbId } from '@shared/types/api';

const route = useRoute();
const { getRecordBySlug, getRecordLinks, upsertRecord } = useRecord();
const { uploadMedia, deleteMedia } = useMedia();
const { upsertLink, deleteLink } = useLink();

const record = ref<GetRecordBySlugQueryResponse | undefined>();

const recordSlug = computed(() => route.params.slug as string);
const { data, error, isError } = getRecordBySlug(recordSlug);

const recordId = computed(() => record.value?.id ?? null);
const isRecordFetched = computed(() => !!recordId.value);

const { data: links } = getRecordLinks(recordId, isRecordFetched);

const { mutate: mutateRecord } = upsertRecord();
const { mutate: upsertLinkMutation } = upsertLink();
const { mutate: deleteLinkMutation } = deleteLink();

const { mutate: uploadMediaMutation } = uploadMedia();
const { mutate: deleteMediaMutation } = deleteMedia();

const debouncedMutate = useDebounceFn(
  (data: RecordInsert) => {
    mutateRecord(data);
  },
  1000,
  { maxWait: 5000 },
);

watch(
  data,
  () => {
    if (!data.value) return;
    record.value = structuredClone(toRaw(data.value));
  },
  { immediate: true },
);

watch(
  record,
  () => {
    if (!record.value) return;
    debouncedMutate(record.value);
  },
  { deep: true },
);

function handleFileUpload(file: File) {
  if (!recordId.value) return;

  uploadMediaMutation({
    file,
    recordId: recordId.value,
  });
}

function handleMediaDelete({ mediaId }: { mediaId: number }) {
  if (!recordId.value) return;
  deleteMediaMutation(mediaId);
}

function handleCreateLink({ link }: { link: LinkInsert }) {
  upsertLinkMutation(link);
}

function handleDeleteLink({ linkId }: { linkId: DbId }) {
  deleteLinkMutation(linkId);
}

function handleUpdatePredicate({
  link,
  predicate,
}: {
  link: LinkSelect;
  predicate: PredicateSelect;
}) {
  upsertLinkMutation({
    ...link,
    predicateId: predicate.id,
  });
}
</script>
