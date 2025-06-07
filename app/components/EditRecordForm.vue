<template>
	<form class="EditRecordForm">
		<RecordTypeSelectButton v-model="modelValue.type" />

		<label>
			Title
			<InputText type="text" v-model="modelValue.title" />
		</label>

		<label>
			Slug
			<InputText type="text" v-model="modelValue.slug" />
		</label>

		<label>
			URL
			<InputText type="url" v-model="modelValue.url" />
		</label>

		<label>
			Curated?
			<Checkbox v-model="modelValue.isCurated" binary />
		</label>

		<Button label="Save" @click="emit('save', modelValue)" />
	</form>
</template>

<script setup lang="ts">
import RecordTypeSelectButton from '@app/components/RecordTypeSelectButton.vue';
import type { RecordSelect } from '@db/schema';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';

const modelValue = defineModel<RecordSelect>({ required: true });

const emit = defineEmits<{
	save: [data: RecordSelect];
}>();
</script>

<style scoped>
.EditRecordForm {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
</style>
