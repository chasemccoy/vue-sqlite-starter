<template>
  <form
    ref="formRef"
    class="AddRecordForm"
    @submit.prevent
  >
    <TitleField v-model="modelValue.title" />

    <RecordTypeSelectButton
      v-if="modelValue.type"
      v-model="modelValue.type"
    />

    <UFormField
      aria-label="Content"
      size="xs"
      class="AddRecordForm__content"
    >
      <UTextarea
        v-model.trim="modelValue.content"
        size="xl"
        placeholder="Main content of the record"
        variant="none"
        :rows="1"
        autoresize
      />
    </UFormField>

    <div class="AddRecordForm__combinedFields">
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

      <UButtonGroup v-if="createdAt">
        <UBadge
          color="neutral"
          variant="outline"
          size="lg"
          label="Published"
        />

        <UInput
          v-model="createdAt"
          variant="outline"
          placeholder="May 4, 1995"
          readonly
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

    <div class="AddRecordForm__actions">
      <FileUploadButton @fileUpload="handleFileUpload" />

      <USwitch
        v-model="modelValue.isCurated"
        label="Curated"
        size="lg"
      />
    </div>

    <AttachmentGallery
      v-if="files && files.length > 0"
      v-model="files"
      @fileUpload="handleFileUpload"
      @fileDelete="handleFileDelete"
    />

    <UButton
      type="submit"
      size="xl"
      class="AddRecordForm__submitButton"
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
import { formatDate, slugify } from '@shared/lib/formatting';
import TitleField from '@app/components/TitleField.vue';
import FileUploadButton from '@app/components/FileUploadButton.vue';
import type { NewRecordData, PartialLinkInsert } from '@app/views/AddRecordView.vue';
import AttachmentGallery from '@app/components/AttachmentGallery.vue';

const modelValue = defineModel<RecordSelect | RecordInsert>({ required: true });

const emit = defineEmits<{
  save: [data: NewRecordData];
}>();

const files = ref<File[]>([]);
const links = ref<PartialLinkInsert[]>([]);

const formRef = useTemplateRef('formRef');

const isDirty = ref(false);

const slug = computed(() => {
  const { slug, title } = modelValue.value;

  if (slug) return slug;
  else if (title) return slugify(title);
  else return '';
});

const createdAt = computed(() => {
  if (!modelValue.value?.contentCreatedAt) return null;
  return formatDate(new Date(modelValue.value.contentCreatedAt));
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
    emit('save', {
      record: { ...modelValue.value, slug: slug.value },
      links: links.value,
      files: files.value,
    });
  }
}

function handleFileUpload(file: File) {
  files.value.push(file);
}

function handleFileDelete() {
  // files.value = files.value.filter((file) => file.name !== mediaId);
}
</script>

<style scoped>
.AddRecordForm {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.AddRecordForm__combinedFields {
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

:deep(.AddRecordForm__submitButton) {
  margin-top: 24px;
}

.AddRecordForm__content {
  margin-inline: -12px;
}

.AddRecordForm__actions {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: -4px;
}
</style>
