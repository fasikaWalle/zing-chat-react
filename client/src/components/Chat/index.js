import React, { useState, useEffect } from "react";
import Parser from "html-react-parser";
import { Avatar, Form, Button, Layout, Col, Row, PageHeader, List } from "antd";

import { SendOutlined } from "@ant-design/icons";
import "../../App.css";
import TextEditor from "../TextEditor";
import { useSocket, useMyInfo, useUsers } from "../Socket";
import { useLocation } from "react-router-dom";

import { useMutation, useQuery } from "@apollo/react-hooks";
import { ADD_CHAT } from "../../utils/mutations";
import { QUERY_ROOM } from "../../utils/queries";
const { Content } = Layout;

export default function Chat() {
  const location = useLocation();
  const { roomId, roomName } = location.state;
  const user = useMyInfo();
  const [room, setRoom] = useState({ colors: ["#fff", "#fff", "#fff"] });
  const allUsers = useUsers().users;
  const [users, setUsers] = useState(
    allUsers.filter((user) => user.room === roomId)
  );
  const [addChat] = useMutation(ADD_CHAT);
  const { data } = useQuery(QUERY_ROOM, {
    variables: {
      _id: roomId,
    },
  });

  const socket = useSocket();
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const chatBox = document.querySelector(".chat-area");

  useEffect(() => {
    if (data) {
      const chatData = data.room[0].roomChat;
      setChat((old) => [...chatData, ...old]);
      setRoom(data.room[0]);
    }
    if (socket) {
      if (!users.length) {
        socket.emit("populate users");
      }
      socket.emit("join room", roomId, roomName);

      socket.on("receive message", (message) => {
        setChat((old) => [...old, message]);
      });
      socket.on("receive users", (socketUsers) => {
        setUsers(socketUsers);
      });
      socket.on("user disconnecting", (id) => {
        setUsers((oldUsers) => [...oldUsers.filter((user) => user.id !== id)]);
      });
      return () => {
        socket.off("receive message");
        socket.off("receive users");
        socket.off("user disconnecting");
      };
    }
  }, [data, socket]);

  async function submitForm(e) {
    e.preventDefault();
    socket.emit("send message", msg);
    setMsg("");

    try {
      await addChat({
        variables: {
          roomId: roomId,
          message: msg,
          avatar: user.avatar,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
  if (chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  if (chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  console.log(users);
  return (
    <>
      <Layout>
        <Row
          style={{
            backgroundColor: room.colors[0],
            height: "100vh",
          }}
        >
          <Col
            span={4}
            offset={2}
            style={{
              backgroundColor: "#F0F2F5",
              height: "75vh",
              margin: "2.5% 0 0 2.5% ",
              boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
          >
            <PageHeader
              title="Online users"
              style={{ borderBottom: "1px solid #ddd" }}
            />
            {users.map((user) => (
              <>
                <List.Item
               
                  style={{
                    borderRadius: "6px",
                    margin: "12px",
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={user.avatar} size={30} />}
                    title={
                      <div
                        style={{ marginTop: "8px", marginBottom: "0" }}
                        align="left"
                      >{`${user.username} `}</div>
                    }
                  />
                </List.Item>
              </>
            ))}
          </Col>
          <Col span={16}>
            <Content
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                margin: "4% 6%",
                boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Content
                style={{
                  padding: "24px",
                  backgroundColor: "#fff",
                  overflowX: "hidden",
                  overflowY: "scroll",
                  height: "55vh",
                  borderBottom: "2px solid #e6e6e6",
                }}
              >
                {chat.map((message, i) => (
                  // Renders the message component
                  <>
                    {message.username !== "zingBot" ? (
                      message.username === user.username ? (
                        <Row justify="end" className="msg-container">
                          <Col align="right" className="my-chat">
                            <span
                              style={{
                                align: "right",
                                textAlign: "right",
                              }}
                              className="chat-metadata"
                            >
                              {message.username}, {message.createdAt}
                            </span>

                            <div
                              className="my-chat"
                              style={{
                                display: "inline-block",
                                textAlign: "left",

                                backgroundColor: room.colors[1],
                                padding: "12px",
                                marginBottom: "16px",
                              }}
                            >
                              {Parser(message.message)}
                            </div>
                          </Col>
                          <Col>
                            <Avatar src={message.avatar}></Avatar>
                          </Col>
                        </Row>
                      ) : (
                        <Row justify="start" key={i} className="msg-container">
                          <Col>
                            <Avatar src={message.avatar}></Avatar>
                          </Col>
                          <Col align="left">
                            <span
                              style={{
                                align: "right",
                                textAlign: "right",
                              }}
                              className="chat-metadata"
                            >
                              {message.username}, {message.createdAt}
                            </span>

                            <div
                              style={{
                                display: "inline-block",
                                textAlign: "left",
                                padding: "12px",
                                marginBottom: "16px",
                                backgroundColor: room.colors[2],
                              }}
                              className="their-chat"
                            >
                              {Parser(message.message)}
                            </div>
                          </Col>
                        </Row>
                      )
                    ) : (
                      <>
                        <p style={{ margin: 0, textAlign: "center" }}>
                          {message.message}
                        </p>
                        <p
                          style={{
                            textAlign: "center",
                            fontSize: "12px",
                            margin: "0 0 12px 0",
                            color: "grey",
                          }}
                        >
                          {message.createdAt}
                        </p>
                      </>
                    )}
                  </>
                ))}
              </Content>
              <Content
                style={{
                  padding: "24px",
                  backgroundColor: "#fff",
                  height: "20vh",
                  overflow: "hidden",
                }}
              >
                <Row
                  style={{
                    padding: "4px",
                    margin: "0",
                    height: "100%",
                  }}
                >
                  <Col flex="auto">
                    <Form.Item
                      className="text-editor"
                      style={{
                        padding: "0",
                        margin: "0",
                      }}
                    >
                      <TextEditor value={msg} setValue={setMsg} />
                    </Form.Item>
                  </Col>
                  <Col flex="50px" style={{ margin: "50px 20px 0 0" }}>
                    <Form.Item>
                      <Button
                        shape="circle"
                        style={{
                          backgroundColor: "#3d50d6",
                        }}
                        icon={<SendOutlined />}
                        htmlType="submit"
                        onClick={submitForm}
                        type="primary"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Content>
            </Content>
          </Col>
        </Row>
      </Layout>
    </>
  );
}
