<template>
  <div>
    <ul class="Attachments">
      <li
        v-for="media in modelValue"
        :key="media.id"
        class="Attachments__item"
      >
        <img
          v-if="media.type === 'image'"
          :src="`${backendBaseUrl}${media.url}`"
          :alt="media.altText ?? ''"
        />
        <div v-else-if="media.url.includes('.pdf')">PDF</div>
        <div v-else-if="media.type === 'video'">Video</div>

        <UButton
          variant="outline"
          color="neutral"
          icon="i-lucide-trash"
          size="md"
          class="justify-center Attachments__itemDeleteButton"
          @click="emit('mediaDelete', { mediaId: media.id })"
        />
      </li>

      <li>
        <div class="Attachments__fileUpload">
          <input
            ref="fileInput"
            type="file"
            class="Attachments__fileInput"
            :accept="acceptedFileTypes"
            multiple
            @change="handleFileSelect"
          />
          <UButton
            variant="outline"
            color="neutral"
            class="justify-center"
            icon="i-lucide-upload"
            size="lg"
            @click="triggerFileSelect"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import useApiClient from '@app/composables/useApiClient';
import type { MediaSelect } from '@db/schema';
import { SUPPORTED_MEDIA_TYPES } from '@shared/types/api';
import { useTemplateRef } from 'vue';

const modelValue = defineModel<MediaSelect[]>({ required: true })

const emit = defineEmits<{
  'mediaUpload': [{ file: File; altText?: string }],
  'mediaDelete': [{ mediaId: number }]
}>()

const fileInput = useTemplateRef('fileInput')

const { backendBaseUrl } = useApiClient();
const acceptedFileTypes = SUPPORTED_MEDIA_TYPES.join(',')

function triggerFileSelect() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files && files.length > 0) {
    for (const file of Array.from(files)) {
      emit('mediaUpload', { file })
    }
    // Reset input to allow selecting same file again
    target.value = ''
  }
}
</script>

<style scoped>
.Attachments {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(120px, 100%), 1fr));
  gap: 16px;
  margin-top: 12px;
}

.Attachments__item {
  position: relative;

  img {
    object-fit: cover;
    aspect-ratio: 1 / 1;
    border-radius: 8px;
  }
}

:deep(.Attachments__itemDeleteButton) {
  opacity: 0;
  position: absolute;
  top: 8px;
  right: 8px;
  transition: opacity 0.15s ease-in-out;
  padding: 8px;

  .Attachments__item:hover & {
    opacity: 1;
  }

  :deep(svg) {
    width: 16px;
    height: 16px;
  }
}

.Attachments__fileUpload {
  display: grid;
  gap: 0.5rem;
  height: 100%;
  aspect-ratio: 1 / 1;
}

.Attachments__fileInput {
  display: none;
}
</style>