import React, { useState, useEffect } from "react";
import MUIDataTable, { MUIDataTableColumn } from "mui-datatables";

// Define props for the ServerSideDataTable component
interface ServerSideDataTableProps {
  columns: MUIDataTableColumn[]; // Columns configuration for the table
  options: any; // Options for customizing the table behavior
  data: any; // Data to be displayed in the table
  totalRows: number; // Total number of rows in the dataset
  fetchData: Function
}

// Define the ServerSideDataTable component
const ServerSideDataTable: React.FC<ServerSideDataTableProps> = ({
  columns,
  options,
  data,
  totalRows,
  fetchData,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState('');

  const handleChangePage = (newPage:number) => {
    fetchData(newPage+1, rowsPerPage, searchText)
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage:number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset page to 0 when rows per page changes
    fetchData(1, newRowsPerPage, searchText) 
  };

  const handleSearchChange = (search:string) => {
    setSearchText(search);
    fetchData(1, rowsPerPage, search) 
  };

  return (
    // Render the MUIDataTable component
    <MUIDataTable
      title={options.title || ""} // Set the title of the table
      data={data} // Pass the data to be displayed in the table
      columns={columns} // Define the columns for the table
      options={{
        ...options, // Spread any additional options passed to the component
        filter: false,
        search: true,
        print: false,
        download: false,
        pagination: true,
        serverSide: true,
        count: totalRows,
        page: page,
        rowsPerPage: rowsPerPage,
        selectableRows: "none",
        onChangePage: handleChangePage,
        onChangeRowsPerPage: handleChangeRowsPerPage,
        onSearchChange: handleSearchChange,
      }}
    />
  );
};

export default ServerSideDataTable; // Export the ServerSideDataTable component
