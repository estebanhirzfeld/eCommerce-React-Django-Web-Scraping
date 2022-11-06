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
    CART_SAVE_PAYMENT_METHOD,
    CART_CLEAR_ITEMS
} from '../constants/cartConstants';


// cart reducer with quantity

export const cartReducer = (state = {cartItems: [], shippingAdress:{}}, action) => {
    let was_clicked = false;
    switch (action.type) {

        case GET_CART_REQUEST:
            return {
                loading: true,
                was_clicked: false,
                cartItems: [] 
            }

        case GET_CART_SUCCESS:
            return {
                loading: false,
                was_clicked:true,
                cartItems: action.payload
            }

        case GET_CART_FAIL:
            return {
                loading: false,
                was_clicked: false,
                error: action.payload 
            }

        case ADD_TO_CART_REQUEST:
            return {
                loading: true,
                cartItems: []
            };

        case ADD_TO_CART_SUCCESS:
            return {
                loading: false,
                was_clicked: true,
                cartItems: action.payload,
            };

        case ADD_TO_CART_FAIL:
            return {
                loading: false,
                error: action.payload,
            };

            
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