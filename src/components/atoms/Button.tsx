import React from "react";
import { Button as MaterialButton } from "@material-ui/core";

const Button: React.FC = ({ children }) => {
  return <MaterialButton>{children}</MaterialButton>;
};

export default Button;
