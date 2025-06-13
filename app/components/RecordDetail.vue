<template>
  <div
    v-if="modelValue"
    class="RecordDetail"
  >
    <div class="RecordDetail__badges">
      <UBadge
        v-if="modelValue.isCurated"
        color="neutral"
        variant="outline"
        class="RecordDetail__badge"
        icon="i-lucide-check"
      />

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
      v-if="modelValue.title || parent?.title"
      class="RecordDetail__title"
    >
      {{ modelValue.title || `↳ ${parent?.title}` }}
    </h1>

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

    <UFormField
      label="Summary"
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

    <UFormField
      label="Notes"
      size="xs"
    >
      <UTextarea
        v-model.trim="modelValue.notes"
        size="lg"
        placeholder="Additional notes"
        variant="outline"
        :rows="1"
        autoresize
      />
    </UFormField>

    <UFormField
      label="Content"
      size="xs"
    >
      <UTextarea
        v-model.trim="modelValue.content"
        size="lg"
        placeholder="Main content of the record"
        variant="outline"
        :rows="5"
        autoresize
      />
    </UFormField>


    <div class="RecordDetail__attachments">
      <h3 class="RecordDetail__sectionTitle">
        <UIcon name="i-lucide-paperclip" /> Attachments
      </h3>

      <AttachmentGallery
        v-model="modelValue.media"
        @mediaUpload="({ file, altText }) => emit('mediaUpload', { file, altText })"
        @mediaDelete="({ mediaId }) => emit('mediaDelete', { mediaId })"
      />
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
import AttachmentGallery from '@app/components/AttachmentGallery.vue';
import RecordLink from '@app/components/RecordLink.vue';
import type { GetRecordBySlugQueryResponse, LinksForRecordQueryResponse } from '@db/queries/records';
import { capitalize } from '@shared/lib/formatting';
import { computed } from 'vue';

const modelValue = defineModel<GetRecordBySlugQueryResponse>({ required: true })

const emit = defineEmits<{
  'mediaUpload': [{ file: File; altText?: string }],
  'mediaDelete': [{ mediaId: number }]
}>()

const { links } = defineProps<{
  links?: LinksForRecordQueryResponse
}>()


const iconForType = {
  'entity': 'i-lucide-user',
  'artifact': 'i-lucide-box',
  'concept': 'i-lucide-brain',
}

const incomingLinks = computed(() => links?.incomingLinks ?? null)
const outgoingLinks = computed(() => links?.outgoingLinks ?? null)

const parent = computed(() => {
  if (!outgoingLinks.value) return null

  return outgoingLinks.value.find((link) => link.predicate.type === 'containment')?.target ?? null
})
</script>

<style scoped>
.RecordDetail {
  display: grid;
  gap: 1rem;
}

.RecordDetail__badges {
  display: flex;
  gap: 4px;
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
  margin-bottom: 0.5rem;
  color: var(--ui-text-dimmed);
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
    width: 12px;
    height: 12px;
    color: var(--ui-text-dimmed);
  }
}
</style>