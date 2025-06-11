<template>
	<UApp>
		<div class="App">
			<UNavigationMenu color="neutral" :items="navItems" class="App__nav" />

			<div class="App__content">
				<RouterView />
			</div>
		</div>
	</UApp>
</template>

<script async setup lang="ts">
const navItems = [
	[
		{
			label: 'Enchiridion',
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
		}
	],
	[
		{
			label: 'Add record',
			to: '/add',
			icon: 'i-lucide-plus',
		}
	]
]
</script>

<style scoped>
.App {
	display: grid;
	gap: 1rem;
}

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
}
</style>
