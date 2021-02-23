import React from "react";
import { Box } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";

interface Props {
  roomNumber: number;
}

export const RoomDetail: React.FC<Props> = ({ roomNumber }: Props) => {
  return (
    <Box display="flex" alignItems="center" fontSize={15}>
      {roomNumber}
      /
      <PersonIcon />
    </Box>
  );
};
