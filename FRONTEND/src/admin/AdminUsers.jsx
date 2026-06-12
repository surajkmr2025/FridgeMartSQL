import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    FiUsers,
    FiSearch,
    FiShield,
    FiMail,
    FiPhone,
    FiMapPin,
    FiUser,
    FiFilter,
} from 'react-icons/fi';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('/api/user/all-users');
                setUsers(res.data.data || []);
            } catch (error) {
                console.error('AdminUsers fetch error', error);
                toast.error('Unable to load users (admin only endpoint).');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const query = searchTerm.trim().toLowerCase();
        const roleMatch = roleFilter === 'all' || user.role === roleFilter;
        const textMatch =
            user.name?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.phone_number?.toString().includes(query) ||
            user.address?.toLowerCase().includes(query);

        return roleMatch && (query === '' || textMatch);
    });

    const adminCount = users.filter((u) => u.role === 'admin').length;
    const customerCount = users.filter((u) => u.role !== 'admin').length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-5">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-9 w-9 border-4 border-indigo-200 border-t-indigo-600 mb-3"></div>
                    <p className="text-gray-600 font-medium">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 py-8 px-4 sm:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-600 mb-1">
                            <FiUsers className="text-lg" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Users Dashboard</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Users</h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            {users.length} total · {adminCount} admins · {customerCount} customers
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                        <div className="relative group w-full sm:w-72">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, email, phone, address"
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm hover:shadow"
                            />
                        </div>
                        <div className="relative w-full sm:w-48">
                            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none cursor-pointer shadow-sm hover:shadow font-medium text-gray-700"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                    </div>
                </div>

                {filteredUsers.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 text-center text-gray-500 border border-gray-200 shadow-lg">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FiUser className="text-2xl text-gray-400" />
                        </div>
                        <p className="font-medium">No users found with current filters.</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setRoleFilter('all');
                            }}
                            className="mt-4 text-indigo-600 text-sm font-semibold hover:text-indigo-700"
                        >
                            Reset filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">#</th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Name</th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Phone</th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Address</th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredUsers.map((user, index) => (
                                            <tr key={user.id} className="hover:bg-gray-50/80 transition-colors duration-150">
                                                <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{user.name || '—'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{user.phone_number || '—'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{user.address || '—'}</td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                                                            user.role === 'admin'
                                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                                : 'bg-sky-50 text-sky-600 border-sky-200'
                                                        }`}
                                                    >
                                                        <FiShield size={12} />
                                                        {user.role ?? 'user'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="lg:hidden grid gap-4">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="bg-white rounded-2xl border border-gray-200 shadow-md p-5 space-y-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">{(user.name || 'U').charAt(0).toUpperCase()}</div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{user.name || 'Unnamed'}</p>
                                                <p className="text-xs text-gray-500">#{user.id}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                            user.role === 'admin'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : 'bg-sky-50 text-sky-600 border-sky-200'
                                        }`}>
                                            <FiShield size={12} /> {user.role ?? 'user'}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p className="flex items-center gap-2"><FiMail size={14} /> {user.email}</p>
                                        <p className="flex items-center gap-2"><FiPhone size={14} /> {user.phone_number || 'N/A'}</p>
                                        <p className="flex items-center gap-2"><FiMapPin size={14} /> {user.address || 'N/A'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
