<template>
	<h1>Add record</h1>

	<EditRecordForm v-model="record" @save="handleSubmit" />
</template>

<script setup lang="ts">
import EditRecordForm from '@app/components/EditRecordForm.vue';
import useRecord from '@app/composables/useRecord';
import type { RecordInsert } from '@db/schema';
import { ref } from 'vue';

const emptyRecord: RecordInsert = {
	title: '',
	slug: '',
}

const record = ref<RecordInsert>(emptyRecord);

const { upsertRecord } = useRecord()
const { mutate } = upsertRecord();

function handleSubmit(data: RecordInsert) {
	mutate(data)
}
</script>
