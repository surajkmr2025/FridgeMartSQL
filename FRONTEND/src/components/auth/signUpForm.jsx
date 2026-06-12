import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiUserPlus } from "react-icons/fi"; // Elegant icons

export default function SignUpForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onBlur" // Errors appear when leaving the field
    });

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const res = await axios.post("/api/auth/signup", data);
            toast.success(res.data.message || "Welcome to FridgeMart! ✨");
            navigate("/login");
        } catch (err) {
            const response = err.response?.data?.message;
            toast.error(response || "Signup failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center font-inter p-4 sm:p-6 lg:p-8">
            <div className="flex w-full max-w-7xl h-full min-h-[700px] shadow-2xl shadow-gray-100 rounded-3xl overflow-hidden border border-gray-100">
                
                {/* Left Side — Brand & Marketing (Matches Login UI) */}
                <div className="hidden lg:flex w-[45%] bg-gray-50/50 p-12 flex-col justify-between border-r border-gray-100 relative">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-60"></div>

                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-white font-bold text-2xl leading-none">F</span>
                        </div>
                        <span className="text-3xl font-extrabold text-blue-900 tracking-tighter">FridgeMart</span>
                    </div>

                    <div className="relative z-10 mt-20 mb-auto space-y-6">
                        <h2 className="text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
                            Start your <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                                smart cooling <br />journey.
                            </span>
                        </h2>
                        <ul className="space-y-4 text-gray-600 text-lg max-w-sm pt-4">
                            <li className="flex items-center gap-3"><span className="text-blue-500">✓</span> Exclusive member discounts</li>
                            <li className="flex items-center gap-3"><span className="text-blue-500">✓</span> Free priority delivery</li>
                            <li className="flex items-center gap-3"><span className="text-blue-500">✓</span> Extended warranty tracking</li>
                        </ul>
                    </div>
                </div>

                {/* Right Side — The Registration Form */}
                <div className="w-full lg:w-[55%] bg-white p-8 sm:p-12 md:px-16 md:py-12 flex flex-col justify-center relative overflow-y-auto">
                    
                    <div className="lg:hidden absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full blur-[80px] opacity-70"></div>

                    <div className="w-full max-w-lg mx-auto relative z-10">
                        
                        {/* Header */}
                        <div className="mb-8">
                            <div className="lg:hidden flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl leading-none">F</span>
                                </div>
                                <span className="text-2xl font-bold text-gray-900 tracking-tighter">FridgeMart</span>
                            </div>
                            <h1 className="text-4xl font-extrabold text-gray-950 tracking-tight mb-2">Create Account</h1>
                            <p className="text-gray-500 text-base">Join us to experience premium cooling solutions.</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            
                            {/* Grid for Name & Phone (Space Saver) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Full Name */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-semibold text-gray-900">Full Name</label>
                                    <div className="relative group">
                                        <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${errors.name ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`}>
                                            <FiUser className="text-lg" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className={`w-full h-11 border ${errors.name ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-200'} rounded-xl pl-10 pr-4 text-sm font-medium text-gray-900 outline-none focus:ring-4 transition duration-150`}
                                            {...register("name", { required: "Name is mandatory" })}
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-600 text-xs font-medium pl-1">{errors.name.message}</p>}
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-semibold text-gray-900">Phone Number</label>
                                    <div className="relative group">
                                        <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${errors.phone_number ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`}>
                                            <FiPhone className="text-lg" />
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="10-digit number"
                                            className={`w-full h-11 border ${errors.phone_number ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-200'} rounded-xl pl-10 pr-4 text-sm font-medium text-gray-900 outline-none focus:ring-4 transition duration-150`}
                                            {...register("phone_number", {
                                                required: "Phone is mandatory",
                                                pattern: { value: /^[0-9]{10}$/, message: "Must be exactly 10 digits" },
                                            })}
                                        />
                                    </div>
                                    {errors.phone_number && <p className="text-red-600 text-xs font-medium pl-1">{errors.phone_number.message}</p>}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-900">Email Address</label>
                                <div className="relative group">
                                    <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`}>
                                        <FiMail className="text-lg" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="you@company.com"
                                        className={`w-full h-11 border ${errors.email ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-200'} rounded-xl pl-10 pr-4 text-sm font-medium text-gray-900 outline-none focus:ring-4 transition duration-150`}
                                        {...register("email", {
                                            required: "Email is mandatory",
                                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
                                        })}
                                    />
                                </div>
                                {errors.email && <p className="text-red-600 text-xs font-medium pl-1">{errors.email.message}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-900">Secure Password</label>
                                <div className="relative group">
                                    <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${errors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`}>
                                        <FiLock className="text-lg" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Min 6 characters"
                                        className={`w-full h-11 border ${errors.password ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-200'} rounded-xl pl-10 pr-4 text-sm font-medium text-gray-900 outline-none focus:ring-4 transition duration-150`}
                                        {...register("password", {
                                            required: "Password is mandatory",
                                            minLength: { value: 6, message: "Must be at least 6 characters" },
                                        })}
                                    />
                                </div>
                                {errors.password && <p className="text-red-600 text-xs font-medium pl-1">{errors.password.message}</p>}
                            </div>

                            {/* Address */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-900">Delivery Address</label>
                                <div className="relative group">
                                    <div className={`absolute top-3 left-0 pl-3.5 pointer-events-none ${errors.address ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`}>
                                        <FiMapPin className="text-lg" />
                                    </div>
                                    <textarea
                                        placeholder="Full address for delivery (min 20 chars)..."
                                        rows={2}
                                        className={`w-full border ${errors.address ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-200'} rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 outline-none focus:ring-4 transition duration-150 resize-none`}
                                        {...register("address", {
                                            required: "Address is mandatory for delivery",
                                            minLength: { value: 20, message: "Please provide a complete address (min 20 chars)" },
                                        })}
                                    />
                                </div>
                                {errors.address && <p className="text-red-600 text-xs font-medium pl-1">{errors.address.message}</p>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group w-full h-12 mt-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <FiUserPlus className="text-lg group-hover:scale-110 transition-transform" />
                                        Create Free Account
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-3">
                            <p className="text-sm text-gray-600">
                                Already a member?{" "}
                                <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 transition hover:underline underline-offset-4">
                                    Sign in here
                                </Link>
                            </p>
                            <p className="text-xs text-gray-400 max-w-xs mx-auto">
                                By signing up, you agree to our <span className="underline cursor-pointer hover:text-gray-600">Terms of Service</span> and <span className="underline cursor-pointer hover:text-gray-600">Privacy Policy</span>.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}