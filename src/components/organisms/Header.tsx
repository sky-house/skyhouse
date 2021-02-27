import React from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import DraftsOutlinedIcon from "@material-ui/icons/DraftsOutlined";
import EventOutlinedIcon from "@material-ui/icons/EventOutlined";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import { Avator } from "../atoms";

export const Header = () => {
  const classes = useStyles();

  return (
    <Box className={classes.headerContainer}>
      <Box className={classes.headerLeftContainer}>
        <SearchOutlinedIcon />
      </Box>
      <Box className={classes.headerRightContainer}>
        <DraftsOutlinedIcon />
        <EventOutlinedIcon />
        <NotificationsNoneOutlinedIcon />
        <Avator name="john" bgColor="primary" />
      </Box>
    </Box>
  );
};

const useStyles = makeStyles({
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "25px 15px",
    width: "100%",
  },
  headerLeftContainer: {
    display: "flex",
    alignItems: "center",
  },
  headerRightContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "60%",
  },
});
