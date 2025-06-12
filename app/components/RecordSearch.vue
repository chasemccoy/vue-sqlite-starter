<template>
  <UInputMenu
    v-model:searchTerm="modelValue"
    v-model:modelValue="selectedSlug"
    placeholder="Find a record"
    valueKey="id"
    size="lg"
    variant="subtle"
    icon="i-lucide-search"
    :items="searchResultItems"
    :arrow="false"
    ignoreFilter
    @update:modelValue="handleSelect"
  >
    <template
      v-if="searchResultItems && searchResultItems.length > 0"
      #item="{ item }"
    >
      <div class="RecordSearch__item">
        <UIcon
          v-if="item.icon"
          :name="item.icon"
        />
        <span class="RecordSearch__label">{{ item.label }}</span>
      </div>
    </template>

    <template #trailing>
      <span />
    </template>
  </UInputMenu>
</template>

<script setup lang="ts">
import type { InputMenuItem } from '@nuxt/ui';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

type SearchResultItem = InputMenuItem & {
  label: string;
  icon: string;
  id: string;
}

const modelValue = defineModel<string>();

const { searchResultItems } = defineProps<{
  searchResultItems?: SearchResultItem[];
}>()

const router = useRouter();

const selectedSlug = ref('');

function handleSelect(slug: string) {
  router.push(`/${slug}`);
  selectedSlug.value = '';
}
</script>

<style scoped>
.RecordSearch__item {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;

  & :deep(svg) {
    flex-shrink: 0;
    width: 12px;
    height: 12px;
    color: var(--ui-text-dimmed);
    position: relative;
    top: 1px;
  }
}

.RecordSearch__label {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}
</style>