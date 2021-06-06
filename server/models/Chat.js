const mongoose = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const { Schema } = mongoose;

const chatSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = { Chat, chatSchema };
