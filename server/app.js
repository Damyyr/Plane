const server = require('http').createServer()
const io = require("socket.io")(server)

io.on("connection", client => {
  console.log("Hi UI");

  client.on("disconnect", () => { 
    console.log("bye")
  })
});

server.listen(3000);