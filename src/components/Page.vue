<template>
    <div ref="content"></div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router';
import { Peer } from 'peerjs';

const router = useRouter();
const peer = ref(null);

const content = ref(null);

async function display(data) {
    document.title = data.title;
    content.value.innerHTML = data.content;
}

async function get(addr, route, query) {
    peer.value = new Peer();
    peer.value.on('open', () => {
        const connection = peer.value.connect(addr, {
            reliable: true,
            metadata: {
                route,
                query
            }
        })
        connection.on('data', (data) => {
            display(data);
        })
        connection.on('error', (err) => {
            console.log('error', err);
        })
    })
    peer.value.on('error', (err) => {
        console.log('error', err);
    })
}

onBeforeMount(() => {
    const query = router.currentRoute.value.query;
    const path = router.currentRoute.value.params.pathMatch;

    const address = path[0];
    const route = '/' + path.slice(1).join('/');

    // Request data from the address
    get(address, route, query);
})
</script>