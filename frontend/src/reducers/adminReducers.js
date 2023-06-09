import {
    TICKER_MESSAGE_REQUEST,
    TICKER_MESSAGE_SUCCESS,
    TICKER_MESSAGE_FAIL,
} from '../constants/adminConstants.js';

export const tickerMessageReducer = (state = { tickerMessage: [] }, action) => {

    switch (action.type) {
        case TICKER_MESSAGE_REQUEST:
            return {
                ...state,
                loading: true,
                tickerMessage: []
            }

        case TICKER_MESSAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                tickerMessage: action.payload?.message
            }

        case TICKER_MESSAGE_FAIL:
            return {
                loading: false,
                error: action.payload || true
            }

        default:
            return state
    }
}