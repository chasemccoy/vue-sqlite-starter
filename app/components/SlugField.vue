<template>
  <FormField label="Slug">
    <InputText type="text" v-model.trim="modelValue" required />
  </FormField>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import FormField from '@app/components/FormField.vue';
import slugify from 'slugify';

const modelValue = defineModel<string>({
  required: true,
  set(value) {
    return slugify(value)
  }
});
</script>