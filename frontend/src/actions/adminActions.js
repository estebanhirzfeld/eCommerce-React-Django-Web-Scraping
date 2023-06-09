import BASE_URL from '../../constants';
import axios from 'axios';
import {
    TICKER_MESSAGE_REQUEST,
    TICKER_MESSAGE_SUCCESS,
    TICKER_MESSAGE_FAIL
} from '../constants/adminConstants.js';

export const getTickerMessage = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: TICKER_MESSAGE_REQUEST,
        });

        const { data } = await axios.get(`${BASE_URL}/api/ticker/`);

        dispatch({
            type: TICKER_MESSAGE_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: TICKER_MESSAGE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}


