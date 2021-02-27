import React from "react";
import { Box, BoxProps } from "@material-ui/core";

// add other color
const BgColors = {
  primary: "#FACE4A",
} as const;
type BgColorsKeys = keyof typeof BgColors;

interface Props extends BoxProps {
  name: string;
  bgColor: BgColorsKeys;
}

export const Avator: React.FC<Props> = ({ name, bgColor }: Props) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width={50}
      height={50}
      borderRadius={20}
      bgcolor={BgColors[bgColor]}
    >
      {name}
    </Box>
  );
};
