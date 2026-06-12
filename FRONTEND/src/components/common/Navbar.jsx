import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import {
    FiShoppingCart, FiPackage, FiLogOut, FiHome,
    FiPlusCircle, FiSettings, FiMenu, FiX,
    FiShield, FiUser, FiGrid, FiUsers, FiChevronDown
} from "react-icons/fi";

const Navbar = () => {
    const { cartCount } = useContext(CartContext);
    const { role, token } = useContext(AuthContext);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const location = useLocation();

    const isAdmin = role === 'admin';
    const hiddenRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!token) {
                setUserProfile(null);
                return;
            }
            try {
                const res = await axios.get('/api/user/get');
                setUserProfile(res.data.user);
            } catch (err) {
                console.error('Failed to fetch user profile', err);
                setUserProfile(null);
            }
        };
        fetchUserProfile();
    }, [token]); // re-fetch whenever the user logs in or out

    if (hiddenRoutes.includes(location.pathname)) return null;

    const isActive = (path) => location.pathname === path;
    const close = () => setMobileOpen(false);

    const linkCls = (path, adminMode = false) => {
        const active = isActive(path);
        if (adminMode) {
            return `flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl transition-all duration-200 ${active
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`;
        }
        return `flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 ${active
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`;
    };

    const initials = userProfile?.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'U';

    // ── User Navbar ───────────────────────────────────────────────
    if (!isAdmin) {
        return (
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md px-4 md:px-8 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group" onClick={close}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, #118AB2, #06D6A0)' }}>
                            <span className="text-white font-black text-base leading-none">F</span>
                        </div>
                        <span className="text-xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tight">
                            FridgeMart
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link
                            to="/"
                            className={`${linkCls('/')} px-3 py-2 rounded-xl hover:scale-105 transition-all duration-200`}
                        >
                            <FiHome size={16} className="shrink-0" />
                            <span>Home</span>
                        </Link>
                        <Link
                            to="/my-orders"
                            className={`${linkCls('/my-orders')} px-3 py-2 rounded-xl hover:scale-105 transition-all duration-200`}
                        >
                            <FiPackage size={16} className="shrink-0" />
                            <span>My Orders</span>
                        </Link>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
                        >
                            <FiShoppingCart
                                size={20}
                                className={`transition-colors duration-200 ${isActive('/cart') ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'}`}
                            />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow-md border-2 border-white"
                                    style={{ background: 'linear-gradient(135deg, #118AB2, #06D6A0)' }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Profile Dropdown */}
                        {userProfile ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-gray-100 transition-all duration-200"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-black text-sm shadow-md">
                                        {initials}
                                    </div>
                                    <FiChevronDown size={14} className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {profileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)}></div>
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                                            <div className="px-4 py-3 border-b border-gray-50">
                                                <p className="text-sm font-bold text-gray-800">{userProfile.name}</p>
                                                <p className="text-xs text-gray-400">{userProfile.email}</p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-blue-500 transition-colors"
                                            >
                                                <FiUser size={14} /> My Profile
                                            </Link>
                                            <Link
                                                to="/my-orders"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-blue-500 transition-colors"
                                            >
                                                <FiPackage size={14} /> My Orders
                                            </Link>
                                            <div className="border-t border-gray-50 my-1"></div>
                                            <Link
                                                to="/logout"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                                            >
                                                <FiLogOut size={14} /> Logout
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <FiUser size={20} className="text-gray-600" />
                            </Link>
                        )}

                        <div className="hidden md:block w-px h-6 bg-gray-200"></div>

                        <Link
                            to="/logout"
                            className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-white hover:bg-red-500 px-3 py-2 rounded-xl transition-all duration-200"
                        >
                            <FiLogOut size={15} /> Logout
                        </Link>

                        {/* Mobile toggle */}
                        <button
                            onClick={() => setMobileOpen(o => !o)}
                            className="md:hidden p-2 text-gray-600 hover:text-blue-600 rounded-lg transition-all duration-200"
                        >
                            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 px-5 py-4 flex flex-col gap-2 shadow-lg rounded-b-2xl mt-2">
                        <Link
                            to="/"
                            onClick={close}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
                        >
                            <FiHome size={16} /> Home
                        </Link>
                        <Link
                            to="/my-orders"
                            onClick={close}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${isActive('/my-orders') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
                        >
                            <FiPackage size={16} /> My Orders
                        </Link>
                        <Link
                            to="/profile"
                            onClick={close}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
                        >
                            <FiUser size={16} /> Profile
                        </Link>
                        <div className="h-px bg-gray-100 my-1"></div>
                        <Link
                            to="/logout"
                            onClick={close}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 transition-all duration-200"
                        >
                            <FiLogOut size={16} /> Logout
                        </Link>
                    </div>
                )}
            </nav>
        );
    }

    // ── Admin Navbar (dark theme) ─────────────────────────────────
    return (
        <nav
            className="sticky top-0 z-50 font-inter border-b border-white/10 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2744 60%, #073b4c 100%)' }}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4 md:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group" onClick={close}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #118AB2, #06D6A0)' }}>
                        <span className="text-white font-black text-base leading-none">F</span>
                    </div>
                    <div>
                        <span className="text-base font-black text-white tracking-tight">FridgeMart</span>
                        <span className="block text-[9px] font-bold text-white/40 uppercase tracking-widest -mt-0.5">Admin Panel</span>
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-2">
                    <Link to="/all-orders" className={`${linkCls('/all-orders', true)}`}>
                        <FiGrid size={15} /> All Orders
                    </Link>
                    <Link to="/all-users" className={`${linkCls('/all-users', true)}`}>
                        <FiUsers size={15} /> All Users
                    </Link>
                    <Link to="/add-products" className={`${linkCls('/add-products', true)}`}>
                        <FiPlusCircle size={15} /> Add Product
                    </Link>
                    <Link to="/update-products" className={`${linkCls('/update-products', true)}`}>
                        <FiSettings size={15} /> Manage
                    </Link>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                    {/* Admin badge */}
                    <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-black text-white/70 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full uppercase tracking-widest">
                        <FiShield size={11} /> Admin
                    </span>

                    {/* Profile for admin */}
                    {userProfile && (
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-white/10 transition-all duration-200"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-black text-sm shadow-md">
                                    {initials}
                                </div>
                                <FiChevronDown size={14} className={`text-white/60 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {profileOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)}></div>
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-sm font-bold text-gray-800">{userProfile.name}</p>
                                            <p className="text-xs text-gray-400">{userProfile.email}</p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-blue-500 transition-colors"
                                        >
                                            <FiUser size={14} /> My Profile
                                        </Link>
                                        <div className="border-t border-gray-50 my-1"></div>
                                        <Link
                                            to="/logout"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <FiLogOut size={14} /> Logout
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <div className="hidden md:block w-px h-6 bg-white/20"></div>

                    <Link
                        to="/logout"
                        className="hidden md:flex items-center gap-1.5 text-sm font-bold text-white/60 hover:text-white hover:bg-white/10 px-3 py-2 rounded-xl transition-all duration-200"
                    >
                        <FiLogOut size={15} /> Logout
                    </Link>

                    <button
                        onClick={() => setMobileOpen(o => !o)}
                        className="md:hidden p-2 text-white/60 hover:text-white rounded-lg transition-all duration-200"
                    >
                        {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                </div>
            </div>

            {/* Admin Mobile menu */}
            {mobileOpen && (
                <div
                    className="md:hidden border-t border-white/10 px-5 py-4 flex flex-col gap-2"
                    style={{ background: '#0f2744' }}
                >
                    <Link
                        to="/all-orders"
                        onClick={close}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${isActive('/all-orders') ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
                    >
                        <FiGrid size={16} /> All Orders
                    </Link>
                    <Link
                        to="/add-products"
                        onClick={close}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${isActive('/add-products') ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
                    >
                        <FiPlusCircle size={16} /> Add Product
                    </Link>
                    <Link
                        to="/update-products"
                        onClick={close}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${isActive('/update-products') ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
                    >
                        <FiSettings size={16} /> Manage Products
                    </Link>
                    <div className="h-px bg-white/10 my-1"></div>
                    <Link
                        to="/profile"
                        onClick={close}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all"
                    >
                        <FiUser size={16} /> Profile
                    </Link>
                    <Link
                        to="/logout"
                        onClick={close}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-300 hover:bg-red-900/30 transition-all duration-200"
                    >
                        <FiLogOut size={16} /> Logout
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
