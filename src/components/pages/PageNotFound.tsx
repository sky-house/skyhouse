import React from "react";
import { Link } from "react-router-dom";
import { DefaultLayouts } from "../templates";
import { Box, Typography } from "@material-ui/core";
import { Button } from "../atoms";
import { makeStyles } from "@material-ui/core/styles";

const PageNotFound = () => {
  const classes = useStyles();
  return (
    <DefaultLayouts>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100%"
      >
        <Box>
          <Typography variant="h4">
            <span className={classes.wave}>👋</span> Skyhouse
          </Typography>
        </Box>
        <Box mt={3} mb={3}>
          <Typography>
            Hey, we're still opening up but anyone can join with an no invite!
          </Typography>
        </Box>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button variant="contained">🏠 Let's go home!</Button>
        </Link>
      </Box>
    </DefaultLayouts>
  );
};

export default PageNotFound;

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
