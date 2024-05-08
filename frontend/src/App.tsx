import React from "react";
import "./App.css";
import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";
import ThemeProviderComponent from "./theme/themeProvider";
import MySnackbar from "./components/snackbar";
import store from "./store/store";
import { Provider as ReduxProvider } from "react-redux";

// Define the main App component
function App() {
  return (
    <div className="App"> {/* Main container with 'App' class */}
      <ReduxProvider store={store}> {/* Provide Redux store to the app */}
        <ThemeProviderComponent> {/* Provide Material-UI theme to the app */}
          <BrowserRouter> {/* Provide BrowserRouter for routing */}
            <AppRoutes /> {/* Render main routes component */}
          </BrowserRouter>
          <MySnackbar /> {/* Render custom Snackbar component */}
        </ThemeProviderComponent>
      </ReduxProvider>
    </div>
  );
}

export default App; // Export the main App component
