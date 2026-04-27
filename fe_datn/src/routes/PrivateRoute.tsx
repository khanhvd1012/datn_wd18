import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
