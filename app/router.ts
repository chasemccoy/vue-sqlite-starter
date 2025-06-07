import AddRecordView from '@app/views/AddRecordView.vue';
import IndexView from '@app/views/IndexView.vue';
import { createWebHistory, createRouter } from 'vue-router';

const routes = [
	{
		path: '/',
		component: IndexView,
	},
	{
		path: '/add',
		component: AddRecordView,
	},
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
