<template>
  <div v-if="isPending">Loading...</div>
  <div v-else-if="isError">Error: {{ error }}</div>
  <div v-else-if="record">
    <EditRecordForm v-model="record" @save="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import EditRecordForm from '@app/components/EditRecordForm.vue';
import useRecord from '@app/composables/useRecord';
import type { RecordInsert, RecordSelect } from '@db/schema';
import type { DbId } from '@shared/types/api';
import { ref, toRaw, watch } from 'vue';

const recordId = defineModel<DbId>({ required: true });

const { getRecord, upsertRecord } = useRecord();

const { data, isPending, error, isError } = getRecord(recordId);
const record = ref<RecordSelect>();

const { mutate } = upsertRecord();

watch(data, () => {
  if (!data.value) return;
  console.log('NEW DATA');
  record.value = structuredClone(toRaw(data.value));
});

// watch(record, () => {
//   console.log(record.value)
// }, { deep: true })

function handleSubmit(data: RecordSelect) {
  console.log(data);

  mutate(record.value as RecordInsert);
}
</script>
