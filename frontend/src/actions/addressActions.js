import BASE_URL from "../../constants";

import axios from "axios";
import {
    ADDRESS_GET_REQUEST,
    ADDRESS_GET_SUCCESS,
    ADDRESS_GET_FAIL,

    ADDRESS_CREATE_REQUEST,
    ADDRESS_CREATE_SUCCESS,
    ADDRESS_CREATE_FAIL,
} from "../constants/addressConstants";

export const getAddress = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ADDRESS_GET_REQUEST,
        });

        const {
            login: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        // const { data } = await axios.get(`http://localhost:8000/api/address/`, config);
        const { data } = await axios.get(`${BASE_URL}/api/address/`, config);

        dispatch({
            type: ADDRESS_GET_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: ADDRESS_GET_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}

export const createAddress = (address) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ADDRESS_CREATE_REQUEST,
        });

        const {
            login: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        // const { data } = await axios.post(`http://localhost:8000/api/address/create/`, address, config);
        const { data } = await axios.post(`${BASE_URL}/api/address/create/`, address, config);

        dispatch({
            type: ADDRESS_CREATE_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: ADDRESS_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}