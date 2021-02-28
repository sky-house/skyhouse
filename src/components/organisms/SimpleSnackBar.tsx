import React from "react";
import { Snackbar, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

export const SimpleSnackBar: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      autoHideDuration={6000}
      open={open}
      message="🎉 You are invited to speaker!"
      action={
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
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
