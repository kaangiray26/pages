<template>
    <div v-show="neterror"
        style="position: absolute;top: 0;left: 0;width: 100vw;height: 100vh;display: flex;justify-content: center;align-items: center;background-color: #1c1b22;color:rgb(251, 251, 254);">
        <div style="display: flex;flex-direction: column;padding: 3rem;">
            <img src="/star.svg" width="96" style="padding-bottom: 1rem;">
            <h1>Hmm. We're having trouble finding that peer.</h1>
            <p>We can’t connect to the server at {{ page.address }}.</p>
            <p>If you entered the right address, you can:</p>
            <ul>
                <li>Try again later</li>
                <li>Check your network connection</li>
            </ul>
            <div style="display: flex;justify-content: end;">
                <a :href="router.currentRoute.value.fullPath"
                    style="background-color: #ffc107;color:rgb(43, 42, 51);padding: 0 1.5em;font-weight: 600;text-decoration: none;border-radius: 4px;min-height: 32px;line-height: 19.5px;display: flex;align-items: center;">Try
                    again</a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router';
import { Peer } from 'peerjs';

const router = useRouter();

const neterror = ref(false);

// Web page data
const page = ref({
    address: '',
    route: '',
    query: [],
})

async function display(data) {
    document.open();
    document.write(data.content);
    document.close();
}

async function get(page) {
    // Create peer
    window.peer = new Peer();

    // Set handlers
    window.peer.on('open', () => {
        window.connection = window.peer.connect(page.value.address, {
            reliable: true,
            metadata: {
                route: page.value.route,
                query: page.value.query
            }
        })
        window.connection.on('data', (data) => {
            console.log("Data received:", data);
            display(data);
        })
        window.connection.on('error', (err) => {
            console.log(err);
        })
    })

    window.peer.on('error', (err) => {
        if (err.type == 'peer-unavailable') {
            neterror.value = true;
        }
    })
}

onBeforeMount(() => {
    const path = router.currentRoute.value.params.pathMatch;

    page.value = {
        address: path[0],
        route: '/' + path.slice(1).join('/'),
        query: router.currentRoute.value.query,
    }

    // Request data from the address
    get(page.value);
})
</script>