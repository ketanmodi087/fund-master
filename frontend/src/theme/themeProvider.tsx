import { ThemeProvider } from "@mui/material/styles"; // Import ThemeProvider component from Material-UI
import theme from "./theme"; // Import custom theme
import { ReactNode } from "react";

type ChildrenProps = {
  children: ReactNode;
};

// Define a functional component to provide the Material-UI theme to its children
function ThemeProviderComponent({ children }: ChildrenProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>; // Render the ThemeProvider with the custom theme and children components
}

export default ThemeProviderComponent; // Export the ThemeProviderComponent
