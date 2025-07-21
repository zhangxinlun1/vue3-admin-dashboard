import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from "@/views/Home.vue";
import HomeDetail from "@/components/HomeDetail.vue";
import Dashboard from "@/views/Dashboard.vue";
import Users from "@/components/Users.vue";
import NotFound from "@/components/NotFound.vue";
import ProductManage from "@/views/product/ProductManage.vue";
import AddProduct from "@/views/inventory/AddProduct.vue";
import ProductList from "@/views/inventory/ProductList.vue";
import CreateOrder from "@/views/orders/CreateOrder.vue";
import OrderList from "@/views/orders/OrderList.vue";
import ProductDetail from "@/views/inventory/ProductDetail.vue";
import StockAdjustment from "@/views/inventory/StockAdjustment.vue";

// 定义路由数组，使用自定义的 AppRouteRecordRaw 类型


const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: () => import('@/components/Login.vue')
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
            {
                path: '/home/inventory/add',
                component: AddProduct,
                meta: { title: '商品入库' }
            },
            {
                path: '/home/inventory/list',
                component: ProductList,
                meta: { title: '库存管理' }
            },
            {
                path: '/home/inventory/detail/:id',
                component: ProductDetail,
                meta: { title: '商品详情' }
            },
            {
                path: '/home/inventory/adjust/:id',
                component: StockAdjustment,
                meta: { title: '库存调整' }
            },
            {
                path: '/home/orders/create',
                component: CreateOrder,
                meta: { title: '商品销售' }
            },
            {
                path: '/home/orders/list',
                component: OrderList,
                meta: { title: '销售记录' }
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        component: NotFound
    }
];

// 路由守卫示例：全局前置守卫，用于验证用户是否登录

export const router = createRouter({
    history: createWebHistory(),
    routes
});

