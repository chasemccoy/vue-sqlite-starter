<template>
  <div v-if="isError">Error: {{ error }}</div>

  <Head>
    <title v-if="record?.title">{{ record.title }} | Enchiridion</title>
  </Head>

  <RecordDetail
    v-if="record"
    :modelValue="record"
    :links="links"
  />
</template>

<script setup lang="ts">
import RecordDetail from '@app/components/RecordDetail.vue';
import useRecord from '@app/composables/useRecord';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Head } from '@unhead/vue/components';

const route = useRoute()
const { getRecordBySlug, getRecordLinks } = useRecord();

const recordSlug = computed(() => route.params.slug as string)
const { data: record, error, isError } = getRecordBySlug(recordSlug);

const recordId = computed(() => record.value?.id ?? null)
const isRecordFetched = computed(() => !!recordId.value)

// const { data: tree } = getRecordTree(recordId, isRecordFetched);

const {
  data: links,
} = getRecordLinks(recordId, isRecordFetched);

// watch([record, tree, links], () => {
//   console.log('tree', tree.value);
// })
</script>
