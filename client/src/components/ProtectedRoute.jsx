import { Navigate } from "react-router-dom";

// role: "admin" or "ordinary" - who is allowed to see the page
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Not logged in -> go to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role -> send to their own dashboard
  if (role && user.type !== role) {
    return <Navigate to={user.type === "admin" ? "/adminhome" : "/userhome"} replace />;
  }

  return children;
};

export default ProtectedRoute;