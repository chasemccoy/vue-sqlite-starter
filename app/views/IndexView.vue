<template>
	<div
		ref="elRef"
		class="IndexView"
	>
		<div class="IndexView_list">
			<ul
				v-if="data"
				class="IndexView_grid"
			>
				<li
					v-for="(record, index) in data"
					:key="record.id"
				>
					<RecordCard
						v-model="data[index]"
						size="compact"
					/>
				</li>
			</ul>
		</div>

		<div class="IndexView_detail">
			<RouterView />
		</div>
	</div>
</template>

<script setup lang="ts">
import RecordCard from '@app/components/RecordCard.vue';
import useRecords from '@app/composables/useRecords';
import { useTemplateRef, watch } from 'vue';
import { useRoute } from 'vue-router';

const elRef = useTemplateRef('elRef');

const route = useRoute()

const { data } = useRecords({
	limit: 200,
	filters: {
		type: 'artifact',
		hasParent: false,
	},
	orderBy: [
		{
			field: 'recordCreatedAt',
			direction: 'desc',
		},
	],
});

watch([data, route], () => {
	if (!elRef.value) return;

	const selectedRecord = elRef.value.querySelector('.RouterLink--isActive');
	if (!selectedRecord) return;

	if (
		!selectedRecord.getBoundingClientRect().top
		|| selectedRecord.getBoundingClientRect().top < 0
		|| selectedRecord.getBoundingClientRect().bottom > window.innerHeight
	) {
		selectedRecord.scrollIntoView();
	}
}, { flush: 'post' })
</script>

<style scoped>
.IndexView {
	display: grid;
	grid-template-columns: minmax(350px, 0.5fr) 1fr;
	gap: 8px;
	overflow: hidden;
	height: calc(100% + 2rem);
	margin: -1rem;
}

.IndexView_list {
	height: 100%;
	overflow: auto;
	padding: 1rem 0.75rem 1rem 1rem;
}

.IndexView_grid {
	&>*+* {
		margin-top: 8px;
	}
}

.IndexView_detail {
	overflow: auto;
	padding: 1rem 1.5rem 0 0.5rem;
}
</style>