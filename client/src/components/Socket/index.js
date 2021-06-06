import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import io from "socket.io-client";
import decode from "jwt-decode";
import { useHistory } from "react-router";
import { QUERY_USER } from "../../utils/queries";

const SocketContext = React.createContext();
const UsersContext = React.createContext();
const MeContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function useUsers() {
  return useContext(UsersContext);
}

export function useMyInfo() {
  return useContext(MeContext);
}

export default function Socket({ children, idToken }) {
  const { data } = useQuery(QUERY_USER);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState();
  const [myInfo, setInfo] = useState();

  const routerHistory = useHistory();
  useEffect(() => {
    const data = decode(idToken).data;
    setInfo(data);
    const newSocket = io("/", {
      query: { idToken: JSON.stringify(data) },
    });
    setSocket(newSocket);
    newSocket.on("already logged in", () => {
      routerHistory.push("/error");
    });
    return () => newSocket.close();
  }, [idToken]);

  useEffect(() => {
    if (data) {
      setInfo(data.user);
    }
  }, [data]);

  return (
    <SocketContext.Provider value={socket}>
      <UsersContext.Provider value={{ users, setUsers }}>
        <MeContext.Provider value={myInfo}>{children}</MeContext.Provider>
      </UsersContext.Provider>
    </SocketContext.Provider>
  );
}
