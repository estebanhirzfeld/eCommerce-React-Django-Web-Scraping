import BASE_URL from '../../constants.js';

import axios from 'axios';

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

export const getWishlist = () => async (dispatch, getState) => {
    
    try {
        dispatch({
            type: GET_WISHLIST_REQUEST
        })

        const { login: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        
        const { data } = await axios.get(`${BASE_URL}/api/lists/wishlist/`, config)

        dispatch({
            type: GET_WISHLIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: GET_WISHLIST_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.detail,
        })
    }
}

export const addToWishlist = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ADD_TO_WISHLIST_REQUEST
        })

        const { login: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        
        const { data } = await axios.post(`${BASE_URL}/api/lists/wishlist/add/${id}/`, {}, config)


        dispatch({
            type: ADD_TO_WISHLIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ADD_TO_WISHLIST_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.detail,
        })
    }
}

export const removeFromWishlist = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: REMOVE_FROM_WISHLIST_REQUEST
        })

        const { login: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        
        const { data } = await axios.delete(`${BASE_URL}/api/lists/wishlist/remove/${id}/`, config)

        dispatch({
            type: REMOVE_FROM_WISHLIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: REMOVE_FROM_WISHLIST_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.detail,
        })
    }
}

// Save for later
export const getSaveForLater = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: GET_SAVE_FOR_LATER_REQUEST
        })

        const { login: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        
        const { data } = await axios.get(`${BASE_URL}/api/lists/forlater/`, config)


        dispatch({
            type: GET_SAVE_FOR_LATER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: GET_SAVE_FOR_LATER_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.detail,
        })
    }
}

export const addToSaveForLater = (id, qty, size) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ADD_TO_SAVE_FOR_LATER_REQUEST
        })

        const { login: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        
        const { data } = await axios.post(`${BASE_URL}/api/lists/forlater/add/${id}/`, {
            size: size.toUpperCase(),
            qty: parseInt(qty)
        }, config)

        dispatch({
            type: ADD_TO_SAVE_FOR_LATER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ADD_TO_SAVE_FOR_LATER_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.detail,
        })
    }
}

export const removeFromSaveForLater = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: REMOVE_FROM_SAVE_FOR_LATER_REQUEST
        })

        const { login: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        
        const { data } = await axios.delete(`${BASE_URL}/api/lists/forlater/remove/${id}/`, config)

        dispatch({
            type: REMOVE_FROM_SAVE_FOR_LATER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: REMOVE_FROM_SAVE_FOR_LATER_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.detail,
        })
    }
}








