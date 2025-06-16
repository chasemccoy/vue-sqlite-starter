<template>
	<Head>
		<title>New record | Enchiridion</title>
	</Head>

	<EditRecordForm
		v-model="record"
		@save="handleSubmit"
	/>
</template>

<script setup lang="ts">
import EditRecordForm from '@app/components/EditRecordForm.vue';
import useRecord from '@app/composables/useRecord';
import type { RecordInsert } from '@db/schema';
import { Head } from '@unhead/vue/components';
import { ref } from 'vue';

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
</script>
