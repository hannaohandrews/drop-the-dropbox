import React from "react";
import "./index.css";

const Title = ({ text }: { text: string }) => {
  return <h1 className="project_title">{text}</h1>;
};

export default Title;
