import React, { useEffect } from "react";
import Button from "@mui/material/Button"; // Importing Button component from Material-UI
import Snackbar from "@mui/material/Snackbar"; // Importing Snackbar component from Material-UI
import IconButton from "@mui/material/IconButton"; // Importing IconButton component from Material-UI
import CloseIcon from "@mui/icons-material/Close"; // Importing CloseIcon component from Material-UI
import { useAppDispatch, useAppSelector } from "../../store/store"; // Importing custom Redux hooks for dispatch and selector
import {
  addNotification,
  clearNotification,
} from "../../store/slices/userNotificationSlice"; // Importing Redux actions

// Functional component for a simple snackbar
export default function SimpleSnackbar() {
  // State to manage the open/close state of the snackbar
  const [open, setOpen] = React.useState(false);

  // Redux dispatch function
  const dispatch = useAppDispatch();

  // Redux selector to get notifications from the store
  let notifications = useAppSelector(
    (state) => state.userNotificationSlice.userNotifications
  );

  // Effect hook to handle notification changes
  useEffect(() => {
    // If there is a notification message, set open to true and clear the notification after 3 seconds
    if (notifications.message) {
      setOpen(true);
      setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
    } else {
      setOpen(false);
    }
  }, [notifications]);

  // Click handler to add a test notification
  const handleClick = () => {
    dispatch(addNotification({ message: "test" }));
  };

  // Close handler for the snackbar
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // Action to be displayed along with the snackbar message
  const action = (
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
  );

  return (
    <div>
      {/* Button to trigger the snackbar */}
      {/* <Button onClick={handleClick}>Open Snackbar</Button> */}

      {/* Snackbar component */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={notifications.message}
        action={action}
        color="#ba950f"
      />
    </div>
  );
}
