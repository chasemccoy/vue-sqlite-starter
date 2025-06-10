<template>
  <div v-if="isError">Error: {{ error }}</div>

  <div v-if="record">
    <h1 v-if="record.title">{{ record.title }}</h1>
    <p v-if="record.summary">{{ record.summary }}</p>
    <a v-if="record.url" :href="record.url" target="_blank">{{ record.url }}</a>
    <p v-if="record.notes">{{ record.notes }}</p>
    <p v-if="record.contentCreatedAt">{{ record.contentCreatedAt }}</p>
    <p v-if="record.recordCreatedAt">{{ record.recordCreatedAt }}</p>
    <p v-if="record.recordUpdatedAt">{{ record.recordUpdatedAt }}</p>
    <p v-if="record.source">{{ capitalize(record.source) }}</p>
  </div>
</template>

<script setup lang="ts">
import useRecord from '@app/composables/useRecord';
import { capitalize } from '@shared/lib/formatting';
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const { getRecordBySlug, getRecordTree, getRecordLinks } = useRecord();

const recordSlug = computed(() => route.params.slug as string)
const { data: record, error, isError } = getRecordBySlug(recordSlug);

const recordId = computed(() => record.value?.id ?? 0)
const isRecordFetched = computed(() => !!recordId.value)

const {
  data: tree,
  error: treeError,
  isError: isTreeError
} = getRecordTree(recordId, isRecordFetched);

const {
  data: links,
  error: linksError,
  isError: isLinksError
} = getRecordLinks(recordId, isRecordFetched);

watch([record, tree, links], () => {
  console.log('tree', tree.value);
  console.log('links', links.value);
})
</script>
