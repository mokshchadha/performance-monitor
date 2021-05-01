import io from "socket.io-client";
let socket = io.connect("https://localhost:8181");
console.log("emitting");
socket.emit("clientAuth", "mokshreact");
console.log(socket);
export default socket;
