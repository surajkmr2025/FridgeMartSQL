import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Global Styles
import './index.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Main App Component
import App from './App';


const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error("Failed to find the root element. FridgeMart cannot start. 🧊");
}

createRoot(rootElement).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);