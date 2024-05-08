import React from "react";
import { lazy } from "react";
import Loadable from "../components/layout/Loadable";
import Layout from "../components/layout/layout";
import AuthLayout from "../components/layout/AuthLayout";
// Custom components
// import MinimalLayout from "layout/MinimalLayout";

// Dynamic imports with lazy loading
// Loadable HOC (Higher Order Component) for code splitting
// render - login
const AuthLogin = Loadable(lazy(() => import("../pages/authentication/index"))); // Lazy-loaded login page
const RegisterUser = Loadable(
  lazy(() => import("../pages/authentication/register"))
); // Lazy-loaded registration page
const VarifyUser = Loadable(
  lazy(() => import("../pages/authentication/varifyUser"))
); // Lazy-loaded verification page
const Funds = Loadable(lazy(() => import("../pages/funds"))); // Lazy-loaded funds page
const HomePage = Loadable(lazy(() => import("../pages/home"))); // Lazy-loaded home page

// Routes for authentication
const LoginRoutes = [
  {
    path: "/", // Root path
    element: <Layout />, // Layout component for non-authenticated pages
    children: [
      {
        path: "/", // Home path
        element: <HomePage />, // Home page component
      },
      {
        path: "/login", // Login path
        element: <AuthLogin />, // Login page component
      },
      {
        path: "/register", // Registration path
        element: <RegisterUser />, // Registration page component
      },      
      {
        path: "/verify-user", // User verification path
        element: <VarifyUser />, // User verification page component
      },
    ],
  },
  {
    path: "/", // Root path
    element: <AuthLayout />, // Layout component for authenticated pages
    children: [
      {
        path: "/funds", // Funds path
        element: <Funds />, // Funds page component
      },
    ],
  },
];

export default LoginRoutes;
