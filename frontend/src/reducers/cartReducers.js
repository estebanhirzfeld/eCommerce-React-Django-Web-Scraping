import {

    GET_CART_REQUEST,
    GET_CART_SUCCESS,
    GET_CART_FAIL,

    ADD_TO_CART_REQUEST,
    ADD_TO_CART_SUCCESS,
    ADD_TO_CART_FAIL,

    REMOVE_FROM_CART_REQUEST,
    REMOVE_FROM_CART_SUCCESS,
    REMOVE_FROM_CART_FAIL,

    CART_CLEAR_ITEMS_REQUEST,
    CART_CLEAR_ITEMS_SUCCESS,
    CART_CLEAR_ITEMS_FAIL,


    WAS_CLICKED_RESET,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD,
} from '../constants/cartConstants';


// cart reducer with quantity

export const cartReducer = (state = {cartItems: []}, action) => {
    let was_clicked = false;
    switch (action.type) {

        case GET_CART_REQUEST:
            return {
                ...state,
                loading: true,
                was_clicked: false,
                cartItems: [] 
            }

        case GET_CART_SUCCESS:
            return {
                ...state,
                loading: false,
                was_clicked:true,
                cartItems: action.payload
            }

        case GET_CART_FAIL:
            return {
                loading: false,
                was_clicked: false,
                error: action.payload || true
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
                was_clicked: false,
                error: action.payload,
            };

            
        case REMOVE_FROM_CART_REQUEST:
            return {
                ...state,
                was_clicked: false,
                loading: true,
            };

        case REMOVE_FROM_CART_SUCCESS:
            return {
                loading: false,
                was_clicked: false,
                cartItems: action.payload,
            };

        case REMOVE_FROM_CART_FAIL:
            return {
                loading: false,
                error: action.payload,
            };

        case CART_CLEAR_ITEMS_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case CART_CLEAR_ITEMS_SUCCESS:
            return {
                loading: false,
                success: true,
                cartItems: action.payload,
            };

        case CART_CLEAR_ITEMS_FAIL:
            return {
                loading: false,
                error: action.payload,
            };

        case WAS_CLICKED_RESET:
            return {
                ...state,
                was_clicked: false
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