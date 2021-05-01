import React from "react";
import "./App.css";
import socket from "./utilities/socketConnection";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      performanceData: {},
    };
  }

  componentDidMount() {
    socket.emit("clientAuth", "mokshreact");
  }

  render() {
    return (
      <div className="App">
        <h1>Sanity check</h1>
      </div>
    );
  }
}

export default App;
