import io from "socket.io-client";

const socket = io.connect("http://localhost:8181");

console.log("socket ", socket.id);

export default socket;
