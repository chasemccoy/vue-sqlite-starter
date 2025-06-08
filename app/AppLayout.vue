<template>
	<div class="App">
		<Toolbar>
			<template #start>
				<RouterLink to="/">Enchiridion</RouterLink>
			</template>

			<template #end>
				<Button icon="pi pi-plus" class="mr-2" severity="secondary" text @click="handleAddRecord" />
			</template>
		</Toolbar>
		<RouterView />
	</div>
</template>

<script async setup lang="ts">
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter()

function handleAddRecord() {
	router.push({ path: '/add' })
}
</script>

<style scoped>
.App {
	padding: 1rem;
	display: grid;
	gap: 2rem;
}
</style>
