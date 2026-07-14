import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return isLoggedIn ? (
    <Outlet/>
  ) : (
    <Navigate to="/chatify/sign-in" replace />
  );
}

export default ProtectedRoute;