import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // check for token

  if (!token) {
    // if no token, redirect to login
    return <Navigate to="/" replace />;
  }

  // if token exists, render the children component
  return children;
};

export default PrivateRoute;
