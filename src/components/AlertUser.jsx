import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { setAlert } from "../slices/user/userSlice";

function AlertUser({ alert }) {
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.user?.collapsed);
  const [snackPack, setSnackPack] = useState([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState(undefined);

  useEffect(() => {
    if (alert?.alert) {
      setSnackPack((prev) => [
        ...prev,
        { ...alert, key: new Date().getTime() },
      ]);
    }
  }, [alert]);

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleClose = () => {
    setOpen(false);
    dispatch(setAlert({}));
  };

  return (
    <Snackbar
      key={messageInfo ? messageInfo.key : undefined}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: collapsed ? "center" : "left",
      }}
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      TransitionProps={{ onExited: () => setMessageInfo(undefined) }}
      ClickAwayListenerProps={{ onClickAway: () => null }}
    >
      <Alert
        severity={messageInfo ? messageInfo.severity : undefined}
        onClose={handleClose}
      >
        {messageInfo ? messageInfo.alert : undefined}
      </Alert>
    </Snackbar>
  );
}

export default AlertUser;
