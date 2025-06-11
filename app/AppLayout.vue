<template>
	<UApp>
		<div class="App">
			<UNavigationMenu color="neutral" :items="navItems" />
			<RouterView />
		</div>
	</UApp>
</template>

<script async setup lang="ts">
const navItems = [
	[
		{
			label: 'Enchiridion',
			to: '/'
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
	padding: 1rem;
	display: grid;
	gap: 2rem;
}
</style>
