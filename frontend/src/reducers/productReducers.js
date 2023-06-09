import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,

    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_RESET,

    PRODUCT_RECOMMEND_REQUEST,
    PRODUCT_RECOMMEND_SUCCESS,
    PRODUCT_RECOMMEND_FAIL,

    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,

    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL,
    PRODUCT_CREATE_RESET,

    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,
    PRODUCT_UPDATE_RESET,

    PRODUCT_IMAGE_DELETE_REQUEST,
    PRODUCT_IMAGE_DELETE_SUCCESS,
    PRODUCT_IMAGE_DELETE_FAIL,

    PRODUCT_CREATE_REVIEW_REQUEST,
    PRODUCT_CREATE_REVIEW_SUCCESS,
    PRODUCT_CREATE_REVIEW_FAIL,
    PRODUCT_CREATE_REVIEW_RESET,

    PRODUCT_NOTIFY_REQUEST,
    PRODUCT_NOTIFY_SUCCESS,
    PRODUCT_NOTIFY_FAIL,
    PRODUCT_NOTIFY_RESET,


} from "../constants/productConstants";

export const productListReducers = (state = { products: [] }, action) => {

    switch (action.type) {
        case PRODUCT_LIST_REQUEST:
            return { loading: true, products: [] }

        case PRODUCT_LIST_SUCCESS:
            return {
                loading: false,
                products: action.payload.products,
                pages: action.payload.pages,
                page: action.payload.page,
                colors_list: action.payload.colors_list,
                min_price: action.payload.min_price,
                max_price: action.payload.max_price,
                categories: action.payload.categories,
            }

        case PRODUCT_LIST_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const productDetailsReducers = (state = { product: { reviews: [] } }, action) => {

    switch (action.type) {
        case PRODUCT_DETAILS_REQUEST:
            return {
                loading: true,
                ...state 
            }

        case PRODUCT_DETAILS_SUCCESS:
            return {
                loading: false,
                success: true,
                product: action.payload 
            }

        case PRODUCT_DETAILS_FAIL:
            return {
                loading: false,
                error: action.payload 
            }

        case PRODUCT_DETAILS_RESET:
            return {}

        default:
            return state
    }
}

export const productRecommendReducers = (state = { products: [] }, action) => {

    switch (action.type) {
        case PRODUCT_RECOMMEND_REQUEST:
            return { loading: true, products: [] }

        case PRODUCT_RECOMMEND_SUCCESS:
            return {
                loading: false,
                products: action.payload
            }

        case PRODUCT_RECOMMEND_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}


export const productDeleteReducers = (state = {}, action) => {

    switch (action.type) {
        case PRODUCT_DELETE_REQUEST:
            return { loading: true }

        case PRODUCT_DELETE_SUCCESS:
            return { loading: false, success: true }

        case PRODUCT_DELETE_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}


export const productCreateReducers = (state = {}, action) => {

    switch (action.type) {
        case PRODUCT_CREATE_REQUEST:
            return { loading: true }

        case PRODUCT_CREATE_SUCCESS:
            return { loading: false, success: true, product: action.payload }

        case PRODUCT_CREATE_FAIL:
            return { loading: false, error: action.payload }

        case PRODUCT_CREATE_RESET:
            return {}


        default:
            return state
    }
}


export const productUpdateReducers = (state = { product: {} }, action) => {

    switch (action.type) {
        case PRODUCT_UPDATE_REQUEST:
            return { loading: true }

        case PRODUCT_UPDATE_SUCCESS:
            return { loading: false, success: true, product: action.payload }

        case PRODUCT_UPDATE_FAIL:
            return { loading: false, error: action.payload }

        case PRODUCT_UPDATE_RESET:
            return { product: {} }
        default:
            return state
    }
}

export const productImageDeleteReducers = (state = {}, action) => {
    switch (action.type) {
        case PRODUCT_IMAGE_DELETE_REQUEST:
            return { loading: true }

        case PRODUCT_IMAGE_DELETE_SUCCESS:
            return { loading: false, success: true }

        case PRODUCT_IMAGE_DELETE_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const productCreateReviewReducers = (state = {}, action) => {

    switch (action.type) {
        case PRODUCT_CREATE_REVIEW_REQUEST:
            return { loading: true }

        case PRODUCT_CREATE_REVIEW_SUCCESS:
            return { loading: false, success: true }

        case PRODUCT_CREATE_REVIEW_FAIL:
            return { loading: false, error: action.payload }

        case PRODUCT_CREATE_REVIEW_RESET:
            return {}
        default:
            return state
    }
}

export const productNotifyReducers = (state = {}, action) => {
    
        switch (action.type) {
            case PRODUCT_NOTIFY_REQUEST:
                return { loading: true }
    
            case PRODUCT_NOTIFY_SUCCESS:
                return { loading: false, success: true }
    
            case PRODUCT_NOTIFY_FAIL:
                return { loading: false, error: action.payload }
    
            case PRODUCT_NOTIFY_RESET:
                return {}
                
            default:
                return state
        }
    }