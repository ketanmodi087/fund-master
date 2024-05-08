import { createAsyncThunk } from "@reduxjs/toolkit";
import { addNotification } from "../slices/userNotificationSlice";
import config from "../../config/config";
import axios from "axios";
import { setFundList } from "../slices/fundSlice";

// Thunk to fetch funds
export const getfundThunk = createAsyncThunk(
  "get", // Thunk action name
  async (_request: any, { dispatch }) => {
    try {
      return axios
        .get(
          `${config.url}funds/funds/?page=${_request.payload.page}&search=${
            _request?.payload?.searchText || ""
          }&offset=${_request?.payload?.rowsPerPage || 10}`,
          {
            headers: {
              Authorization: "Bearer " + _request?.token,
            },
          }
        ) // Make a GET request to fetch funds
        .then((response: any) => {
          dispatch(setFundList(response.data)); // Dispatch action to set fund list
        })
        .catch((error: any) => {
          dispatch(
            addNotification({
              message:
                error?.response?.data?.message ||
                "Error while trying getting funds.", // Dispatch notification for error while fetching funds
            })
          );
        });
    } catch (error) {}
  }
);

// Function to convert JSON object to FormData
const jsonToFormData = (json: any) => {
  const formData = new FormData();

  // Iterate over the keys of the JSON object
  Object.keys(json).forEach((key) => {
    if (key === "fund_documents") {
      json[key].map((file: any) => formData.append(key, file)); // If key is 'fund_documents', append each file to FormData
    } else {
      formData.append(key, json[key]); // Otherwise, append key-value pair to FormData
    }
  });

  return formData;
};

// Thunk to update a fund
export const updatefundThunk = createAsyncThunk(
  "udpate", // Thunk action name
  async (_request: any, { dispatch }) => {
    try {
      return axios
        .patch(
          `${config.url}funds/funds/${_request.payload.id}/`, // Make a PATCH request to update fund
          jsonToFormData(_request.payload), // Convert payload to FormData
          {
            headers: {
              Authorization: "Bearer " + _request?.token,
            },
          }
        )
        .then(() => {
          dispatch(
            addNotification({
              message: "fund updated successfully", // Dispatch notification for successful fund update
            })
          );
        })
        .catch((error: any) => {
          dispatch(
            addNotification({
              message:
                error?.response?.data?.message ||
                "Error while trying update a new fund.", // Dispatch notification for error while updating fund
            })
          );
        });
    } catch (error) {}
  }
);

// Thunk to delete a fund
export const deletefundThunk = createAsyncThunk(
  "delete", // Thunk action name
  async (_request: any, { dispatch }) => {
    try {
      return axios
        .delete(`${config.url}funds/funds/${_request.payload.id}/`, {
          headers: {
            Authorization: "Bearer " + _request?.token,
          },
        }) // Make a DELETE request to delete fund
        .then(() => {
          dispatch(
            addNotification({
              message: "fund deleted successfully", // Dispatch notification for successful fund deletion
            })
          );
        })
        .catch((error: any) => {
          dispatch(
            addNotification({
              message:
                error?.response?.data?.message ||
                "Error while trying delete a new fund.", // Dispatch notification for error while deleting fund
            })
          );
        });
    } catch (error) {}
  }
);

// Thunk to add a new fund
export const addfundThunk = createAsyncThunk(
  "add", // Thunk action name
  async (_request: any, { dispatch }) => {
    try {
      return axios
        .post(`${config.url}funds/funds/`, jsonToFormData(_request.payload), {
          headers: {
            Authorization: "Bearer " + _request?.token,
          },
        }) // Make a POST request to add fund
        .then(() => {
          dispatch(
            addNotification({
              message: "fund Created successfully", // Dispatch notification for successful fund creation
            })
          );
        })
        .catch((error: any) => {
          dispatch(
            addNotification({
              message:
                error?.response?.data?.message ||
                "Error while trying create a new fund.", // Dispatch notification for error while creating fund
            })
          );
        });
    } catch (error) {}
  }
);
