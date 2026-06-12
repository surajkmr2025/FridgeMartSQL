import axios from 'axios';
import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CartContext } from '../context/CartContext';
import heroBanner from '../../public/assets/images/hero.png';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { fetchCartCount } = useContext(CartContext);

    const handleAddToCart = async (e, product_id) => {
        try {
            e.stopPropagation();
            await axios.post('/api/cart/add', { product_id });
            toast.success('Added to cart!');
            fetchCartCount();
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast('Please login first');
                navigate('/login');
            } else {
                toast.error('Something went wrong');
            }
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/api/products/');
                setProducts(res.data.products);
                setLoading(false);
            } catch (error) {
                console.error(error.message);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="bg-[#f8f9fc] min-h-screen font-inter">
                <div className="w-11/12 max-w-maxContent mx-auto pt-10 pb-6">
                    <div
                        className="rounded-[2.5rem] overflow-hidden min-h-[420px] animate-pulse"
                        style={{ background: 'linear-gradient(135deg, #0a1628, #073b4c)' }}
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between px-14 py-12 gap-8">
                            <div className="flex-1 space-y-5">
                                <div className="h-6 w-52 bg-white/10 rounded-full"></div>
                                <div className="h-14 w-3/4 bg-white/10 rounded-2xl"></div>
                                <div className="h-14 w-1/2 bg-white/10 rounded-2xl"></div>
                                <div className="flex gap-3 mt-4">
                                    <div className="h-12 w-36 bg-white/10 rounded-xl"></div>
                                    <div className="h-12 w-32 bg-white/10 rounded-xl"></div>
                                </div>
                            </div>
                            <div className="w-80 h-72 bg-white/10 rounded-3xl"></div>
                        </div>
                    </div>
                </div>
                <div className="w-11/12 max-w-maxContent mx-auto py-10">
                    <div className="h-8 w-56 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                    <div className="h-4 w-40 bg-gray-100 rounded animate-pulse mb-10"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                                <div className="h-52 bg-gray-100"></div>
                                <div className="p-5 space-y-3">
                                    <div className="h-3 w-16 bg-gray-100 rounded"></div>
                                    <div className="h-5 w-full bg-gray-200 rounded"></div>
                                    <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                                    <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
                                        <div className="h-7 w-24 bg-gray-200 rounded-lg"></div>
                                        <div className="h-10 w-10 bg-gray-100 rounded-xl"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-[#f8f9fc] to-white min-h-screen font-inter">
            {/* ── HERO ─────────────────────────────────────────────── */}
            <div className="w-11/12 max-w-maxContent mx-auto pt-8 pb-6">
                <div
                    className="relative rounded-3xl md:rounded-[2.5rem] overflow-hidden min-h-[440px] md:min-h-[520px] flex items-center shadow-2xl"
                    style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2744 40%, #0c3460 70%, #073b4c 100%)' }}
                >
                    {/* Animated gradient blobs */}
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle, #118AB2 0%, transparent 70%)', transform: 'translate(30%,-30%)' }}></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 animate-pulse" style={{ background: 'radial-gradient(circle, #06D6A0 0%, transparent 70%)', transform: 'translate(-30%,30%)' }}></div>
                    <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full opacity-10 animate-pulse" style={{ background: 'radial-gradient(circle, #47A5C5 0%, transparent 70%)' }}></div>
                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                    <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-14 py-12 gap-8">
                        {/* Left */}
                        <div className="flex-1 max-w-xl text-center md:text-left">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest shadow-lg">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                Free Delivery + 2-Year Warranty
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-5">
                                Keep It{' '}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#47A5C5] to-[#06D6A0]">
                                    Cool
                                </span>
                                <br />with FridgeMart
                            </h1>

                            <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
                                Discover premium refrigerators at unbeatable prices. Smart cooling technology for every home.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 justify-center md:justify-start">
                                <button
                                    onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                                    className="group flex items-center gap-2 text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-300 active:scale-[0.98] text-sm shadow-2xl hover:shadow-[0_20px_30px_-12px_rgba(6,214,160,0.4)]"
                                    style={{ background: 'linear-gradient(135deg, #118AB2, #06D6A0)' }}
                                >
                                    Shop Now
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => navigate('/cart')}
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 text-sm hover:shadow-lg"
                                >
                                    🛒 View Cart
                                </button>
                            </div>

                            <div className="flex items-center gap-6 mt-10 justify-center md:justify-start">
                                {[['500+', 'Models'], ['4.9★', 'Rating'], ['10K+', 'Customers']].map(([val, label], i, arr) => (
                                    <React.Fragment key={label}>
                                        <div className="text-center">
                                            <p className="text-white font-black text-2xl tracking-tight">{val}</p>
                                            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">{label}</p>
                                        </div>
                                        {i < arr.length - 1 && <div className="w-px h-8 bg-white/20"></div>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Right — Image with floating animation */}
                        <div className="flex-shrink-0 flex items-center justify-center relative w-full md:w-auto">
                            <div className="absolute inset-0 rounded-full blur-3xl opacity-30 animate-pulse" style={{ background: 'radial-gradient(circle, #06D6A0 0%, #118AB2 50%, transparent 80%)' }}></div>
                            <img
                                src={heroBanner}
                                alt="Premium Refrigerator"
                                className="relative z-10 w-56 md:w-72 lg:w-[600px] h-auto object-contain animate-float rounded"
                                style={{ filter: 'drop-shadow(0 30px 60px rgba(6,214,160,0.25)) drop-shadow(0 0 40px rgba(17,138,178,0.3))' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── FEATURES STRIP ──────────────────────────────────── */}
            <div className="w-11/12 max-w-maxContent mx-auto py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {[
                        { icon: '🚚', title: 'Free Delivery', sub: 'On all orders', color: 'from-blue-50 to-blue-100' },
                        { icon: '🛡️', title: '2-Year Warranty', sub: '100% genuine', color: 'from-green-50 to-green-100' },
                        { icon: '↩️', title: 'Easy Returns', sub: '7-day policy', color: 'from-amber-50 to-amber-100' },
                        { icon: '💳', title: 'Secure Payments', sub: 'Encrypted checkout', color: 'from-purple-50 to-purple-100' },
                    ].map(({ icon, title, sub, color }) => (
                        <div
                            key={title}
                            className="group bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default"
                        >
                            <div className={`text-2xl w-12 h-12 flex items-center justify-center bg-gradient-to-br ${color} rounded-xl flex-shrink-0 transition-all group-hover:scale-110`}>
                                {icon}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">{title}</p>
                                <p className="text-xs text-gray-400 font-medium">{sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── PRODUCTS ────────────────────────────────────────── */}
            <div className="w-11/12 max-w-maxContent mx-auto py-8 pb-20">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-3 tracking-tight">Explore Refrigerators</h2>
                        <p className="text-gray-400 mt-1 text-sm">Handpicked for quality and performance</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm text-sm">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-gray-500 font-medium">
                            <span className="text-gray-900 font-black">{products.length}</span> models in stock
                        </span>
                    </div>
                </div>

                {/* Grid */}
                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="text-7xl mb-4 animate-bounce">🧊</div>
                        <h3 className="text-2xl font-black text-gray-800 mb-2">No products available</h3>
                        <p className="text-gray-400 text-sm">Check back later for new arrivals.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => navigate(`/product/${product.id}`)}
                                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
                            >
                                {/* Image with overlay */}
                                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-56 flex items-center justify-center p-5 overflow-hidden">
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-gray-100 text-[10px] font-black uppercase tracking-widest text-blue-600 px-2.5 py-1 rounded-full z-10 shadow-sm">
                                        {product.brand}
                                    </div>
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="object-contain h-full w-full group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                {/* Details */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed flex-grow mb-4">
                                        {product.description}
                                    </p>

                                    {/* Price + CTA */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Price</p>
                                            <p className="text-xl font-black text-gray-900 tracking-tight">
                                                ₹{Number(product.price).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => handleAddToCart(e, product.id)}
                                            className="flex items-center gap-1.5 bg-gray-50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 text-gray-500 hover:text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all duration-200 active:scale-95 border border-gray-200 hover:border-transparent hover:shadow-lg"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Custom keyframe for floating animation */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Home;