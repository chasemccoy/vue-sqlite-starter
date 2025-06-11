<template>
	<UTable v-if="modelValue" :data="modelValue" :columns="columns" :columnVisibility="columnVisibility"
		@select="handleRowSelect" />
</template>

<script setup lang="ts">
import type { ListRecordsQueryResponse } from '@db/queries/records';
import type { TableRow } from '@nuxt/ui';
import { capitalize } from '@shared/lib/formatting';
import { computed, h, resolveComponent } from 'vue';
import { useRouter } from 'vue-router';

const modelValue = defineModel<ListRecordsQueryResponse>({ required: true })

const props = defineProps<{
	hideColumns?: string[]
}>()

const router = useRouter()

const UBadge = resolveComponent('UBadge')

const columnVisibility = computed(() => {
	return props.hideColumns?.reduce((acc, column) => {
		acc[column] = false
		return acc
	}, { slug: false, id: false, summary: false } as Record<string, boolean>)
})

const columns = [
	{
		accessorKey: 'id',
		header: 'ID',
	},
	{
		accessorKey: 'type',
		header: 'Type',
		cell: ({ row }: { row: TableRow<ListRecordsQueryResponse[number]> }) => {
			return h(UBadge, {
				color: 'neutral',
				size: 'sm',
				variant: 'subtle',
			}, () => capitalize(row.getValue('type') as string))
		},
	},
	{
		accessorKey: 'slug',
		header: 'Slug',
	},
	{
		accessorKey: 'title',
		header: 'Title',
	},
	{
		accessorKey: 'url',
		header: 'URL',
	},
	{
		accessorKey: 'content',
		header: 'Content',
		cell: ({ row }: { row: TableRow<ListRecordsQueryResponse[number]> }) => {
			return row.getValue('content') || row.getValue('summary')
		},
		meta: {
			class: {
				td: 'RecordTable__contentCell',
			}
		}
	},
	{
		accessorKey: 'summary',
		header: 'Summary',
	},
	{
		accessorKey: 'recordCreatedAt',
		header: 'Created',
	}
]

function handleRowSelect(row: TableRow<ListRecordsQueryResponse[number]>) {
	router.push(`/${row.getValue('slug')}`)
}
</script>

<style scoped>
:deep(.RecordTable__contentCell) {
	max-width: 400px;
	text-wrap: auto;
	/* overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap; */
}
</style>