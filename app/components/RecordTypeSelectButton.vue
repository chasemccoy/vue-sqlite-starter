<template>
	<UTabs :content="false" :items="options" v-model="modelValue" />
</template>

<script setup lang="ts">
import { capitalize } from '@shared/lib/formatting';
import { recordTypeEnum, type RecordType } from '@shared/types';

const modelValue = defineModel<RecordType>({ required: true });

const options = [...recordTypeEnum]
	.sort()
	.map((type) => ({ label: capitalize(type), value: type }));

</script>
