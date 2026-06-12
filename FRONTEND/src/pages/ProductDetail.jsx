import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CartContext } from '../context/CartContext';
import { FiArrowLeft, FiShoppingCart, FiStar, FiCheck, FiShield, FiTruck, FiMinus, FiPlus } from 'react-icons/fi';

const ProductDetail = () => {
    const navigate = useNavigate();
    const { fetchCartCount } = useContext(CartContext);
    const { id } = useParams();
    const [Product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await axios.get(`/api/products/${id}`);
                setProduct(res.data.product);
                setLoading(false);
            } catch {
                toast.error("Error fetching product details");
                setLoading(false);
            }
        };
        getProduct();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            await axios.post('/api/cart/add', { product_id: id, quantity });
            toast.success('Added to your cart! 🛒');
            fetchCartCount();
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error("Please sign in to add items");
                navigate('/login');
            } else {
                toast.error("Something went wrong");
            }
        }
    };

    const increaseQty = () => setQuantity(prev => Math.min(prev + 1, 5));
    const decreaseQty = () => setQuantity(prev => Math.max(prev - 1, 1));

    if (loading) {
        return (
            <div className="bg-gradient-to-b from-[#f8f9fc] to-white min-h-screen py-10 font-inter">
                <div className="w-11/12 max-w-maxContent mx-auto">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-8"></div>
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 lg:p-12 flex flex-col lg:flex-row gap-12 animate-pulse shadow-sm">
                        <div className="w-full lg:w-1/2">
                            <div className="h-[420px] bg-gray-100 rounded-2xl mb-4"></div>
                            <div className="flex gap-3">
                                {[1, 2, 3].map(i => <div key={i} className="h-20 w-20 bg-gray-100 rounded-xl"></div>)}
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 space-y-4 pt-4">
                            <div className="h-5 w-20 bg-gray-100 rounded-full"></div>
                            <div className="h-10 w-3/4 bg-gray-200 rounded-xl"></div>
                            <div className="h-4 w-full bg-gray-100 rounded"></div>
                            <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
                            <div className="h-24 w-full bg-gray-100 rounded-2xl mt-6"></div>
                            <div className="h-14 w-full bg-gray-200 rounded-xl mt-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!Product) {
        return (
            <div className="bg-gradient-to-b from-[#f8f9fc] to-white min-h-[80vh] flex flex-col items-center justify-center gap-4 font-inter">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl">😕</span>
                </div>
                <h2 className="text-2xl font-black text-gray-900">Product Not Found</h2>
                <p className="text-gray-400 text-sm">This appliance doesn't exist or was removed.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 flex items-center gap-2 bg-white border border-gray-200 hover:border-blue-400 text-gray-700 hover:text-blue-500 font-bold px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <FiArrowLeft /> Go Back
                </button>
            </div>
        );
    }

    const galleryImages = [Product.image_url, Product.image_url, Product.image_url];
    return (
        <div className="bg-gradient-to-b from-[#f8f9fc] to-white min-h-screen py-10 font-inter">
            <div className="w-11/12 max-w-maxContent mx-auto">

                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-gray-400 hover:text-blue-600 font-semibold text-sm mb-8 transition-all duration-200"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" size={16} />
                    Back to Products
                </button>

                <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 lg:p-10 flex flex-col lg:flex-row gap-10 lg:gap-16">

                    {/* Left — Image Gallery */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        {/* Main Image */}
                        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl h-[380px] md:h-[460px] flex items-center justify-center p-8 overflow-hidden group border border-gray-100">
                            <span className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm border border-gray-100 text-[11px] font-black text-green-600 px-3 py-1 rounded-full shadow-sm flex items-center gap-1 z-10">
                                <FiCheck size={10} /> In Stock
                            </span>
                            <img
                                src={galleryImages[activeImage]}
                                alt={Product.name}
                                className="object-contain max-h-full w-full group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
                            />
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-3 overflow-x-auto pb-1">
                            {galleryImages.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-xl p-2 border-2 transition-all duration-200 ${
                                        activeImage === index
                                            ? 'border-blue-400 bg-blue-50 scale-105 shadow-md'
                                            : 'border-gray-100 bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                                    }`}
                                >
                                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right — Details */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">

                        <span className="inline-block text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-4 w-fit">
                            {Product.brand}
                        </span>

                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight mb-3">
                            {Product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 text-sm mb-5">
                            <div className="flex text-yellow-400 gap-0.5">
                                {[...Array(4)].map((_, i) => <FiStar key={i} className="fill-current" size={14} />)}
                                <FiStar className="text-gray-200" size={14} />
                            </div>
                            <span className="font-bold text-gray-800">4.8</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-400 text-xs">124 reviews</span>
                        </div>

                        <p className="text-gray-500 text-base leading-relaxed mb-6">
                            {Product.description}
                        </p>

                        {/* Price Box */}
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-6 hover:bg-gray-100/50 transition-colors">
                            <div className="flex items-end gap-3">
                                <span className="text-4xl font-black text-gray-900 tracking-tight">
                                    ₹{Number(Product.price).toLocaleString('en-IN')}
                                </span>
                                <span className="text-gray-300 line-through text-lg mb-1">
                                    ₹{Number(Product.price * 1.2).toLocaleString('en-IN')}
                                </span>
                                <span className="bg-green-100 text-green-700 font-bold text-xs px-2 py-1 rounded-full">20% OFF</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Inclusive of all taxes · Free shipping</p>
                        </div>

                        {/* Quantity + CTA */}
                        <div className="flex gap-3 mb-8">
                            <div className="flex items-center bg-white border-2 border-gray-100 rounded-xl px-4 py-3 gap-4 shadow-sm">
                                <button
                                    onClick={decreaseQty}
                                    disabled={quantity <= 1}
                                    className={`transition-all duration-200 ${
                                        quantity <= 1
                                            ? 'text-gray-200 cursor-not-allowed'
                                            : 'text-gray-600 hover:text-blue-500 hover:scale-110'
                                    }`}
                                >
                                    <FiMinus size={14} />
                                </button>
                                <span className="font-black text-lg text-gray-900 w-6 text-center">{quantity}</span>
                                <button
                                    onClick={increaseQty}
                                    disabled={quantity >= 5}
                                    className={`transition-all duration-200 ${
                                        quantity >= 5
                                            ? 'text-gray-200 cursor-not-allowed'
                                            : 'text-gray-600 hover:text-blue-500 hover:scale-110'
                                    }`}
                                >
                                    <FiPlus size={14} />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="group flex-1 flex items-center justify-center gap-2 text-white font-black py-4 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-xl text-base"
                                style={{ background: 'linear-gradient(135deg, #118AB2, #06D6A0)' }}
                            >
                                <FiShoppingCart className="group-hover:scale-110 transition-transform duration-200" size={18} />
                                Add to Cart
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100">
                            {[
                                { icon: <FiShield size={18} />, color: 'text-green-500 bg-green-50 border-green-100', title: '1 Year Warranty', sub: 'Brand Protection' },
                                { icon: <FiTruck size={18} />, color: 'text-blue-500 bg-blue-50 border-blue-100', title: 'Free Delivery', sub: '3–5 business days' },
                                { icon: <FiCheck size={18} />, color: 'text-purple-500 bg-purple-50 border-purple-100', title: 'Verified', sub: 'By FridgeMart' },
                            ].map(({ icon, color, title, sub }) => (
                                <div key={title} className="flex flex-col items-start gap-2 group">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${color} group-hover:scale-110 transition-transform duration-200`}>
                                        {icon}
                                    </div>
                                    <p className="text-xs font-bold text-gray-800">{title}</p>
                                    <p className="text-[10px] text-gray-400">{sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
