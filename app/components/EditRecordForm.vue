<template>
  <form
    ref="formRef"
    class="EditRecordForm"
  >
    <div>
      <UFormField
        aria-label="Title"
        class="EditRecordForm__formField"
      >
        <UInput
          v-model.trim="modelValue.title"
          type="text"
          size="lg"
          variant="none"
          placeholder="Untitled record"
          :ui="{
            base: 'EditRecordForm__titleInput',
          }"
        />
      </UFormField>

      <RecordTypeSelectButton
        v-if="modelValue.type"
        v-model="modelValue.type"
      />
    </div>

    <div>
      <SlugField
        v-model="slug"
        class="EditRecordForm__input"
      />

      <UFormField
        aria-label="URL"
        class="EditRecordForm__formField"
      >
        <UInput
          v-model.trim="modelValue.url"
          type="url"
          size="lg"
          placeholder="https://example.org"
          icon="i-lucide-link"
          variant="none"
          class="EditRecordForm__input"
        />
      </UFormField>
    </div>

    <USwitch
      v-model="modelValue.isCurated"
      label="Curated"
      color="neutral"
      size="lg"
    />

    <UFormField label="Summary">
      <UTextarea
        v-model.trim="modelValue.summary"
        size="lg"
        placeholder="A brief summary of this record"
        :rows="3"
      />
    </UFormField>

    <UFormField label="Content">
      <UTextarea
        v-model.trim="modelValue.content"
        size="lg"
        placeholder="Main content of the record"
        :rows="6"
      />
    </UFormField>

    <UButton
      type="submit"
      size="xl"
      variant="outline"
      color="neutral"
      :disabled="!isDirty"
      block
      @click="handleSubmit"
    >
      Save record
    </UButton>
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
  gap: 16px;
}

.EditRecordForm__formField {
  margin-inline: -8px;
}

:deep(.EditRecordForm__titleInput) {
  margin-bottom: 8px;
}

:deep(.EditRecordForm__titleInput) {
  font-size: 1.5rem;
}

.EditRecordForm__input {
  & :deep(svg) {
    width: 16px;
    height: 16px;
  }
}
</style>
