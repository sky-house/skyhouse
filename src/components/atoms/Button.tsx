import React from "react";
import { Button as MaterialButton, ButtonProps } from "@material-ui/core";

export const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return <MaterialButton {...rest}>{children}</MaterialButton>;
};
