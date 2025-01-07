"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
require("./style.css");
const pinia_1 = require("pinia");
const router_1 = require("./router");
const element_plus_1 = require("element-plus");
require("element-plus/dist/index.css");
require("@/main.css");
const App_vue_1 = require("@/App.vue"); // 导入包含 Tailwind CSS 的主 CSS 文件
const app = (0, vue_1.createApp)(App_vue_1.default);
app.use(router_1.default);
const pinia = (0, pinia_1.createPinia)();
app.use(pinia);
app.use(element_plus_1.default);
app.mount('#app');
