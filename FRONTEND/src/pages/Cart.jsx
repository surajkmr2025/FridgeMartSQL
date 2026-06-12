import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart, FiArrowRight, FiLock } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const { fetchCartCount } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        const getItems = async () => {
            try {
                const res = await axios.get('/api/cart/get');
                setCartItems(res.data.data);
            } catch (error) {
                console.log("Error fetching cart: ", error);
            }
        };
        getItems();
    }, []);

    const handleRemove = async (id) => {
        try {
            await axios.delete(`/api/cart/remove/${id}`);
            setCartItems(prev => prev.filter(item => item.id !== id));
            fetchCartCount();
            toast.success("Item removed!");
        } catch {
            toast.error("Failed to remove item");
        }
    };

    const handleQuantity = async (id, quantity) => {
        if (quantity < 1) return;
        try {
            await axios.put(`/api/cart/update/${id}`, { quantity });
            setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
        } catch {
            toast.error("Failed to update quantity");
        }
    };

    const grandTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        try {
            await axios.post('/api/orders/checkout');
            toast.success('Order placed successfully! 🎉');
            fetchCartCount();
            setCartItems([]);
            navigate('/my-orders');
        } catch {
            toast.error('Error placing order');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="bg-gradient-to-b from-[#f8f9fc] to-white min-h-[85vh] flex flex-col items-center justify-center font-inter p-6">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 border border-blue-100 shadow-inner">
                    <FiShoppingCart className="text-4xl text-blue-400" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-400 text-sm mb-8 text-center max-w-xs">
                    You haven't added any appliances yet. Browse our collection!
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="group flex items-center gap-2 text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl text-sm"
                    style={{ background: 'linear-gradient(135deg, #118AB2, #06D6A0)' }}
                >
                    Browse Products
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-[#f8f9fc] to-white min-h-screen py-10 font-inter">
            <div className="w-11/12 max-w-maxContent mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
                    <p className="text-gray-400 text-sm mt-1">{cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your cart</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Cart Items */}
                    <div className="flex-1 flex flex-col gap-5">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5"
                            >
                                {/* Image */}
                                <div className="w-24 h-24 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden p-2 shadow-sm">
                                    {item.image_url
                                        ? <img src={item.image_url} alt={item.name} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" />
                                        : <FiShoppingCart className="text-3xl text-gray-300" />
                                    }
                                </div>

                                {/* Name + unit price */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-400 font-medium mt-1">
                                        ₹{Number(item.price).toLocaleString('en-IN')} per unit
                                    </p>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center gap-5 w-full sm:w-auto border-t sm:border-0 border-gray-100 pt-4 sm:pt-0">
                                    {/* Qty */}
                                    <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1 gap-1 shadow-sm">
                                        <button
                                            onClick={() => handleQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                                item.quantity <= 1
                                                    ? 'text-gray-200 cursor-not-allowed'
                                                    : 'text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm'
                                            }`}
                                        >
                                            <FiMinus size={14} />
                                        </button>
                                        <span className="w-10 text-center font-black text-gray-900 text-base">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantity(item.id, item.quantity + 1)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all duration-200"
                                        >
                                            <FiPlus size={14} />
                                        </button>
                                    </div>

                                    {/* Subtotal */}
                                    <span className="font-black text-gray-900 text-base min-w-[90px] text-right hidden sm:block">
                                        ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                                    </span>

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="w-9 h-9 bg-red-50 hover:bg-red-500 text-red-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-[380px]">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 p-6 sticky top-24">
                            <h2 className="text-xl font-black text-gray-900 mb-5">Order Summary</h2>

                            <div className="flex flex-col gap-3 mb-5 max-h-[280px] overflow-y-auto pr-1">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex justify-between items-start gap-3 text-sm">
                                        <span className="text-gray-600 line-clamp-1 flex-1">
                                            {item.name} <span className="text-gray-400">×{item.quantity}</span>
                                        </span>
                                        <span className="font-bold text-gray-800 whitespace-nowrap">
                                            ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t-2 border-dashed border-gray-100 my-5"></div>

                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <p className="text-xs text-gray-400 font-medium mb-1">Total Amount</p>
                                    <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                        ₹{Number(grandTotal).toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <span className="text-[11px] font-black text-green-600 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full shadow-sm">
                                    FREE SHIPPING
                                </span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full text-white font-black py-4 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-base"
                                style={{ background: 'linear-gradient(135deg, #118AB2, #06D6A0)' }}
                            >
                                Secure Checkout
                                <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="flex items-center justify-center gap-1.5 mt-5">
                                <FiLock className="text-gray-300" size={12} />
                                <p className="text-xs text-gray-400 font-medium">Safe & Encrypted Payments</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Cart;