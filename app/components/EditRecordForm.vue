<template>
  <form
    ref="formRef"
    class="EditRecordForm"
  >
    <TitleField v-model="modelValue.title" />

    <RecordTypeSelectButton
      v-if="modelValue.type"
      v-model="modelValue.type"
    />

    <UFormField label="Content">
      <UTextarea
        v-model.trim="modelValue.content"
        size="lg"
        placeholder="Main content of the record"
        :rows="6"
      />
    </UFormField>

    <div class="EditRecordForm__combinedFields">
      <UFormField
        aria-label="Summary"
        size="xs"
      >
        <UTextarea
          v-model.trim="modelValue.summary"
          size="lg"
          placeholder="A brief summary of this record"
          variant="outline"
          :rows="1"
          autoresize
        />
      </UFormField>

      <SlugField v-model="slug" />

      <UButtonGroup>
        <UBadge
          color="neutral"
          variant="outline"
          size="lg"
          label="URL"
        />

        <UInput
          v-model="modelValue.url"
          variant="outline"
          placeholder="https://example.org"
        />
      </UButtonGroup>

      <UButtonGroup>
        <UBadge
          color="neutral"
          variant="outline"
          size="lg"
          label="Notes"
        />

        <UTextarea
          v-model="modelValue.notes"
          variant="outline"
          placeholder="Additional notes"
          :rows="1"
          autoresize
        />
      </UButtonGroup>
    </div>

    <USwitch
      v-model="modelValue.isCurated"
      label="Curated"
      color="neutral"
      size="lg"
    />

    <UButton
      type="submit"
      size="xl"
      class="EditRecordForm__submitButton"
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
import TitleField from '@app/components/TitleField.vue';

const modelValue = defineModel<RecordSelect | RecordInsert>({ required: true });

const emit = defineEmits<{
  save: [data: RecordInsert];
}>();

const formRef = useTemplateRef('formRef');

const isDirty = ref(false);

const slug = computed(() => {
  const { slug, title } = modelValue.value;

  if (slug) return slug;
  else if (title) return slugify(title);
  else return '';
});

watch(
  () => modelValue,
  () => {
    isDirty.value = true;
  },
  { deep: true },
);

function handleSubmit() {
  if (formRef.value?.checkValidity()) {
    emit('save', { ...modelValue.value, slug: slug.value });
  }
}
</script>

<style scoped>
.EditRecordForm {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.EditRecordForm__combinedFields {
  display: grid;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--ui-border);

  --ui-radius: 0;

  & :deep(input),
  & :deep(textarea),
  & :deep(span) {
    box-shadow: none;
  }

  & > * + * {
    border-top: 1px solid var(--ui-border);
  }
}

:deep(.EditRecordForm__submitButton) {
  margin-top: 24px;
}
</style>
