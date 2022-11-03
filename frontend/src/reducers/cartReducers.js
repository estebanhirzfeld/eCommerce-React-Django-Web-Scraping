import {ADD_TO_CART, REMOVE_FROM_CART, WAS_CLICKED_RESET, CART_SAVE_SHIPPING_ADDRESS, CART_SAVE_PAYMENT_METHOD, CART_CLEAR_ITEMS} from '../constants/cartConstants';


// cart reducer with quantity

export const cartReducer = (state = {cartItems: [], shippingAdress:{}}, action) => {
    let was_clicked = false;
    switch (action.type) {
        case ADD_TO_CART:
            const item = action.payload;
            // Check if item and its size already exists in cart
            const existItem = state.cartItems.find((x) => x.product === item.product && x.size === item.size);
            if (existItem) {
                return {
                    ...state,
                    was_clicked: true,
                    cartItems: state.cartItems.map((x) => x.product === existItem.product && x.size === existItem.size ? item : x),
                };
            } else {
                return {
                    ...state,
                    was_clicked: true,
                    cartItems: [...state.cartItems, item],
                };
            }
            

            
        case REMOVE_FROM_CART:
            // cart action receives productId and size as payload
            return {
                ...state,
                cartItems: state.cartItems.filter((x) => x.product !== action.payload.productId || x.size !== action.payload.size),
            };



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