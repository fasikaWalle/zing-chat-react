const { AuthenticationError } = require("apollo-server-express");
const { User, Chat, Room } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    users: async (parent, {}) => {
      return User.find({});
    },
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id)
          .populate("friends")
          .populate("friendRequests");

        return user;
      }
      throw new AuthenticationError("Not logged in");
    },
    rooms: async (parent, args) => {
      return Room.find({}).populate("roomChat");
    },

    room: async (parent, args) => {
      return Room.find({ _id: args._id }).populate("roomChat");
    },

    chat: async (parent, args) => {
      return Chat.find({});
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    addRoom: async (parent, args, context) => {
      if (context.user) {
        const room = await Room.create({
          ...args,
          username: context.user.username,
        });

        return room;
      }

      throw new AuthenticationError("Not logged in");
    },

    updateRoom: async (parent, args, context) => {
      if (context.user) {
        const room = await Room.findOneAndUpdate(
          { _id: args.roomId },
          {
            $set: {
              colors: args.colors,
              tags: args.tags,
              roomName: args.roomName,
              privacy: args.privacy,
            },
          },
          { new: true, runValidators: true }
        );

        return room;
      }
    },

    addChat: async (parent, args, context) => {
      if (context.user) {
        const chat = await Chat.create({
          ...args,
          username: context.user.username,
        });
     
        const room = await Room.findByIdAndUpdate(
          { _id: args.roomId },
          { $push: { roomChat: chat._id } },
          { new: true }
        ).populate("roomChat");
        return room;
      }

      throw new AuthenticationError("Not logged in");
    },

    sendDM: async (parent, { message, receiver }, context) => {
      if (context.user) {
        const user = await User.findByIdAndUpdate(
          { _id: context.user._id },
          {
            $push: {
              privateMessages: {
                receiver,
                message,
                sender: context.user.username,
              },
            },
          },
          { new: true }
        );
        await User.findOneAndUpdate(
          { username: receiver },
          {
            $push: {
              privateMessages: {
                receiver,
                message,
                sender: context.user.username,
              },
            },
          }
        );
        return user;
      }
    },

    deleteRoom: async (parent, args, context) => {

      if (context.user) {
        const room = await Room.findByIdAndDelete({ _id: args._id });
    
        return room;
      }
    },

    addFriend: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findByIdAndUpdate(
          context.user._id,
          {
            $addToSet: { friends: args.friendId },
          },
          { new: true }
        )
          .populate("friends")
          .populate("friendRequests");

        await User.findByIdAndUpdate(args.friendId, {
          $addToSet: { friendRequests: context.user._id },
        });

        return user;
      }
    },
  },
};

module.exports = resolvers;
