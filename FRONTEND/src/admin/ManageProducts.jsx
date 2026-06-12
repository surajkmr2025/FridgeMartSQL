import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiSearch, FiPackage, FiX, FiSave, FiImage } from 'react-icons/fi';

const ManageProducts = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // 1 Initial Fetch
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`/api/products`);
                setAllProducts(res.data.products);
            } catch {
                toast.error("Failed to load inventory");
            }
        }
        fetchProducts();
    }, []);

    // 2 Delete Logic (with Confirmation)
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure? This fridge will be removed from the store! ❄️")) {
            try {
                await axios.delete(`/api/products/delete/${id}`);
                setAllProducts(allProducts.filter((product) => product.id !== id));
                toast.success('Product removed from inventory');
            } catch {
                toast.error('Error deleting product');
            }
        }
    }

    // 3 Input Handlers for Edit Modal
    const handleInputChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        });
    }

    const handleEdit = (product) => {
        setEditFormData({ ...product }); // Shallow copy to avoid direct state mutation
        setIsModalOpen(true);
    }

    // 4 Update Submit Logic
    const handleUpdateSubmit = async () => {
        try {
            await axios.put(`/api/products/update/${editFormData.id}`, editFormData);
            // Local state sync
            setAllProducts(allProducts.map((item) => 
                item.id === editFormData.id ? editFormData : item
            ));
            setIsModalOpen(false);
            toast.success("Fridge details updated successfully!");
        } catch {
            toast.error('Failed to save changes');
        }
    }

    // 5 Real-time Search Logic
    const filteredProducts = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-pure-greys-5 py-10 px-4 sm:px-8 font-inter animate-fadeIn">
            <div className="max-w-7xl mx-auto">
                
                {/* 🎯 Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-richblack-900 tracking-tight">Manage Inventory</h1>
                        <p className="text-richblack-400 mt-1 font-medium italic">Track and maintain your cooling appliances catalog</p>
                    </div>

                    {/*  Search Bar UI */}
                    <div className="relative group w-full md:w-80">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-richblack-300 group-focus-within:text-blue-200 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search by name or brand..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-pure-greys-25 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/*  Inventory Table */}
                {filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-[2rem] border border-pure-greys-25 p-20 text-center shadow-sm">
                        <FiPackage className="text-6xl text-pure-greys-100 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-richblack-800 tracking-tight">Warehouse Empty</h2>
                        <p className="text-richblack-400 mt-2 italic text-sm">No products found matching your search query.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] border border-pure-greys-25 shadow-xl shadow-pure-greys-50/5 overflow-hidden">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-pure-greys-5 border-b border-pure-greys-25">
                                        <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-richblack-400">Product</th>
                                        <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-richblack-400">Brand</th>
                                        <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-richblack-400">Price</th>
                                        <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-richblack-400 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-pure-greys-25">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-blue-5/30 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-xl bg-white border border-pure-greys-25 p-1 flex-shrink-0 shadow-sm">
                                                        <img src={product.image_url} alt="Fridge" className="w-full h-full object-contain" />
                                                    </div>
                                                    <div className="max-w-[250px]">
                                                        <p className="text-sm font-bold text-richblack-900 truncate leading-tight group-hover:text-blue-200 transition-colors">{product.name}</p>
                                                        <p className="text-[10px] text-richblack-300 mt-1 line-clamp-1 italic font-medium">{product.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="bg-blue-5 text-blue-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-25">
                                                    {product.brand}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-sm font-black text-richblack-900 tracking-tight">₹{Number(product.price).toLocaleString('en-IN')}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button 
                                                        onClick={() => handleEdit(product)}
                                                        className="p-2.5 bg-pure-greys-5 hover:bg-blue-200 hover:text-white text-richblack-400 rounded-xl transition-all shadow-sm active:scale-90"
                                                        title="Edit Product"
                                                    >
                                                        <FiEdit2 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2.5 bg-pink-5 hover:bg-pink-200 hover:text-white text-pink-300 rounded-xl transition-all shadow-sm active:scale-90"
                                                        title="Delete Product"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/*  Edit Section with Image Preview */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-richblack-900/60 backdrop-blur-md animate-fadeIn">
                        <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-pure-greys-25 overflow-hidden flex flex-col md:flex-row transition-all duration-300">
                            
                            {/* 📸 Modal Left: Live Image Preview */}
                            <div className="md:w-1/3 bg-pure-greys-5 p-6 flex flex-col items-center justify-center border-r border-pure-greys-25">
                                <span className="text-[10px] font-black uppercase text-richblack-300 mb-4 tracking-widest">Image Preview</span>
                                <div className="w-full aspect-square bg-white rounded-2xl border border-pure-greys-25 p-4 shadow-inner flex items-center justify-center overflow-hidden group">
                                    {editFormData.image_url ? (
                                        <img 
                                            src={editFormData.image_url} 
                                            alt="Preview" 
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <FiImage className="text-4xl text-pure-greys-50" />
                                    )}
                                </div>
                                <p className="text-[9px] text-blue-200 font-bold mt-4 text-center px-2 italic uppercase tracking-wider opacity-60">
                                    Preview syncs in real-time
                                </p>
                            </div>

                            {/* Modal Right: Edit Form */}
                            <div className="md:w-2/3 flex flex-col bg-white">
                                <div className="px-8 py-6 border-b border-pure-greys-25 flex items-center justify-between bg-white">
                                    <h2 className="text-xl font-black text-richblack-900 flex items-center gap-2 tracking-tight">
                                        <FiEdit2 className="text-blue-200" /> Edit Product
                                    </h2>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-pure-greys-25 rounded-full transition-colors">
                                        <FiX size={20} />
                                    </button>
                                </div>
                                
                                <div className="p-8 space-y-4 overflow-y-auto max-h-[70vh] custom-scrollbar">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-richblack-300 ml-1">Fridge Name</label>
                                            <input type="text" name="name" value={editFormData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-pure-greys-5 border border-pure-greys-25 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-richblack-300 ml-1">Price (₹)</label>
                                            <input type="number" name="price" value={editFormData.price} onChange={handleInputChange} className="w-full px-4 py-3 bg-pure-greys-5 border border-pure-greys-25 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-richblack-300 ml-1">Brand Name</label>
                                        <input type="text" name="brand" value={editFormData.brand} onChange={handleInputChange} className="w-full px-4 py-3 bg-pure-greys-5 border border-pure-greys-25 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-richblack-300 ml-1">Live Image URL</label>
                                        <div className="relative group">
                                            <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 text-pure-greys-200 group-focus-within:text-blue-200 transition-colors" />
                                            <input 
                                                type="text" 
                                                name="image_url" 
                                                value={editFormData.image_url} 
                                                onChange={handleInputChange} 
                                                placeholder="Paste image URL here..."
                                                className="w-full pl-11 pr-4 py-3 bg-pure-greys-5 border border-pure-greys-25 rounded-xl text-xs font-medium focus:ring-4 focus:ring-blue-100 outline-none transition-all italic" 
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-richblack-300 ml-1">Technical Specs</label>
                                        <textarea name="description" rows={2} value={editFormData.description} onChange={handleInputChange} className="w-full px-4 py-3 bg-pure-greys-5 border border-pure-greys-25 rounded-xl text-sm font-medium focus:ring-4 focus:ring-blue-100 outline-none resize-none transition-all" />
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 border-2 border-pure-greys-50 text-richblack-600 font-bold rounded-2xl hover:bg-pure-greys-5 transition-all active:scale-95">Cancel</button>
                                        <button onClick={handleUpdateSubmit} className="flex-1 py-3.5 bg-gradient-to-r from-blue-200 to-blue-300 text-white font-black rounded-2xl shadow-lg shadow-blue-200/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                                            <FiSave /> Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageProducts;
