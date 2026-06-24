import React, { useContext } from "react";
import { useForm } from "react-hook-form";
// import axios from "axios";
import API from "../../utils/axios";
import toast from 'react-hot-toast';
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi"; 
import { CartContext } from "../../context/CartContext";

export default function LoginForm() {

    const { fetchCartCount } = useContext(CartContext)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onBlur"
    });

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const onSubmit = async (data) => {
        try {
            const res = await API.post('/auth/login', data);
            login(res.data.token, res.data.user.role);
            toast.success(res.data.message || 'Authenticated successfully ✨');
            
            fetchCartCount();
            navigate('/');
        } catch (err) {
            const message = err.response?.data?.message;
            toast.error(message || 'Authentication failed. Please check credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center font-inter p-4 sm:p-6 lg:p-8">
            <div className="flex w-full max-w-7xl h-full shadow-2xl shadow-gray-100 rounded-3xl overflow-hidden border border-gray-100">
                
                {/* 🎨 Left Side — Brand & Marketing */}
                <div className="hidden lg:flex w-1/2 bg-gray-50/50 p-12 flex-col justify-between border-r border-gray-100 relative">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-60"></div>

                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-white font-bold text-2xl leading-none">F</span>
                        </div>
                        <span className="text-3xl font-extrabold text-blue-900 tracking-tighter">FridgeMart</span>
                    </div>

                    <div className="relative z-10 mt-20 mb-auto space-y-6">
                        <h2 className="text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
                            Freshness, <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                                delivered <br />to your context.
                            </span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-md">
                            Access your personalized dashboard, manage your cooling appliances, and unlock exclusive FridgeMart offers.
                        </p>
                    </div>

                    <div className="relative z-10 mt-auto text-sm text-gray-500 pt-10">
                        &copy; {new Date().getFullYear()} FridgeMart India. All rights reserved.
                    </div>
                </div>

                {/* 🔐 Right Side — The Login Form */}
                <div className="w-full lg:w-1/2 bg-white p-8 sm:p-12 md:p-16 flex flex-col justify-center relative">
                    
                    <div className="lg:hidden absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full blur-[80px] opacity-70"></div>

                    <div className="w-full max-w-md mx-auto relative z-10">
                        
                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="lg:hidden flex items-center gap-2 justify-center mb-5">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl leading-none">F</span>
                                </div>
                                <span className="text-2xl font-bold text-gray-900 tracking-tighter">FridgeMart</span>
                            </div>
                            <h1 className="text-4xl font-extrabold text-gray-950 tracking-tight">Welcome Back 👋</h1>
                            <p className="text-gray-500 mt-2.5 text-base">Sign in to manage your smart devices & orders</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-900">Registered Email Address</label>
                                <div className="relative group">
                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`}>
                                        <FiMail className="text-lg" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="you@company.com"
                                        className={`w-full h-12 border ${errors.email ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-200'} rounded-xl pl-11 pr-4 text-sm font-medium text-gray-900 outline-none focus:ring-4 transition duration-150`}
                                        {...register("email", { required: "Email is mandatory" })}
                                    />
                                </div>
                                {errors.email && <p className="text-red-600 text-xs font-medium pl-1">{errors.email.message}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-semibold text-gray-900">Security Password</label>
                                    <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${errors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`}>
                                        <FiLock className="text-lg" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••••"
                                        autoComplete="current-password"
                                        className={`w-full h-12 border ${errors.password ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-200'} rounded-xl pl-11 pr-4 text-sm font-medium text-gray-900 outline-none focus:ring-4 transition duration-150`}
                                        {...register('password', { required: "Password is mandatory" })}
                                    />
                                </div>
                                {errors.password && <p className="text-red-600 text-xs font-medium pl-1">{errors.password.message}</p>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        <FiLogIn className="text-lg group-hover:translate-x-1 transition-transform" />
                                        Secure Login
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-10 pt-10 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-600">
                                New to FridgeMart?{" "}
                                <Link to="/signup" className="text-blue-600 font-bold hover:text-blue-700 transition hover:underline underline-offset-4">
                                    Create a free account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}