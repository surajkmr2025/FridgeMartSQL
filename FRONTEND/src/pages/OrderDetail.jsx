import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    FiArrowLeft, FiPackage, FiXCircle, FiCheckCircle,
    FiTruck, FiClock, FiShoppingBag
} from 'react-icons/fi';

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.get(`/api/orders/get-order/${orderId}`);
                setOrder(res.data.data);
                setLoading(false);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Order not found');
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    const getStatusConfig = (status) => {
        const s = status?.toLowerCase();
        if (s === 'cancelled') return { bg: 'bg-red-50 border-red-200 text-red-600', icon: <FiXCircle size={14} />, label: 'Cancelled' };
        if (s === 'delivered') return { bg: 'bg-green-50 border-green-200 text-green-600', icon: <FiCheckCircle size={14} />, label: 'Delivered' };
        if (s === 'shipped')   return { bg: 'bg-blue-50 border-blue-200 text-blue-600', icon: <FiTruck size={14} />, label: 'Shipped' };
        if (s === 'confirmed') return { bg: 'bg-amber-50 border-amber-200 text-amber-700', icon: <FiCheckCircle size={14} />, label: 'Confirmed' };
        return { bg: 'bg-gray-50 border-gray-200 text-gray-600', icon: <FiClock size={14} />, label: 'Processing' };
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-b from-[#f8f9fc] to-white min-h-screen py-10 font-inter">
                <div className="w-11/12 max-w-4xl mx-auto animate-pulse">
                    <div className="h-5 w-32 bg-gray-200 rounded mb-8"></div>
                    <div className="bg-white rounded-2xl border border-gray-100 h-24 mb-4 shadow-sm"></div>
                    <div className="bg-white rounded-2xl border border-gray-100 h-64 shadow-sm"></div>
                </div>
            </div>
        );
    }

    if (!order || order.length === 0) {
        return (
            <div className="bg-gradient-to-b from-[#f8f9fc] to-white min-h-[70vh] flex flex-col items-center justify-center gap-4 font-inter">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiPackage className="text-4xl text-gray-400" />
                </div>
                <h2 className="text-xl font-black text-gray-700">Order not found</h2>
                <button 
                    onClick={() => navigate('/my-orders')} 
                    className="text-blue-500 font-bold hover:text-blue-600 transition-colors text-sm flex items-center gap-1"
                >
                    ← Back to My Orders
                </button>
            </div>
        );
    }

    // All rows share same order_id, status, total_price
    const firstRow    = order[0];
    const statusData  = getStatusConfig(firstRow.status);
    const totalPrice  = Number(firstRow.total_price).toLocaleString('en-IN');

    return (
        <div className="bg-gradient-to-b from-[#f8f9fc] to-white min-h-screen py-10 font-inter">
            <div className="w-11/12 max-w-4xl mx-auto">

                {/* Back */}
                <button
                    onClick={() => navigate('/my-orders')}
                    className="group flex items-center gap-2 text-gray-400 hover:text-blue-600 font-semibold text-sm mb-8 transition-all duration-200"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" size={16} />
                    Back to My Orders
                </button>

                {/* Order Header */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-6 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900">
                            #{String(firstRow.order_id).padStart(6, '0')}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`flex items-center gap-1.5 text-xs font-black uppercase px-4 py-2 rounded-full border ${statusData.bg}`}>
                            {statusData.icon} {statusData.label}
                        </span>
                    </div>
                </div>

                {/* Items Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mb-5">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
                        <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                            <FiShoppingBag size={16} className="text-blue-500" />
                            Items in this Order
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {order.map((item, index) => (
                            <div key={index} className="flex items-center gap-5 p-5 hover:bg-gray-50/30 transition-colors duration-200">
                                {/* Image */}
                                <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden p-1 shadow-sm">
                                    {item.image_url
                                        ? <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                                        : <FiShoppingBag className="text-gray-300 text-xl" />
                                    }
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                                    <p className="text-xs text-gray-400 font-medium mt-0.5">{item.brand}</p>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</p>
                                </div>

                                {/* Qty + Price */}
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xs text-gray-400 font-medium">Qty: {item.quantity}</p>
                                    <p className="text-base font-black text-gray-900 mt-0.5">
                                        ₹{Number(item.price).toLocaleString('en-IN')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-6">
                    <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                        <FiPackage size={16} className="text-blue-500" />
                        Order Summary
                    </h2>
                    <div className="flex flex-col gap-2 text-sm">
                        {order.map((item, index) => (
                            <div key={index} className="flex justify-between text-gray-500 py-1">
                                <span className="line-clamp-1 flex-1 pr-4 font-medium">{item.name} × {item.quantity}</span>
                                <span className="font-bold text-gray-700 whitespace-nowrap">
                                    ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t-2 border-dashed border-gray-100 mt-4 pt-4 flex justify-between items-center">
                        <span className="font-black text-gray-900 text-base">Grand Total</span>
                        <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            ₹{totalPrice}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OrderDetail;