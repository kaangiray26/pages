<template>
    <div class="container d-flex flex-column py-4">
        <h1 class="fw-bold">Web</h1>
        <p>Create and serve your own web pages directly from your browser.</p>
        <div class="bg-dark text-light rounded shadow p-3">
            <span>{{ serving ? 'Active' : 'Not active' }}</span>
        </div>
        <hr>
        <div class="d-flex flex-column">
            <h1 class="fw-bold">Configuration</h1>
            <form>
                <div class="row mb-3">
                    <label for="inputTitle" class="col-sm-2 col-form-label">Title</label>
                    <div class="col-sm-10">
                        <input v-model="data.title" type="text" class="form-control" id="inputTitle"
                            placeholder="My amazing page">
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="inputAddress" class="col-sm-2 col-form-label">Address</label>
                    <div class="col-sm-10 mb-2">
                        <input v-model="data.address" type="text" class="form-control" placeholder="example"
                            id="inputAddress" :readonly="serving">
                    </div>
                    <span class="col-sm-10 offset-sm-2">Your web page will be available at
                        <span class="fw-bold">https://kaangiray26.github.io/web/{{ data.address }}</span></span>
                </div>
                <div class="row mb-3">
                    <label for="inputContent" class="col-sm-2 col-form-label">Content</label>
                    <div class="col-sm-10">
                        <textarea v-model="data.content" class="form-control" placeholder="<h1>Hey people!</h1>"
                            id="inputContent" rows="5"></textarea>
                    </div>
                </div>
            </form>
        </div>
        <hr>
        <div class="d-flex flex-column">
            <h1 class="fw-bold">Ready to publish?</h1>
            <p>Click the button below to publish your web page.</p>
            <div class="d-flex justify-content-end">
                <button v-if="!serving" type="button" class="btn btn-primary" @click="start_serving">Publish</button>
                <button v-else type="button" class="btn btn-danger" @click="stop_serving">Stop</button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { Peer } from 'peerjs';

const peer = ref(null);
const serving = ref(false);

// Web page data
const data = ref({
    title: '',
    address: '',
    content: ''
})

async function start_serving() {
    if (!data.value.title || !data.value.address || !data.value.content) return;

    // Create peer
    peer.value = new Peer([data.value.address]);

    // On connection, send content
    peer.value.on('connection', (connection) => {
        connection.on('open', () => {
            connection.send({
                title: data.value.title,
                content: data.value.content
            });
        })
    })

    peer.value.on('error', (err) => {
        console.log('error', err);
    })

    serving.value = true;
}

async function stop_serving() {
    peer.value.destroy();
    serving.value = false;
}
</script>