import React, { useState, useEffect } from 'react';
import Selector from './Selector';
import { Row, Col, Button, ListGroup, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { notifyProduct } from '../actions/productActions';
import { PRODUCT_NOTIFY_RESET } from '../constants/productConstants';

function Selectors({ colors, id, addToCartHandler, addToWishlistHandler, was_added, is_active }) {

    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [qty, setQty] = useState(1);
    const [email, setEmail] = useState('');

    const [reminder_btn, setReminderBtn] = useState(false);

    const login = useSelector(state => state.login);
    const { userInfo } = login;

    const productNotify = useSelector(state => state.productNotify);
    const { success, error } = productNotify;
    const dispatch = useDispatch();

    
    useEffect(() => {
        dispatch({ type: 'PRODUCT_NOTIFY_RESET' });
        const initialColor = colors && Object.keys(colors).length > 0 ? Object.keys(colors)[0] : 'No color available';
        setColor(initialColor);
        const initialSize = colors && Object.keys(colors).length > 0 && colors[initialColor] && Object.keys(colors[initialColor]).length > 0 ? Object.keys(colors[initialColor])[0] : 'No size available';
        setSize(initialSize);
        const initialQty = colors && Object.keys(colors).length > 0 && colors[initialColor] && colors[initialColor][initialSize] ? 1 : 0;
        setQty(initialQty);
    }, [colors, dispatch])


    const subscribeHandler = (e, id, color, size, email) => {
        e.preventDefault();

        if (!userInfo && email && reminder_btn) {
            dispatch(notifyProduct(id, color, size, email));
        }

        if (!userInfo) {
            setReminderBtn(!reminder_btn);
        } else {
            dispatch(notifyProduct(id, color, size));
        }
    }

    useEffect(() => {
        if(error || success) {
            setTimeout(() => {
                dispatch({ type: 'PRODUCT_NOTIFY_RESET' });
            }, 1000);
        }
    }, [error, dispatch, success])


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
                        colors[color][size] === 0 || is_active === false ? (
                            <Col>
                                {/* if reminder_btn was pressed and user is not logged in, show input for email */}
                                {reminder_btn && !userInfo ? (
                                    <Form className='mt-3 col-12' onSubmit={(e) => subscribeHandler(e, id, color, size, email)}>
                                        <Form.Group controlId='email'>
                                            <Row>
                                                <Col className='col-9 col-md-12 col-lg-9'>
                                                    <Form.Control
                                                        type='email'
                                                        placeholder='Enter email'
                                                        value={email}
                                                        required
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    ></Form.Control>
                                                </Col>
                                                <Col className='col-3 col-md-12 col-lg-3'>
                                                    <Button
                                                        className='col-12 btn-block bg-dark border'
                                                        type='submit'
                                                    >
                                                        <i className="fa-solid fa-paper-plane"></i>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                        <Button
                                            className='mt-3 col-12 btn-block'
                                            type='button'
                                            onClick={() => setReminderBtn(!reminder_btn)}
                                        >
                                            Cancel
                                        </Button>
                                    </Form>
                                ) : error ? (
                                    <Button className='mt-3 col-12 btn-block bg-danger'>
                                        {error || 'Invalid email'}
                                    </Button>
                                ) : success ? (
                                    <Button className='mt-3 col-12 btn-block bg-success'>
                                        You will be notified when the product is back in stock
                                    </Button>
                                ) : (
                                    <Button className='mt-3 col-12 btn-block' type='button' onClick={(e) => subscribeHandler(e, id, color, size, email)}>
                                        Send stock reminder <i className="fa-solid fa-bell"></i>
                                    </Button>
                                )}



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
                    className='mt-3 col-3 col-md-12 col-lg-3 btn-block border'
                    variant='light'
                    type='button'
                    onClick={() => addToWishlistHandler(id)}
                >
                    <i className="fa-solid fa-heart"
                        style={{ color: was_added ? 'red' : 'grey' }}
                    ></i>
                </Button>
                <Button
                    // onClick={() => addToCartHandler(id, qty, size, color)}
                    onClick={() => addToCartHandler(id, qty, size, color)}
                    className='mt-3 col-8 col-md-12 col-lg-8 btn-block'
                    type='button'
                    disabled={
                        colors[color] && colors[color][size] === 0 || is_active === false
                    }
                >
                    {
                        is_active === false ? 'Out of stock' : 'Add to Cart'
                    }
                </Button>
            </Row>

        </ListGroup.Item >
    )
}

export default Selectors