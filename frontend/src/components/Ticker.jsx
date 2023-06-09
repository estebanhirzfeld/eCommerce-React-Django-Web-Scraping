import React, { useState, useEffect } from 'react';
import './styles/Ticker.css';

// import redux state
import { useSelector, useDispatch } from 'react-redux';
// import actions
import { getTickerMessage } from '../actions/adminActions'



const Ticker = () => {
    const [showTicker, setShowTicker] = useState(true);

    const dispatch = useDispatch();

    const tickerMessage = useSelector((state) => state.tickerMessage);
    const {loading, tickerMessage : message, success, error } = tickerMessage;

    useEffect(() => {
        dispatch(getTickerMessage());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            setShowTicker(true);
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            setShowTicker(false);
        }
    }, [error]);

    return (
        <>
            {showTicker && (
                <div className="ticker">
                    {/* <span className="ticker-text">All products have a discount of 50%! Shop now!</span> */}
                    <span className="ticker-text">
                        {loading ? 'Loading...' : message}
                    </span>
                </div>
            )}
        </>
    );
};

export default Ticker;
