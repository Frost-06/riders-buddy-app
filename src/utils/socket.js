import Socket from "socket.io-client";

const socket = Socket.connect("http://localhost:3003/");
export default socket;
