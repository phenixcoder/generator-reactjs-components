import React from "react";
import ReactDOM from "react-dom";
import <%= compName %> from ".";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<<%= compName %> />, div);
  ReactDOM.unmountComponentAtNode(div);
});
