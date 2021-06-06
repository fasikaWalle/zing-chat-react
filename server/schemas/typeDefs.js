const { gql } = require("apollo-server-express");
const typeDefs = gql`

  type Chat {
    _id: ID
    username: String
    message: String
    createdAt: String
    avatar: String
  }

  type DM {
    sender: String
    message: String
    receiver: String
  }

  type User {
    _id: ID
    username: String
    displayName: String
    privateMessages: [DM]
    notifications: [String]
    avatar: String
    rooms: [Room]
    friends: [User]
    friendRequests: [User]
    createdAt: String
  }

  type Room {
    _id: ID
    roomName: String
    password: String
    username: String
    roomChat: [Chat]
    colors: [String]
    tags: [String]
    privacy: String
    createdAt: String
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    chat: [Chat]
    user: User
    rooms: [Room]
    room(_id: String!): [Room]
    users: [User]
  }

  type Mutation {
    addUser(username: String!, password: String!, avatar: String!): Auth
    login(username: String!, password: String!): Auth
    sendDM(receiver: String!, message: String!): User
    addChat(roomId: String!, message: String!, avatar: String!): Room
    deleteRoom(_id: String!): Room
    addRoom(
      roomName: String!
      password: String
      colors: [String]!
      tags: [String]!
      privacy: String!
    ): Room
    updateRoom(
      roomId: String!
      roomName: String!
      colors: [String]!
      tags: [String]!
      privacy: String!
    ): Room
    addFriend(friendId: String!): User
  }
`;

module.exports = typeDefs;
