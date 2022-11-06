import axios from 'axios';

import {listProductDetails} from '../actions/productActions';


import {

    GET_CART_REQUEST,
    GET_CART_SUCCESS,
    GET_CART_FAIL,


    ADD_TO_CART_REQUEST,
    ADD_TO_CART_SUCCESS,
    ADD_TO_CART_FAIL,

    REMOVE_FROM_CART,
    WAS_CLICKED_RESET,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD
} from '../constants/cartConstants';

// export const addToCart = (productId, qty, size, countInStock) => async (dispatch, getState) => {
//     const { data } = await axios.get(`http://localhost:8000/api/products/${productId}`);
//     dispatch({
//         type: ADD_TO_CART,
//         payload: {
//             product: data.id,
//             name: data.name,
//             image: data.image,
//             price: data.price,
//             countInStock,
//             size,
//             qty,
//         },
//     });
//     localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
// }


export const getCart = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: GET_CART_REQUEST
        })

        const {
            login: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        const { data } = await axios.get(`http://localhost:8000/api/cart/`, config)

        dispatch({
            type: GET_CART_SUCCESS, 
            payload: data
        })

    } catch (error) {
        dispatch({
            type: GET_CART_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.detail,
        })
    }
}


export const addToCart = (productId, qty, size) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ADD_TO_CART_REQUEST,
        });

        const {
            login: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        console.log(
            {
                productId,
                qty,
                size
            }
        );

        const { data } = await axios.post(`http://localhost:8000/api/cart/add/${productId}/`, {
            size: size.toUpperCase(),
            qty: parseInt(qty)
        }, config);

        dispatch({
            type: ADD_TO_CART_SUCCESS,
            payload: data,
        });
        
    } catch (error) {
        dispatch({
            type: ADD_TO_CART_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}



export const removeFromCart = (productId,size) => (dispatch, getState) => {
    dispatch({
        // type: REMOVE_FROM_CART,
        payload: { productId,size },
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