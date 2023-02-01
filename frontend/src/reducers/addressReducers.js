import {
    ADDRESS_GET_REQUEST,
    ADDRESS_GET_SUCCESS,
    ADDRESS_GET_FAIL,

    ADDRESS_CREATE_REQUEST,
    ADDRESS_CREATE_SUCCESS,
    ADDRESS_CREATE_FAIL,
    ADDRESS_CREATE_RESET,
} from '../constants/addressConstants';

export const addressReducer = (state = {shippingAddresses: []}, action) => {
    switch (action.type) {
        case ADDRESS_GET_REQUEST:
            return {
                loading: true,
                shippingAddresses: []
            }
        case ADDRESS_GET_SUCCESS:
            return {
                loading: false,
                shippingAddresses: action.payload
            }
        case ADDRESS_GET_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}

export const addressCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case ADDRESS_CREATE_REQUEST:
            return {
                loading: true,
            }
        case ADDRESS_CREATE_SUCCESS:
            return {
                loading: false,
                success: true,
                address: action.payload
            }
        case ADDRESS_CREATE_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        case ADDRESS_CREATE_RESET:
            return {}
        default:
            return state
    }
}