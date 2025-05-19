import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        redirect: '/lucky' // 默认重定向到抽奖页面
    },
    {
        path: '/lucky',
        name: 'lucky',
        component: () => import('../views/LuckyDraw.vue')
    },
    {
        path: '/bank',
        name: 'bank',
        component: () => import('../views/Bank.vue')
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;