<template>
	<div v-if="isError">Error: {{ error }}</div>

	<div v-if="record">
		<EditRecordForm
			v-model="record"
			@save="handleSubmit"
		/>
	</div>
</template>

<script setup lang="ts">
import EditRecordForm from '@app/components/EditRecordForm.vue';
import useRecord from '@app/composables/useRecord';
import type { RecordInsert, RecordSelect } from '@db/schema';
import { computed, ref, toRaw, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { getRecord, upsertRecord } = useRecord();

const record = ref<RecordSelect>();

const recordId = computed(() => parseInt(route.params.id as string));

const { data, error, isError } = getRecord(recordId);
const { mutate } = upsertRecord();

watch(
	data,
	() => {
		if (!data.value) return;
		record.value = structuredClone(toRaw(data.value));
	},
	{ immediate: true },
);

function handleSubmit(data: RecordInsert) {
	mutate(data);
}
</script>
