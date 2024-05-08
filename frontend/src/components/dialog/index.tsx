import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

// Define the type for an action that can be performed within the dialog
interface Action {
  label: string; // Label for the action button
  onClick: () => void; // Function to be executed when the action button is clicked
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning"; // Color of the action button (optional)
}

// Define the props that the ReusableDialog component accepts
interface Props {
  open: boolean; // Whether the dialog is open or not
  handleClose: () => void; // Function to close the dialog
  title: string; // Title of the dialog
  content: React.ReactNode; // Content of the dialog
  actions: Action[]; // Array of actions to be displayed in the dialog
}

// Define the ReusableDialog component
const ReusableDialog: React.FC<Props> = ({
  open,
  handleClose,
  title,
  content,
  actions,
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      {/* Dialog title section */}
      <DialogTitle>
        {title}
        
        {/* Close button */}
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
          sx={{ float: "right" }} // Styling to position the close button on the right
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Dialog content section */}
      <DialogContent>{content}</DialogContent>

      {/* Dialog actions section */}
      <DialogActions>
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={action.onClick}
            color={action.color || "primary"} // Default color is primary if not specified
          >
            {action.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};

export default ReusableDialog;
