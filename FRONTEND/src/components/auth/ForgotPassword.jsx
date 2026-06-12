import React from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

export default function ForgotPassword() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await axios.post('/api/auth/forgot-password', { email: data.email });
            toast.success('OTP generated! Check the backend console for the OTP (dev mode).');

            // Navigate to reset page — user must manually enter OTP from console/email
            navigate('/reset-password', {
                state: { email: data.email }
            });
        } catch (err) {
            const message = err.response?.data?.message;
            toast.error(message || 'Something went wrong');
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center font-inter p-4">
            <div className="flex w-full max-w-7xl shadow-2xl shadow-gray-100 rounded-3xl overflow-hidden border border-gray-100">

                {/* Left Side */}
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
                            Forgot your <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                                password?
                            </span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-md">
                            No worries! Enter your registered email and we'll send you an OTP to reset your password.
                        </p>
                    </div>

                    <div className="relative z-10 text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} FridgeMart India. All rights reserved.
                    </div>
                </div>

                {/* Right Side — Form */}
                <div className="w-full lg:w-1/2 bg-white p-8 sm:p-12 md:p-16 flex flex-col justify-center">
                    <div className="w-full max-w-md mx-auto">

                        <Link to="/login" className="flex items-center gap-2 text-gray-400 hover:text-blue-600 text-sm font-semibold mb-8 transition-colors group">
                            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            Back to Login
                        </Link>

                        <div className="mb-8">
                            <h1 className="text-4xl font-extrabold text-gray-950 tracking-tight mb-2">Reset Password</h1>
                            <p className="text-gray-500 text-base">Enter your email to receive an OTP.</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-900">Registered Email</label>
                                <div className="relative group">
                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`}>
                                        <FiMail className="text-lg" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        className={`w-full h-12 border ${errors.email ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-200'} rounded-xl pl-11 pr-4 text-sm font-medium text-gray-900 outline-none focus:ring-4 transition duration-150`}
                                        {...register('email', { required: 'Email is required' })}
                                    />
                                </div>
                                {errors.email && <p className="text-red-600 text-xs font-medium pl-1">{errors.email.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                        Sending OTP...
                                    </>
                                ) : (
                                    'Send OTP'
                                )}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-8">
                            Remember your password?{' '}
                            <Link to="/login" className="text-blue-600 font-bold hover:underline underline-offset-4">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
