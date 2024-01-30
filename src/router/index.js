import { createRouter, createWebHistory } from 'vue-router';
import Serve from '/components/Serve.vue';
import Page from '/components/Page.vue';

const routes = [
    {
        path: "/web/",
        component: Serve
    },
    {
        // All other paths to Page
        path: "/web/:pathMatch(.*)*",
        component: Page
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router