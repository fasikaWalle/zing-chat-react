import React from "react";
import { List, Button, Avatar } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/react-hooks";
import { ADD_FRIEND } from "../../../utils/mutations";
import { useMyInfo, useSocket } from "../../Socket";

export default function UserCard({ user, friends, setFriends }) {
  const [addFriend] = useMutation(ADD_FRIEND);
  const socket = useSocket();
  const userData = useMyInfo();

  const addFriendHandler = async (event) => {
    event.preventDefault();
    try {
      if (user.id === userData._id) {
        return;
      }
      const response = await addFriend({
        variables: { friendId: user.id },
      });
      socket.emit("add friend", user.id);
      setFriends((old) => [...old, { _id: user.id, username: user.username }]);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <List.Item
        style={{
          border: "1px solid #dadada",
          borderRadius: "6px",
          margin: "12px",
          padding: "8px",
        }}
      >
        <List.Item.Meta
          avatar={<Avatar src={user.avatar} size={56} />}
          title={
            <div
              style={{ marginTop: "8px", marginBottom: "0" }}
              align="left"
            >{`${user.username} `}</div>
          }
          description={
            <p style={{ marginTop: "0" }} align="left">{`${user.roomName}`}</p>
          }
        />

        {friends.filter((friend) => friend._id === user.id) < 1 &&
        user.id !== userData._id ? (
          <Button onClick={addFriendHandler} icon={<UserAddOutlined />} />
        ) : null}
      </List.Item>
    </>
  );
}
