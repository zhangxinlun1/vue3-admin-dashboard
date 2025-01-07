import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/components/Login.vue';
import NotFound from '@/components/NotFound.vue';
import Dashboard from "@components/Dashboard.vue";
import Users from "@components/Users.vue";
import Profile from "@components/Profile.vue";
import HomeDetail from "@components/HomeDetail.vue";
import ProductManage from "@views/product/ProductManage.vue";

// 定义路由数组，使用自定义的 AppRouteRecordRaw 类型
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        meta: { requiresAuth: true, title: '首页' },
        children: [
            {
                path: '/home',
                component: HomeDetail,
                meta: { title: '主页内容' }
            },
            {
                path: '/home/dashboard',
                component: Dashboard,
                meta: { title: '仪表盘' }
            },
            {
                path: '/home/users',
                component: Users,
                meta: { title: '用户管理' }
            },
            {
                path: '/home/product-manage',
                component: ProductManage,
                meta: { title: '商品管理' }
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        component: NotFound
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 路由守卫示例：全局前置守卫，用于验证用户是否登录
router.beforeEach((to, from, next) => {
    const publicPages = ['/login'];
    const authRequired = to.meta.requiresAuth as boolean;
    const loggedIn = localStorage.getItem('token');

    if (authRequired &&!loggedIn) {
        next('/login');
    } else {
        next();
    }
});

export default router;