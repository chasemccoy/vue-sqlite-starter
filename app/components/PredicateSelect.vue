<template>
  <UDropdownMenu
    size="sm"
    :items="menuItems"
    :ui="{
      content: 'min-w-[200px]'
    }"
    :content="{
      align: 'start'
    }"
  >
    <UButton
      color="neutral"
      variant="outline"
      icon="i-lucide-list-tree"
      size="sm"
      :label="capitalize(selectedPredicate?.name ?? 'Predicates')"
    />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import usePredicates from '@app/composables/usePredicates';
import { capitalize } from '@shared/lib/formatting';
import type { DbId } from '@shared/types/api';
import { computed } from 'vue';

const modelValue = defineModel<DbId>({ default: 19 });

const { getPredicates } = usePredicates()

const { data: predicates } = getPredicates();

const menuItems = computed(() => {
  if (!predicates.value) return []

  return predicates.value.filter(p => p.canonical).map(p => ({
    label: capitalize(p.name),
    type: 'checkbox' as const,
    checked: modelValue.value === p.id,
    onUpdateChecked(checked: boolean) {
      if (checked) {
        modelValue.value = p.id
      }
    },
  }))
})

const selectedPredicate = computed(() => {
  if (!predicates.value) return null
  return predicates.value.find(p => p.id === modelValue.value)
})
</script>