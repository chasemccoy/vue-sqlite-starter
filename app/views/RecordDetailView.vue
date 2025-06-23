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
    @deleteRecord="handleDeleteRecord"
  />
</template>

<script setup lang="ts">
import RecordDetail from '@app/components/RecordDetail.vue';
import useRecord from '@app/composables/useRecord';
import useMedia from '@app/composables/useMedia';
import { computed, ref, toRaw, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Head } from '@unhead/vue/components';
import type { GetRecordBySlugAPIResponse } from '@db/queries/records';
import { useDebounceFn } from '@vueuse/core';
import type { LinkInsert, LinkSelect, PredicateSelect, RecordInsert } from '@db/schema';
import useLink from '@app/composables/useLink';
import type { DbId } from '@shared/types/api';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const { getRecordBySlug, getRecordLinks, upsertRecord, deleteRecord } = useRecord();
const { uploadMedia, deleteMedia, deleteMediaForRecord } = useMedia();
const { upsertLink, deleteLink } = useLink();

const record = ref<GetRecordBySlugAPIResponse | undefined>();

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
const { mutate: deleteMediaForRecordMutation } = deleteMediaForRecord();
const { mutate: deleteRecordMutation } = deleteRecord();

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

function handleMediaDelete({ mediaId }: { mediaId?: number }) {
  if (!recordId.value || !mediaId) return;
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

function handleDeleteRecord(id: DbId) {
  deleteMediaForRecordMutation(id);

  deleteRecordMutation(id, {
    onSuccess: (record) => {
      if (route.matched.length > 1) {
        router.push(route.matched[route.matched.length - 2].path);
      }

      toast.add({
        title: 'Record deleted',
        description: `The record with slug “${record[0].slug}” has been deleted.`,
        color: 'success',
      });
    },
  });
}
</script>
