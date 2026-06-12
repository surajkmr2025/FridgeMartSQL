import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const OpenRoute = ({ children }) => {
    const { token } = useContext(AuthContext);

    if (!token) {
        return children;
    } else {
        return <Navigate to="/" />;
    }
};

export default OpenRoute;
