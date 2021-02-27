import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

export const NoRoomName = () => {
  const classes = useStyles();
  return (
    <>
      <Box mt={10}>
        <Typography variant="h5">
          <span className={classes.wave}>👋</span> Hi there!
        </Typography>
      </Box>
      <Box mt={3}>
        <Typography>
          Start a new room to <br />
          get a conversation going!
        </Typography>
      </Box>
    </>
  );
};

const useStyles = makeStyles({
  wave: {
    animationName: "$wave-animation",
    animationDuration: "5s",
    animationIterationCount: 1,
    transformOrigin: "70% 70%",
    display: "inline-block",
  },
  "@keyframes wave-animation": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "5%": {
      transform: "rotate(-5deg)",
    },
    "10%": {
      transform: "rotate(10deg)",
    },
    "20%": {
      transform: "rotate(-10deg)",
    },
    "30%": {
      transform: "rotate(12deg)",
    },
    "40%": {
      transform: "rotate(-10deg)",
    },
    "50%": {
      transform: "rotate(12deg)",
    },
    "60% ": {
      transform: "rotate(-10deg)",
    },
    "70%": {
      transform: "rotate(12deg)",
    },
    "80%": {
      transform: "rotate(-10deg)",
    },
    "90%": {
      transform: "rotate(9deg)",
    },
    "100%": {
      transform: "rotate(0deg)",
    },
  },
});
