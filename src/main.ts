import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia';
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/main.css';
import App from "@/App.vue"; // 导入包含 Tailwind CSS 的主 CSS 文件

const app = createApp(App)
app.use(router)


const pinia = createPinia();
app.use(pinia);
app.use(ElementPlus)
app.mount('#app')