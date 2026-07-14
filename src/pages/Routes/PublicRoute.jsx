import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PublicRoute() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return isLoggedIn ? (
    <Navigate to="/chatify" replace />
  ) : (
    <Outlet/>
  );
}

export default PublicRoute;