import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
   
    const { auth } = useAuth();
    const location = useLocation();
    
    return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
      <Outlet />
    ) : auth?.accessToken ? ( //changed from user to accessToken to persist login after refresh
      <Navigate to="/offsys/unauthorized" state={{ from: location }} replace />
    ) : (
      <Navigate to="/offsys" state={{ from: location }} replace />
    );
}

export default RequireAuth;