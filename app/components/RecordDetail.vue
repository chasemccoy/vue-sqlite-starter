<template>
  <div
    v-if="modelValue"
    class="RecordDetail"
  >
    <div class="RecordDetail__badges">
      <UBadge
        color="neutral"
        variant="outline"
        class="RecordDetail__badge"
        :icon="iconForType[modelValue.type]"
      >
        {{ capitalize(modelValue.type) }}
      </UBadge>

      <UBadge
        v-if="modelValue.source && modelValue.source !== 'manual'"
        color="neutral"
        variant="outline"
        class="RecordDetail__badge"
      >
        {{ capitalize(modelValue.source) }}
      </UBadge>

      <UBadge
        v-if="modelValue"
        color="neutral"
        variant="outline"
        class="RecordDetail__badge"
        icon="i-lucide-hash"
      >
        {{ modelValue.id }}
      </UBadge>
    </div>

    <h1
      v-if="modelValue.title"
      class="RecordDetail__title"
    >
      {{ modelValue.title }}
    </h1>

    <p v-if="modelValue.summary">{{ modelValue.summary }}</p>

    <UInput
      v-model="modelValue.url"
      class="RecordDetail__input"
      color="neutral"
      variant="ghost"
      placeholder="example.com"
      icon="i-lucide-link"
    >
      <template
        v-if="modelValue.url"
        #trailing
      >
        <UTooltip text="Open source URL">
          <UButton
            variant="link"
            size="sm"
            icon="i-lucide-external-link"
            aria-label="Open source URL"
            target="_blank"
            :to="modelValue.url"
          />
        </UTooltip>
      </template>
    </UInput>

    <p v-if="modelValue.notes">{{ modelValue.notes }}</p>

    <div v-if="modelValue.content">
      {{ modelValue.content }}
    </div>

    <div class="RecordDetail__attachments">
      <h3 class="RecordDetail__sectionTitle">
        <UIcon name="i-lucide-paperclip" /> Attachments
      </h3>

      <ul class="RecordDetail__mediaGallery">
        <li
          v-for="media in modelValue.media"
          :key="media.id"
          class="RecordDetail__mediaGalleryItem"
        >
          <img
            v-if="media.type === 'image'"
            :src="`${backendBaseUrl}${media.url}`"
            :alt="media.altText ?? ''"
          />
          <div v-else-if="media.url.includes('.pdf')">PDF</div>
          <div v-else-if="media.type === 'video'">Video</div>
        </li>

        <li>
          <div class="RecordDetail__fileUpload">
            <input
              ref="fileInput"
              type="file"
              class="RecordDetail__fileInput"
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

    <div class="RecordDetail__links">
      <div
        v-if="incomingLinks && incomingLinks.length > 0"
        class="RecordDetail__section"
      >
        <h2 class="RecordDetail__sectionTitle">
          <UIcon name="i-lucide-arrow-left" /> Incoming links ({{ incomingLinks.length }})
        </h2>
        <ul class="RecordDetail__list">
          <li
            v-for="link in incomingLinks"
            :key="link.id"
          >
            <RecordLink
              :model-value="link.sourceId"
              :relationship="link.predicate.inverse?.name"
            />
          </li>
        </ul>
      </div>

      <div
        v-if="outgoingLinks && outgoingLinks.length > 0"
        class="RecordDetail__section"
      >
        <h2 class="RecordDetail__sectionTitle">
          <UIcon name="i-lucide-arrow-right" /> Outgoing links ({{ outgoingLinks.length }})
        </h2>
        <ul class="RecordDetail__list">
          <li
            v-for="link in outgoingLinks"
            :key="link.id"
          >
            <RecordLink
              :model-value="link.targetId"
              :relationship="link.predicate.name"
            />
          </li>
        </ul>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import RecordLink from '@app/components/RecordLink.vue';
import useApiClient from '@app/composables/useApiClient';
import type { GetRecordQueryResponse, LinksForRecordQueryResponse } from '@db/queries/records';
import { capitalize } from '@shared/lib/formatting';
import { SUPPORTED_MEDIA_TYPES } from '@shared/types/api';
import { computed, ref } from 'vue';

const modelValue = defineModel<GetRecordQueryResponse>({ required: true })

const emit = defineEmits<{
  'media-upload': [{ file: File; altText?: string }]
}>()

const { links } = defineProps<{
  links?: LinksForRecordQueryResponse
}>()

const { backendBaseUrl } = useApiClient();

const fileInput = ref<HTMLInputElement>()
const acceptedFileTypes = SUPPORTED_MEDIA_TYPES.join(',')

const incomingLinks = computed(() => links?.incomingLinks ?? null)
const outgoingLinks = computed(() => links?.outgoingLinks ?? null)

const iconForType = {
  'entity': 'i-lucide-user',
  'artifact': 'i-lucide-box',
  'concept': 'i-lucide-brain',
}

function triggerFileSelect() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files && files.length > 0) {
    for (const file of Array.from(files)) {
      emit('media-upload', { file })
    }
    // Reset input to allow selecting same file again
    target.value = ''
  }
}
</script>

<style scoped>
.RecordDetail {
  display: grid;
  gap: 1rem;
}

.RecordDetail__badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.RecordDetail__title {
  font-size: 1.5rem;
}

.RecordDetail__links {
  margin-top: 2rem;
  display: grid;
  gap: 2rem;
}

.RecordDetail__attachments {
  margin-top: 2rem;
}

.RecordDetail__section {
  display: grid;
  gap: 0.25rem;
}

.RecordDetail__sectionTitle {
  font-size: 0.75rem;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border-bottom: 1px solid var(--ui-border);
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
}

.RecordDetail__badge {
  width: fit-content;

  & :deep(svg) {
    width: 12px;
    height: 12px;
    color: var(--ui-text-muted);
  }
}

.RecordDetail__list {
  li+li {
    margin-top: 1rem;
  }
}

.RecordDetail__input {
  & :deep(input) {
    color: var(--ui-text-muted);
  }

  & :deep(input:hover),
  & :deep(input:focus) {
    color: var(--ui-text);
  }

  & :deep(svg) {
    width: 14px;
    height: 14px;
    color: var(--ui-text-dimmed);
  }
}

.RecordDetail__mediaGallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(120px, 100%), 1fr));
  gap: 16px;
}

.RecordDetail__mediaGalleryItem {
  img {
    object-fit: cover;
    aspect-ratio: 1 / 1;
    border-radius: 8px;
  }
}

.RecordDetail__fileUpload {
  display: grid;
  gap: 0.5rem;
  height: 100%;
}

.RecordDetail__fileInput {
  display: none;
}
</style>