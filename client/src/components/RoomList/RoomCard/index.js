import React, { useState } from "react";
import { Card, Avatar, Button, Col, Row, Tag, Tooltip, Input } from "antd";

import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined, RightOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_ROOM } from "../../../utils/mutations";
import { useSocket, useMyInfo } from "../../Socket";
import EditForm from "../../RoomForm/EditForm";

import { UPDATE_ROOM } from "../../../utils/mutations";
const { Meta } = Card;

export default function RoomCard({ room, setFilterString }) {
  const { users, tags, roomName } = room;
  const [deleteRoom] = useMutation(DELETE_ROOM);
  const [updateRoom] = useMutation(UPDATE_ROOM);
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");

  const socket = useSocket();

  const id = room._id;
  const { username } = useMyInfo();
  const deleteHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await deleteRoom({
        variables: {
          _id: room._id,
        },
      });

      socket.emit("delete room", room);
    } catch (e) {
      console.log(e);
    }
  };

  const editHandler = (event) => {
    event.preventDefault();
    setVisible(!visible);
  };

  function filterListByTag(tagName) {
    setFilterString(tagName);
  }

  function lockedRoom() {
    console.log("wrong pw");
  }

  const onCreate = async (values) => {
    const { roomName, tags, privacy, primary, secondary, tertiary } = values;
    try {
      const response = await updateRoom({
        variables: {
          roomId: room._id,
          roomName,
          colors: [primary, secondary, tertiary],
          tags,
          privacy,
        },
      });
      socket.emit("edit room", response.data.updateRoom);
    } catch (e) {
      console.log(e);
    }
    setVisible(false);
  };

  return (
    <>
      <Card
        title={roomName}
        extra={
          <>
            {room.privacy === "public" ? (
              <Link
                to={{
                  pathname: `/room/${id}`,
                  state: { roomName: room.roomName, roomId: id },
                }}
              >
                {" "}
                {room.username === username ||
                username.toLowerCase() === "admin" ? (
                  <>
                    <Button
                      icon={<DeleteOutlined style={{ color: "#bd0c0b" }} />}
                      onClick={deleteHandler}
                      style={{ marginRight: "10px" }}
                    />

                    <Button
                      icon={<EditOutlined />}
                      style={{ marginRight: "10px" }}
                      onClick={editHandler}
                    />
                  </>
                ) : null}
                <Button shape="round">
                  Join <RightOutlined />
                </Button>
              </Link>
            ) : (
              <>
                {" "}
                {room.username === username ||
                username.toLowerCase() === "admin" ? (
                  <>
                    <Button
                      icon={<DeleteOutlined style={{ color: "#bd0c0b" }} />}
                      onClick={deleteHandler}
                    />

                    <Button
                      icon={<EditOutlined />}
                      onClick={editHandler}
                      style={{ marginLeft: "10px" }}
                    />
                  </>
                ) : null}
              
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  style={{ width: "10rem", marginLeft: "10px" }}
                />
                {password !== room.password ? (
                  <Button
                    onClick={(e) => lockedRoom()}
                    style={{ marginLeft: "10px" }}
                  >
                    Join <RightOutlined />
                  </Button>
                ) : (
                  <Link
                    to={{
                      pathname: `/room/${id}`,
                      state: { roomName: room.roomName, roomId: id },
                    }}
                  >
                    <Button>
                      Join <RightOutlined />
                    </Button>
                  </Link>
                )}
              </>
            )}
          </>
        }
      >
        <Meta description={`created by ${room.username}`} />
        <Row justify="space-between">
          <Col>
            {tags.map((tag, i) => {
              return (
                <Tag
                  style={{
                    margin: "2px",
                    padding: "0 8px",
                  }}
                  color="#47A8BD"
                  key={i}
                  className="filterTags"
                  onClick={(e) => filterListByTag(tag)}
                >
                  {tag}
                </Tag>
              );
            })}
          </Col>
          <Col>
            <Avatar.Group maxCount={5}>
              {users.map((user, i) => {
                return (
                  <Tooltip title={user.username} key={i}>
                    <Avatar
                      key={i}
                      className="avatar-round"
                      size="32"
                      src={user.avatar}
                      round="true"
                      name={user.username}
                    />
                  </Tooltip>
                );
              })}
            </Avatar.Group>
          </Col>
        </Row>
      </Card>
      <EditForm
        visible={visible}
        room={room}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </>
  );
}
