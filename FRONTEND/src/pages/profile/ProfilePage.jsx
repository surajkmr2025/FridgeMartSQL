import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import {
    FiUser, FiMail, FiMapPin, FiPhone,
    FiLock, FiEdit2, FiSave, FiX,
    FiShield, FiLogOut, FiEye, FiEyeOff, FiCheck
} from 'react-icons/fi';

// ─── Tab constants ───────────────────────────────────────────────
const TABS = ['Personal Info', 'Security'];

const ProfilePage = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab]     = useState(0);
    const [loading, setLoading]         = useState(true);
    const [saving, setSaving]           = useState(false);
    const [userData, setUserData]       = useState(null);
    const [editing, setEditing]         = useState(false);
    const [editForm, setEditForm]       = useState({ name: '', phone_number: '', address: '' });

    // password state
    const [pwForm, setPwForm]           = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [pwSaving, setPwSaving]       = useState(false);
    const [showPw, setShowPw]           = useState({ old: false, new: false, confirm: false });

    // ── Fetch profile ─────────────────────────────────────────────
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/api/user/get');
                setUserData(res.data.user);
                setEditForm({
                    name:         res.data.user.name || '',
                    phone_number: res.data.user.phone_number || '',
                    address:      res.data.user.address || '',
                });
            } catch {
                toast.error('Could not load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // ── Update profile ────────────────────────────────────────────
    const handleSave = async () => {
        if (!editForm.name.trim()) return toast.error('Name is required');
        if (!/^[0-9]{10}$/.test(editForm.phone_number)) return toast.error('Phone must be 10 digits');
        if (editForm.address.trim().length < 10) return toast.error('Address too short');
        setSaving(true);
        try {
            await axios.put('/api/user/update', editForm);
            setUserData(prev => ({ ...prev, ...editForm }));
            setEditing(false);
            toast.success('Profile updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    // ── Change password ───────────────────────────────────────────
    const handleChangePassword = async () => {
        const { oldPassword, newPassword, confirmPassword } = pwForm;
        if (!oldPassword || !newPassword || !confirmPassword) return toast.error('All fields required');
        if (newPassword.length < 6) return toast.error('Min 6 characters');
        if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
        setPwSaving(true);
        try {
            await axios.put('/api/user/change-password', { oldPassword, newPassword, confirmPassword });
            toast.success('Password changed!');
            setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setPwSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // ── Loading skeleton ──────────────────────────────────────────
    if (loading) {
        return (
            <div className="bg-gradient-to-b from-[#f8f9fc] to-white min-h-screen py-10 font-inter">
                <div className="w-11/12 max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 animate-pulse">
                    <div className="lg:w-72 bg-white rounded-3xl border border-gray-100 h-72 shadow-sm"></div>
                    <div className="flex-1 bg-white rounded-3xl border border-gray-100 h-96 shadow-sm"></div>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 font-inter">
                <p className="text-gray-500 font-semibold">Session expired. Please login again.</p>
                <button onClick={() => navigate('/login')} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
                    Login
                </button>
            </div>
        );
    }

    const initials = userData.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'U';

    return (
        <div className="bg-gradient-to-b from-[#f8f9fc] to-white min-h-screen py-10 font-inter">
            <div className="w-11/12 max-w-5xl mx-auto">

                {/* ── Page Header ───────────────────────────── */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">My Account</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage your profile and security settings</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* ── LEFT SIDEBAR ──────────────────────── */}
                    <div className="lg:w-72 flex flex-col gap-4">

                        {/* Avatar Card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                            {/* Gradient Banner */}
                            <div className="h-20 w-full bg-gradient-to-r from-[#0f2744] to-[#073b4c]"></div>

                            <div className="px-6 pb-6 -mt-10 flex flex-col items-center text-center">
                                <div
                                    className="w-20 h-20 rounded-2xl text-white text-2xl font-black flex items-center justify-center border-4 border-white shadow-lg mb-3 transition-transform hover:scale-105 duration-200"
                                    style={{ background: 'linear-gradient(135deg, #118AB2, #06D6A0)' }}
                                >
                                    {initials}
                                </div>
                                <h2 className="text-base font-black text-gray-900 capitalize">{userData.name}</h2>
                                <p className="text-xs text-gray-400 font-medium mt-0.5">{userData.email}</p>
                                <span className="mt-3 text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                                    Member #{userData.id}
                                </span>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-4">Account Info</p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FiMail className="text-blue-400" size={14} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-gray-400 font-medium">Email</p>
                                        <p className="text-xs font-bold text-gray-700 truncate">{userData.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FiPhone className="text-green-400" size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-medium">Phone</p>
                                        <p className="text-xs font-bold text-gray-700">{userData.phone_number || '—'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <FiMapPin className="text-purple-400" size={14} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-gray-400 font-medium">Address</p>
                                        <p className="text-xs font-bold text-gray-700 line-clamp-2">{userData.address || '—'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-3 space-y-1">
                            <button
                                onClick={() => navigate('/my-orders')}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-blue-500 transition-all duration-200 text-left"
                            >
                                📦 My Orders
                            </button>
                            <button
                                onClick={() => navigate('/cart')}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-blue-500 transition-all duration-200 text-left"
                            >
                                🛒 My Cart
                            </button>
                            <div className="h-px bg-gray-50 my-1"></div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-100 transition-all duration-200 text-left"
                            >
                                <FiLogOut size={15} /> Logout
                            </button>
                        </div>
                    </div>

                    {/* ── RIGHT CONTENT ──────────────────────── */}
                    <div className="flex-1 min-w-0">

                        {/* Tabs */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 p-1.5 flex gap-1">
                            {TABS.map((tab, i) => (
                                <button
                                    key={tab}
                                    onClick={() => { setActiveTab(i); setEditing(false); }}
                                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                                        activeTab === i
                                            ? 'text-white shadow-md'
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                    style={activeTab === i ? { background: 'linear-gradient(135deg, #118AB2, #06D6A0)' } : {}}
                                >
                                    {i === 0 && <FiUser className="inline mr-1.5" size={13} />}
                                    {i === 1 && <FiShield className="inline mr-1.5" size={13} />}
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* ── TAB 0: Personal Info ───────────── */}
                        {activeTab === 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                                {/* Card Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                                    <div>
                                        <h3 className="text-base font-black text-gray-900">Personal Information</h3>
                                        <p className="text-xs text-gray-400 font-medium mt-0.5">Update your name, phone & address</p>
                                    </div>
                                    {!editing ? (
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="flex items-center gap-1.5 text-sm font-bold text-blue-500 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-xl transition-all duration-200"
                                        >
                                            <FiEdit2 size={13} /> Edit
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setEditing(false); setEditForm({ name: userData.name, phone_number: userData.phone_number, address: userData.address }); }}
                                                className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-gray-600 border border-gray-100 px-3 py-2 rounded-xl transition-all duration-200"
                                            >
                                                <FiX size={13} /> Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="flex items-center gap-1.5 text-sm font-black text-white px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-60 shadow-sm hover:shadow-md"
                                                style={{ background: 'linear-gradient(135deg, #118AB2, #06D6A0)' }}
                                            >
                                                {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div> : <FiSave size={13} />}
                                                Save
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Fields */}
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Name */}
                                    <Field
                                        label="Full Name"
                                        icon={<FiUser size={14} />}
                                        iconColor="text-blue-400 bg-blue-50"
                                        editing={editing}
                                        value={editing ? editForm.name : userData.name}
                                        onChange={v => setEditForm(f => ({ ...f, name: v }))}
                                        placeholder="Your full name"
                                    />

                                    {/* Email (read-only always) */}
                                    <Field
                                        label="Email Address"
                                        icon={<FiMail size={14} />}
                                        iconColor="text-purple-400 bg-purple-50"
                                        editing={false}
                                        value={userData.email}
                                        readOnly
                                        hint="Email cannot be changed"
                                    />

                                    {/* Phone */}
                                    <Field
                                        label="Phone Number"
                                        icon={<FiPhone size={14} />}
                                        iconColor="text-green-400 bg-green-50"
                                        editing={editing}
                                        value={editing ? editForm.phone_number : userData.phone_number}
                                        onChange={v => setEditForm(f => ({ ...f, phone_number: v }))}
                                        placeholder="10-digit number"
                                        type="tel"
                                    />

                                    {/* Address */}
                                    <Field
                                        label="Delivery Address"
                                        icon={<FiMapPin size={14} />}
                                        iconColor="text-orange-400 bg-orange-50"
                                        editing={editing}
                                        value={editing ? editForm.address : userData.address}
                                        onChange={v => setEditForm(f => ({ ...f, address: v }))}
                                        placeholder="Your full address"
                                    />
                                </div>

                                {editing && (
                                    <div className="px-6 pb-6">
                                        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-2 text-xs text-blue-600 font-semibold">
                                            <FiCheck size={13} /> Changes will be saved to your account immediately.
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── TAB 1: Security ────────────────── */}
                        {activeTab === 1 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                                <div className="px-6 py-4 border-b border-gray-50">
                                    <h3 className="text-base font-black text-gray-900">Change Password</h3>
                                    <p className="text-xs text-gray-400 font-medium mt-0.5">Choose a strong password with at least 6 characters</p>
                                </div>

                                <div className="p-6 space-y-4 max-w-md">
                                    {/* Old Password */}
                                    <PasswordField
                                        label="Current Password"
                                        value={pwForm.oldPassword}
                                        onChange={v => setPwForm(f => ({ ...f, oldPassword: v }))}
                                        show={showPw.old}
                                        onToggle={() => setShowPw(s => ({ ...s, old: !s.old }))}
                                        placeholder="Enter current password"
                                    />

                                    {/* New Password */}
                                    <PasswordField
                                        label="New Password"
                                        value={pwForm.newPassword}
                                        onChange={v => setPwForm(f => ({ ...f, newPassword: v }))}
                                        show={showPw.new}
                                        onToggle={() => setShowPw(s => ({ ...s, new: !s.new }))}
                                        placeholder="Min 6 characters"
                                    />

                                    {/* Confirm */}
                                    <PasswordField
                                        label="Confirm New Password"
                                        value={pwForm.confirmPassword}
                                        onChange={v => setPwForm(f => ({ ...f, confirmPassword: v }))}
                                        show={showPw.confirm}
                                        onToggle={() => setShowPw(s => ({ ...s, confirm: !s.confirm }))}
                                        placeholder="Re-enter new password"
                                    />

                                    {/* Match indicator */}
                                    {pwForm.newPassword && pwForm.confirmPassword && (
                                        <div className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg ${
                                            pwForm.newPassword === pwForm.confirmPassword
                                                ? 'bg-green-50 text-green-600 border border-green-100'
                                                : 'bg-red-50 text-red-500 border border-red-100'
                                        }`}>
                                            {pwForm.newPassword === pwForm.confirmPassword
                                                ? <><FiCheck size={12} /> Passwords match</>
                                                : <><FiX size={12} /> Passwords do not match</>
                                            }
                                        </div>
                                    )}

                                    <button
                                        onClick={handleChangePassword}
                                        disabled={pwSaving}
                                        className="w-full py-3.5 text-white font-black rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-2"
                                        style={{ background: 'linear-gradient(135deg, #118AB2, #06D6A0)' }}
                                    >
                                        {pwSaving
                                            ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                                            : <><FiShield size={16} /> Update Password</>
                                        }
                                    </button>
                                </div>

                                {/* Security tips */}
                                <div className="border-t border-gray-50 px-6 py-5">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Security Tips</p>
                                    <ul className="space-y-2">
                                        {[
                                            'Use at least 6 characters',
                                            'Mix uppercase, lowercase, and numbers',
                                            'Never share your password with anyone',
                                        ].map(tip => (
                                            <li key={tip} className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                <div className="w-4 h-4 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <FiCheck size={9} className="text-green-500" />
                                                </div>
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Reusable field component ──────────────────────────────────────
const Field = ({ label, icon, iconColor, editing, value, onChange, placeholder, type = 'text', readOnly = false, hint }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-0.5">{label}</label>
        <div className="relative group">
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                {icon}
            </div>
            <input
                type={type}
                value={value || ''}
                readOnly={!editing || readOnly}
                onChange={e => onChange?.(e.target.value)}
                placeholder={placeholder}
                className={`w-full pl-11 pr-4 py-3 text-sm font-semibold rounded-xl border transition-all duration-200 outline-none ${
                    editing && !readOnly
                        ? 'bg-white border-gray-200 text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:ring-opacity-50'
                        : 'bg-gray-50 border-gray-100 text-gray-700 cursor-default'
                }`}
            />
        </div>
        {hint && <p className="text-[10px] text-gray-300 font-medium ml-0.5">{hint}</p>}
    </div>
);
// ── Password field component ──────────────────────────────────────
const PasswordField = ({ label, value, onChange, show, onToggle, placeholder }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-0.5">{label}</label>
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center">
                <FiLock size={13} className="text-gray-400" />
            </div>
            <input
                type={show ? 'text' : 'password'}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-11 pr-11 py-3 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"/>
            <button
                type="button"
                onClick={onToggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors duration-200"
            >
                {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
        </div>
    </div>
);
export default ProfilePage;
