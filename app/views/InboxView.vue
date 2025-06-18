<template>
	<div class="InboxView">
		<div class="InboxView_list">
			<ul
				v-if="data"
				class="InboxView_grid"
			>
				<li
					v-for="(record, index) in data"
					:key="record.id"
				>
					<RecordCard
						v-model="data[index]"
						size="compact"
						:to="`/inbox/record/${record.slug}`"
					/>
				</li>
			</ul>
		</div>

		<div class="InboxView_detail">
			<RouterView />
		</div>
	</div>
</template>

<script setup lang="ts">
import RecordCard from '@app/components/RecordCard.vue';
import useRecords from '@app/composables/useRecords';

const { data } = useRecords({
	limit: 200,
	filters: {
		isCurated: false,
	},
	orderBy: [
		{
			field: 'recordCreatedAt',
			direction: 'desc',
		},
		{
			field: 'type',
			direction: 'asc',
		},
	],
});
</script>

<style scoped>
.InboxView {
	display: grid;
	grid-template-columns: minmax(350px, 0.5fr) 1fr;
	gap: 8px;
	overflow: hidden;
	height: calc(100% + 2rem);
	margin: -1rem;
}

.InboxView_list {
	height: 100%;
	overflow: auto;
	padding: 1rem 0.75rem 1rem 1rem;
}

.InboxView_grid {
	&>*+* {
		margin-top: 8px;
	}
}

.InboxView_detail {
	overflow: auto;
	padding: 1rem 1.5rem 0 0.5rem;
}
</style>