import React, { useState, useEffect } from "react";
import { SketchField, Tools } from "react-sketch";
import {
  Button,
  Select,
  Row,
  Col,
  Input,
  Avatar,
  PageHeader,
  Space,
  Typography,
} from "antd";
import { FrownOutlined } from "@ant-design/icons";
import { useSocket, useMyInfo } from "../Socket";

const { Title } = Typography;
const { Option } = Select;

const data = [
  { name: "bunny", score: 20 },
  { name: "carrot", score: 90 },
  { name: "Easter", score: 20 },
  { name: "new", score: 40 },
];
const Paint = () => {
  console.log("here");
  const user = useMyInfo();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paintState, setPaintState] = useState({
    tools: Tools.Pencil,
    active: false,
    lineWidth: 10,
    canUndo: false,
    canRedo: false,
  });

  const users = [
    { username: "fasika", answer: "banana", score: 0 },
    { username: "Bunny", answer: "orange", score: 0 },
  ];

  const handleChange = (value) => {
    setPaintState({ tools: value });
  };

  const undo = () => {
    paintState._sketch.undo();
    setPaintState({
      canUndo: paintState._sketch.canUndo(),
      canRedo: paintState._sketch.canRedo(),
    });
  };

  const redo = () => {
    paintState._sketch.redo();
    setPaintState({
      canUndo: paintState._sketch.canUndo(),
      canRedo: paintState._sketch.canRedo(),
    });
  };
  const onSketchChange = () => {
    let prev = paintState.canUndo;
    let now = paintState._sketch.canUndo();
    if (prev !== now) {
      setPaintState({ canUndo: now });
    }
  };

  const submitAnswerhandler = (e) => {
    e.preventDefault();
    socket.emit("send message", message);
    setMessage("");
  };

  useEffect(() => {
    if (socket) {
      socket.on("receive message", (message) => {
        setChat((old) => [...old, message]);
      });
      return () => {
        socket.off("receive message");
      };
    }
  }, [socket]);

  const clear = () => {
    paintState._sketch.clear();
    setPaintState({
      backgroundColor: "transparent",
      fillWithBackgroundColor: false,
      canUndo: paintState._sketch.canUndo(),
      canRedo: paintState._sketch.canRedo(),
    });
  };

  return (
    <>
      <Row>
        <Col span={4}></Col>

        <Col
          span={13}
          offset={2}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Space
            style={{
              fontSize: "30px",
              color: "#e67e22",
              fontWeight: "bold",
              fontFamily: "cursive",
            }}
          >
            Orange banana Lemon
          </Space>
        </Col>
      </Row>
      <Row>
        <Col
          span={4}
          offset={1}
          style={{
            backgroundColor: "#F0F2F5",
          }}
        >
          <PageHeader
            title="Online users"
            style={{ backgroundColor: "#FFFAFA" }}
          />
          {data.map((user) => (
            <div
              key={user.name}
              style={{
                backgroundColor: "#FFF",
                marginBottom: "1rem",
              }}
            >
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              <span>{user.name}</span>
              <div style={{ marginLeft: "3rem", fontSize: "10px" }}>
                Score: {user.score}
              </div>
            </div>
          ))}
        </Col>
        <Col span={13} offset={1}>
          {isDrawing ? (
            <div style={{ backgroundColor: "#fff", width: "98% " }}>
              <SketchField
                ref={(c) => (paintState._sketch = c)}
                width="98%"
                height="70vh"
                tool={paintState.tools}
                onChange={onSketchChange}
              />
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "#fff",
                width: "97%",
                fontSize: "30px",
                height: "100%",
              }}
            >
              <div style={{ padding: "28% 25%" }}>
                <FrownOutlined style={{ color: "red", margin: "1px" }} />
                Sorry Fasika is drawing!!{" "}
              </div>
            </div>
          )}
        </Col>
        <Col span={4} style={{ backgroundColor: "#F7F8F8", padding: "10px" }}>
          <div style={{ backgroundColor: "#eee" }}>
            {chat.map((answer, i) => (
              <Title level={5} key={i}>
                {answer.message}
              </Title>
            ))}
          </div>
        </Col>
      </Row>

      <Row>
        <Col span={4} offset={1}></Col>
        <Col span={13} offset={1}>
          <div
            style={{
              backgroundColoe: "#555",
              display: "flex",
            }}
          >
            <Select
              defaultValue={paintState.tools}
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Option value={Tools.Pan} key="pan">
                Pan
              </Option>
              <Option value={Tools.Circle} key="circle">
                Circle
              </Option>
              <Option value={Tools.Rectangle} key="rectangle">
                Rectangle
              </Option>
              <Option value={Tools.Line}>Line</Option>
              <Option value={Tools.Pencil}>Pencil</Option>
            </Select>

            <Button onClick={undo} disabled={!paintState.canUndo}>
              Undo
            </Button>
            <Button onClick={redo} disabled={!paintState.canRedo}>
              Redo
            </Button>
            <Button onClick={clear}>Clear</Button>
            <Button>Done</Button>
          </div>
        </Col>
        <Col span={4}>
          <Input
            placeholder="Write your answer"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onPressEnter={submitAnswerhandler}
            style={{
              bottom: "0",
              position: "absolute",
              marginBottom: "2rem",
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default Paint;
