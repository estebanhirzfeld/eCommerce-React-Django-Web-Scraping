import React, { useState, useEffect } from 'react';
import Selector from './Selector';
import { Col, Button } from 'react-bootstrap'

function Selectors({ colors }) {

    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [qty, setQty] = useState(0);

    useEffect(() => {
        const initialColor = colors && Object.keys(colors).length > 0 ? Object.keys(colors)[0] : 'No color available';
        setColor(initialColor);
        const initialSize = colors && Object.keys(colors).length > 0 && colors[initialColor] && Object.keys(colors[initialColor]).length > 0 ? Object.keys(colors[initialColor])[0] : 'No size available';
        setSize(initialSize);
        const initialQty = colors && Object.keys(colors).length > 0 && colors[initialColor] && colors[initialColor][initialSize] ? 1 : 'No qty available';
        setQty(initialQty);
    }, [colors])

    return (
        <>
            <Selector
                label="Color"
                options={Object.keys(colors)}
                handleChange={(e) => {
                    setColor(e.target.value);
                    if (Object.keys(colors[e.target.value]).length === 1) setSize(Object.keys(colors[e.target.value])[0]);
                }}
            />

            {
                color !== 'No color available' && colors[color] && (
                    <Selector
                        label="Size"
                        options={Object.keys(colors[color])}
                        handleChange={(e) => { setSize(e.target.value) }}
                    />
                )
            }


            {
                color !== 'No color available' && colors[color] && colors[color][size] !== undefined && (
                    colors[color][size] === 0 ? (
                        <Col>
                            <Button className='mt-3 col-12 btn-block ' type='button' disabled={true}>
                                Send stock reminder <i className="fa-solid fa-bell"></i>
                            </Button>
                        </Col>
                    ) : (
                        <Selector
                            label="Qty"
                            options={Array.from(Array(colors[color][size]).keys()).map(x => x + 1)}
                            handleChange={(e) => { setQty(e.target.value) }}
                        />
                    )
                )
            }

            <Button
                onClick={() => {
                    alert(`Color: ${color}, Size: ${size}, Qty: ${qty}`)
                }}
            />


        </>

    )
}

export default Selectors