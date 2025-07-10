import '@app/assets/css/theme.css';
import { createApp } from 'vue';
import App from '@app/AppLayout.vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { router } from '@app/router';
import { createHead } from '@unhead/vue/client';

const app = createApp(App);
const head = createHead({
  init: [
    {
      title: 'Vue.js + SQLite starter',
    },
  ],
});

app.use(router);
app.use(head);

app.use(VueQueryPlugin, {
  enableDevtoolsV6Plugin: true,
  queryClientConfig: {
    defaultOptions: {
      queries: {
        networkMode: 'always',
        retry: false,
      },
    },
  },
});

app.mount('#app');
