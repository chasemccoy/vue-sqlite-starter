<template>
  <div
    v-if="modelValue"
    class="RecordCard"
    :data-size="size"
  >
    <h1
      v-if="modelValue.title"
      class="RecordCard__title"
    >
      <RouterLink
        activeClass="RecordCard__link--isActive"
        :to="href"
      >
        {{ modelValue.title }}
      </RouterLink>
    </h1>

    <div class="RecordCard__byline">
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
      <span
        v-if="modelValue.url"
        class="RecordCard__url"
      >at&nbsp;&nbsp;<img
          v-if="faviconUrl"
          alt=""
          :src="faviconUrl"
        />
        <a
          target="_blank"
          :href="modelValue.url"
        >
          {{ urlOrigin }}
        </a>
      </span>
    </div>

    <AttachmentGallery
      v-model="modelValue.media"
      readonly
    />

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

    <div v-if="modelValue.notes">
      {{ modelValue.notes }}
    </div>

    <ul
      v-if="(tags && tags.length > 0) || modelValue.notes"
      class="RecordCard__tags"
    >
      <li v-if="modelValue.notes">
        <UIcon
          name="i-lucide-message-circle"
          class="size-4"
        />
      </li>
      <li
        v-for="tag in tags"
        :key="tag.id"
        class="RecordCard__tag"
      >
        <RouterLink :to="`/${tag.slug}`">
          #{{ slugify(tag.title ?? tag.slug) }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import AttachmentGallery from '@app/components/AttachmentGallery.vue';
import type {
  ListRecordsQueryResponse
} from '@db/queries/records';
import { computed } from 'vue';
import { getOriginOfUrl } from '@app/utils';
import { slugify } from '@shared/lib/formatting';

const modelValue = defineModel<ListRecordsQueryResponse[number]>({ required: true });

const { to, size = 'default' } = defineProps<{
  to?: string;
  size?: 'compact' | 'default';
}>();

const href = computed(() => {
  if (to) return to;

  return `/${modelValue.value.slug}`;
})

const urlOrigin = computed(() => {
  if (!modelValue.value.url) return null;
  return getOriginOfUrl(modelValue.value.url);
});

const faviconUrl = computed(() => {
  if (!urlOrigin.value) return null;
  return `https://www.google.com/s2/favicons?domain=${urlOrigin.value}`;
});

const outgoingLinks = computed(() => modelValue.value?.outgoingLinks ?? null);

const creator = computed(() => {
  if (!outgoingLinks.value) return null;

  return outgoingLinks.value.find((link) => link.predicate.slug === 'created_by')?.target ?? null;
});

const tags = computed(() => {
  if (!outgoingLinks.value) return null;

  return outgoingLinks.value.filter((link) => link.predicate.type === 'description')?.map((link) => link.target) ?? null;
});
</script>

<style scoped>
.RecordCard {
  display: grid;
  gap: 4px;
  background-color: var(--ui-bg);
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  padding: 16px;

  -webkit-column-break-inside: avoid;
  page-break-inside: avoid;
  break-inside: avoid;

  &[data-size="compact"] {
    padding: 12px;
    gap: 6px;
  }

  &>* {
    overflow-wrap: break-word;
    hyphens: auto;
    min-width: 0;
  }

  &:has(.RecordCard__link--isActive) {
    border-color: var(--ui-primary);
    box-shadow: 0 0 0 1px var(--ui-primary);
  }
}

.RecordCard__title {
  font-size: 1.25rem;
  line-height: 1.2;

  & a {
    display: block;
  }

  & a:hover {
    text-decoration: underline;
  }

  [data-size="compact"] & {
    font-size: 1rem;
  }
}

.RecordCard__byline {
  display: inline-flex;
  margin-top: -2px;
  flex-wrap: wrap;
  font-weight: 500;
  font-size: 0.75rem;
  color: var(--ui-text-muted);
}

.RecordCard__bylineItem {
  display: flex;
  align-items: center;
}

:deep(.RecordCard__bylineButton) {
  max-width: 250px;
  margin-left: 1px;
  padding-inline: 4px;

  & :deep(span) {
    min-width: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  & :deep(svg) {
    width: 14px;
    height: 14px;
  }
}

.RecordCard__url {
  word-break: break-all;
  display: inline-flex;
  align-items: center;

  img {
    width: 1em;
    aspect-ratio: 1;
    margin-right: 4px
  }
}

.RecordCard__summary,
.RecordCard__content {
  font-size: 0.8rem;
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

.RecordCard__tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
  margin-bottom: -2px;
  color: var(--ui-text-dimmed);
}

.RecordCard__tag {
  display: inline-block;
  font-size: 0.8rem;
  color: var(--ui-text-dimmed);
}
</style>
