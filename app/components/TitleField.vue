<template>
  <UFormField aria-label="Title">
    <UTextarea
      v-model.trim="modelValue"
      type="text"
      size="lg"
      variant="none"
      placeholder="Untitled record"
      :rows="1"
      :ui="{
        base: 'TitleField__input',
      }"
      autoresize
    />
  </UFormField>
</template>

<script setup lang="ts">
const modelValue = defineModel<string | null>('modelValue');
</script>

<style scoped>
:deep(.TitleField__input) {
  font-size: 1.7rem;
  margin-inline: -12px;
  padding-block: 0;
  text-wrap: pretty;
}
</style>
