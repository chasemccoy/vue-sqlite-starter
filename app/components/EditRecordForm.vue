<template>
  <form class="EditRecordForm" ref="formRef">
    <RecordTypeSelectButton v-if="modelValue.type" v-model="modelValue.type" />

    <FormField label="Title">
      <InputText type="text" v-model.trim="modelValue.title" required />
    </FormField>

    <SlugField v-model="slug" />

    <FormField label="URL">
      <InputText type="url" v-model.trim="modelValue.url" placeholder="https://" />
    </FormField>

    <FormField label="Curated?">
      <Checkbox v-model="modelValue.isCurated" binary />
    </FormField>

    <FormField label="Summary">
      <Textarea v-model="modelValue.summary" rows="3" placeholder="A brief summary of this record" />
    </FormField>

    <FormField label="Content">
      <Textarea v-model="modelValue.content" placeholder="Main content of the record" />
    </FormField>

    <Button type="submit" label="Save" @click="handleSubmit" :disabled="!isDirty" size="large" />
  </form>
</template>

<script setup lang="ts">
import RecordTypeSelectButton from '@app/components/RecordTypeSelectButton.vue';
import type { RecordInsert, RecordSelect } from '@db/schema';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import FormField from '@app/components/FormField.vue';
import Textarea from 'primevue/textarea';
import { computed, ref, useTemplateRef, watch } from 'vue';
import SlugField from '@app/components/SlugField.vue';
import { slugify } from '@shared/lib/formatting';

const modelValue = defineModel<RecordSelect | RecordInsert>({ required: true });

const emit = defineEmits<{
  save: [data: RecordInsert];
}>();

const formRef = useTemplateRef('formRef')

const isDirty = ref(false)

const slug = computed(() => {
  return modelValue.value.slug || slugify(modelValue.value.title)
})

watch(() => modelValue, () => {
  isDirty.value = true
}, { deep: true })

function handleSubmit() {
  if (formRef.value?.checkValidity()) {
    emit('save', { ...modelValue.value, slug: slug.value })
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
