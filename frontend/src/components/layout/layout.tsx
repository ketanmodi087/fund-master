import Box from "@mui/material/Box";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../store/store";

// This component represents the layout for the application.
// It renders the child routes (Outlet) if the user is authenticated, otherwise redirects to the login page.
export default function Layout() {
  // Check if the user is authenticated by accessing the user token from the Redux store
  let userToken = useAppSelector(
    (state) => state.authSlice.userData.token
  );

  return (
    <Box sx={{ display: "flex", background:"url(bg2.jpg)", minHeight:"100vh", backgroundSize:"100%" }}>
      {/* Main content area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Render the child routes (Outlet) if the user is authenticated, otherwise redirect to login */}
        {userToken ? <Navigate to='/funds'/> : <Outlet/>}
      </Box>
    </Box>
  );
}
