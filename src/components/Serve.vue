<template>
    <div class="container d-flex flex-column py-4">
        <div class="d-flex align-items-center">
            <img src="/favicon-dark.svg" height="64">
            <h1 class="fw-bold">Pages</h1>
        </div>
        <p>Serve web pages directly from your browser</p>
        <div class="bg-dark text-light rounded shadow p-3">
            <span>{{ serving ? 'Active' : 'Not active' }}</span>
        </div>
        <hr>
        <div class="d-flex flex-column">
            <h2 class="fw-bold">Configuration</h2>
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
                        <a class="fw-bold"
                            :href="'https://kaangiray26.github.io/pages/' + data.address">https://kaangiray26.github.io/pages/{{
                                data.address }}</a></span>
                </div>
                <div class="row mb-3">
                    <label for="inputContent" class="col-sm-2 col-form-label">Content</label>
                    <div class="col-sm-10">
                        <textarea v-model="data.content" class="form-control" placeholder="<h1>Hey people!</h1>"
                            id="inputContent" rows="5"></textarea>
                        <div class="mt-3">
                            <label for="formFile" class="form-label">Or upload a single HTML file</label>
                            <input class="form-control" type="file" id="formFile" @change="upload_file" accept=".html">
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <hr>
        <div class="d-flex flex-column">
            <h2 class="fw-bold">Ready to publish?</h2>
            <p>Click the button below to publish your web page.</p>
            <div class="d-flex justify-content-start">
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
    title: null,
    address: '',
    content: ''
})

async function upload_file(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
        data.value.content = event.target.result;
    }

    reader.readAsText(file);
}

async function start_serving() {
    if (!data.value.address || !data.value.content) return;

    // Create peer
    peer.value = new Peer([data.value.address]);

    // On connection, send content
    peer.value.on('connection', (connection) => {
        connection.on('open', () => {
            console.log(connection.metadata);
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