import axios from 'axios';

import { ADD_TO_CART, REMOVE_FROM_CART, WAS_CLICKED_RESET, CART_SAVE_SHIPPING_ADDRESS, CART_SAVE_PAYMENT_METHOD } from '../constants/cartConstants';

export const addToCart = (productId, qty) => async (dispatch, getState) => {
    const { data } = await axios.get(`http://localhost:8000/api/products/${productId}`);
    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty,
        },
    });
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}

export const removeFromCart = (productId) => (dispatch, getState) => {
    dispatch({
        type: REMOVE_FROM_CART,
        payload: productId,
    });
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}

export const was_clicked_reset = () => (dispatch) => {
    dispatch({
        type: WAS_CLICKED_RESET,
    });
}

export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data,
    });
    localStorage.setItem('shippingAddress', JSON.stringify(data));
}

export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data,
    });
    localStorage.setItem('paymentMethod', JSON.stringify(data));
}