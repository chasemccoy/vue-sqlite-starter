import IndexView from '@app/views/IndexView.vue';
import { createWebHistory, createRouter } from 'vue-router';

export enum RouteName {
  index = 'index',
}

const routes = [
  {
    path: '/',
    name: RouteName.index,
    component: IndexView,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
