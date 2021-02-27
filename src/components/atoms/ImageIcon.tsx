import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, AvatarProps, Typography } from "@material-ui/core";

// add other image
const ImageIconsCandidate = {
  open:
    "https://cdn.plus.amanaimages.com/uploads/items/024/332/05/preview/FYI02433205.jpg",
} as const;
type ImageIconsCandidateKeys = keyof typeof ImageIconsCandidate;

interface Props extends AvatarProps {
  imageIconName: ImageIconsCandidateKeys;
}

export const ImageIcon: React.FC<Props> = ({ imageIconName }: Props) => {
  const classes = useStyles();
  return (
    <>
      <Avatar
        alt={imageIconName}
        src={ImageIconsCandidate[imageIconName]}
        className={classes.imageIcon}
      />
      <Typography>{imageIconName}</Typography>
    </>
  );
};

const useStyles = makeStyles({
  imageIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "25px",
  },
});
