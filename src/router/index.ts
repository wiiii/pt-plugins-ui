// src/router/index.ts
import {createRouter, createWebHistory,} from 'vue-router';
import Home from '../views/Home.vue';
import LuckyDraw from '../views/LuckyDraw.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/lucky',
        name: 'LuckyDraw',
        component: LuckyDraw
    },
    // {
    //     path: '/page1',
    //     name: 'Page1',
    //     component: Page1
    // },
    // {
    //     path: '/page2',
    //     name: 'Page2',
    //     component: Page2
    // },
    // {
    //     path: '/page3',
    //     name: 'Page3',
    //     component: Page3
    // }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;