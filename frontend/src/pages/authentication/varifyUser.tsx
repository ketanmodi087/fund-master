import React, { useEffect, useState } from "react";
import { Typography, Container, Card } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { varifyUser } from "../../store/thunk/authThunk"; // Importing the action to verify user
import { useAppDispatch } from "../../store/store";

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch(); // Get dispatch function from Redux store
  const navigate = useNavigate(); // Get navigation function from react-router-dom
  const location = useLocation(); // Get current location
  const queryParams = new URLSearchParams(location.search); // Extract query parameters from URL
  const useridb64 = queryParams.get("useridb64"); // Get useridb64 from query parameters
  const otpb64 = queryParams.get("otpb64"); // Get otpb64 from query parameters
  const [loader, setLoader] = useState(false); // State to manage loading state

  useEffect(() => {
    // Effect to run when component mounts
    if (useridb64 && otpb64) { // Check if useridb64 and otpb64 are present in query parameters
      setLoader(true); // Set loader to true
      dispatch(
        varifyUser({
          payload: {
            useridb64: useridb64,
            otpb64: otpb64,
          },
        })
      ).then(() => {
        setLoader(false); // Set loader to false after verification is completed
        navigate("/login"); // Navigate to login page after verification
      });
    }
  }, []); // Empty dependency array ensures this effect runs only once, similar to componentDidMount in class components

  // Render the component
  return (
    <Container component="main" maxWidth="sm">
      <Card sx={{ p: 4 }}>
        {/* Display "Verifying" if loader is true, otherwise display "Done" */}
        <Typography component="h1" variant="h5">
          {loader ? "Verifying" : "Done"}
        </Typography>
      </Card>
    </Container>
  );
};

export default RegisterPage;
