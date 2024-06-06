import React from "react";
import Dropzone from "./Dropzone";
import Title from "./Title";

export default function Home() {
  return (
    <div>
      <Title text="Project: DroppedBox" />
      <Dropzone />
    </div>
  );
}
