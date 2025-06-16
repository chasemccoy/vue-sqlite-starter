<template>
	<UTabs
		v-model="modelValue"
		color="neutral"
		class="RecordTypeSelectButton"
		:content="false"
		:items="options"
	/>
</template>

<script setup lang="ts">
import { capitalize } from '@shared/lib/formatting';
import { recordTypeEnum, type RecordType } from '@shared/types';

const modelValue = defineModel<RecordType>({ required: true });

const options = [...recordTypeEnum]
	.sort()
	.map((type) => ({ label: capitalize(type), value: type }));
</script>

<style scoped>
.RecordTypeSelectButton {
	border: 1px solid var(--ui-border);
	border-radius: 0.5rem;
}
</style>
