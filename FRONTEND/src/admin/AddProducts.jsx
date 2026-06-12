import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { 
    FiPlusCircle, 
    FiTag, 
    FiBox, 
    FiDollarSign, 
    FiImage, 
    FiAlignLeft, 
    FiCheck 
} from 'react-icons/fi';

const AddProducts = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        mode: "onBlur"
    });

    const onSubmit = async (data) => {
        try {
            await axios.post('/api/products/add', data);
            toast.success('Product catalog updated! 🧊');
            reset();
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Something went wrong";
            toast.error(errorMsg);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                
                {/* Header Section */}
                <div className="mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md text-white">
                        <FiPlusCircle size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Add new product</h1>
                        <p className="text-sm text-gray-500">Create a new refrigerator listing for your store.</p>
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            
                            {/* Product Name */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-700 ml-1">Product title</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <FiBox size={16} />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Smart Inverter Double Door" 
                                        {...register('name', { required: "Product name is mandatory" })} 
                                        className={`w-full h-10 pl-9 pr-3 bg-white border ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'} rounded-lg text-sm transition-all outline-none focus:ring-2`}
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>}
                            </div>

                            {/* Brand */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-700 ml-1">Brand</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <FiTag size={16} />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Samsung, LG, Haier" 
                                        {...register('brand', { required: "Brand name is mandatory" })} 
                                        className={`w-full h-10 pl-9 pr-3 bg-white border ${errors.brand ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'} rounded-lg text-sm transition-all outline-none focus:ring-2`}
                                    />
                                </div>
                                {errors.brand && <p className="text-red-500 text-xs mt-1 ml-1">{errors.brand.message}</p>}
                            </div>

                            {/* Price */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-700 ml-1">Price (INR)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <FiDollarSign size={16} />
                                    </div>
                                    <input 
                                        type="number" 
                                        placeholder="0.00" 
                                        {...register('price', { required: "Price is required", min: { value: 1, message: "Price must be positive" } })} 
                                        className={`w-full h-10 pl-9 pr-3 bg-white border ${errors.price ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'} rounded-lg text-sm transition-all outline-none focus:ring-2`}
                                    />
                                </div>
                                {errors.price && <p className="text-red-500 text-xs mt-1 ml-1">{errors.price.message}</p>}
                            </div>

                            {/* Image URL */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-700 ml-1">Image URL</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <FiImage size={16} />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="https://..." 
                                        {...register('image_url', { required: "Image link is required", minLength: { value: 5, message: "Link too short" } })} 
                                        className={`w-full h-10 pl-9 pr-3 bg-white border ${errors.image_url ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'} rounded-lg text-sm transition-all outline-none focus:ring-2`}
                                    />
                                </div>
                                {errors.image_url && <p className="text-red-500 text-xs mt-1 ml-1">{errors.image_url.message}</p>}
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 ml-1">Description</label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                                        <FiAlignLeft size={16} />
                                    </div>
                                    <textarea 
                                        placeholder="Describe features like capacity, star rating, etc." 
                                        rows={4}
                                        {...register('description', { required: "Description is mandatory" })} 
                                        className={`w-full pl-9 pr-3 py-2 bg-white border ${errors.description ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'} rounded-lg text-sm transition-all outline-none focus:ring-2 resize-none`}
                                    />
                                </div>
                                {errors.description && <p className="text-red-500 text-xs mt-1 ml-1">{errors.description.message}</p>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button 
                                type='submit' 
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <FiCheck size={16} />
                                        <span>Publish product</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddProducts;
