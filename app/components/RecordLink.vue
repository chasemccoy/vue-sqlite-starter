<template>
  <div
    class='RecordLink'
    :class="{ 'RecordLink--loading': isLoading }"
  >
    <div v-if="isError">Error: {{ error }}</div>

    <div class="RecordLink__header">
      <RouterLink
        v-if="record"
        class="RecordLink__title"
        :to="`/${record.slug}`"
      >
        {{ title }}
      </RouterLink>

      <div class="RecordLink__headerMeta">
        <a
          v-if="record?.url"
          target="_blank"
          :href="record.url"
        >
          <UIcon
            name="i-lucide-link"
            class="RecordLink__icon"
          />
        </a>

        <UBadge
          v-if="relationship"
          color="neutral"
          variant="soft"
          class="RecordLink__badge"
          size="sm"
        >
          {{ capitalize(relationship) }}
        </UBadge>
      </div>
    </div>

    <div
      v-if="record?.summary || record?.content"
      class="RecordLink__summary"
    >
      {{ record.summary || record.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import usePredicates from '@app/composables/usePredicates';
import useRecord from '@app/composables/useRecord';
import type { DbId } from '@shared/types/api';
import { capitalize, computed } from 'vue';
import { RouterLink } from 'vue-router';

const modelValue = defineModel<DbId>({ required: true })

const { relationship } = defineProps<{
  relationship?: string;
}>()

const { getRecord } = useRecord()
const { getPredicates } = usePredicates()

const { data: record, error, isError, isLoading } = getRecord(modelValue, true, { includeOutgoingLinks: true });

const { data: predicates } = getPredicates();

const outgoingLinks = computed(() => record.value?.outgoingLinks ?? null)

const predicateMap = computed(() => {
  return Object.fromEntries((predicates.value ?? []).map((p) => [p.id, p]));
})

const outgoingLinksById = computed(() => {
  if (!outgoingLinks.value) return null;

  return Object.fromEntries(outgoingLinks.value?.map((link) => [link.target.id, link.target]) ?? []);
})

const creator = computed(() => {
  if (!outgoingLinks.value || !predicateMap.value || !outgoingLinksById.value) return null

  for (const edge of outgoingLinks.value) {
    const predicate = predicateMap.value[edge.predicateId];

    if (predicate && predicate.type === 'creation') {
      return outgoingLinksById.value[edge.target.id]
    }
  }

  return null;
})

const parent = computed(() => {
  if (!outgoingLinks.value || !predicateMap.value || !outgoingLinksById.value) return null

  for (const edge of outgoingLinks.value) {
    const predicate = predicateMap.value[edge.predicateId];

    if (predicate && predicate.type === 'containment') {
      return outgoingLinksById.value[edge.target.id]
    }
  }

  return null;
})

const title = computed(() => {
  if (record.value?.title) {
    return record.value.title
  }

  if (parent.value && parent.value.title) {
    return `↳ ${parent.value.title}`
  }

  if (creator.value && creator.value.title) {
    return creator.value.title
  }

  return null;
})
</script>

<style scoped>
.RecordLink {
  display: grid;
  gap: 2px;
}

.RecordLink__header {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: baseline;
}

.RecordLink__title {
  text-decoration: underline;
  font-size: 0.875rem;
  display: block;
  flex-grow: 1;
  text-decoration-color: var(--ui-border-accented);
  transition: text-decoration-color 0.15s ease-in-out;

  &:hover {
    text-decoration-color: currentColor;
  }
}

.RecordLink__headerMeta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.RecordLink__icon {
  color: var(--ui-text-dimmed);
}

.RecordLink__summary {
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--ui-text-muted);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}
</style>