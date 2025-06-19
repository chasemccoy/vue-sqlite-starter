<template>
	<div
		ref="elRef"
		class="SplitViewLayout"
		:class="{ 'SplitViewLayout--empty': isEmpty }"
	>
		<div class="SplitViewLayout_list">
			<ul
				v-if="modelValue"
				class="SplitViewLayout_grid"
			>
				<li
					v-for="(record, index) in modelValue"
					:key="record.id"
				>
					<RecordCard
						v-model="modelValue[index]"
						size="compact"
						v-bind="getRecordCardProps(record)"
					/>
				</li>
			</ul>
		</div>

		<div
			v-if="!isEmpty"
			class="SplitViewLayout_detail"
		>
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import RecordCard from '@app/components/RecordCard.vue';
import type { ListRecordsQueryResponse } from '@db/queries/records';
import { useTemplateRef, watch } from 'vue';
import { useRoute } from 'vue-router';

const modelValue = defineModel<ListRecordsQueryResponse>();

const { isEmpty, recordCardProps } = defineProps<{
	isEmpty?: boolean;
	recordCardProps?: (record: ListRecordsQueryResponse[number]) => Record<string, string>
}>()

const getRecordCardProps = (record: ListRecordsQueryResponse[number]) => {
	if (typeof recordCardProps === 'function') {
		return recordCardProps(record);
	}

	return recordCardProps || {};
};

const elRef = useTemplateRef('elRef');
const route = useRoute();

watch(
	[() => modelValue, route],
	() => {
		if (!elRef.value) return;

		const selectedRecord = elRef.value.querySelector('.RouterLink--isActive');
		if (!selectedRecord) return;

		if (
			!selectedRecord.getBoundingClientRect().top ||
			selectedRecord.getBoundingClientRect().top < 0 ||
			selectedRecord.getBoundingClientRect().bottom > window.innerHeight
		) {
			selectedRecord.scrollIntoView();
		}
	},
	{ flush: 'post' },
);
</script>

<style scoped>
.SplitViewLayout {
	display: grid;
	grid-template-columns: minmax(350px, 0.5fr) 1fr;
	gap: 8px;
	overflow: hidden;
	height: calc(100% + 2rem);
	margin: -1rem;

	&.SplitViewLayout--empty {
		grid-template-columns: 1fr;
	}
}

.SplitViewLayout_list {
	height: 100%;
	overflow: auto;
	padding: 1rem 0.75rem 1rem 1rem;
}

.SplitViewLayout_grid {
	column-gap: 12px;

	&>*+* {
		margin-top: 8px;
	}

	.SplitViewLayout--empty & {
		columns: 30ch 3;

		&>*+* {
			margin-top: 12px;
		}
	}
}

.SplitViewLayout_detail {
	overflow: auto;
	padding: 1rem 1.5rem 1rem 0.5rem;
}
</style>
