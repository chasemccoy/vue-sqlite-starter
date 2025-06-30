<template>
  <UTable
    v-if="modelValue"
    :data="modelValue"
    :columns="columns"
    :columnVisibility="columnVisibility"
    @select="handleRowSelect"
  >
    <template #url-cell="{ row }">
      <a
        v-if="row.getValue('url')"
        target="_blank"
        :href="row.getValue('url')"
      >
        <UIcon
          name="i-lucide-link"
          class="RecordLink__icon"
        />
      </a>
    </template>
  </UTable>
</template>

<script setup lang="ts">
import type { ListRecordsAPIResponse } from '@db/queries/records';
import type { TableRow } from '@nuxt/ui';
import { capitalize, formatDate } from '@shared/lib/formatting';
import { computed, h, resolveComponent } from 'vue';
import { useRouter } from 'vue-router';

const modelValue = defineModel<ListRecordsAPIResponse>({ required: true });

const props = defineProps<{
  hideColumns?: string[];
}>();

const router = useRouter();

const UBadge = resolveComponent('UBadge');

const columnVisibility = computed(() => {
  return props.hideColumns?.reduce(
    (acc, column) => {
      acc[column] = false;
      return acc;
    },
    { slug: false, id: false, summary: false } as Record<string, boolean>,
  );
});

const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }: { row: TableRow<ListRecordsAPIResponse[number]> }) => {
      return h(
        UBadge,
        {
          color: 'neutral',
          variant: 'outline',
        },
        () => capitalize(row.getValue('type') as string),
      );
    },
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'title',
    header: 'Title',
    meta: {
      class: {
        td: 'RecordTable__titleCell',
      },
    },
  },
  {
    accessorKey: 'url',
    header: 'URL',
  },
  {
    accessorKey: 'content',
    header: 'Content',
    cell: ({ row }: { row: TableRow<ListRecordsAPIResponse[number]> }) => {
      return row.getValue('content') || row.getValue('summary');
    },
    meta: {
      class: {
        td: 'RecordTable__contentCell',
      },
    },
  },
  {
    accessorKey: 'summary',
    header: 'Summary',
  },
  {
    accessorKey: 'recordCreatedAt',
    header: 'Created',
    cell: ({ row }: { row: TableRow<ListRecordsAPIResponse[number]> }) => {
      return formatDate(new Date(row.getValue('recordCreatedAt')));
    },
  },
];

function handleRowSelect(row: TableRow<ListRecordsAPIResponse[number]>) {
  router.push(`/${row.getValue('slug')}`);
}
</script>

<style scoped>
:deep(.RecordTable__contentCell) {
  max-width: 400px;
  text-wrap: auto;
}

:deep(.RecordTable__titleCell) {
  max-width: 400px;
  text-wrap: auto;
}
</style>
