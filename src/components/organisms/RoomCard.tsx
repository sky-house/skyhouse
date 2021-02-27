import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Avator } from "../atoms";
import { RoomDetail } from "../molecules";

interface Props {
  title: string;
  names: string[];
  roomNumber: number;
}

export const RoomCard: React.FC<Props> = ({
  title,
  names,
  roomNumber,
}: Props) => {
  const classes = useStyles();
  return (
    <Box
      width={310}
      color="#000"
      bgcolor="#fff"
      borderRadius={10}
      boxShadow="0 3px 6px -2px rgb(0 10 60 / 20%)"
      p={2}
      mt={2}
    >
      <Typography variant="h2" className={classes.title}>
        {title}
      </Typography>
      <Box className={classes.roomDetailContainer}>
        <Box>
          <Avator name="aaa" bgColor="primary" />
        </Box>
        <Box ml={2}>
          <Box className={classes.roomDetailTextContainer}>
            {names.map((name, index) => (
              <Typography key={index}>{name} 💬</Typography>
            ))}
          </Box>
          <RoomDetail roomNumber={roomNumber} />
        </Box>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles({
  title: {
    fontSize: 20,
    margin: "0 10px 10px 10px",
    textAlign: "left",
  }, // a style rule
  roomDetailContainer: {
    display: "flex",
  }, // a nested style rule
  roomDetailTextContainer: {
    display: "flex",
    flexDirection: "column",
  },
});
