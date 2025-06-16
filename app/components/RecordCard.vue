<template>
  <div
    v-if="modelValue"
    class="RecordCard"
  >
    <div class="RecordCard__badges">
      <UBadge
        v-if="modelValue.isCurated"
        color="neutral"
        variant="outline"
        class="RecordCard__badge"
        icon="i-lucide-check"
      />

      <UBadge
        color="neutral"
        variant="outline"
        class="RecordCard__badge"
        :icon="getIconForRecordType(modelValue.type)"
      >
        {{ capitalize(modelValue.type) }}
      </UBadge>
    </div>

    <h1 class="RecordCard__title">
      <RouterLink :to="`/${modelValue.slug}`">
        {{ modelValue.title }}
      </RouterLink>
    </h1>

    <div
      v-if="parent || creator"
      class="RecordCard__byline"
    >
      <span
        v-if="parent"
        class="RecordCard__bylineItem"
      >
        from
        <UButton
          icon="i-lucide-workflow"
          size="sm"
          color="neutral"
          variant="link"
          class="RecordCard__bylineButton"
          :to="`/${parent.slug}`"
        >
          <span>{{ parent.title }}</span>
        </UButton>
      </span>

      <span
        v-if="creator"
        class="RecordCard__bylineItem"
      >
        by
        <UButton
          icon="i-lucide-user-pen"
          size="sm"
          color="neutral"
          variant="link"
          class="RecordCard__bylineButton"
          :to="`/${creator.slug}`"
        >
          <span>{{ creator.title }}</span>
        </UButton>
      </span>
    </div>

    <div
      v-if="modelValue.url"
      class="RecordCard__url"
    >
      {{ modelValue.url }}
    </div>

    <div
      v-if="modelValue.summary"
      class="RecordCard__summary"
    >
      {{ modelValue.summary }}
    </div>

    <div
      v-if="modelValue.content"
      class="RecordCard__content"
    >
      {{ modelValue.content }}
    </div>

    <AttachmentGallery
      v-if="false"
      v-model="modelValue.media"
      @mediaUpload="({ file, altText }) => emit('mediaUpload', { file, altText })"
      @mediaDelete="({ mediaId }) => emit('mediaDelete', { mediaId })"
    />

    <div v-if="modelValue.notes">
      {{ modelValue.notes }}
    </div>
  </div>
</template>

<script setup lang="ts">
import AttachmentGallery from '@app/components/AttachmentGallery.vue';
import type {
  LinksForRecordQueryResponse,
  ListRecordsQueryResponse
} from '@db/queries/records';
import { capitalize } from '@shared/lib/formatting';
import { computed } from 'vue';
import { getIconForRecordType } from '@app/utils';

const modelValue = defineModel<ListRecordsQueryResponse[number]>({ required: true });

const emit = defineEmits<{
  mediaUpload: [{ file: File; altText?: string }];
  mediaDelete: [{ mediaId: number }];
}>();

const { links } = defineProps<{
  links?: LinksForRecordQueryResponse;
}>();

const outgoingLinks = computed(() => links?.outgoingLinks ?? null);

const parent = computed(() => {
  if (!outgoingLinks.value) return null;

  return outgoingLinks.value.find((link) => link.predicate.type === 'containment')?.target ?? null;
});

const creator = computed(() => {
  if (!outgoingLinks.value) return null;

  return outgoingLinks.value.find((link) => link.predicate.slug === 'created_by')?.target ?? null;
});
</script>

<style scoped>
.RecordCard {
  display: grid;
  gap: 12px;
  background-color: var(--ui-bg);
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  padding: 16px;

  -webkit-column-break-inside: avoid;
  page-break-inside: avoid;
  break-inside: avoid;

  &>* {
    overflow-wrap: break-word;
    hyphens: auto;
    min-width: 0;
  }
}

.RecordCard__badges {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.RecordCard__title {
  font-size: 1.25rem;
  line-height: 1.2;

  & a:hover {
    text-decoration: underline;
  }
}

.RecordCard__byline {
  display: inline-flex;
  margin-top: -12px;
}

.RecordCard__bylineItem {
  display: flex;
  align-items: center;
  color: var(--ui-text-muted);
  font-size: 0.8rem;
}

.RecordCard__url {
  word-break: break-all;
}

.RecordCard__url,
.RecordCard__summary,
.RecordCard__content {
  font-size: 0.8rem;
  color: var(--ui-text-muted);
}

.RecordCard__section {
  display: grid;
  gap: 0.25rem;
}

.RecordCard__sectionTitle {
  font-size: 0.75rem;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  color: var(--ui-text-dimmed);
}

.RecordCard__badge {
  width: fit-content;

  & :deep(svg) {
    width: 12px;
    height: 12px;
    color: var(--ui-text-muted);
  }
}

.RecordCard__list {
  li+li {
    margin-top: 1rem;
  }
}

.RecordCard__input {
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
    color: var(--ui-text-muted);
  }
}
</style>
