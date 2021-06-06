import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
const socket = io.connect("/");

const Chat = ({ location }) => {
	const [username, setUsername] = useState("");
	const [room, setRoom] = useState("");
	const ENDPOINT = "localhost:4000";

	useEffect(() => {
		const { username, room } = queryString.parse(location.search);

		socket = io(ENDPOINT);
		setUsername(username);
		setRoom(room);

		socket.emit("join", { username, room });
	}, [ENDPOINT, location.search]);
	return <h1>{room}</h1>;
};

export default Chat;
