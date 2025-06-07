<template>table</template>

<script setup lang="ts">
import useRecords from '@app/composables/useRecords';
import { watch } from 'vue';

const { data, isLoading, error } = useRecords();

// const id = ref(1)
// const { data: recordData, error: recordError } = useRecord(id)

watch([data], () => {
	if (!data.value) return;

	console.log(data.value);
});
</script>
