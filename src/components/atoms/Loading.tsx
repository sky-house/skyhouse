import React from "react";
import { Box, CircularProgress } from "@material-ui/core";

export const Loading = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100%"
    >
      <CircularProgress />
    </Box>
  );
};
