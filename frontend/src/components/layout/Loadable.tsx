import { Suspense } from 'react'; // Importing the Suspense component from React, used for lazy loading
import Loader from './Loader'; // Importing the Loader component from './Loader'

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

// Loadable is a higher-order component that takes another component as an argument
const Loadable = (Component:any) => (props:any) => 
  (
    // Suspense component is used to wrap the lazy-loaded component and provide a fallback
    <Suspense fallback={<Loader />}>
      {/* Render the lazy-loaded component */}
      <Component {...props} />
    </Suspense>
  );

// Exporting the Loadable component as default
export default Loadable;
