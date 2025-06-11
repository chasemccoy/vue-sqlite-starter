<template>
  <UFormField label="Slug">
    <UInput type="text" v-model.trim="modelValue" size="lg" required />
  </UFormField>
</template>

<script setup lang="ts">
import { slugify } from '@shared/lib/formatting';

const modelValue = defineModel<string>({
  required: true,
  set(value) {
    return slugify(value)
  }
});
</script>