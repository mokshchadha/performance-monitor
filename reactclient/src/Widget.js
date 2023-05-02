import React from "react";
import { Cpu } from "./Cpu";
import { Memory } from "./Memory";
import { Info } from "./Info";

const Widget = (props) => {
  return (
    <div>
      <h1>Widget!!</h1>
      <Cpu />
      <Memory />
      <Info />
    </div>
  );
};

export default Widget;
