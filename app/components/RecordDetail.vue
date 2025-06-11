<template>
  <div v-if="modelValue" class="RecordDetail">
    <h1 v-if="modelValue.title" class="RecordDetail__title">
      {{ modelValue.title }} ({{ modelValue.id }})
    </h1>

    <p v-if="modelValue.summary">{{ modelValue.summary }}</p>

    <a v-if="modelValue.url" :href="modelValue.url" target="_blank">{{ modelValue.url }}</a>

    <p v-if="modelValue.notes">{{ modelValue.notes }}</p>

    <UBadge v-if="modelValue.source" color="neutral" variant="outline" class="RecordDetail__badge">
      {{ capitalize(modelValue.source) }}
    </UBadge>

    <div v-if="modelValue.content">
      {{ modelValue.content }}
    </div>

    <div v-if="incomingLinks && incomingLinks.length > 0" class="RecordDetail__section">
      <h2 class="RecordDetail__sectionTitle">Incoming links</h2>
      <ul>
        <li v-for="link in incomingLinks" :key="link.id">
          <RecordLink :model-value="link.sourceId" />
        </li>
      </ul>
    </div>

    <div v-if="outgoingLinks && outgoingLinks.length > 0" class="RecordDetail__section">
      <h2 class="RecordDetail__sectionTitle">Outgoing links</h2>
      <ul>
        <li v-for="link in outgoingLinks" :key="link.id">
          <RecordLink :model-value="link.targetId" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import RecordLink from '@app/components/RecordLink.vue';
import type { GetRecordQueryResponse, LinksForRecordQueryResponse } from '@db/queries/records';
import { capitalize } from '@shared/lib/formatting';
import { computed } from 'vue';

const modelValue = defineModel<GetRecordQueryResponse>({ required: true })

const { links } = defineProps<{
  links?: LinksForRecordQueryResponse
}>()

const incomingLinks = computed(() => links?.incomingLinks ?? null)
const outgoingLinks = computed(() => links?.outgoingLinks ?? null)
</script>

<style scoped>
.RecordDetail {
  display: grid;
  gap: 1rem;
}

.RecordDetail__title {
  font-size: 1.5rem;
}

.RecordDetail__section {
  display: grid;
  gap: 0.25rem;
}

.RecordDetail__sectionTitle {
  font-size: 0.75rem;
  text-transform: uppercase;
}

.RecordDetail__badge {
  width: fit-content;
}
</style>