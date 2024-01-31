<template>
    <div class="container d-flex flex-column py-4">
        <h1 class="fw-bold mb-3">How to serve web pages directly from your browser</h1>
        <div class="d-flex align-items-center">
            <span class="bi bi-calendar2-event me-2"></span>
            <span class="text-muted">Feb 2024</span>
        </div>
        <hr>
        <div class="d-flex flex-column">
            <a href="#quickstart" class="unlink">
                <h2 id="quickstart" class="fw-bold">Quickstart</h2>
            </a>
            <pre class="code">server: {{ serving ? 'active' : 'not active' }}</pre>
            <form>
                <div class="row mb-3">
                    <label for="inputAddress" class="col-sm-2 col-form-label">Address</label>
                    <div class="col-sm-10 mb-2">
                        <input v-model="data.address" type="text" class="form-control" placeholder="example"
                            id="inputAddress" :readonly="serving">
                    </div>
                    <span class="col-sm-10 offset-sm-2">Your web page will be available at
                        <a class="fw-bold" :href="'https://kaangiray26.github.io/pages/' + data.address" target="_blank">
                            https://kaangiray26.github.io/pages/{{ data.address }}</a></span>
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
        <div class="d-flex flex-column">
            <h3>Ready to publish?</h3>
            <p>Click the button below to publish your web page.</p>
            <div class="d-flex justify-content-start">
                <button v-if="!serving" type="button" class="btn btn-primary" @click="start_serving">Publish</button>
                <button v-else type="button" class="btn btn-danger" @click="stop_serving">Stop</button>
            </div>
        </div>
        <hr>
        <div class="d-flex flex-column">
            <a href="#going-further" class="unlink">
                <h2 id="going-further" class="fw-bold">Going further</h2>
            </a>
            <p>If you had fun with the example above, it's time to go a little further. Let's start by explaining what is
                really going on here.</p>
            <p>In Peer-to-Peer networks, there is no central server that exchanges data through the connections between
                peers. Each peer can be a client and a server at the same time. In our example, we are using <a
                    href="https://peerjs.com">PeerJS</a> library to establish p2p connections. Now, when you click on that
                button and publish your HTML content, you actually create a <strong>Peer</strong> that is listening on the
                address you provided. This Peer is a unique identifier used by the signaling server to direct other peers to
                your peer. So, when a user enters your address in their browser, they actually create a new Peer themselves
                and connect to your peer. Then, your peer sends the HTML content as a
                response and the browser renders the HTML content acquired from the response. That's basically it, however
                you can extend this functionality by adding routing and handling URL parameters, which is what we are going
                to do next.
            </p>
            <p>Let's continue!</p>
        </div>
        <div class="d-flex flex-column">
            <a href="#adding-routes" class="unlink">
                <h2 id="adding-routes" class="fw-bold">Adding routes</h2>
            </a>
            <p>Until now, we have only served a single HTML file on a single route. But we can do better than that. Let's
                add a route to our web page.</p>
            <p>We start by creating our peer first.</p>
            <pre class="code">
const peer = new Peer();</pre>
            <p>When a user connects to our peer, a <strong>connection</strong> event is emitted. We simply listen to this
                event to handle the connection and send a response to the user. Per implementation, a
                <strong>metadata</strong> object is attached to the connection by the user. This object contains the route
                and the query parameters of the user. Let us suppose that the user goes to
                <code>/about?name=John&age=20</code>. Then, we will get the following metadata object.
            </p>
            <pre class="code">
metadata: {
    route: '/about',
    query: {
        name: 'John',
        age: 20
    }
}</pre>
            <p>Now that we have the route and the parameters, we can handle the request accordingly. Let's create a route
                for the index page and the about page.</p>
            <pre class="code">
peer.on('connection', (connection)=>{
    connection.on('open', ()=>{
        const metadata = connection.metadata;

        if (metadata.route === '/') {
            connection.send({
                content: `&lt;h1&gt;Hey people!&lt;/h1&gt;&lt;a href='/pages/${peer.id}/about?name=John&amp;age=20'&gt;About me&lt;/a&gt;`
            })
            return
        }

        if (metadata.route === '/about') {
            connection.send({
                content: `&lt;h1&gt;About me&lt;/h1&gt;&lt;p&gt;Hi, I am ${metadata.query.name}, a ${metadata.query.age}-year-old boy from Pleasantville.&lt;/p&gt;`
            })
            return
        }
    })
})</pre>
            <p>That's it! Now, let's try it out.</p>
            <div class="d-flex justify-content-start mb-3">
                <button v-if="!serving" type="button" class="btn btn-primary" @click="serve_example_1">Publish</button>
                <button v-else type="button" class="btn btn-danger" @click="stop_serving">Stop</button>
            </div>
            <p v-show="serving">Go to <a :href="'https://kaangiray26.github.io/pages/' + data.address" target="_blank">
                    https://kaangiray26.github.io/pages/{{ data.address }}</a> to check it out.
            </p>
        </div>
    </div>
</template>
<style>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");

.unlink {
    color: unset !important;
    text-decoration: none !important;
}

.code {
    display: flex;
    padding: 1rem;
    color: #fff;
    background-color: #362c3f;
    border-radius: 0.375rem;
    overflow-x: auto;
}
</style>
<script setup>
import { onBeforeMount, ref } from 'vue';
import { Peer } from 'peerjs';

const peer = ref(null);
const serving = ref(false);

// Web page data
const data = ref({
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
    // Clean previous peers
    if (peer.value) peer.value.destroy();

    // Check if data is valid
    if (!data.value.address || !data.value.content) return;

    // Create peer
    peer.value = new Peer([data.value.address]);

    peer.value.on('open', () => {
        serving.value = true;
    })

    // On connection, send content
    peer.value.on('connection', (connection) => {
        connection.on('open', () => {
            connection.send({
                content: data.value.content
            });
        })
    })
}

async function serve_example_1() {
    // Clean previous peers
    if (peer.value) peer.value.destroy();

    // Create peer
    peer.value = new Peer();

    // Event handlers
    peer.value.on('open', () => {
        data.value.address = peer.value.id;
        serving.value = true;
    })

    peer.value.on('connection', (connection) => {
        connection.on('open', () => {
            const metadata = connection.metadata;

            if (metadata.route === '/') {
                connection.send({
                    content: `<h1>Hey people!</h1><a href='/pages/${peer.value.id}/about?name=John&age=20'>About me</a>`
                })
                return
            }

            if (metadata.route === '/about') {
                connection.send({
                    content: `<h1>About me</h1><p>Hi, I am ${metadata.query.name}, a ${metadata.query.age}-year-old boy from Pleasantville.</p>`
                })
                return
            }
        })
    })
}

async function stop_serving() {
    peer.value.destroy();
    serving.value = false;
}

onBeforeMount(() => {
    window.onbeforeunload = () => {
        if (peer.value) peer.value.destroy();
    };
})
</script>