import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/main.css';
import App from "./App.vue";
import {router} from "./router";
import axiosInstance from '@/api/axios';
const app = createApp(App)
app.use(router)
app.config.globalProperties.$axios = axiosInstance;

const pinia = createPinia();
app.use(pinia);
app.use(ElementPlus)
app.mount('#app')