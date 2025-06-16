<template>
  <UPopover
    v-model:open="isOpen"
    :content="{ align: 'start', sideOffset: 8 }"
    :ui="{
      content: 'min-w-[400px]',
    }"
  >
    <UButton
      color="neutral"
      variant="outline"
      icon="i-lucide-list-tree"
      label="Add Link"
    />

    <template #content>
      <div
        v-if="currentStep === 'predicate'"
        class="RelationshipSelect__header"
      >
        <UButton
          variant="ghost"
          size="xs"
          icon="i-lucide-arrow-left"
          @click="goBackToRecordSelection"
        />

        <span class="RelationshipSelect__headerText"> Linking to: {{ selectedRecord?.label }} </span>
      </div>

      <UCommandPalette
        v-if="currentStep === 'record'"
        v-model:searchTerm="searchQuery"
        placeholder="Search for a record to link..."
        :groups="commandItems"
        :ui="{ input: '[&>input]:h-8 [&>input]:text-sm' }"
        ignoreFilter
        @update:modelValue="handleRecordSelect"
      />

      <UCommandPalette
        v-else-if="currentStep === 'predicate'"
        v-model:searchTerm="predicateQuery"
        placeholder="Select a relationship type..."
        :groups="predicateCommandItems"
        :ui="{ input: '[&>input]:h-8 [&>input]:text-sm' }"
        @update:modelValue="handlePredicateSelect"
      >
        <template #header>
          <div class="RelationshipSelect__header">
            <UButton
              variant="ghost"
              size="xs"
              icon="i-lucide-arrow-left"
              @click="goBackToRecordSelection"
            />

            <span class="RelationshipSelect__headerText"> Linking to: {{ selectedRecord?.label }} </span>
          </div>
        </template>
      </UCommandPalette>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import usePredicates from '@app/composables/usePredicates';
import useSearch from '@app/composables/useSearch';
import { capitalize } from '@shared/lib/formatting';
import type { DbId } from '@shared/types/api';
import type { CommandPaletteItem } from '@nuxt/ui';
import { computed, ref, watch } from 'vue';

type SearchResultItem = {
  label?: string;
  icon: string;
  id: string;
};

const emit = defineEmits<{
  createLink: [{ targetRecordId: DbId; predicateId: DbId }];
}>();

const { sourceRecordId } = defineProps<{
  sourceRecordId: DbId;
}>();

const isOpen = ref(false);
const currentStep = ref<'record' | 'predicate'>('record');
const searchQuery = ref('');
const predicateQuery = ref('');
const selectedRecord = ref<SearchResultItem>();

const { data: searchResults } = useSearch(
  searchQuery,
  computed(() => searchQuery.value.length > 0),
);

const { getPredicates } = usePredicates();
const { data: predicates } = getPredicates();

const commandItems = computed(() => {
  if (!searchResults.value) return [];

  const items = searchResults.value
    .filter((record) => record.id !== sourceRecordId)
    .map((record) => ({
      id: record.id.toString(),
      label: record.title || record.slug,
      icon: getRecordIcon(record.type),
      suffix: record.summary || record.content || undefined,
      // prefix: record.summary || record.content || undefined,
    }));

  return [
    {
      id: 'records',
      items,
    }
  ]
});

const predicateCommandItems = computed(() => {
  if (!predicates.value) return [];

  const items = predicates.value
    .filter((p) => p.canonical)
    .map((p) => ({
      id: p.id.toString(),
      label: capitalize(p.name),
      icon: 'i-lucide-list-tree',
      suffix: capitalize(p.type),
    }));

  return [
    {
      id: 'predicates',
      items,
    }
  ]
});

watch(isOpen, () => {
  if (!isOpen.value) {
    resetForm();
  }
});

function getRecordIcon(type: string) {
  switch (type) {
    case 'artifact':
      return 'i-lucide-file';
    case 'concept':
      return 'i-lucide-lightbulb';
    case 'entity':
      return 'i-lucide-user';
    default:
      return 'i-lucide-circle';
  }
}

function handleRecordSelect(item: CommandPaletteItem) {
  if (!item) return;

  selectedRecord.value = {
    id: item.id,
    label: item.label,
    icon: item.icon || 'i-lucide-circle',
  };

  predicateQuery.value = '';
  currentStep.value = 'predicate';
}

function handlePredicateSelect(item: CommandPaletteItem) {
  if (!item || !selectedRecord.value) return;

  emit('createLink', {
    targetRecordId: parseInt(selectedRecord.value.id),
    predicateId: parseInt(item.id),
  });

  resetForm();
}

function goBackToRecordSelection() {
  currentStep.value = 'record';
  selectedRecord.value = undefined;
}

function resetForm() {
  isOpen.value = false;
  currentStep.value = 'record';
  searchQuery.value = '';
  predicateQuery.value = '';
  selectedRecord.value = undefined;
}
</script>

<style scoped>
.RelationshipSelect__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--ui-border);
}

.RelationshipSelect__headerText {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ui-text-highlighted);
}

.RelationshipSelect__searchItem {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
}

.RelationshipSelect__searchItem :deep(svg) {
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  color: var(--ui-text-dimmed);
  position: relative;
  top: 1px;
}

.RelationshipSelect__searchLabel {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}
</style>
