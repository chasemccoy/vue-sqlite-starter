<template>
  <Head>
    <title>New record | Enchiridion</title>
  </Head>

  <div class="AddRecordView">
    <EditRecordForm
      v-model="record"
      @save="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import EditRecordForm from '@app/components/EditRecordForm.vue';
import useRecord from '@app/composables/useRecord';
import type { RecordInsert } from '@db/schema';
import { Head } from '@unhead/vue/components';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const emptyRecord: RecordInsert = {
  type: 'artifact',
  title: '',
  slug: '',
  source: 'manual',
};

const record = ref<RecordInsert>(emptyRecord);

const { upsertRecord } = useRecord();
const { mutate } = upsertRecord();

function handleSubmit(data: RecordInsert) {
  mutate(data);
}

onMounted(() => {
  const query = route.query;

  const populatedRecord = { ...emptyRecord };

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
