<template>
  <form class="EditRecordForm" ref="formRef">
    <RecordTypeSelectButton v-if="modelValue.type" v-model="modelValue.type" />

    <FormField label="Title">
      <InputText type="text" v-model.trim="modelValue.title" required />
    </FormField>

    <FormField label="Slug">
      <InputText type="text" v-model.trim="modelValue.slug" required />
    </FormField>

    <FormField label="URL">
      <InputText type="url" v-model.trim="modelValue.url" />
    </FormField>

    <FormField label="Curated?">
      <Checkbox v-model="modelValue.isCurated" binary />
    </FormField>

    <Button type="submit" label="Save" @click="handleSubmit" :disabled="!isDirty" />
  </form>
</template>

<script setup lang="ts">
import RecordTypeSelectButton from '@app/components/RecordTypeSelectButton.vue';
import type { RecordInsert, RecordSelect } from '@db/schema';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import FormField from '@app/components/FormField.vue';
import { ref, useTemplateRef, watch } from 'vue';

const modelValue = defineModel<RecordSelect | RecordInsert>({ required: true });

const emit = defineEmits<{
  save: [data: RecordInsert];
}>();

const formRef = useTemplateRef('formRef')

const isDirty = ref(false)

watch(() => modelValue, () => {
  isDirty.value = true
}, { deep: true })

function handleSubmit() {
  if (formRef.value?.checkValidity()) {
    emit('save', modelValue.value)
  }
}
</script>

<style scoped>
.EditRecordForm {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
