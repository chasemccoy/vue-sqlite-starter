import AddRecordView from '@app/views/AddRecordView.vue';
import EditRecordView from '@app/views/EditRecordView.vue';
import IndexView from '@app/views/IndexView.vue';
import RecordView from '@app/views/RecordView.vue';
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
	{
		path: '/:slug',
		component: RecordView,
	},
	{
		path: '/edit/:id',
		component: EditRecordView,
	},
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
