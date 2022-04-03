import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle as MuiDialogTitle,
  Icon,
  IconButton,
  LinearProgress,
  Typography,
  withStyles,
} from "@material-ui/core";
import React, { useCallback, useContext, useState } from "react";
import DialogContext from "../../context/DialogContext";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography
        variant="h2"
        style={{ fontSize: 21, fontWeight: 600, ...(props.titleProps || {}) }}
      >
        {children}
      </Typography>
      {onClose && !props.noClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <Icon>close</Icon>
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
function DialogComponent(props) {
  const { dialogContext, setDialogContext } = useContext(DialogContext);
  const [loading, setLoading] = useState(false);
  const closeDialog = useCallback(() => {
    if (!dialogContext.noClose)
      setDialogContext({ ...dialogContext, visible: false });
  }, [dialogContext]);
  return (
    <Dialog
      open={dialogContext.visible}
      onClose={() => closeDialog()}
      maxWidth="md"
      fullWidth
      className="dialog-provider"
    >
      <DialogTitle
        onClose={() => closeDialog()}
        noClose={dialogContext.noClose}
      >
        {dialogContext.title}
      </DialogTitle>
      <DialogContent>
        {loading && <LinearProgress />}
        {dialogContext.message}
      </DialogContent>
      <DialogActions>
        {dialogContext.actions?.map((action, index) => (
          <Button
            disabled={loading}
            key={index}
            {...(action.props ? action.props : {})}
            onClick={() =>
              action.callback({ closeDialog, dialogContext, setLoading })
            }
          >
            {action.name}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
}

export default DialogComponent;
