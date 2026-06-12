import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPackage, FiCheckCircle, FiFilter, FiSearch } from 'react-icons/fi';

const AdminOrders = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        const getAllOrders = async () => {
            try {
                const res = await axios.get('/api/orders/all-orders');
                setAllOrders(res.data.data);
                setLoading(false);
            } catch {
                toast.error('Error fetching Orders');
                setLoading(false);
            }
        }
        getAllOrders();
    }, []);

    const handleUpdateStatus = async (orderId) => {
        try {
            await axios.put(`/api/orders/update/${orderId}`, { status: 'delivered' });
            toast.success('Order marked as Delivered! ✅');
            setAllOrders(allOrders.map((item) => 
                item.order_id === orderId ? { ...item, status: 'delivered' } : item
            ));
        } catch {
            toast.error('Failed to update status');
        }
    }

    const filteredOrders = allOrders.filter((order) => {
        const matchesSearch = 
            order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(order.order_id).includes(searchTerm) ||
            order.product_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || order.status?.toLowerCase() === filterStatus.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        switch(s) {
            case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-200';
            default: return 'bg-sky-50 text-sky-600 border-sky-200';
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Loading orders...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 py-8 px-4 sm:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* Header with stats */}
                <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-600 mb-1">
                            <FiPackage className="text-lg" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Orders Dashboard</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Order Management</h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            {filteredOrders.length} active order{filteredOrders.length !== 1 ? 's' : ''} · {allOrders.filter(o => o.status === 'pending').length} pending
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                        <div className="relative group w-full sm:w-64">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search by name, ID, product..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm hover:shadow"
                            />
                        </div>

                        <div className="relative w-full sm:w-48">
                            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                            <select 
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none cursor-pointer shadow-sm hover:shadow font-medium text-gray-700"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Orders View */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center text-gray-400 border border-gray-200 shadow-lg">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiPackage className="text-2xl text-gray-400" />
                        </div>
                        <p className="font-medium text-gray-500">No orders found matching your filters.</p>
                        <button 
                            onClick={() => { setSearchTerm(""); setFilterStatus("all"); }}
                            className="mt-4 text-indigo-600 text-sm font-semibold hover:text-indigo-700"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Customer</th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Product</th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">Action</th>
                                         </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredOrders.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50/80 transition-colors duration-150">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-sm">
                                                            {item.user_name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-900">{item.user_name}</p>
                                                            <p className="text-xs text-gray-500">{item.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{item.product_name}</p>
                                                    <p className="text-xs text-gray-400 font-mono">#{item.order_id}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${getStatusStyle(item.status)}`}>
                                                        {item.status === 'delivered' && <FiCheckCircle size={12} />}
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-gray-900">
                                                    ₹{Number(item.total_price || item.price).toLocaleString('en-IN')}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {item.status === 'pending' || item.status === 'confirmed' ? (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(item.order_id)} 
                                                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                                                        >
                                                            Mark Delivered
                                                        </button>
                                                    ) : (
                                                        <span className="text-emerald-600 text-xs font-medium flex items-center justify-center gap-1">
                                                            <FiCheckCircle /> Completed
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden flex flex-col gap-4">
                            {filteredOrders.map((item, index) => (
                                <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                                {item.user_name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{item.user_name}</h3>
                                                <p className="text-xs text-gray-500">{item.email}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(item.status)}`}>
                                            {item.status === 'delivered' && <FiCheckCircle size={12} />}
                                            {item.status}
                                        </span>
                                    </div>

                                    <div className="py-3 border-y border-gray-100">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Product</p>
                                        <p className="text-sm font-medium text-gray-800 mt-1">{item.product_name}</p>
                                        <p className="text-xs text-gray-400 font-mono">Order ID: #{item.order_id}</p>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Amount</p>
                                            <p className="text-lg font-bold text-gray-900">₹{Number(item.total_price || item.price).toLocaleString('en-IN')}</p>
                                        </div>
                                        {item.status === 'pending' || item.status === 'confirmed' ? (
                                            <button 
                                                onClick={() => handleUpdateStatus(item.order_id)} 
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm active:scale-95 transition-all"
                                            >
                                                Mark Delivered
                                            </button>
                                        ) : (
                                            <span className="text-emerald-600 text-sm font-medium flex items-center gap-1">
                                                <FiCheckCircle /> Delivered
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default AdminOrders;
