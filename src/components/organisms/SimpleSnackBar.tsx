import React from "react";
import { Button, Snackbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

interface Props {
  isSpeaker: boolean;
  setIsSpeaker: (value: React.SetStateAction<boolean>) => void;
}

export const SimpleSnackBar: React.FC<Props> = ({
  isSpeaker,
  setIsSpeaker,
}: Props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(isSpeaker);

  const handleApproveInvite = () => {
    setOpen(false);
    setIsSpeaker(true);
  };

  const handleRejectInvite = () => {
    setOpen(false);
    setIsSpeaker(false);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={open}
      message="You are invited to speaker."
      action={
        <>
          <Button
            className={classes.snackBarButton}
            color="inherit"
            size="small"
            onClick={handleApproveInvite}
          >
            👍 Yes!
          </Button>
          <Button
            className={classes.snackBarButton}
            color="inherit"
            size="small"
            onClick={handleRejectInvite}
          >
            👎 No!
          </Button>
        </>
      }
      ContentProps={{ className: classes.snackBarContainer }}
    />
  );
};

const useStyles = makeStyles({
  snackBarContainer: {
    backgroundColor: "#35AD5E",
    color: "#fff",
    fontWeight: "bold",
  },
  snackBarButton: {
    backgroundColor: "#35AD5E",
    fontWeight: "bold",
  },
});
