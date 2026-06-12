import { useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './authContextValue';

export { AuthContext };

export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(localStorage.getItem('role') || null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common.Authorization;
        }
    }, [token]);

    const login = (token, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        setToken(token);
        setRole(role);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        delete axios.defaults.headers.common.Authorization;
        setToken(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
