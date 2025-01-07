"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_router_1 = require("vue-router");
const Home_vue_1 = require("@/views/Home.vue");
const Login_vue_1 = require("@/components/Login.vue");
const NotFound_vue_1 = require("@/components/NotFound.vue");
const Dashboard_vue_1 = require("@components/Dashboard.vue");
const Users_vue_1 = require("@components/Users.vue");
const HomeDetail_vue_1 = require("@components/HomeDetail.vue");
const ProductManage_vue_1 = require("@views/product/ProductManage.vue");
// 定义路由数组，使用自定义的 AppRouteRecordRaw 类型
const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login_vue_1.default
    },
    {
        path: '/home',
        component: Home_vue_1.default,
        meta: { requiresAuth: true, title: '首页' },
        children: [
            {
                path: '/home',
                component: HomeDetail_vue_1.default,
                meta: { title: '主页内容' }
            },
            {
                path: '/home/dashboard',
                component: Dashboard_vue_1.default,
                meta: { title: '仪表盘' }
            },
            {
                path: '/home/users',
                component: Users_vue_1.default,
                meta: { title: '用户管理' }
            },
            {
                path: '/home/product-manage',
                component: ProductManage_vue_1.default,
                meta: { title: '商品管理' }
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        component: NotFound_vue_1.default
    }
];
const router = (0, vue_router_1.createRouter)({
    history: (0, vue_router_1.createWebHistory)(),
    routes
});
// 路由守卫示例：全局前置守卫，用于验证用户是否登录
router.beforeEach((to, from, next) => {
    const publicPages = ['/login'];
    const authRequired = to.meta.requiresAuth;
    const loggedIn = localStorage.getItem('token');
    if (authRequired && !loggedIn) {
        next('/login');
    }
    else {
        next();
    }
});
exports.default = router;
