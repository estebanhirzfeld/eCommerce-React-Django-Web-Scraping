import BASE_URL from '../../constants';

import axios from 'axios';

import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,

    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,

    PRODUCT_RECOMMEND_REQUEST,
    PRODUCT_RECOMMEND_SUCCESS,
    PRODUCT_RECOMMEND_FAIL,

    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,

    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL,

    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,

    PRODUCT_IMAGE_DELETE_REQUEST,
    PRODUCT_IMAGE_DELETE_SUCCESS,
    PRODUCT_IMAGE_DELETE_FAIL,

    PRODUCT_CREATE_REVIEW_REQUEST,
    PRODUCT_CREATE_REVIEW_SUCCESS,
    PRODUCT_CREATE_REVIEW_FAIL,

    PRODUCT_NOTIFY_REQUEST,
    PRODUCT_NOTIFY_SUCCESS,
    PRODUCT_NOTIFY_FAIL,



} from "../constants/productConstants";

import { WAS_CLICKED_RESET } from "../constants/cartConstants";


// export const listProducts = (keyword = '', pageNumber = 1, category = '', subcategory = '') => async (dispatch) => {
// export const listProducts = (keyword = '', pageNumber = 1, category = '', subcategory = '', priceFrom = '', priceTo = '', sortBy = '') => async (dispatch) => {
export const listProducts = (keyword = '', pageNumber = 1, category = '', subcategory = '', priceFrom = '', priceTo = '', sortBy = '', color = '') => async (dispatch) => {

    try {
        dispatch({ type: PRODUCT_LIST_REQUEST });

        const { data } = await axios.get(`${BASE_URL}/api/products?keyword=${keyword}&page=${pageNumber}&category=${category}&subcategory=${subcategory}&priceFrom=${priceFrom}&priceTo=${priceTo}&sortBy=${sortBy}&color=${color}`);

        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: PRODUCT_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        });
    }

}

export const listProductDetails = (id) => async (dispatch) => {

    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });


        const { data } = await axios.get(`${BASE_URL}/api/products/${id}`);

        dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });

        dispatch({ type: WAS_CLICKED_RESET });

    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        });
    }

}

export const listProductRecommendations = (id) => async (dispatch) => {
    
    try {
        dispatch({ type: PRODUCT_RECOMMEND_REQUEST });

        const { data } = await axios.get(`${BASE_URL}/api/products/recommendations/${id}`);

        dispatch({ type: PRODUCT_RECOMMEND_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: PRODUCT_RECOMMEND_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        });
    }

}


export const deleteProduct = (id) => async (dispatch, getState) => {

    try {
        dispatch({ type: PRODUCT_DELETE_REQUEST });

        const { login: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }


        await axios.delete(`${BASE_URL}/api/products/delete/${id}`, config);

        dispatch({ type: PRODUCT_DELETE_SUCCESS });

    } catch (error) {
        dispatch({
            type: PRODUCT_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        });
    }

}

export const createProduct = () => async (dispatch, getState) => {

    try {
        dispatch({ type: PRODUCT_CREATE_REQUEST });

        const { login: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }


        const { data } = await axios.post(`${BASE_URL}/api/products/create/`, {}, config);

        dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: PRODUCT_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        });
    }

}

export const updateProduct = (product) => async (dispatch, getState) => {

    try {
        dispatch({ type: PRODUCT_UPDATE_REQUEST });

        const { login: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }


        const { data } = await axios.put(`${BASE_URL}/api/products/update/${product.id}/`, product, config);

        dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });

        dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: PRODUCT_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        });
    }

}

export const deleteProductImage = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_IMAGE_DELETE_REQUEST });

        const { login: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`
            }
        }


        const { data } = await axios.delete(`${BASE_URL}/api/products/image/delete/${id}/`, config);

        dispatch({ type: PRODUCT_IMAGE_DELETE_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: PRODUCT_IMAGE_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        });
    }
}

export const createProductReview = (productId, review) => async (dispatch, getState) => {

    try {
        dispatch({ type: PRODUCT_CREATE_REVIEW_REQUEST });

        const { login: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }


        const { data } = await axios.post(`${BASE_URL}/api/products/review/${productId}/`, review, config);

        dispatch({
            type: PRODUCT_CREATE_REVIEW_SUCCESS,
            payload: data
        });


    } catch (error) {
        dispatch({
            type: PRODUCT_CREATE_REVIEW_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        });
    }

}

export const notifyProduct = (productId, color, size, email='') => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_NOTIFY_REQUEST });

        const { login: { userInfo } } = getState();

        if (userInfo) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                }
            }

            const { data } = await axios.post(`${BASE_URL}/api/products/notify/${productId}/`, { color, size, email }, config);

            dispatch({
                type: PRODUCT_NOTIFY_SUCCESS,
                payload: data
            });
        } else {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            }

            const { data } = await axios.post(`${BASE_URL}/api/products/notify/${productId}/`, { color, size, email }, config);

            dispatch({
                type: PRODUCT_NOTIFY_SUCCESS,
                payload: data
            });
        }

    } catch (error) {
        dispatch({
            type: PRODUCT_NOTIFY_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        });
    }
}

