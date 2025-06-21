<template>
  <input
    ref="fileInput"
    type="file"
    class="FileUploadButton__fileInput"
    :accept="acceptedFileTypes"
    multiple
    @change="handleFileSelect"
  />
  <UButton
    color="neutral"
    class="justify-center"
    icon="i-lucide-upload"
    variant="subtle"
    label="Upload attachments"
    size="sm"
    @click="triggerFileSelect"
  />
</template>

<script setup lang="ts">
import { SUPPORTED_MEDIA_TYPES } from '@shared/types/api';
import { useTemplateRef } from 'vue';

const emit = defineEmits<{
  fileUpload: [File];
}>();

const fileInput = useTemplateRef('fileInput');
const acceptedFileTypes = SUPPORTED_MEDIA_TYPES.join(',');

function triggerFileSelect() {
  fileInput.value?.click();
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files && files.length > 0) {
    for (const file of Array.from(files)) {
      emit('fileUpload', file);
    }
    // Reset input to allow selecting same file again
    target.value = '';
  }
}
</script>

<style scoped>
.FileUploadButton__fileInput {
  display: none;
}
</style>
