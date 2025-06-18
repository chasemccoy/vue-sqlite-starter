import AddRecordView from '@app/views/AddRecordView.vue';
import ConceptsView from '@app/views/ConceptsView.vue';
import EditRecordView from '@app/views/EditRecordView.vue';
import EntitiesView from '@app/views/EntitiesView.vue';
import InboxView from '@app/views/InboxView.vue';
import IndexView from '@app/views/IndexView.vue';
import RecordView from '@app/views/RecordView.vue';
import { createWebHistory, createRouter } from 'vue-router';

export enum RouteName {
	index = 'index',
	inbox = 'inbox',
	concepts = 'concepts',
	entities = 'entities',
	add = 'add',
	edit = 'edit',
}

const routes = [
	{
		path: '/',
		name: RouteName.index,
		component: IndexView,
		children: [
			{
				path: ':slug',
				component: RecordView,
			},
		],
	},
	{
		path: '/inbox',
		name: RouteName.inbox,
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
		name: RouteName.concepts,
		component: ConceptsView,
	},
	{
		path: '/entities',
		name: RouteName.entities,
		component: EntitiesView,
	},
	{
		path: '/add',
		name: RouteName.add,
		component: AddRecordView,
	},
	{
		path: '/edit/:id',
		name: RouteName.edit,
		component: EditRecordView,
	},
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
