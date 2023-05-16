import React, { useState, useEffect } from 'react';
import './styles/Ticker.css';

const Ticker = () => {
    const [showTicker, setShowTicker] = useState(true);

    return (
        <>
            {showTicker && (
                <div className="ticker">
                    <span className="ticker-text">All products have a discount of 50%! Shop now!</span>
                </div>
            )}
        </>
    );
};

export default Ticker;
