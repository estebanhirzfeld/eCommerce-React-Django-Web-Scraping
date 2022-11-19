import {
    ORDER_CREATE_FAIL,
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_RESET,
    ORDER_CREATE_PAYMENT_MP,

    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,

    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,

    ORDERS_LIST_REQUEST,
    ORDERS_LIST_SUCCESS,
    ORDERS_LIST_FAIL,
    ORDERS_LIST_RESET,

    ORDERS_ALL_LIST_REQUEST,
    ORDERS_ALL_LIST_SUCCESS,
    ORDERS_ALL_LIST_FAIL,

    
    ORDER_USER_LIST_REQUEST,
    ORDER_USER_LIST_FAIL,
    ORDER_USER_LIST_SUCCESS,

    ORDER_UPDATE_PAID_REQUEST,
    ORDER_UPDATE_PAID_SUCCESS,
    ORDER_UPDATE_PAID_FAIL,

    ORDER_UPDATE_DELIVERED_REQUEST,
    ORDER_UPDATE_DELIVERED_SUCCESS,
    ORDER_UPDATE_DELIVERED_FAIL,


} from "../constants/orderConstants";


export const orderCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_CREATE_REQUEST:
            return {
                loading: true,
            };
        case ORDER_CREATE_SUCCESS:
            return {
                loading: false,
                success: true,
                order: action.payload,
            };
        case ORDER_CREATE_FAIL:
            return {
                loading: false,
                error: action.payload,
            };

        case ORDER_CREATE_RESET:
            return {};

        case ORDER_CREATE_PAYMENT_MP:
            return {
                ...state,
                orderLink: action.payload,
            };
            
        default:
            return state;
    }
}

export const orderDetailsReducer = (state = { loading: true, orderItems: [], shippingAddress: {} }, action) => {
    switch (action.type) {
        case ORDER_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case ORDER_DETAILS_SUCCESS:
            return {
                loading: false,
                order: action.payload,
            };
        case ORDER_DETAILS_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}

export const orderPayReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_PAY_REQUEST:
            return {
                loading: true,
            };
        case ORDER_PAY_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                paymentLink: action.payload.init_point,
            };
        case ORDER_PAY_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}

export const ordersListReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case ORDERS_LIST_REQUEST:
            return {
                loading: true,
            };
        case ORDERS_LIST_SUCCESS:
            return {
                loading: false,
                orders: action.payload,
            };
        case ORDERS_LIST_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case ORDERS_LIST_RESET:
            return {
                orders: [],
            };
        default:
            return state;
    }
}

export const ordersListAdminReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case ORDERS_ALL_LIST_REQUEST:
            return {
                loading: true,
            };
        case ORDERS_ALL_LIST_SUCCESS:
            return {
                loading: false,
                success: true,
                orders: action.payload,
            };
        case ORDERS_ALL_LIST_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}

export const orderUserListReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case ORDER_USER_LIST_REQUEST:
            return {
                loading: true,
            };
        case ORDER_USER_LIST_SUCCESS:
            return {
                loading: false,
                orders: action.payload,
            };
        case ORDER_USER_LIST_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}

export const orderUpdatePaidReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_UPDATE_PAID_REQUEST:
            return {
                loading: true,
            };
        case ORDER_UPDATE_PAID_SUCCESS:
            return {
                loading: false,
                success: true,
            };
        case ORDER_UPDATE_PAID_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}


export const orderUpdateDeliveredReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_UPDATE_DELIVERED_REQUEST:
            return {
                loading: true,
            };
        case ORDER_UPDATE_DELIVERED_SUCCESS:
            return {
                loading: false,
                success: true,
            };
        case ORDER_UPDATE_DELIVERED_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}