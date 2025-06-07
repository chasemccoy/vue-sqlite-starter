<template>
	<div class="App">
		<DataTable :value="products" table-style="min-width: 50rem">
			<Column field="code" header="Code" />
			<Column field="name" header="Name" />
			<Column field="category" header="Category" />
			<Column field="quantity" header="Quantity" />
		</DataTable>

		<EditRecordView :model-value="1" />
	</div>
</template>

<script async setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref } from 'vue';
import EditRecordView from '@app/views/EditRecordView.vue';

const products = ref([
	{
		code: '1',
		name: 'Product 1',
		category: 'Category 1',
		quantity: 10,
	},
]);
</script>

<style scoped>
.App {
	padding: 1rem;
}
</style>
