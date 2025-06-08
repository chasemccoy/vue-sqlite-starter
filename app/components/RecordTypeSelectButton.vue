<template>
	<SelectButton v-model="modelValue" :options="options" option-value="value" option-label="label" />
</template>

<script setup lang="ts">
import { capitalize } from '@shared/lib/formatting';
import { recordTypeEnum, type RecordType } from '@shared/types';
import SelectButton from 'primevue/selectbutton';

const modelValue = defineModel<RecordType>({ required: true });

const options = [...recordTypeEnum]
	.sort()
	.map((type) => ({ label: capitalize(type), value: type }));
</script>
