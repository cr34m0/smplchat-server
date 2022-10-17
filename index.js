const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const cors = require("cors");
const methods = require("./services/userService");

app.use(cors({ origin: "*" }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const connections = new Set();

io.on("connection", (client) => {
  console.log("a user connected");

  connections.add(client);

  client.on("register", (result) => {
    methods.addUser(client.id, result).then((res) => {
      io.emit("updateAll");
      if (res.status == "ok") {
        client.emit("userRegistered", { uid: client.id, login: result });
      }
    });
  });

  client.on("getLogged", () => {
    methods.getLogged().then((res) => {
      client.emit("users", JSON.parse(res));
    });
  });

  client.on("sendedMessage", (res) => {
    methods.saveMessage(res.user, res.message, res.uid).then((res) => {
      client.emit("messageOk");
    });

    io.emit("updateAllMessages");
  });

  client.on("updateMessages", (res) => {
    methods.getMessages().then((res) => {
      client.emit("updatedMessages", JSON.parse(res));
    });
  });

  client.once("disconnect", function () {
    methods.removeUser(client.id).then(() => {
      io.emit("updateAll");
      connections.delete(client);
      console.log("Got disconnect!");
    });
  });
});

server.listen(3333, () => {
  console.log("listening on *:3333");
});
