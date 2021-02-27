import React from "react";
import { Button as MaterialButton, ButtonProps } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

export const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  const classes = useStyles();
  return (
    <MaterialButton className={classes.button} {...rest}>
      {children}
    </MaterialButton>
  );
};

const useStyles = makeStyles({
  button: {
    borderRadius: "20px",
    backgroundColor: "#35AD5E",
    color: "#fff",
    padding: "5px 20px",
    fontWeight: "bold",
    "&:active": {
      backgroundColor: "#35AD5E",
      color: "#ddd",
    },
  },
});
