import AddRecordView from '@app/views/AddRecordView.vue';
import ArtifactsView from '@app/views/ArtifactsView.vue';
import ConceptsView from '@app/views/ConceptsView.vue';
import EditRecordView from '@app/views/EditRecordView.vue';
import EntitiesView from '@app/views/EntitiesView.vue';
import InboxView from '@app/views/InboxView.vue';
import IndexView from '@app/views/IndexView.vue';
import RecordView from '@app/views/RecordView.vue';
import { createWebHistory, createRouter } from 'vue-router';

const routes = [
	{
		path: '/',
		component: IndexView,
	},
	{
		path: '/inbox',
		component: InboxView,
		children: [
			{
				path: 'record/:slug',
				component: RecordView,
			},
		],
	},
	{
		path: '/concepts',
		component: ConceptsView,
	},
	{
		path: '/entities',
		component: EntitiesView,
	},
	{
		path: '/artifacts',
		component: ArtifactsView,
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
