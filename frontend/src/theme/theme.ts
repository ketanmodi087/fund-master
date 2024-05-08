import { createTheme } from "@mui/material/styles";

// Create a theme using MUI's createTheme function
const theme = createTheme({
  // Customize the color palette
  palette: {
    primary: {
      main: "#1976d2", // Main primary color
    },
    secondary: {
      main: "#dc004e", // Main secondary color
    },
    background: {
      default: "#f5f5f5", // Default background color
    },
    text: {
      primary: "#333", // Primary text color
      secondary: "#666", // Secondary text color
    },
  },
  // Customize typography styles
  typography: {
    fontFamily: "Roboto, Arial, sans-serif", // Default font family
    h1: {
      fontSize: "2.5rem", // Font size for heading 1
      fontWeight: 500, // Font weight for heading 1
    },
    h2: {
      fontSize: "2rem", // Font size for heading 2
      fontWeight: 400, // Font weight for heading 2
    },
    // Add more typography styles as needed
  },
  spacing: 8, // Define spacing unit
  // Customize components
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "#ffffffe0", // Override card background color
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "#ffffffe0", // Override paper background color
        },
      },
    },
    // Add more component customizations as needed
  },
});

export default theme; // Export the customized theme
