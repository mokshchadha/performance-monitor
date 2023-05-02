import { useEffect } from "react";
import "./App.css";
import io from "socket.io-client";

import Widget from "./Widget";

const socket = io.connect("http://localhost:8181");

function App() {
  useEffect(() => {
    console.log(socket.id);
    socket.on("data", (d) => console.log(d));
    return () => {};
  }, []);

  return (
    <div className="App">
      <Widget />
    </div>
  );
}

export default App;
