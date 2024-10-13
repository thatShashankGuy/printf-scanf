---
title: Load Balancing and Static File Serving with NGINX
author: Shashank Shekhar
date: 2024-10-13
---

![alt text](/nginx-load-balancing.png)

NGINX is a popular web server often used to host Node.js applications in production. It provides features like **load balancing**, **proxying**, **reverse proxy**, and **static file serving** out of the box.

#### Serving Web Apps with NGINX

Today, we will perform a simple exercise using a basic JavaScript backend to demonstrate the **load balancing** capabilities of the NGINX web server. Alongside the backend server script, we’ll also host a single webpage on NGINX to showcase static file serving.

As usual, code examples are available in my [GitHub repository](https://github.com/thatShashankGuy/code-examples/tree/master/nginx-load-balancer). Let’s get started!

In this exercise, our web page will send a request to the backend, and the backend will respond with a joke. We will simulate load balancing among different servers by running our backend script on four separate ports. The backend script will check the `PORT` value for each request and return a **port-specific joke** to the webpage.

---

### Exercise: Random Joke Generator

Here is the code for the backend server and the web page.

#### `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Joke Balancing with NGINX</title>
</head>
<body>
    <h1>Here are Random Jokes</h1>
    <p>With each request the server responds to, NGINX will serve a port-specific joke.</p>
    <div>JOKE FROM PORT: <b><i id="server-port">waiting...</i></b></div>
    <div id="server-response">Fetching a joke from the server...</div>

    <script>
        fetch('/api/data')
            .then(response => response.json())
            .then(data => {
                document.getElementById('server-response').innerText = data.joke;
                document.getElementById('server-port').innerText = data.port;
            })
            .catch(error => {
                document.getElementById('server-response').innerText = 'Error fetching data';
                console.error('Error:', error);
            });
    </script>
</body>
</html>
```

#### `server.js`

```js
const http = require('http');
const os = require('os');

const PORT = process.env.PORT || "3000";

http.createServer((req, res) => {
    let joke = `THIS IS SERIOUS BUSINESS`;
    switch (PORT) {
        case "3000":
            joke = `Why don't skeletons fight each other? Because they don't have the guts.`;
            break;
        case "8080":
            joke = `What do you call fake spaghetti? An impasta!`;
            break;
        case "1313":
            joke = `Why did the scarecrow win an award? Because he was outstanding in his field!`;
            break;
        case "1517":
            joke = `Why don’t eggs tell jokes? Because they might crack up!`;
            break;
        default:
            break;
    }    

    console.log(JSON.stringify({ port: PORT, joke }));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ port: PORT, joke }));
}).listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
```

#### A Script to Start All Servers Together

```bash
#!/bin/bash

PORTS=(3000 8080 1313 1517)
SERVER_JS_PATH="./server.js"

for PORT in "${PORTS[@]}"
do
    echo "Starting server.js on port $PORT"
    PORT=$PORT nohup node $SERVER_JS_PATH > logs/server_$PORT.log 2>&1 &
done

echo "All servers started."
```

---

### Configuring NGINX for Our Web App

Before configuring NGINX, you need to [install NGINX](https://nginx.org/en/docs/install.html) on your system. You can check if NGINX is installed by running the following command:

```bash
nginx -v
```

The behavior of NGINX is determined by its configuration file, typically named `nginx.conf`. By default, this file is located in directories such as `/etc/nginx` or `/usr/local/etc/nginx`, but for this demonstration, we will keep the `nginx.conf` file in the same directory as the project files.

You can read the configuration file with the following command:

```bash
nginx -c /your/path/to/code-examples/nginx-load-balancer/nginx.conf
```

Before running the server, it’s always a good idea to test the configuration using the `-t` flag:

```bash
nginx -t -c /your/path/to/code-examples/nginx-load-balancer/nginx.conf
```

#### NGINX Configuration (`nginx.conf`)

```bash
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server 127.0.0.1:3000;
        server 127.0.0.1:8080;
        server 127.0.0.1:1313;
        server 127.0.0.1:1517;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            root code-examples/nginx-load-balancer;
            index index.html;
        }

        location /api/data {
            proxy_pass http://backend;
        }
    }
}
```

---

### Explaining the NGINX Configuration

**Worker Connections**: In the `events` block, we configured NGINX to handle 1024 simultaneous connections per worker. This optimizes how NGINX deals with incoming requests.

**Upstream Block**: The `upstream` block defines a pool of backend servers, each running on a different port (3000, 8080, 1313, and 1517). NGINX will distribute the load across these servers using a **round-robin method**, sending each request to a different server in turn.


   **Port 80**: NGINX listens on port 80, which is the default HTTP port.
   
   **Serving Static Files**: When a request is made to `/`, NGINX serves the static HTML file (`index.html`) located in the `code-examples/nginx-load-balancer` directory.
   
   **Proxying Requests**: When a request is made to `/api/data`, NGINX acts as a **proxy** and forwards the request to one of the backend servers, which will respond with a port-specific joke.

---

### Testing the Web Application

Once everything is set up, open a browser and go to `http://localhost`. Each time you refresh the page, NGINX will serve the static HTML file and fetch data from different backend servers running on different ports, showing a new joke with each request.

Request 1 
![image not found](/nginx-req1.png)

Request 2 
![image not found](/nginx-req2.png)

---

### Conclusion

In this article, we explored how to use NGINX to serve a Node.js application, demonstrating its **load-balancing**, **proxying**, and **static file serving** capabilities. NGINX is a popular choice in the Node.js ecosystem for production environments, thanks to its efficiency and powerful features.

This is a basic example demonstrating some of NGINX's capabilities. In future exercises, we will explore more features such as caching, reverse proxying, and SSL/TLS configuration.

---

### Further Reading
- [What is a Web Server?](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_web_server)
- [NGINX Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html)
- [Load Balancing Node.js Applications on NGINX](https://docs.nginx.com/nginx/deployment-guides/load-balance-third-party/node-js/)
- [Apache vs IIS vs NGINX: Web Server Comparison](https://www.linuxcareers.com/resources/blog/2023/07/apache-vs-iis-vs-nginx-an-in-depth-comparison-of-web-servers/)

As always, happy coding!
