import gql from "graphql-tag";

export const QUERY_USERS = gql`
  {
    users {
      _id
      username
      displayName
      rooms {
        _id
        roomName
        username
        colors
        tags
        privacy
        roomChat {
          _id
          username
          message
          createdAt
        }
        createdAt
      }
      friends {
        _id
        username
      }
      friendRequests {
        _id
        username
      }
      avatar
      createdAt
    }
  }
`;
export const QUERY_USER = gql`
  {
    user {
      _id
      username
      displayName
      rooms {
        _id
        roomName
        username
        colors
        tags
        privacy
        roomChat {
          _id
          username
          message
          createdAt
        }
        createdAt
      }
      avatar
      friends {
        _id
        username
        avatar
      }
      friendRequests {
        _id
        username
        avatar
      }
      privateMessages{
        sender
        message
        receiver
      }
    }
  }
`;

export const QUERY_ROOMS = gql`
  {
    rooms {
      _id
      roomName
      password
      username
      colors
      tags
      privacy
      roomChat {
        _id
        username
        message
        createdAt
      }
    }
  }
`;
export const QUERY_ROOM = gql`
  query room($_id: String!) {
    room(_id: $_id) {
      _id
      roomName
      password
      username
      colors
      tags
      privacy
      roomChat {
        _id
        username
        message
        avatar
        createdAt
      }
    }
  }
`;

export const QUERY_CHAT = gql`
  {
    chat {
      _id
      username
      message
      createdAt
    }
  }
`;
