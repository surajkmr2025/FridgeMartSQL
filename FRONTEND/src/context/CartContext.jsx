import React, { useEffect, useState } from 'react'
import { createContext } from 'react'
import axios from 'axios';

export const CartContext = createContext();

    export const CartProvider = ({ children }) => {

    const [cartCount, setCartCount] = useState(0);

    const fetchCartCount = async() => {
        try{
            const res = await axios.get('/api/cart/get');
            if(res.data.success) {
                setCartCount(res.data.data.length);
            }
        }
        catch(error){
            console.log('Cart count error: ', error);
        }
    }

    useEffect(() => {
        fetchCartCount();
    }, [])
    return (
        <CartContext.Provider value={{ cartCount, fetchCartCount }}>
            {children}
        </CartContext.Provider>
    )
}