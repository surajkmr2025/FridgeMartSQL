import React from 'react';
import axios from 'axios';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiLock, FiKey, FiArrowLeft } from 'react-icons/fi';

export default function ResetPassword() {
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const newPassword = useWatch({ control, name: 'newPassword' });

    // ForgotPassword page se email aaya hai — OTP user manually enter karega (from console/email)
    const email = location.state?.email || '';

    const onSubmit = async (data) => {
        try {
            await axios.post('/api/auth/reset-password', {
                email,
                resetToken: data.otp,
                newPassword: data.newPassword,
            });
            toast.success('Password reset successfully! Please login.');
            navigate('/login');
        } catch (err) {
            const message = err.response?.data?.message;
            toast.error(message || 'Something went wrong');
        }
    };

    // Agar koi seedha is page pe aaye bina email ke
    if (!email) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 font-inter bg-gray-50">
                <p className="text-gray-600 font-semibold">Please request a password reset first.</p>
                <Link to="/forgot-password" className="text-blue-600 font-bold hover:underline">
                    Go to Forgot Password
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center font-inter p-4">
            <div className="flex w-full max-w-7xl shadow-2xl shadow-gray-100 rounded-3xl overflow-hidden border border-gray-100">

                {/* Left Side */}
                <div className="hidden lg:flex w-1/2 bg-gray-50/50 p-12 flex-col justify-between border-r border-gray-100 relative">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-100 rounded-full blur-[100px] opacity-60"></div>

                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-white font-bold text-2xl leading-none">F</span>
                        </div>
                        <span className="text-3xl font-extrabold text-blue-900 tracking-tighter">FridgeMart</span>
                    </div>

                    <div className="relative z-10 mt-20 mb-auto space-y-4">
                        <h2 className="text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
                            Create a <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                                new password.
                            </span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-md">
                            Enter the OTP sent to <span className="font-bold text-gray-800">{email}</span> and set your new password.
                        </p>
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mt-4 max-w-xs">
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">OTP valid for</p>
                            <p className="text-2xl font-black text-blue-600">15 minutes</p>
                        </div>
                    </div>

                    <div className="relative z-10 text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} FridgeMart India. All rights reserved.
                    </div>
                </div>

                {/* Right Side — Form */}
                <div className="w-full lg:w-1/2 bg-white p-8 sm:p-12 md:p-16 flex flex-col justify-center">
                    <div className="w-full max-w-md mx-auto">

                        <Link to="/forgot-password" className="flex items-center gap-2 text-gray-400 hover:text-blue-600 text-sm font-semibold mb-8 transition-colors group">
                            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            Back
                        </Link>

                        <div className="mb-8">
                            <h1 className="text-4xl font-extrabold text-gray-950 tracking-tight mb-2">New Password</h1>
                            <p className="text-gray-500 text-base">Enter the OTP and your new password below.</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                            {/* OTP Field */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-900">OTP Code</label>
                                <div className="relative group">
                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${errors.otp ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`}>
                                        <FiKey className="text-lg" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit OTP from console"
                                        maxLength={6}
                                        className={`w-full h-12 border ${errors.otp ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-200'} rounded-xl pl-11 pr-4 text-sm font-medium text-gray-900 outline-none focus:ring-4 transition duration-150 tracking-[0.3em]`}
                                        {...register('otp', {
                                            required: 'OTP is required',
                                            minLength: { value: 6, message: 'OTP must be 6 digits' },
                                            maxLength: { value: 6, message: 'OTP must be 6 digits' },
                                        })}
                                    />
                                </div>
                                {errors.otp && <p className="text-red-600 text-xs font-medium pl-1">{errors.otp.message}</p>}
                            </div>

                            {/* New Password */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-900">New Password</label>
                                <div className="relative group">
                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${errors.newPassword ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`}>
                                        <FiLock className="text-lg" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Min 6 characters"
                                        className={`w-full h-12 border ${errors.newPassword ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-200'} rounded-xl pl-11 pr-4 text-sm font-medium text-gray-900 outline-none focus:ring-4 transition duration-150`}
                                        {...register('newPassword', {
                                            required: 'New password is required',
                                            minLength: { value: 6, message: 'Must be at least 6 characters' },
                                        })}
                                    />
                                </div>
                                {errors.newPassword && <p className="text-red-600 text-xs font-medium pl-1">{errors.newPassword.message}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-900">Confirm New Password</label>
                                <div className="relative group">
                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${errors.confirmPassword ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`}>
                                        <FiLock className="text-lg" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Re-enter password"
                                        className={`w-full h-12 border ${errors.confirmPassword ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-200'} rounded-xl pl-11 pr-4 text-sm font-medium text-gray-900 outline-none focus:ring-4 transition duration-150`}
                                        {...register('confirmPassword', {
                                            required: 'Please confirm your password',
                                            validate: (val) => val === newPassword || 'Passwords do not match',
                                        })}
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-red-600 text-xs font-medium pl-1">{errors.confirmPassword.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-60 mt-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                        Resetting...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
