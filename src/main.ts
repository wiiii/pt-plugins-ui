// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Element3 from 'element3';
import 'element3/lib/theme-chalk/index.css';
import './assets/fontawesome-free-6.7.2/css/all.min.css';
import './assets/reset.css';

const app = createApp(App);
app.use(router);
app.use(Element3);
app.mount('#app');