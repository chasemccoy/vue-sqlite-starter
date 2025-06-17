<template>
	<div class="IndexView">
		<ul
			v-if="data"
			class="IndexView_grid"
		>
			<li
				v-for="(record, index) in data"
				:key="record.id"
			>
				<RecordCard v-model="data[index]" />
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import RecordCard from '@app/components/RecordCard.vue';
import useRecords from '@app/composables/useRecords';

const { data } = useRecords({
	limit: 200,
	filters: {
		type: 'artifact',
		hasParent: false,
	},
	orderBy: [
		{
			field: 'title',
			direction: 'asc',
		},
	],
});
</script>

<style scoped>
.IndexView_grid {
	columns: 30ch 3;
	column-gap: 12px;

	&>*+* {
		margin-top: 12px;
	}
}
</style>