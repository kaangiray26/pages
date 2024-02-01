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
            <p>
                Enter an address and some content to make it instantly available on the web. Then, click the button to start
                serving.
            </p>
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
                for the index page and the about page. Here's the HTML content for the index page:</p>
            <pre class="code">{{ examples.content_1 }}</pre>
            <p>Notice the weird looking <code>&#123;&#123;peer.id&#125;&#125;</code> part. This is a template string that
                will be replaced by
                the peer's ID when the page loads using our custom <code>render</code> function. The thing I've done in this
                page actually is to create additional HTML files with some template strings and load them when the page
                loads. You can check out the source code for this page on my GitHub repository to see
                how it's done but we're not going to cover that here. Just know that the <code>render</code> function
                returns some plain HTML content from the variables <code>content_1</code> and <code>content_2</code> that we
                can send to the user.</p>
            <p>So here's the code for handling the routes:</p>
            <pre class="code">
peer.on('connection', (connection) => {
    connection.on('open', () => {
        const metadata = connection.metadata;

        if (metadata.route === '/') {
            connection.send({
                content: render(content_1, {
                    'peer.id': peer.id
                })
            })
            return
        }

        if (metadata.route === '/about') {
            connection.send({
                content: render(content_2, {
                    'metadata.query.name': metadata.query.name,
                    'metadata.query.age': metadata.query.age
                })
            })
            return
        }
    })
})
</pre>
            <p>That's it! Now, let's try it out and see what happens.</p>
            <div class="d-flex justify-content-start mb-3">
                <button v-if="!serving" type="button" class="btn btn-primary" @click="serve_example_1">Publish</button>
                <button v-else type="button" class="btn btn-danger" @click="stop_serving">Stop</button>
            </div>
            <p v-show="serving">
                Check it out on
                <a class="fw-bold" :href="'https://kaangiray26.github.io/pages/' + data.address"
                    target="_blank">https://kaangiray26.github.io/pages/{{ data.address }}</a>
            </p>
            <p>We are going to add some interactivity to our web page next.</p>
        </div>
        <div class="d-flex flex-column">
            <a href="#a-little-bit-interactivity" class="unlink">
                <h2 id="adding-routes" class="fw-bold">A little bit interactivity</h2>
            </a>
            <p>In this example, we are going to add a button to our page that will increment the counter on the page, whose
                value will be saved on the serving peer and updated on all the connected peers.</p>
            <p>For this to work, we need 2 things: a way to send requests when a user clicks on the button and a way to
                announce the counter's value to all the connected peers.</p>
            <p>To make it possible for the pages to access the peer and the connection objects, I've assigned them to
                <code>window.peer</code> and <code>window.connection</code> respectively. With these in mind, we can add a
                script to our HTML file to modify the peer's connection event handler for the <code>data</code> event. I've
                also tried to make it a bit fancier than the previous example, which was just plain HTML junk.
            </p>
            <p>
                We have the following elements in our HTML file:
            </p>
            <pre class="code">
&lt;div id=&quot;container&quot;&gt;
    &lt;h1&gt;Welcome traveler!&lt;/h1&gt;
    &lt;p&gt;&lt;span id=&quot;counter&quot;&gt;&#123;&#123;counter&#125;&#125;&lt;/span&gt; people say hello to you!&lt;/p&gt;
    &lt;p&gt;Click the button to greet them back!&lt;/p&gt;
    &lt;div&gt;
        &lt;button id=&quot;greet&quot;&gt;Greet&lt;/button&gt;
    &lt;/div&gt;
&lt;/div&gt;</pre>
            <p>And we are going to add a script to the bottom of the page:</p>
            <pre class="code">
&lt;script&gt;
    document.querySelector('#greet').onclick = () =&gt; {
            window.connection.send('greet');
    }

    // Remove the listener for the data event
    window.connection.off('data');

    // Add the new listener for the data event
    window.connection.on('data', (data) =&gt; {
        if (data.type == 'update') {
            document.querySelector('#counter').innerHTML = data.value;
        }
    })
&lt;/script&gt;</pre>
            <p>So here, we are sending a <code>greet</code> message to serving peer and listening for the <code>data</code>
                event to update the counter. When the received data has a <code>type</code> property of <code>update</code>,
                we update the value seen on our page.</p>
            <p>Now, let's write our code for the serving peer to handle the <code>greet</code> message, increment the
                counter and send the updated value to all connected peers.</p>
            <pre class="code">
// Create a peer object and an array of connections
const peer = new Peer();
let connections = [];

// Create a counter
let counter = 0;

// Handle the connection event
peer.on('connection', (connection) =&gt; {
    // Send the page when a new peer connects
    connection.on('open', () =&gt; {
        connection.send({
            content: render(content_3, {
                'counter': counter
            })
        })
    })

    // Remove the connection from the array when it closes
    connection.on('close', () =&gt; {
        connections = connections.filter(conn =&gt; conn.id != connection.peer);
    })

    // Handle the data event
    connection.on('data', (data) =&gt; {
        if (data == 'greet') {
            counter++;
            connections.map(conn =&gt; conn.connection.send({
                type: 'update',
                value: counter
            }))
        }
    })

    // Add the connection to the array
    connections.push({
        'id': connection.peer,
        'connection': connection
    });
})</pre>
            <p>Here, we hold an array of the connections to announce the updated value to all peers via their open
                connections. Also, when a user closes their web page, the peer gets disconnected and we simply remove it
                from the array.</p>
            <p>So, let's try it!</p>
            <div class="d-flex justify-content-start mb-3">
                <button v-if="!serving" type="button" class="btn btn-primary" @click="serve_example_2">Publish</button>
                <button v-else type="button" class="btn btn-danger" @click="stop_serving">Stop</button>
            </div>
            <p v-show="serving">
                Check it out on
                <a class="fw-bold" :href="'https://kaangiray26.github.io/pages/' + data.address"
                    target="_blank">https://kaangiray26.github.io/pages/{{ data.address }}</a>
            </p>
            <p>Alright, we had fun. So, let's wrap it up.</p>
        </div>
        <div class="d-flex flex-column">
            <a href="#final-words" class="unlink">
                <h2 id="final-words" class="fw-bold">Final words</h2>
            </a>
            <p>This concept you've seen here is definitely not a new one and it's some sort of <a
                    href="https://en.wikipedia.org/wiki/Peer-to-peer_web_hosting">Peer-to-peer web hosting</a>. However, I
                wanted to explore the possibilities of P2P connections on the web myself and share my little experiment with
                you. As we have seen, it is quite possible to mimic a web server by creating a peer and handling all the
                requests by ourselves. Although we can basically do anything we want with this and run it on the web, there
                are some limitations that we need to consider.</p>
            <p>First of all, the web page is served by a single peer on a browser. So, we can expect the performance to be
                not as good as a real dedicated web server. Also, P2P connections are sometimes blocked behind firewalls and
                NATs. This means that some users may not be able to access the web page, where we may also not serve the
                page in every network as well.</p>
            <p>Moreover, we are not using any authentication for the addresses in this example, which means everyone can
                take over an address and serve their own stuff. Fortunately, this can be solved by hosting your own <a
                    href="https://github.com/peers/peerjs-server">PeerServer</a> and prevent address hijacking by attaching
                a token to the address request, which will be checked by the server before assigning the address to the
                peer. Address reserving can be maintained by the server as well with user registration, which sounds kind of
                like a domain name registrar, doesn't it?</p>
            <p>I hope you enjoyed this little experiment. If you want to build your own peer-to-peer web server, you can
                check out the <a href="https://github.com/kaangiray26/pages">source code</a> of this page on my GitHub
                repository. Stay connected!</p>
            <p>Feel free to reach out to me on GitHub or you can send me an <a
                    href="mailto:kaangiray26@protonmail.com">email!</a></p>
            <div class="d-flex justify-content-start">
                <a class="unlink fw-bold" href="https://github.com/kaangiray26" target="_blank">
                    <span class="bi bi-github me-2"></span>
                    <span>kaangiray26</span>
                </a>
            </div>
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
import { Peer, PeerError } from 'peerjs';

const peer = ref(null);
const serving = ref(false);
const connections = ref([]);

// Web page data
const data = ref({
    address: '',
    content: ''
})

// Example html contents
const examples = ref({
    content_1: '',
    content_2: '',
    content_3: '',
})

// Counter
const counter = ref(0);

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

    // Event handlers
    peer.value.on('open', () => {
        serving.value = true;
    })

    peer.value.on('connection', (connection) => {
        console.log("Incoming connection:", connection);
        connection.on('open', () => {
            connection.send({
                content: data.value.content
            });
        })
        connection.on('error', (err) => {
            console.log(err);
        })
    })
    peer.value.on('error', (error) => {
        console.log(error);
        if (error.type == 'unavailable-id') {
            alert('This address is already in use. Please try another one.');
        }
    })
}

function render(template, params) {
    return template.replace(/{{([^}]+)}}/g, function (_, key) {
        return params[key];
    });
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
                    content: render(examples.value.content_1, {
                        'peer.id': peer.value.id
                    })
                })
                return
            }

            if (metadata.route === '/about') {
                connection.send({
                    content: render(examples.value.content_2, {
                        'metadata.query.name': metadata.query.name,
                        'metadata.query.age': metadata.query.age
                    })
                })
                return
            }
        })
    })
}

async function serve_example_2() {
    // Clean previous peers
    if (peer.value) peer.value.destroy();

    // Create peer
    peer.value = new Peer();

    // Create a counter
    counter.value = 0;

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
                    content: render(examples.value.content_3, {
                        'counter': counter.value
                    })
                })
                return
            }
        })
        connection.on('close', () => {
            connections.value = connections.value.filter(conn => conn.id != connection.peer);
        })
        connection.on('data', (data) => {
            console.log(data);
            if (data == 'greet') {
                counter.value++;
                connections.value.map(conn => conn.connection.send({
                    type: 'update',
                    value: counter.value
                }))
            }
        })
        connections.value.push({
            'id': connection.peer,
            'connection': connection
        });
    })
}

async function stop_serving() {
    peer.value.destroy();
    serving.value = false;
}

async function load_html_contents() {
    examples.value.content_1 = await fetch('/pages/content_1.html').then(res => res.text());
    examples.value.content_2 = await fetch('/pages/content_2.html').then(res => res.text());
    examples.value.content_3 = await fetch('/pages/content_3.html').then(res => res.text());
}

onBeforeMount(() => {
    load_html_contents();
    window.onbeforeunload = () => {
        if (peer.value) peer.value.destroy();
    };
})
</script>