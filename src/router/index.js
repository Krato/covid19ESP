import Vue from 'vue';
import VueRouter from 'vue-router';
import Spain from '@/views/Spain.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'spain',
        component: Spain,
    },
    {
        path: '/mundo',
        name: 'world',
        component: () => import(/* webpackChunkName: "world" */ '@/views/World.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
