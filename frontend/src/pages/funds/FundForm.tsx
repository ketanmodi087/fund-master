import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Button, Grid, Typography, Container } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { addfundThunk, updatefundThunk } from "../../store/thunk/fundThunk";
import { useAppDispatch, useAppSelector } from "../../store/store";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";

interface Fund {
  id?: number;
  fund_name: string;
  fund_description: string;
  fund_size: number;
  fund_documents: any[];
}

interface FundFormProps {
  defaultValues?: Fund | null;
  handleCloseDialog: Function;
  getFundList: Function;
}

const FundForm: React.FC<FundFormProps> = ({
  defaultValues,
  handleCloseDialog,
  getFundList,
}) => {
  const dispatch = useAppDispatch();
  const [docs, setDocs] = useState<any[]>(defaultValues?.fund_documents || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<Fund>({
    defaultValues: { ...defaultValues, fund_documents: [] },
  });

  const fileList = getValues("fund_documents");

  const userToken = useAppSelector((state) => state.authSlice.userData.token);

  const onDrop = (acceptedFiles: File[]) => {
    setValue("fund_documents", [...fileList, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  const onSubmit: SubmitHandler<Fund> = (data) => {
    if (data.id) {
      dispatch(
        updatefundThunk({
          token: userToken,
          payload: { ...data, existing_documents: docs.map((row) => row?.id) },
        })
      ).then(() => {
        handleCloseDialog();
        getFundList();
      });
    } else {
      dispatch(
        addfundThunk({
          token: userToken,
          payload: data,
        })
      ).then(() => {
        handleCloseDialog();
        getFundList();
      });
    }
  };

  const removeFile = (i: number) => {
    setValue(
      "fund_documents",
      fileList.filter((file, index) => index !== i)
    );
  };

  const removeExistingFile = (i: number) => {
    setDocs(docs.filter((file, index) => index !== i));
  };

  const currentFileList = (
    file: any,
    removeFile: (i: number) => void,
    index: number
  ) => {
    return (
      <Grid
        item
        sm={6}
        sx={{
          p: 1,
          display: "flex",
        }}
        key={index}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <InsertDriveFileIcon sx={{ mr: 2 }} />
        </div>
        <div
          style={{
            width: "100px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            height:"20px"
          }}
        >
          {file.document_name || file.name}
        </div>
        <DeleteIcon
          color="error"
          fontSize="small"
          sx={{ ml: 2, cursor: "pointer" }}
          onClick={() => removeFile(index)}
        />
      </Grid>
    );
  };

  return (
    <Container component="main" maxWidth="md" sx={{ pt: 2 }}>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                {...register("fund_name", {
                  required: "Fund name is required",
                })}
                variant="outlined"
                fullWidth
                id="fund_name"
                label="Fund Name"
                error={!!errors.fund_name}
                helperText={errors.fund_name ? errors.fund_name.message : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("fund_description", {
                  required: "Fund description is required",
                })}
                variant="outlined"
                fullWidth
                id="fund_description"
                label="Fund Description"
                error={!!errors.fund_description}
                helperText={
                  errors.fund_description
                    ? errors.fund_description.message
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("fund_size", {
                  required: "Fund size is required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Invalid fund size",
                  },
                })}
                variant="outlined"
                fullWidth
                type="number"
                id="fund_size"
                label="Fund Size (in USD)"
                error={!!errors.fund_size}
                helperText={errors.fund_size ? errors.fund_size.message : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Typography sx={{ my: 2, p: 4, border: "1px solid" }}>
                  Drag 'n' drop some images here, or click to select images
                </Typography>
              </div>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {fileList.map((file, index) => {
                  return currentFileList(file, removeFile, index);
                })}
                {docs.map((file, index) => {
                  return currentFileList(file, removeExistingFile, index);
                })}
              </Grid>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
          >
            {defaultValues?.id ? `Update` : `Create`} Fund
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default FundForm;
