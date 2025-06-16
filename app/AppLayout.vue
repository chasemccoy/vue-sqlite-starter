<template>
	<UApp>
		<div class="App">
			<UNavigationMenu
				color="neutral"
				class="App__nav"
				:items="navItems"
			/>

			<div class="App__content">
				<RecordSearch
					v-model="searchQuery"
					:searchResultItems="searchResultItems"
				/>

				<RouterView />
			</div>
		</div>
	</UApp>
</template>

<script async setup lang="ts">
import RecordSearch from '@app/components/RecordSearch.vue';
import useSearch from '@app/composables/useSearch';
import { computed, ref } from 'vue';

const searchQuery = ref('');
const shouldSearch = computed(() => searchQuery.value !== '');

const navItems = [
	[
		{
			to: '/',
			icon: 'i-lucide-home',
		},
		{
			label: 'Concepts',
			to: '/concepts',
			icon: 'i-lucide-brain',
		},
		{
			label: 'Entities',
			to: '/entities',
			icon: 'i-lucide-users',
		},
		{
			label: 'Artifacts',
			to: '/artifacts',
			icon: 'i-lucide-box',
		},
	],
	[
		{
			to: '/add',
			icon: 'i-lucide-plus',
		},
	],
];

const iconForType = {
	entity: 'i-lucide-user',
	artifact: 'i-lucide-box',
	concept: 'i-lucide-brain',
};

const { data: searchResults } = useSearch(searchQuery, shouldSearch);

const searchResultItems = computed(() => {
	if (!searchResults.value) return undefined;

	return searchResults.value.map((result) => ({
		label: result.title || result.content || result.slug,
		id: result.slug,
		icon: iconForType[result.type],
	}));
});
</script>

<style scoped>
:deep(.App__nav) {
	position: sticky;
	top: 0px;
	z-index: 1;
	background-color: var(--ui-bg);
	border-bottom: 1px solid var(--ui-border);
	padding: 0.25rem 0.5rem;
}

.App__content {
	padding: 1rem;
	display: grid;
	gap: 2rem;
}
</style>
