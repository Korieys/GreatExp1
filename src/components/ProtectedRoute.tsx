import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    adminOnly?: boolean;
}

const ProtectedRoute = ({ adminOnly = false }: ProtectedRouteProps) => {
    const { userLoggedIn, isAdmin, loading } = useAuth();

    if (loading) {
        return <div className="text-center mt-20">Loading...</div>;
    }

    if (!userLoggedIn) {
        return <Navigate to={adminOnly ? "/admin/login" : "/login"} />;
    }

    if (adminOnly && !isAdmin) {
        // Logged in but not admin -> redirect to portal or home
        return <Navigate to="/portal" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
