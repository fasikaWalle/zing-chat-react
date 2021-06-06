const db = require("../config/connection");
const { User, Chat, Room } = require("../models");

db.once("open", async () => {
  await User.deleteMany();
  const users = await User.insertMany([
    { username: "admin", password: "admin" },
    { username: "testAdmin", password: "testAdmin" },
  ]);
  console.log("users seeded");

  await Chat.deleteMany();
  const chats = await Chat.insertMany([
    { message: "hello", username: users[0]._id },
    { message: "holla", username: users[1]._id },
  ]);

  await Room.deleteMany();
  const rooms = await Room.insertMany([
    { roomName: "tiny", username: users[0]._id },
    { roomName: "dark", username: users[1]._id },
  ]);

  console.log("rooms seeded");

  process.exit();
});
