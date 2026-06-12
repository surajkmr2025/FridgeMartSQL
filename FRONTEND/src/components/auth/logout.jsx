import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { FiLogOut, FiArrowLeft } from 'react-icons/fi';

export default function LogOut() {
    const navigate = useNavigate();
    const { logout, token } = useContext(AuthContext);
    
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        if (!token) {
            toast.error('You are not logged in');
            navigate('/login');
            return;
        }

        setIsLoggingOut(true);
        try {
            await axios.post('/api/auth/logout');
            logout(); // Context clear
            toast.success('Logged out successfully ✨');
            navigate('/login');
        } catch (error) {
            console.error('Backend logout issue:', error);
            logout(); //if backend fails remove from frontend too
            toast.error('Logout failed, but you are signed out locally.');
            navigate('/login');
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 font-inter animate-fadeIn bg-pure-greys-5/50">
            <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl shadow-pure-greys-50/10 p-8 sm:p-10 border border-pure-greys-25 text-center relative overflow-hidden">
                
                {/* Background decorative blur */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-5 rounded-full blur-2xl opacity-70"></div>

                <div className="relative z-10 flex flex-col items-center">
                    
                    {/* Big Icon */}
                    <div className="w-20 h-20 bg-pink-5 rounded-full flex items-center justify-center mb-6 shadow-inner border border-pink-25">
                        <FiLogOut className="text-4xl text-pink-300 ml-1" />
                    </div>

                    <h2 className="text-3xl font-extrabold text-richblack-900 mb-2 tracking-tight">Leaving so soon?</h2>
                    <p className="text-richblack-400 text-sm mb-8 px-2 leading-relaxed">
                        Are you sure you want to log out of your FridgeMart account? You will need to sign in again to view your orders and cart.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        {/* Cancel Button (Goes back to previous page) */}
                        <button
                            onClick={() => navigate(-1)}
                            disabled={isLoggingOut}
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-richblack-600 bg-pure-greys-5 border border-pure-greys-25 hover:bg-pure-greys-25 transition-all disabled:opacity-50"
                        >
                            <FiArrowLeft className="text-lg" />
                            Cancel
                        </button>

                        {/* Actual Logout Button */}
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-pink-200 to-pink-300 hover:from-pink-300 hover:to-pink-400 shadow-lg shadow-pink-200/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoggingOut ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                    Logging out...
                                </>
                            ) : (
                                <>
                                    <FiLogOut className="text-lg" />
                                    Yes, Log Out
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}