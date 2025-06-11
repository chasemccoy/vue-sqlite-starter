<template>
  <form class="EditRecordForm" ref="formRef">
    <RecordTypeSelectButton v-if="modelValue.type" v-model="modelValue.type" />

    <UFormField label="Title">
      <UInput type="text" v-model.trim="modelValue.title" size="lg" />
    </UFormField>

    <SlugField v-model="slug" />

    <UFormField label="URL">
      <UInput type="url" v-model.trim="modelValue.url" size="lg" placeholder="https://" />
    </UFormField>

    <UCheckbox label="Curated?" v-model="modelValue.isCurated" />

    <UFormField label="Summary">
      <UTextarea v-model.trim="modelValue.summary" size="lg" placeholder="A brief summary of this record" :rows="3" />
    </UFormField>

    <UFormField label="Content">
      <UTextarea v-model.trim="modelValue.content" size="lg" placeholder="Main content of the record" :rows="6" />
    </UFormField>

    <UButton type="submit" @click="handleSubmit" :disabled="!isDirty" size="xl" block>Save</UButton>
  </form>
</template>

<script setup lang="ts">
import RecordTypeSelectButton from '@app/components/RecordTypeSelectButton.vue';
import type { RecordInsert, RecordSelect } from '@db/schema';
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
  const { slug, title } = modelValue.value

  if (slug) return slug
  else if (title) return slugify(title)
  else return ''
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
