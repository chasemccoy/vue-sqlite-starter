<template>
  <div v-if="isError">Error: {{ error }}</div>

  <Head>
    <title v-if="record?.title">{{ record.title }} | Enchiridion</title>
  </Head>

  <RecordDetail
    v-if="record"
    :modelValue="record"
    :links="links"
    @mediaUpload="handleMediaUpload"
    @mediaDelete="handleMediaDelete"
  />
</template>

<script setup lang="ts">
import RecordDetail from '@app/components/RecordDetail.vue';
import useRecord from '@app/composables/useRecord';
import useMedia from '@app/composables/useMedia';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Head } from '@unhead/vue/components';

const route = useRoute()
const { getRecordBySlug, getRecordLinks } = useRecord();
const { uploadMedia, deleteMedia } = useMedia();

const recordSlug = computed(() => route.params.slug as string)
const { data: record, error, isError } = getRecordBySlug(recordSlug);

const recordId = computed(() => record.value?.id ?? null)
const isRecordFetched = computed(() => !!recordId.value)

// const { data: tree } = getRecordTree(recordId, isRecordFetched);

const {
  data: links,
} = getRecordLinks(recordId, isRecordFetched);

const { mutate: uploadMediaMutation } = uploadMedia();
const { mutate: deleteMediaMutation } = deleteMedia();

function handleMediaUpload({ file, altText }: { file: File; altText?: string }) {
  if (!recordId.value) return

  uploadMediaMutation({
    file,
    recordId: recordId.value,
    altText,
  });
}

function handleMediaDelete({ mediaId }: { mediaId: number }) {
  if (!recordId.value) return
  deleteMediaMutation(mediaId);
}
</script>
