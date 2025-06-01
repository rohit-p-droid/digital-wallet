import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const authToken = localStorage.getItem("auth-token"); // ✅ Check if token exists

    return authToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
