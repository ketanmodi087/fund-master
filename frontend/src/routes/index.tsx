import { useRoutes } from 'react-router-dom';

// Project Routes
import Routes from './Routes';

// ==============================|| ROUTING RENDER ||============================== //

export default function AppRoutes() {
  return useRoutes([...Routes]);
}
