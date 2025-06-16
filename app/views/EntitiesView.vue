<template>
	<RecordTable
		v-if="data"
		v-model="data"
		:hideColumns="['type', 'content']"
	/>
</template>

<script setup lang="ts">
import RecordTable from '@app/components/RecordTable.vue';
import useRecords from '@app/composables/useRecords';

const { data } = useRecords({
	filters: {
		type: 'entity',
	},
});
</script>
