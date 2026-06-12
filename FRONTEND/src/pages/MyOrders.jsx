import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiXCircle, FiCheckCircle, FiTruck, FiClock, FiShoppingBag, FiEye } from 'react-icons/fi';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getOrders = async () => {
            try {
                const res = await axios.get('/api/orders/get-orders');
                setOrders(res.data.order);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        getOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        try {
            await axios.patch(`/api/orders/cancel/${orderId}`, { status: 'cancelled' });
            toast.success('Order Cancelled');
            setOrders(prev => prev.map(item =>
                item.order_id === orderId ? { ...item, status: 'cancelled' } : item
            ));
        } catch {
            toast.error('Error cancelling order');
        }
    };

    const getStatusConfig = (status) => {
        const s = status?.toLowerCase();
        if (s === 'cancelled') return { bg: 'bg-red-50 border-red-200 text-red-600', icon: <FiXCircle size={13} />, label: 'Cancelled' };
        if (s === 'delivered') return { bg: 'bg-green-50 border-green-200 text-green-600', icon: <FiCheckCircle size={13} />, label: 'Delivered' };
        if (s === 'shipped')   return { bg: 'bg-blue-50 border-blue-200 text-blue-600',   icon: <FiTruck size={13} />,      label: 'Shipped' };
        if (s === 'confirmed') return { bg: 'bg-amber-50 border-amber-200 text-amber-700', icon: <FiCheckCircle size={13} />, label: 'Confirmed' };
        return { bg: 'bg-gray-50 border-gray-200 text-gray-600', icon: <FiClock size={13} />, label: 'Processing' };
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-b from-[#f8f9fc] to-white min-h-screen py-10 font-inter">
                <div className="w-11/12 max-w-maxContent mx-auto">
                    <div className="h-9 w-44 bg-gray-200 rounded-xl animate-pulse mb-2"></div>
                    <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mb-10"></div>
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="bg-white rounded-2xl h-28 border border-gray-100 animate-pulse shadow-sm"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-[#f8f9fc] to-white min-h-screen py-10 font-inter">
            <div className="w-11/12 max-w-maxContent mx-auto">
                {/* Header */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full mb-3">
                            <FiPackage className="text-blue-500 text-sm" />
                            <span className="text-xs font-black text-blue-600 uppercase tracking-wider">My Orders</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                            Order History
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm">
                            <span className="font-bold text-gray-700">{orders.length}</span> order{orders.length !== 1 ? 's' : ''} found
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="group flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #118AB2, #06D6A0)' }}
                    >
                        <FiShoppingBag size={15} className="group-hover:scale-110 transition-transform" />
                        Shop More
                    </button>
                </div>

                {/* Empty State */}
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300 text-center px-6">
                        <div className="w-28 h-28 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mb-6 border border-blue-100 shadow-inner">
                            <FiPackage className="text-5xl text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-400 text-sm mb-8 max-w-xs">
                            Explore our premium cooling appliances and place your first order.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="group flex items-center gap-2 text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl text-sm"
                            style={{ background: 'linear-gradient(135deg, #118AB2, #06D6A0)' }}
                        >
                            <FiShoppingBag className="group-hover:scale-110 transition-transform" />
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {orders.map((item, index) => {
                            const status = getStatusConfig(item.status);
                            const canCancel = item.status === 'pending' || item.status === 'confirmed';

                            return (
                                <div
                                    key={`${item.order_id}-${index}`}
                                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:border-gray-200"
                                >
                                    {/* Left Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <span className="text-xs font-black text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                                                #{String(item.order_id).padStart(6, '0')}
                                            </span>
                                            <span className={`flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1 rounded-full border ${status.bg}`}>
                                                {status.icon}
                                                {status.label}
                                            </span>
                                        </div>

                                        <h3 className="text-base md:text-lg font-bold text-gray-800 mb-1.5 line-clamp-1 group-hover:text-blue-500 transition-colors">
                                            {item.name}
                                        </h3>

                                        <p className="text-sm text-gray-400 font-medium">
                                            Total:{' '}
                                            <span className="font-black text-gray-900">
                                                ₹{Number(item.total_price).toLocaleString('en-IN')}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Right Actions */}
                                    <div className="border-t md:border-0 border-gray-100 pt-4 md:pt-0 w-full md:w-auto flex items-center justify-end gap-3">
                                        {/* View Details */}
                                        <button
                                            onClick={() => navigate(`/my-orders/${item.order_id}`)}
                                            className="flex items-center gap-1.5 text-blue-500 bg-blue-50 hover:bg-blue-100 border border-blue-100 font-bold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 active:scale-95 hover:shadow-md"
                                        >
                                            <FiEye size={14} /> Details
                                        </button>

                                        {canCancel ? (
                                            <button
                                                onClick={() => handleCancelOrder(item.order_id)}
                                                className="text-red-400 hover:text-white bg-red-50 hover:bg-red-500 border border-red-200 hover:border-red-500 font-bold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                                            >
                                                Cancel
                                            </button>
                                        ) : (
                                            <span className={`text-xs font-bold px-4 py-2.5 rounded-xl border ${item.status === 'cancelled' ? 'bg-red-50 border-red-200 text-red-400' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                                                {item.status === 'cancelled' ? 'Cancelled' : 'Locked'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;