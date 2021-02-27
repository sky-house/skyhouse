import React, { useCallback, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Divider, Typography, TextField } from "@material-ui/core";
import { Button, ImageIcon } from "../atoms";
import { Link } from "react-router-dom";

export const DrawerItem = () => {
  const classes = useStyles();
  const [input, setInput] = useState("");
  const messageRef = useRef("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      messageRef.current = e.target.value;
    },
    []
  );

  const handleBlur = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setInput(messageRef.current);
    },
    []
  );

  return (
    <Box className={classes.createRoomItem}>
      <Box className={classes.roomTypeButtonContainer}>
        <ImageIcon imageIconName="open" />
      </Box>
      <Divider className={classes.divider} />
      <TextField
        required
        className={classes.rootNameTextFieldContainer}
        id="roomName"
        type="text"
        label="Room Name"
        fullWidth
        variant="outlined"
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <Divider className={classes.divider} />
      <Box className={classes.createRoomButtonContainer}>
        <Typography>Start a room open to everyone</Typography>
        <Link
          to={
            input
              ? {
                  pathname: `/Room/${input}`,
                  state: {
                    admin: true,
                  },
                }
              : "#"
          }
          style={{ textDecoration: "none", marginTop: "8px" }}
        >
          <Button variant="contained" disabled={input ? false : true}>
            🎉 Let's go
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles({
  createRoomItem: {
    padding: "20px",
  },
  divider: {
    marginTop: "13px",
    marginBottom: "13px",
  },
  rootNameTextFieldContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  roomTypeButtonContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "40%",
  },
  createRoomButtonContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    height: "40%",
  },
});
