import React from "react";
import { Box } from "@material-ui/core";

export const DefaultLayouts: React.FC = ({ children }) => {
  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width={326}
        margin="0 auto"
      >
        {children}
      </Box>
    </Box>
  );
};
