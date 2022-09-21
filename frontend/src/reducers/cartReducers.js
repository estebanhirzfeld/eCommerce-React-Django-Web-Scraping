import {ADD_TO_CART, REMOVE_FROM_CART, WAS_CLICKED_RESET, CART_SAVE_SHIPPING_ADDRESS, CART_SAVE_PAYMENT_METHOD, CART_CLEAR_ITEMS} from '../constants/cartConstants';


// cart reducer with quantity

export const cartReducer = (state = {cartItems: [], shippingAdress:{}}, action) => {
    let was_clicked = false;
    switch (action.type) {
        case ADD_TO_CART:
            const item = action.payload;
            const existItem = state.cartItems.find(cartItem => cartItem.product === item.product);
            if (existItem) {
                return {
                    ...state,
                    was_clicked: true,
                    cartItems: state.cartItems.map(cartItem => cartItem.product === existItem.product ? item : cartItem)
                }
            } else {
                return {
                    ...state,
                    was_clicked: true,
                    cartItems: [...state.cartItems, item]
                }
            }
        case REMOVE_FROM_CART:
            return {
                ...state,
                was_clicked:false,
                cartItems: state.cartItems.filter(x => x.product !== action.payload)
            }

        case CART_CLEAR_ITEMS:
            return {
                ...state,
                cartItems: []
            }

        case WAS_CLICKED_RESET:
            return {
                ...state,
                was_clicked: false
            }

        case CART_SAVE_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload
            }
        
        case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload
            }

        default:
            return state;
    }
}