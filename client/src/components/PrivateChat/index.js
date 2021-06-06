import React, { useState, useEffect } from "react";
import { Tabs, Input, Avatar, List, Badge, Tooltip } from "antd";
import "./chat.css";
import { useVisible } from "./BlurHandler";
import { useMyInfo, useUsers, useSocket } from "../Socket";
import { useMutation } from "@apollo/react-hooks";
import { ADD_FRIEND, SEND_DM } from "../../utils/mutations";

const { TabPane } = Tabs;

function PrivateChat({ setCount }) {
  const [addFriend] = useMutation(ADD_FRIEND);

  const { visible } = useVisible();
  const [openChat, setOpenChat] = useState("1");
  const [currentConv, setCurrentConv] = useState({ username: "" });
  const [currentConvChat, setCurrentConvChat] = useState([]);
  const [message, setMessage] = useState("");
  const user = useMyInfo();
  const [friends, setFriends] = useState([]);
  const { users } = useUsers();
  const [sendDM] = useMutation(SEND_DM);
  const socket = useSocket();
  const [notif, setNotif] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    if (openChat === "2" && visible) {
      setNotif((old) => old.filter((names) => names !== currentConv.username));
    }
    if (openChat === "1" && visible) {
      setNotif((old) => old.filter((names) => names !== "friend request"));
    }
  }, [openChat, visible]);

  useEffect(() => {
    if (socket) {
      socket.off("receive DM");
      socket.off("add friend");
      socket.off("friend request");

      socket.on("receive DM", (message) => {
        if (
          openChat !== "2" ||
          visible === false ||
          currentConv.username !== message.sender
        ) {
          setNotif((old) => [...old, message.sender]);
          setCount(notif.length);
        }
        setCurrentConvChat((old) => [...old, message]);
      });
      socket.on("add friend", (friend) => {
        setFriends((old) => [...old, friend]);
      });
      socket.on("friend request", (friend) => {
        if (openChat !== "1" || visible === false) {
          setNotif((old) => [...old, "friend request"]);
          setCount(notif.length);
        }
        setFriendRequests((old) => [...old, friend]);
      });
      return () => {
        socket.off("receive DM");
        socket.off("add friend");
        socket.off("friend request");
      };
    }
  }, [socket, openChat, visible, currentConv]);

  setCount(notif.length);

  setCount(notif.length);

  useEffect(() => {
    if (!user || (Array.isArray(currentConvChat) && currentConvChat.length)) {
    } else {
      setCurrentConvChat(user.privateMessages);
      setFriends(user.friends);
      setFriendRequests(user.friendRequests);
    }
  }, [user]);

  async function sendMessage(e) {
    e.preventDefault();
    setMessage("");
    const userMessage = { message, receiver: currentConv.username };
    setCurrentConvChat((old) => [...old, userMessage]);
    socket.emit("send DM", userMessage, currentConv._id);
    try {
      await sendDM({ variables: userMessage });
    } catch (e) {
      console.log(e);
    }
  }
  const newChatHandler = (currentTab) => {
    setOpenChat((e) => currentTab);
  };
  const clickFriendHandler = (friend) => {
    newChatHandler("2");
    setCurrentConv(friend);
  };
  function isFriend(friend) {
    return friendRequests.filter((user) => user.username === friend.username)
      .length;
  }
  function filteredFriends() {
    let userList = friends.map((c) => c.username);
    return friendRequests.filter((user) => !userList.includes(user.username));
  }
  function sentFriends() {
    let userList = friendRequests.map((c) => c.username);
    return friends.filter((friend) => !userList.includes(friend.username));
  }
  function allFriends() {
    let userList = friendRequests.map((c) => c.username);
    return friends.filter((friend) => userList.includes(friend.username));
  }
  async function addFriendHandler(friend) {
    try {
      if (user.username === friend.username) {
        return;
      }
      friend._id
        ? await addFriend({
            variables: { friendId: friend._id },
          })
        : await addFriend({
            variables: { friendId: friend.id },
          });
      socket.emit("add friend", { ...friend, id: friend._id });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      {visible && (
        <div className="chatBox testThis">
          <Tabs activeKey={openChat} onChange={(e) => newChatHandler(e)}>
            <TabPane tab="Friends" key="1">
              <li
                style={{
                  overflowY: "scroll",
                  height: "270px",
                }}
              >
                <p style={{ marginBottom: "0" }}>My Friends: </p>
                <List
                  style={{ paddig: "0 5px" }}
                  dataSource={allFriends()}
                  renderItem={(friend, i) => (
                    <List.Item
                      key={i}
                      onClick={() =>
                        isFriend(friend) && clickFriendHandler(friend)
                      }
                    >
                      <List.Item.Meta
                        avatar={
                          users.filter((user) => user.id === friend._id)
                            .length ? (
                            <Badge dot status="success" size="default">
                              <Avatar src={friend.avatar} />
                            </Badge>
                          ) : (
                            <Badge dot status="" size="default">
                              <Avatar src={friend.avatar} />
                            </Badge>
                          )
                        }
                        description={friend.username}
                      />

                      {users.filter((user) => user.id === friend._id).length ? (
                        <div>Online</div>
                      ) : (
                        <div>Offline</div>
                      )}
                    </List.Item>
                  )}
                ></List>
                <p>Friend Requests: </p>
                <List
                  dataSource={filteredFriends()}
                  renderItem={(friend, i) => (
                    <List.Item key={i}>
                      <List.Item.Meta
                        avatar={
                          users.filter(
                            (user) => user.username === friend.username
                          ).length ? (
                            <Badge dot status="success" size="default">
                              <Avatar src={friend.avatar} />
                            </Badge>
                          ) : (
                            <Badge dot status="" size="default">
                              <Avatar src={friend.avatar} />
                            </Badge>
                          )
                        }
                        description={friend.username}
                      />

                      <Tooltip title="Add User?">
                        <button onClick={(e) => addFriendHandler(friend)}>
                          +
                        </button>
                      </Tooltip>
                    </List.Item>
                  )}
                ></List>
                <p>Sent Friend Requests: </p>
                <List
                  dataSource={sentFriends()}
                  renderItem={(friend, i) => (
                    <List.Item key={i}>
                      <List.Item.Meta
                        avatar={
                          users.filter((user) => user.id === friend._id)
                            .length ? (
                            <Badge dot status="success" size="default">
                              <Avatar src={friend.avatar} />
                            </Badge>
                          ) : (
                            <Badge dot status="" size="default">
                              <Avatar src={friend.avatar} />
                            </Badge>
                          )
                        }
                        description={friend.username}
                      />

                      {users.filter((user) => user.id === friend._id).length ? (
                        <div>Online</div>
                      ) : (
                        <div>Offline</div>
                      )}
                    </List.Item>
                  )}
                ></List>
              </li>
            </TabPane>
            <TabPane tab="Conversations" key="2">
              {currentConv.username !== "" ? (
                <>
                  <div className="private-conversation">
                    <List.Item.Meta
                      avatar={
                        users.filter((user) => user.id === currentConv._id)
                          .length ? (
                          <Badge dot status="success" size="default">
                            <Avatar src={currentConv.avatar} />
                          </Badge>
                        ) : (
                          <Badge dot status="" size="default">
                            <Avatar src={currentConv.avatar} />
                          </Badge>
                        )
                      }
                      description={currentConv.username}
                    />
                  </div>
                  <ul
                    style={{
                      overflowX: "hidden",
                      overflowY: "scroll",
                      height: "210px",
                      backgroundColor: "#F0F2F5",
                    }}
                    className="private-chat"
                  >
                    {currentConvChat
                      .filter(
                        (message) =>
                          message.receiver === currentConv.username ||
                          message.sender === currentConv.username
                      )
                      .map((chat, i) => (
                        <li
                          key={i}
                          className={
                            user.username !== chat.username ? "their" : "mine"
                          }
                        >
                          {console.log(chat.username)}
                          {chat.message}
                        </li>
                      ))}
                    <div></div>
                  </ul>
                  <form onSubmit={(e) => sendMessage(e)}>
                    <div className="chatInput">
                      <Input
                        placeholder="write a message..."
                        className="chat"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                  </form>
                </>
              ) : (
                <p>Please select a friend...</p>
              )}
            </TabPane>
          </Tabs>
        </div>
      )}
    </>
  );
}

export default PrivateChat;
