const mongoose = require("mongoose");
const { chatSchema } = require("./Chat");
const dateFormat = require("../utils/dateFormat");
const { Schema } = mongoose;

const roomSchema = new Schema({
  roomName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: ""
  },
  tags: {
    type: Array,
  },
  privacy: {
    type: String,
    required: true,
    validate: {
      validator: function (privacy) {
        if (privacy === "private" || privacy === "public") {
          return true;
        }

        return false;
      },
      message: (privacy) => `${privacy.value} is not valid!!`,
    },
  },

  colors: {
    type: Array,
    required: true,
    validate: {
      validator: function (colors) {
        const hex = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
        for (let i = 0; i < colors.length; i++) {
          if (!hex.test(colors[i])) {
            return false;
          }
        }
        return true;
      },
      message: (colors) => `${colors.value} is not valid!!`,
    },
  },
  username: {
    type: String,
    required: true,
  },

  roomChat: [
    {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = { Room, roomSchema };
