import {createRouter, createWebHistory} from 'vue-router';

import LuckyDraw from '../views/LuckyDraw.vue';
import Bank from '../views/Bank.vue';


const routes = [
    {
        path: '/',
        redirect: '/lucky' // 默认重定向到抽奖页面
    },
    {
        path: '/lucky',
        name: 'lucky',
        component: LuckyDraw
    },
    {
        path: '/bank',
        name: 'bank',
        component: Bank
    },
];

const router = createRouter({
    history: createWebHistory('/plugins/'),
    routes
});

export default router;