import React from "react";
import { Button as MaterialButton, ButtonProps } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

interface Props extends ButtonProps {
  isGreen?: boolean;
}

export const Button: React.FC<Props> = ({
  children,
  isGreen = true,
  ...rest
}) => {
  const classes = useStyles();
  return (
    <MaterialButton
      className={`${classes.button} ${
        isGreen ? classes.greenButton : classes.grayButton
      }`}
      {...rest}
    >
      {children}
    </MaterialButton>
  );
};

const useStyles = makeStyles({
  button: {
    borderRadius: "20px",
    padding: "5px 20px",
    fontWeight: "bold",
    textTransform: "none",
    "&:active": {
      backgroundColor: "#35AD5E",
      color: "#ddd",
    },
  },
  greenButton: {
    backgroundColor: "#35AD5E",
    color: "#fff",
  },
  grayButton: {
    backgroundColor: "#F2F2F2",
    color: "#B76663",
  },
});
