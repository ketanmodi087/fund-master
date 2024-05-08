import React, { useEffect, useState } from "react";
import ServerSideDataTable from "../../components/table";
import ReusableDialog from "../../components/dialog";
import { Box, Button, IconButton } from "@mui/material";
import FundForm from "./FundForm";
import { Delete, Edit } from "@mui/icons-material";
import { deletefundThunk, getfundThunk } from "../../store/thunk/fundThunk";
import { useAppDispatch, useAppSelector } from "../../store/store";

// Define the shape of a fund object
// interface Fund {
//   id?: number;
//   fund_name: string;
//   fund_description: string;
//   fund_size: number;
//   fund_documents: File[];
// }

interface FundData {
  id?: number;
  fund_name: string;
  fund_description: string;
  fund_size: number;
  fund_documents: any[];
}

const FundList: React.FC = () => {
  // Redux hooks for dispatching actions and accessing state
  const dispatch = useAppDispatch();
  const fundList = useAppSelector(
    (state) => state.fundSlice?.fundList?.results
  ) || [];
  const totalRows = useAppSelector((state) => state.fundSlice?.fundList?.count);

  const userToken = useAppSelector((state) => state.authSlice.userData.token);
  // State variables to manage data and dialog visibility
  const [data, setData] = useState<FundData[]>([]);
  const [fundData, setFundData] = useState<FundData | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDialogDelete, setOpenDialogDelete] = useState<boolean>(false);

  // Effect to update data when fundList changes
  useEffect(() => {
    console.log("fundList", fundList);
    setData(fundList || []);
  }, [fundList]);

  // Effect to fetch fund data on component mount
  useEffect(() => {
    getFundList()
  }, []);

  const getFundList = () =>{
    dispatch(
      getfundThunk({
        token: userToken,
        payload: {
          page: 1,
          rowsPerPage: 10,
          searchText: "",
        },
      })
    );
  }

  // Open edit fund dialog
  const handleOpenDialog = (value?: number) => {
    setOpenDialog(true);
    if (value) {
      setFundData(fundList?.find((val: FundData) => val?.id === value) || null);
    } else {
      setFundData(null);
    }
  };

  // Close edit fund dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFundData(null);
  };

  // Open delete fund dialog
  const handleOpenDialogDelete = (value?: number) => {
    setOpenDialogDelete(true);
    if (value) {
      setFundData(fundList?.find((val: FundData) => val.id === value) || null);
    } else {
      setFundData(null);
    }
  };

  // Close delete fund dialog
  const handleCloseDialogDelete = () => {
    setOpenDialogDelete(false);
    setFundData(null);
  };

  // Confirm fund deletion
  const handleConfirmDelete = () => {
    handleCloseDialogDelete();
    if (fundData?.id) {
      dispatch(
        deletefundThunk({
          token: userToken,
          payload: {
            id: fundData.id,
          },
        })
      ).then(()=>{
        getFundList()
      });
    }
  };

  // Table columns configuration
  const columns = [
    { name: "fund_name", label: "Fund Name" },
    { name: "fund_description", label: "Fund Description" },
    { name: "fund_size", label: "Fund Size" },
    {
      name: "id",
      label: "Actions",
      options: {
        customBodyRender: (value: number) => {
          return (
            <div>
              {/* Edit fund button */}
              <IconButton
                onClick={() => handleOpenDialog(value)}
                aria-label="Edit"
              >
                <Edit color="primary" />
              </IconButton>
              {/* Delete fund button */}
              <IconButton
                onClick={() => handleOpenDialogDelete(value)}
                aria-label="Delete"
              >
                <Delete color="error" />
              </IconButton>
            </div>
          );
        },
      },
    },
  ];

  const fetchData = (page: number, rowsPerPage: number, searchText: string) => {
    console.log(page, rowsPerPage, searchText);
    // Example API call for fetching data
    // Replace this with your actual API call
    dispatch(
      getfundThunk({
        token: userToken,
        payload: {
          page,
          rowsPerPage,
          searchText,
        },
      })
    );
  };

  return (
    <Box>
      {/* Dialog for adding/editing Fund */}
      <ReusableDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        title="Add Funds"
        content={
          <FundForm
            defaultValues={fundData}
            handleCloseDialog={handleCloseDialog}
            getFundList={getFundList}
          />
        }
        actions={[]}
      />
      {/* Dialog for confirming Fund deletion */}
      <ReusableDialog
        open={openDialogDelete}
        handleClose={handleCloseDialogDelete}
        title="Confirmation"
        content={"Are you sure you want to delete this fund?"}
        actions={[
          {
            label: "Cancel",
            onClick: handleCloseDialogDelete,
            color: "secondary",
          },
          { label: "Confirm", onClick: handleConfirmDelete },
        ]}
      />
      {/* Server side data table */}
      <ServerSideDataTable
        columns={columns}
        options={{
          customToolbar: () => (
            // Button to add new fund
            <Button onClick={() => handleOpenDialog()} variant="contained">
              Add Fund
            </Button>
          ),
        }}
        data={data}
        totalRows={totalRows || 0}
        fetchData={fetchData}
      />
    </Box>
  );
};

export default FundList;
