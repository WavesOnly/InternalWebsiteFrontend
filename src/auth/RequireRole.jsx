import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RequireRole = ({ requiredRoles }) => {
  const location = useLocation();
  const user = useSelector((state) => state.user);

  const hasRequiredRole = user?.user?.roles?.some(role => requiredRoles.includes(role));

  return hasRequiredRole ? (
    <Outlet />
  ) : (
    <Navigate to="/home" state={{ from: location }} replace />
  );
};

export default RequireRole;