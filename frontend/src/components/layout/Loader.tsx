// material-ui
import { styled } from '@mui/material/styles'; // Importing styled function from Material-UI for creating styled components
import LinearProgress from '@mui/material/LinearProgress'; // Importing LinearProgress component from Material-UI

// loader style
// Creating a styled wrapper component for the loader
const LoaderWrapper = styled('div')(({ theme }) => ({
  position: 'fixed', // Positioning the loader fixed on the screen
  top: 0, // Placing it at the top
  left: 0, // Placing it at the left
  zIndex: 2001, // Setting a high z-index to ensure it's displayed above other elements
  width: '100%', // Setting the width to 100% of the viewport
  '& > * + *': {
    marginTop: theme.spacing(2) // Adding spacing between child elements using theme.spacing
  }
}));

// ==============================|| Loader ||============================== //

// Loader component definition
const Loader = () => (
  // Rendering the LoaderWrapper styled component
  <LoaderWrapper>
    {/* Rendering the LinearProgress component from Material-UI */}
    <LinearProgress color="primary" /> {/* Setting the color of the loader to primary */}
  </LoaderWrapper>
);

// Exporting the Loader component as default
export default Loader;
