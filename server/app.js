const http = require('http');
const io = require("socket.io")(http)

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

io.on("connection", client => {
  console.log("Hi UI");

  client.on("event", data => { 
    UIClient.emit("event", { data: "chocolat" })
  })

  client.on("disconnect", () => { 
    console.log("bye")
  })
})