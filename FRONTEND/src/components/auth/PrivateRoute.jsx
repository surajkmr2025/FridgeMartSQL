

import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
    const { token, role } = useContext(AuthContext);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminOnly && role !== 'admin') {
        console.warn("Unauthorized Access: Normal user tried to enter Admin area!");
        return <Navigate to="/" replace />; 
    }

    return children;
};

export default PrivateRoute;