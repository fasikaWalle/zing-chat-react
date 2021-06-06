const formattedTimeStamp = require("./utils/dateFormat");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const app = express();
const {
  getUsers,
  getUsersByRoom,
  getUsersWithoutMe,
  changeRoom,
  userConnected,
  userDisconnected,
  checkIfAlreadyOnline,
} = require("./utils/sockets");

const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");
const db = require("./config/connection");
const { user } = require("./config/connection");

const PORT = process.env.PORT || 4000;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const http = require("http").createServer(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });
const botName = "zingBot";
const date = () => formattedTimeStamp(Date.now());

io.on("connection", function (socket) {
  console.log(`someone connected at ${date()}`);

  const idToken = JSON.parse(socket.handshake.query.idToken) || undefined;
  const user = {
    id: idToken._id,
    username: idToken.username,
    avatar: idToken.avatar,
    room: "Lobby",
    roomName: "Lobby",
  };
  if (checkIfAlreadyOnline(user.id)) {
    socket.emit("already logged in");
    socket.disconnect();
    return;
  }
  userConnected(user);
  socket.join(user.roomName);
  socket.join(user.id);
  socket.on("populate users", () => {
    socket.emit("receive users", getUsers());
  });
  socket.broadcast.emit("user joining", user);
  socket.on("join room", (room, roomName) => {
    socket.broadcast.to(user.room).emit("receive message", {
      username: botName,
      message: `${user.username} has left the room!`,
      createdAt: date(),
      avatar: "",
    });
    socket.leave(user.room);
    user.room = room;
    user.roomName = roomName;
    changeRoom(user.id, room, roomName);
    socket.join(room);
    io.emit("receive users", getUsers());
    io.to(user.room).emit("receive message", {
      username: botName,
      message: `${user.username} has joined the room!`,
      createdAt: date(),
      avatar: "",
    });
  });

  socket.on("add room", (room) => {
    io.emit("add room", room);
  });

  socket.on("delete room", (room) => {
    io.emit("delete room", room);
  });
  socket.on("edit room", (room) => {
    io.emit("edit room", room);
  });

  socket.on("send message", function (message) {
    io.to(user.room).emit("receive message", {
      username: user.username,
      message,
      createdAt: date(),
      avatar: user.avatar,
    });
  });

  socket.on('send DM', (message, receiverId )=> {
    console.log(receiverId)
    io.to(receiverId).emit('receive DM', {...message, sender: user.username})
  })

  socket.on('add friend', friend=>{
 
    socket.emit('add friend', {...friend, _id: friend.id})
    io.to(friend.id).emit('friend request', user)
  })

  socket.on("disconnect", () => {
    user &&
      socket.broadcast.emit("user disconnecting", user.id) &&
      userDisconnected(user.id);
   
  });
});

// Serve up static assets

db.once("open", () => {
  http.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
