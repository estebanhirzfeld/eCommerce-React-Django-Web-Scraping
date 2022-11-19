import {
    GET_WISHLIST_REQUEST,
    GET_WISHLIST_SUCCESS,
    GET_WISHLIST_FAIL,

    ADD_TO_WISHLIST_REQUEST,
    ADD_TO_WISHLIST_SUCCESS,
    ADD_TO_WISHLIST_FAIL,

    REMOVE_FROM_WISHLIST_REQUEST,
    REMOVE_FROM_WISHLIST_SUCCESS,
    REMOVE_FROM_WISHLIST_FAIL,

    GET_SAVE_FOR_LATER_REQUEST,
    GET_SAVE_FOR_LATER_SUCCESS,
    GET_SAVE_FOR_LATER_FAIL,

    ADD_TO_SAVE_FOR_LATER_REQUEST,
    ADD_TO_SAVE_FOR_LATER_SUCCESS,
    ADD_TO_SAVE_FOR_LATER_FAIL,

    REMOVE_FROM_SAVE_FOR_LATER_REQUEST,
    REMOVE_FROM_SAVE_FOR_LATER_SUCCESS,
    REMOVE_FROM_SAVE_FOR_LATER_FAIL,

} from '../constants/listsConstants'

export const wishlistReducer = (state = { wishlistItems: [] }, action) => {
    switch (action.type) {
        case GET_WISHLIST_REQUEST:
            return {
                ...state,
                loading: true,
                wishlistItems: []
            }

        case GET_WISHLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                wishlistItems: action.payload
            }

        case GET_WISHLIST_FAIL:
            return {
                loading: false,
                error: action.payload || true
            }

        case ADD_TO_WISHLIST_REQUEST:
            return {
                loading: true,
                wishlistItems: []
            };

        case ADD_TO_WISHLIST_SUCCESS:
            return {
                loading: false,
                wishlistItems: action.payload,
            };

        case ADD_TO_WISHLIST_FAIL:
            return {
                loading: false,
                error: action.payload,
            };

        case REMOVE_FROM_WISHLIST_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case REMOVE_FROM_WISHLIST_SUCCESS:
            return {
                loading: false,
                success: true,
                wishlistItems: action.payload,
            };

        case REMOVE_FROM_WISHLIST_FAIL:
            return {
                loading: false,
                error: action.payload,
            };

        default:
            return state
    }

}

export const saveForLaterReducer = (state = { saveForLaterItems: [] }, action) => {
    switch (action.type) {
        case GET_SAVE_FOR_LATER_REQUEST:
            return {
                ...state,
                loading: true,
                saveForLaterItems: []
            }

        case GET_SAVE_FOR_LATER_SUCCESS:
            return {
                ...state,
                loading: false,
                saveForLaterItems: action.payload
            }

        case GET_SAVE_FOR_LATER_FAIL:
            return {
                loading: false,
                error: action.payload || true
            }

        case ADD_TO_SAVE_FOR_LATER_REQUEST:
            return {
                loading: true,
                saveForLaterItems: []
            };

        case ADD_TO_SAVE_FOR_LATER_SUCCESS:
            return {
                loading: false,
                saveForLaterItems: action.payload,
            };

        case ADD_TO_SAVE_FOR_LATER_FAIL:
            return {
                loading: false,
                error: action.payload,
            };

        case REMOVE_FROM_SAVE_FOR_LATER_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case REMOVE_FROM_SAVE_FOR_LATER_SUCCESS:
            return {
                loading: false,
                saveForLaterItems: action.payload,
            };

        case REMOVE_FROM_SAVE_FOR_LATER_FAIL:
            return {
                loading: false,
                error: action.payload,
            };

        default:
            return state
    }

}










































