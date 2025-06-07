<template>
	<div v-if="record">
		<EditRecordForm v-model="record" @save="handleSubmit" />
	</div>

	<div v-if="isLoading">Loading...</div>
	<div v-if="error">Error: {{ error }}</div>
</template>

<script setup lang="ts">
import EditRecordForm from '@app/components/EditRecordForm.vue';
import useRecord from '@app/composables/useRecord';
import type { RecordSelect } from '@db/schema';
import type { DbId } from '@shared/types/api';
import { ref, toRaw, watch } from 'vue';

const recordId = defineModel<DbId>({ required: true });

const { data, isLoading, error } = useRecord(recordId);

const record = ref<RecordSelect>();

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
}
</script>
