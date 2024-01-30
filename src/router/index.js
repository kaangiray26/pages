import { createRouter, createWebHistory } from 'vue-router';
import Serve from '/components/Serve.vue';
import Page from '/components/Page.vue';

const routes = [
    {
        path: "/pages/",
        component: Serve
    },
    {
        // All other paths to Page
        path: "/pages/:pathMatch(.*)*",
        component: Page
    }
];

const router = createRouter({
    history: createWebHistory('/pages/'),
    routes
});

export default router