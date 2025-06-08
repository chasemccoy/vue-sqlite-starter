import '@app/assets/css/global.css';
import '@app/assets/css/theme.css';
import 'primeicons/primeicons.css';
import { createApp } from 'vue';
import App from '@app/AppLayout.vue';
import PrimeVue from 'primevue/config';
import { Theme } from '@app/utils/theme';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { router } from '@app/router';

const app = createApp(App);

app.use(router);

app.use(PrimeVue, {
	theme: {
		preset: Theme,
	},
});

app.use(VueQueryPlugin, {
	enableDevtoolsV6Plugin: true,
});

app.mount('#app');
