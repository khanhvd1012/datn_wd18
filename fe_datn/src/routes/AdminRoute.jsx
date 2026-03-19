import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const userString = localStorage.getItem("user");
  if (!userString) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userString);
    if (!user || user.role !== "admin") {
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;