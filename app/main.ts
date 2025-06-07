import '@app/assets/css/global.css';
import { createApp } from 'vue';
import App from '@app/App.vue';
import PrimeVue from 'primevue/config';
import { Theme } from '@app/utils/theme';
import { VueQueryPlugin } from '@tanstack/vue-query';

const app = createApp(App);

app.use(PrimeVue, {
	theme: {
		preset: Theme,
	},
});

app.use(VueQueryPlugin);

app.mount('#app');
