<template>
	<UDropdownMenu
		size="sm"
		:items="menuItems"
		:ui="{
			content: 'min-w-[200px]',
		}"
		:content="{
			align: 'start',
		}"
	>
		<UButton
			color="neutral"
			variant="link"
			trailingIcon="i-lucide-chevrons-up-down"
			size="sm"
			:label="label"
		/>
	</UDropdownMenu>
</template>

<script setup lang="ts">
import usePredicates from '@app/composables/usePredicates';
import type { PredicateSelect } from '@db/schema';
import { capitalize } from '@shared/lib/formatting';
import type { DbId } from '@shared/types/api';
import { computed } from 'vue';

const modelValue = defineModel<DbId>({ default: 19 });

const emit = defineEmits<{
	'select:predicate': [PredicateSelect];
	'delete:link': [];
}>();

const { linkDirection = 'outgoing' } = defineProps<{
	linkDirection?: 'incoming' | 'outgoing';
}>();

const { getPredicates } = usePredicates();
const { data: predicates } = getPredicates();

const menuItems = computed(() => {
	if (!predicates.value) return [];

	const predicateItems = predicates.value
		.filter((p) => p.canonical)
		.map((p) => ({
			label: capitalize(p.name),
			type: 'checkbox' as const,
			checked: modelValue.value === p.id,
			onUpdateChecked(checked: boolean) {
				if (checked && p.id !== modelValue.value) {
					modelValue.value = p.id;
					emit('select:predicate', p);
				}
			},
		}));

	return [
		predicateItems,
		[
			{
				label: 'Delete',
				icon: 'i-lucide-trash',
				color: 'error',
				onSelect() {
					emit('delete:link');
				}
			}
		]
	]
});

const selectedPredicate = computed(() => {
	if (!predicates.value) return null;
	return predicates.value.find((p) => p.id === modelValue.value);
});

const selectedInverse = computed(() => {
	if (!predicates.value || !selectedPredicate.value) return null;

	const inverseSlug = selectedPredicate.value.inverseSlug;
	return predicates.value.find((p) => p.slug === inverseSlug);
});

const label = computed(() => {
	let name = selectedPredicate.value?.name;

	if (linkDirection === 'incoming') {
		name = selectedInverse.value?.name;
	}

	return name ? capitalize(name) : 'Predicates'
});
</script>
