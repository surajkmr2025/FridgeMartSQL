import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { CartContext } from './cartContextValue';

export { CartContext };

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
        // Keep the navbar count fresh when the app first mounts.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCartCount();
    }, [])
    return (
        <CartContext.Provider value={{ cartCount, fetchCartCount }}>
            {children}
        </CartContext.Provider>
    )
}


