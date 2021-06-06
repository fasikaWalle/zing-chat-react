import React, { useState } from "react";
import PrivateChat from "./index";
import { MessageOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import {useVisible} from "./BlurHandler"

function Private() {
  const {visible, setVisibility} = useVisible();
  const [count, setCount] = useState(0)

  const showPrivateMessage = (e) => {
    e.preventDefault();
    setVisibility(!visible);
  };

  const onClose = () => {
    setVisibility(!visible);
  };

  return (
    <div>
      <Badge count={count} overflowCount={100} className="message-badge" >
        <MessageOutlined
          onClick={showPrivateMessage}
          className="message-icon"
        />
      </Badge>
      <PrivateChat setCount={setCount} onClose={onClose} />
    </div>
  );
}

export default Private;
