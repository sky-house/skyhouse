import React from "react";
import { Box, Typography } from "@material-ui/core";

export const NoRoomName = () => {
  return (
    <>
      <Box mt={10}>
        <Typography>👋 Hi there!</Typography>
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
