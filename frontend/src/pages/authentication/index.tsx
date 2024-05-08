import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Button, Grid, Typography, Container, Card, Box } from "@mui/material";
import { loginUserThunk } from "../../store/thunk/authThunk"; // Importing the loginUserThunk action
import { useAppDispatch, useAppSelector } from "../../store/store"; // Importing Redux hooks
import { Link, useNavigate } from "react-router-dom"; // Importing navigation utilities

// Define the shape of form values
type FormValues = {
  email: string;
  password: string;
};

// Define the LoginPage component
const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch(); // Getting the dispatch function from Redux
  let userToken = useAppSelector(
    (state) => state.authSlice.userData.token
  ); // Accessing user token from Redux store
  const navigate = useNavigate(); // Getting the navigation function from react-router-dom
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>(); // Hook for managing form state and validation

  const [loader, setLoader] = useState(false); // State for loader

  // Redirect user if already logged in
  useEffect(()=>{
    if(userToken){
      navigate('/funds')
    }
  },[userToken])

  // Form submission handler
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setLoader(true); // Activate loader
    // If form is valid, dispatch login action
    dispatch(
      loginUserThunk({
        payload: {
          email: data.email,
          password: data.password,
        },
      })
    ).then(()=>{
      setLoader(false); // Deactivate loader after login attempt
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Card sx={{p:4}}>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        {/* Form for user login */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} sx={{mt:4}}>
            {/* Email input field */}
            <Grid item xs={12}>
              <TextField
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                variant="outlined"
                fullWidth
                id="email"
                label="Email Address"
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
              />
            </Grid>
            {/* Password input field */}
            <Grid item xs={12}>
              <TextField
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                variant="outlined"
                fullWidth
                type="password"
                id="password"
                label="Password"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
              />
            </Grid>
            {/* Login button */}
            <Grid item xs={6}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ float:"left" }}
                disabled={loader} // Disable button when loader is active
              >
                 Log In
              </Button>
            </Grid>
            {/* Link to registration page */}
            <Grid item xs={6}>
              <Typography
                component={Link}
                to="/register"
                align="right"
                variant="caption"
                sx={{ mt:3}}
              >
                Don't have account?
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Container>
  );
};

export default LoginPage; // Export the LoginPage component
