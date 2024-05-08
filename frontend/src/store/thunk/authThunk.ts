import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../config/config";
import { addNotification } from "../slices/userNotificationSlice";
import { setAuthUser } from "../slices/authSlice";

// Thunk to handle user login
export const loginUserThunk = createAsyncThunk(
  "login", // Thunk action name
  async (_request: any, { dispatch }) => {
    try {
      return axios
        .post(`${config.url}accounts/login/`, _request.payload) // Make a POST request to login endpoint
        .then((response: any) => {
          if (response?.data?.data?.is_verified) {
            localStorage.setItem(
              // Store user token in local storage
              "userToken",
              response?.data?.data?.tokens?.access
            );
            dispatch(addNotification({ message: "User logged successfully" })); // Dispatch notification
            dispatch(
              setAuthUser({
                token: response?.data?.data?.tokens?.access,
                ...response?.data?.data,
              }) // Dispatch action to set authenticated user
            );
          }
        })
        .catch((error: any) => {
          dispatch(
            addNotification({
              message:
                error?.response?.data?.message ||
                "Error while trying to login, Please check your credentials.", // Dispatch notification for login error
            })
          );
        });
    } catch (error) {}
  }
);

// Thunk to handle user registration
export const registerUserThunk = createAsyncThunk(
  "registerUserThunk", // Thunk action name
  async (_request: any, { dispatch }) => {
    try {
      return axios
        .post(`${config.url}accounts/signup/`, _request.payload) // Make a POST request to register endpoint
        .then((response: any) => {
          dispatch(
            addNotification({
              message:
                "User Created successfully, please check you email to verify the account.",
            })
          ); // Dispatch notification for successful registration
        })
        .catch((error: any) => {
          dispatch(
            addNotification({
              message:
                error?.response?.data?.message ||
                "Error while trying to signup.", // Dispatch notification for registration error
            })
          );
        });
    } catch (error) {}
  }
);

// Thunk to handle user verification
export const varifyUser = createAsyncThunk(
  "varifyUser", // Thunk action name
  async (_request: any, { dispatch }) => {
    try {
      return axios
        .post(`${config.url}accounts/verify_email/`, _request.payload) // Make a POST request to verify email endpoint
        .then((response: any) => {
          dispatch(addNotification({ message: "User verified successfully" })); // Dispatch notification for successful verification
        })
        .catch((error: any) => {
          dispatch(
            addNotification({
              message:
                error?.response?.data?.message ||
                "Error while trying to verify.", // Dispatch notification for verification error
            })
          );
        });
    } catch (error) {}
  }
);
