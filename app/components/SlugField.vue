<template>
	<UFormField
		aria-label="Slug"
		class="SlugField"
		required
	>
		<UInput
			v-model.trim="modelValue"
			type="text"
			size="lg"
			variant="none"
			icon="i-lucide-hash"
			placeholder="record-slug"
			required
		/>
	</UFormField>
</template>

<script setup lang="ts">
import { slugify } from '@shared/lib/formatting';

const modelValue = defineModel<string>({
	required: true,
	set(value) {
		return slugify(value);
	},
});
</script>

<style scoped>
.SlugField {
	margin-inline: -8px;
}
</style>
