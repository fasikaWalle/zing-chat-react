import React, { useState, useEffect } from "react";
import { List, Input } from "antd";
import RoomCard from "./RoomCard";
import { QUERY_ROOMS } from "../../utils/queries";
import { ADD_ROOM } from "../../utils/mutations";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useSocket, useUsers } from "../Socket";
import RoomForm from "../../components/RoomForm";
import { Button, Row, Col } from "antd";

import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

export default function RoomList() {
  const socket = useSocket();
  const [rooms, setRooms] = useState([]);
  const [filterString, setFilterString] = useState("");

  const [createRoom] = useMutation(ADD_ROOM);
  const { data } = useQuery(QUERY_ROOMS);
  const [visible, setVisible] = useState(false);
  const { users } = useUsers();

  useEffect(() => {
    if (data) {
      setRooms((index) => [
        ...index,
        ...data.rooms.map((room) => {
          return { ...room, users: [] };
        }),
      ]);
    }
    if (socket) {
      socket.on("add room", (room) => {
        setRooms((index) => [...index, { ...room, users: [] }]);
      });
      socket.on("delete room", (room) => {
        setRooms((index) => [...index.filter((old) => old._id !== room._id)]);
      });
      socket.on("edit room", (room) => {
        setRooms((index) => [
          ...index.map((old) => {
            if (old._id === room._id) {
              return { ...room, users: [] };
            }
            return old;
          }),
        ]);
      });

      return () => {
        socket.off("add room");
        socket.off("delete room");
        socket.off("edit room");
      };
    }
  }, [data]);

  const onCreate = async (values) => {
    const { roomName, tags, privacy, password, primary, secondary, tertiary } =
      values;
    try {
      const response = await createRoom({
        variables: {
          roomName,
          colors: [primary, secondary, tertiary],
          tags,
          privacy,
          password: password || "",
        },
      });
      socket.emit("add room", response.data.addRoom);
    } catch (e) {
      console.log(e);
    }
    setVisible(false);
  };

  return (
    <>
      <Row
        style={{
          padding: "0 4%",
          marginTop: "1.8%",
        }}
      >
        <Col align="left" flex="auto">
          <h1 style={{ margin: 0 }}>{rooms.length} rooms</h1>
        </Col>
        <Col align="right" span={12}>
          <Input
            size="large"
            style={{
              borderRadius: "32px",
              padding: "8px 16px",
            }}
            value={filterString}
            allowClear
            suffix={<SearchOutlined />}
            placeholder="Search By Tag"
            onChange={(e) => setFilterString(e.target.value)}
          />
        </Col>

        <Col align="right" span={3}>
          <Button
            icon={<PlusOutlined />}
            shape="round"
            size="large"
            style={{
              backgroundColor: "#434379",
              color: "#fff",
            }}
            onClick={() => {
              setVisible(true);
            }}
          >
            Room
          </Button>
          <RoomForm
            visible={visible}
            onCreate={onCreate}
            onCancel={() => {
              setVisible(false);
            }}
          />
        </Col>
      </Row>

      <List
        style={{ padding: "1% 4%" }}
        id="room-list"
        dataSource={
          filterString
            ? rooms.filter((room) => {
                for (let i = 0; i < room.tags.length; i++) {
                  if (
                    room.tags[i]
                      .toLowerCase()
                      .includes(filterString.toLowerCase())
                  ) {
                    return true;
                  }
                }
                return false;
              })
            : rooms
        }
        pagination={{
          pageSize: 4,
          hideOnSinglePage: true,
        }}
        renderItem={(room, i) => (
          <RoomCard
            key={i}
            room={{
              ...room,
              users: users.filter((user) => user.room === room._id),
            }}
            setFilterString={setFilterString}
          />
        )}
      ></List>
    </>
  );
}
