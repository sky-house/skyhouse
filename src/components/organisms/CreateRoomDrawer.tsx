import React, { useCallback, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Drawer } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Button } from "../atoms";
import { DrawerItem } from ".";

export const CreateRoomDrawer = () => {
  const classes = useStyles();
  const [state, setState] = useState(false);

  const toggleDrawer = useCallback(
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      setState(open);
    },
    []
  );

  return (
    <Box className={classes.createRoomContainer}>
      <Button
        size="large"
        startIcon={<AddIcon />}
        variant="contained"
        onClick={toggleDrawer(true)}
      >
        Start a room
      </Button>
      <Drawer anchor="bottom" open={state} onClose={toggleDrawer(false)}>
        <DrawerItem />
      </Drawer>
    </Box>
  );
};

const useStyles = makeStyles({
  createRoomContainer: {
    position: "fixed",
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "150px",
    width: "100%",
    zIndex: 99,
    background:
      "linear-gradient(rgba(242, 239, 228, 0) 20%, rgba(242, 239, 228, 1) 50%)",
    borderRadius: "20px",
  },
});
