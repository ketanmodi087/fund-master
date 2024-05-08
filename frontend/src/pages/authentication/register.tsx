import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
  Card,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { registerUserThunk } from "../../store/thunk/authThunk";
import { useAppDispatch, useAppSelector } from "../../store/store";

// Define the type for form values
type FormValues = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

// Define the RegisterPage component
const RegisterPage: React.FC = () => {
  // Get dispatch function from Redux store
  const dispatch = useAppDispatch(); 
  // State to manage loading state
  const [loader, setLoader] = useState(false)
  // Get navigation function from react-router-dom
  const navigate = useNavigate();
  // Destructure methods from useForm hook for form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  // Function to handle form submission
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // Set loader to true when submitting form
    setLoader(true)
    // Dispatch registerUserThunk action with form data
    dispatch(
      registerUserThunk({
        payload: data
      })
    ).then(()=>{
      // Set loader to false after registration is completed
      setLoader(false)
      // Navigate to login page after successful registration
      navigate("/login")
    });
  };

  // Render the component
  return (
    <Container component="main" maxWidth="sm">
      <Card sx={{ p: 4 }}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        {/* Form for user registration */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6}>
              {/* Input field for first name */}
              <TextField
                {...register("first_name", {
                  required: "First name is required",
                })}
                variant="outlined"
                fullWidth
                id="first_name"
                label="First Name"
                error={!!errors.first_name}
                helperText={errors.first_name ? errors.first_name.message : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* Input field for last name */}
              <TextField
                {...register("last_name", { required: "Last name is required" })}
                variant="outlined"
                fullWidth
                id="last_name"
                label="Last Name"
                error={!!errors.last_name}
                helperText={errors.last_name ? errors.last_name.message : ""}
              />
            </Grid>
            <Grid item xs={12}>
              {/* Input field for email */}
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
            <Grid item xs={12}>
              {/* Input field for password */}
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
            <Grid item xs={8}>
              {/* Submit button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ float:"left" }}
                disabled={loader}
              >
                Sign Up
              </Button>
            </Grid>
            <Grid item xs={4}>
              {/* Link to login page */}
              <Typography
                component={Link}
                to="/login"
                align="right"
                variant="caption"
                sx={{ mt:3}}
              >
                Already have account?
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Container>
  );
};

export default RegisterPage;
