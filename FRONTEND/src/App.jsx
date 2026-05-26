import { Toaster } from 'react-hot-toast';
import { Route, Routes } from "react-router-dom";

// Auth
import SignUpForm from "./components/auth/signUpForm";
import LoginForm from "./components/auth/loginForm";
import LogOut from "./components/auth/logout";
import PrivateRoute from "./components/auth/PrivateRoute";
import OpenRoute from "./components/auth/OpenRoute";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

// Pages
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import ProfilePage from "./pages/profile/ProfilePage";
import OrderDetail from "./pages/OrderDetail";

// Admin
import AdminOrders from "./admin/AdminOrders";
import AdminUsers from "./admin/AdminUsers";
import AddProducts from "./admin/AddProducts";
import ManageProducts from "./admin/ManageProducts";

// Common
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Error
import Error from './pages/Error';

function App() {
    return (
        <div className="flex flex-col min-h-screen bg-[#f8f9fc] font-inter">
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1a1a2e',
                        color: '#fff',
                        borderRadius: '12px',
                        padding: '12px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                    },
                    success: { style: { background: '#059669' } },
                    error:   { style: { background: '#dc2626' } },
                }}
            />

            <Navbar />

            <main className="flex-grow">
                <Routes>
                    {/* -- Public (logged-out only) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
                    <Route path="/signup"          element={<OpenRoute><SignUpForm /></OpenRoute>} />
                    <Route path="/login"           element={<OpenRoute><LoginForm /></OpenRoute>} />
                    <Route path="/forgot-password" element={<OpenRoute><ForgotPassword /></OpenRoute>} />
                    <Route path="/reset-password"  element={<OpenRoute><ResetPassword /></OpenRoute>} />

                    {/* -- User Protected \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
                    <Route path="/"            element={<PrivateRoute><Home /></PrivateRoute>} />
                    <Route path="/product/:id" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
                    <Route path="/cart"        element={<PrivateRoute><Cart /></PrivateRoute>} />
                    <Route path="/my-orders"   element={<PrivateRoute><MyOrders /></PrivateRoute>} />
                    <Route path="/my-orders/:orderId" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
                    <Route path="/profile"     element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                    <Route path="/logout"      element={<PrivateRoute><LogOut /></PrivateRoute>} />

                    {/* -- Admin Protected \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
                    <Route path="/all-orders"      element={<PrivateRoute adminOnly={true}><AdminOrders /></PrivateRoute>} />
                    <Route path="/all-users"       element={<PrivateRoute adminOnly={true}><AdminUsers /></PrivateRoute>} />
                    <Route path="/add-products"    element={<PrivateRoute adminOnly={true}><AddProducts /></PrivateRoute>} />
                    <Route path="/update-products" element={<PrivateRoute adminOnly={true}><ManageProducts /></PrivateRoute>} />

                    <Route path='*' element={<Error />}></Route>
                </Routes>
            <Footer />
            </main>

        </div>
    );
}

export default App;