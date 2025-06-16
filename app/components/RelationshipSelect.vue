<template>
  <UPopover
    :content="{ align: 'start', sideOffset: 8 }"
    :ui="{
      content: 'min-w-[400px]'
    }"
  >
    <UButton
      color="neutral"
      variant="outline"
      icon="i-lucide-link"
      size="sm"
      label="Add Link"
    />

    <template #content>
      <div class="LinkCreator__content">
        <div class="LinkCreator__field">
          <label class="LinkCreator__label">Target record</label>

          <USelectMenu
            v-model:searchTerm="searchQuery"
            v-model:modelValue="selectedTargetId"
            placeholder="Search for a record"
            valueKey="id"
            size="md"
            variant="outline"
            icon="i-lucide-search"
            :items="searchResultItems"
            :ui="{
              content: 'min-w-[300px]'
            }"
            ignoreFilter
          >
            <template
              v-if="searchResultItems && searchResultItems.length > 0"
              #item="{ item }"
            >
              <div class="LinkCreator__searchItem">
                <UIcon
                  v-if="item.icon"
                  :name="item.icon"
                />
                <span class="LinkCreator__searchLabel">{{ item.label }}</span>
              </div>
            </template>
          </USelectMenu>
        </div>

        <div class="LinkCreator__field">
          <label class="LinkCreator__label">Relationship</label>
          <USelectMenu
            v-model="selectedPredicateId"
            placeholder="Select a relationship"
            size="md"
            variant="outline"
            icon="i-lucide-list-tree"
            value-attribute="id"
            option-attribute="label"
            valueKey="id"
            :items="predicateOptions"
          />
        </div>

        <div class="LinkCreator__actions">
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            label="Cancel"
            @click="handleCancel"
          />
          <UButton
            color="primary"
            size="sm"
            label="Create Link"
            :disabled="!isFormValid"
            @click="handleSubmit"
          />
        </div>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import usePredicates from '@app/composables/usePredicates';
import useSearch from '@app/composables/useSearch';
import { capitalize } from '@shared/lib/formatting';
import type { DbId } from '@shared/types/api';
import type { InputMenuItem } from '@nuxt/ui';
import { computed, ref } from 'vue';

type SearchResultItem = InputMenuItem & {
  label: string;
  icon: string;
  id: string;
}

const emit = defineEmits<{
  'createLink': [{ targetRecordId: DbId; predicateId: DbId }];
}>();

const { sourceRecordId } = defineProps<{
  sourceRecordId: DbId;
}>();

const searchQuery = ref('');
const selectedTargetId = ref<string>();
const selectedPredicateId = ref<DbId>();

const { data: searchResults } = useSearch(searchQuery, computed(() => searchQuery.value.length > 0));
const { getPredicates } = usePredicates();
const { data: predicates } = getPredicates();

const searchResultItems = computed<SearchResultItem[]>(() => {
  if (!searchResults.value) return [];

  return searchResults.value
    .filter(record => record.id !== sourceRecordId)
    .map(record => ({
      id: record.id.toString(),
      label: record.title || record.slug,
      icon: getRecordIcon(record.type),
    }));
});

const predicateOptions = computed(() => {
  if (!predicates.value) return [];

  return predicates.value
    .filter(p => p.canonical)
    .map(p => ({
      id: p.id,
      label: capitalize(p.name),
    }));
});

const isFormValid = computed(() => {
  return selectedTargetId.value && selectedPredicateId.value;
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

function handleSubmit() {
  if (!isFormValid.value) return;

  emit('createLink', {
    targetRecordId: parseInt(selectedTargetId.value!),
    predicateId: selectedPredicateId.value!,
  });

  resetForm();
}

function handleCancel() {
  resetForm();
}

function resetForm() {
  searchQuery.value = '';
  selectedTargetId.value = undefined;
  selectedPredicateId.value = undefined;
}
</script>

<style scoped>
.LinkCreator__content {
  padding: 1rem;
  display: grid;
  gap: 1rem;
  min-width: 320px;
}

.LinkCreator__field {
  display: grid;
  gap: 0.5rem;
}

.LinkCreator__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ui-text-highlighted);
}

.LinkCreator__searchItem {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
}

.LinkCreator__searchItem :deep(svg) {
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  color: var(--ui-text-dimmed);
  position: relative;
  top: 1px;
}

.LinkCreator__searchLabel {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.LinkCreator__actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding-top: 0.5rem;
}
</style>