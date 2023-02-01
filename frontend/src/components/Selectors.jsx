import React, { useState, useEffect } from 'react';
import Selector from './Selector';
import { Row, Col, Button, ListGroup } from 'react-bootstrap'

function Selectors({ colors, id, addToCartHandler, addToWishlistHandler, was_added }) {

    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [qty, setQty] = useState(1);

    useEffect(() => {
        const initialColor = colors && Object.keys(colors).length > 0 ? Object.keys(colors)[0] : 'No color available';
        setColor(initialColor);
        const initialSize = colors && Object.keys(colors).length > 0 && colors[initialColor] && Object.keys(colors[initialColor]).length > 0 ? Object.keys(colors[initialColor])[0] : 'No size available';
        setSize(initialSize);
        const initialQty = colors && Object.keys(colors).length > 0 && colors[initialColor] && colors[initialColor][initialSize] ? 1 : 0;
        setQty(initialQty);
    }, [colors])

    return (
        <ListGroup.Item className='text-center'>
            <Row className='justify-content-center align-items-center' >
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
                            handleChange={(e) => {
                                setSize(e.target.value);
                                if (colors[color][e.target.value] === 0) {
                                    setQty(1);
                                }
                            }}
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
            </Row>

            <Row className='justify-content-around align-items-center'>

                <Button
                    className='mt-3 col-3 col-md-12 col-lg-3 btn-block'
                    type='button'
                    onClick={() => addToWishlistHandler(id)}
                >
                    <i className="fa-solid fa-heart"
                        style={{ color: was_added ? 'red' : 'black' }}
                    ></i>
                </Button>
                <Button
                    // onClick={() => addToCartHandler(id, qty, size, color)}
                    onClick={() => addToCartHandler(id, qty, size, color)}
                    className='mt-3 col-8 col-md-12 col-lg-8 btn-block'
                    type='button'
                    disabled={
                        colors[color] && colors[color][size] === 0
                    }
                >
                    Add to Cart
                </Button>
            </Row>

        </ListGroup.Item >
    )
}

export default Selectors