import React, { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'

import { addToCart, removeFromCart, getCart } from '../actions/cartActions'
import { useParams } from 'react-router-dom'
import BASE_URL from '../../constants'

function CartScreen() {

    const navigate = useNavigate()

    const [isOutOfStock, setIsOutOfStock] = useState(false)

    const cart = useSelector(state => state.cart)
    const { cartItems, loading, error, success } = cart

    const dispatch = useDispatch()

    const checkoutHandler = () => {
        if (error) {
            navigate('/login?redirect=shipping')
        } else {
            navigate('/shipping')
        }
    }

    const removeFromCartHandler = (cartItemId) => {
        dispatch(removeFromCart(cartItemId))
    }

    useEffect(() => {
        dispatch(getCart())
    }, [dispatch])

    useEffect(() => {
        if (cartItems) {
            // if at least one item is out of stock, show the message or is_active = false
            setIsOutOfStock(cartItems.some(item => item.qty > item.stock || item.product.is_active === false))
            console.log(cartItems)
        }
    }, [cartItems, loading, error, success, dispatch, navigate])


    const addToCartHandler = (id, qty, size, color) => {
        dispatch(addToCart(id, qty, size, color))
    }



    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems && cartItems.length > 0 ? (
                    <ListGroup variant='flush'>
                        {cartItems.map(item => (

                            <ListGroup.Item className='my-2' key={item.product.id + item.size}>

                                <Row>
                                    <Col className="col-4" md={2}>
                                        <Link to={`/product/${item.product.id}`}>
                                        <Image style={{ aspectRatio: '1/1', objectFit: 'cover', }} src={`${BASE_URL}${item.product.images[0]?.image}`} alt={item.product.name} fluid rounded />
                                        </Link>
                                    </Col>
                                    <Col className="col-8" md={3}>
                                        <Link to={`/product/${item.product.id}`}>
                                            {/* if name > 15 lengh cut it and add ... */}
                                            {item.product.name.length > 14 ? item.product.name.slice(0, 14) + '...' : item.product.name}
                                        </Link>
                                        <p className='mt-2'>Size: {item.size}</p>
                                        <p className='mt-2'>Color: {item.color}</p>
                                        {
                                            item.stock <= 0 || item.product.is_active === false
                                            ? <>
                                            <p className='text-danger'>Out of stock</p>
                                            </>
                                            : null
                                        }
                                    </Col>

                                    <Col className="text-center col-12 my-3" md={2}><span>${item.product.price}</span></Col>
                                    <Col className="col-6" md={2}>
                                        <Form.Control
                                            as='select'
                                            value={item.qty}
                                            className='text-center'
                                            // onChange={(e) => addToCartHandler(item.product.id, Number(e.target.value), item.size)}>
                                            onChange={(e) => addToCartHandler(item.product.id, Number(e.target.value), item.size, item.color)}>
                                            {
                                                item.stock <= 0 ?
                                                    <option value={0}>0</option>
                                                    :
                                                    [...Array(item.stock).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    ))
                                            }
                                        </Form.Control>
                                    </Col>
                                    <Col className="col-6" md={2}>
                                        <Button
                                            className='col-12'
                                            type='button'
                                            variant='light'
                                            onClick={() => removeFromCartHandler(item.id)}
                                        >
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <p className='mt-5'>
                        Your cart is empty <Link to='/'>Go Back</Link>
                    </p>
                )}
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>
                                Subtotal ({cartItems?.reduce((acc, item) => acc + Number(item.qty), 0)})
                                items
                            </h2>
                            $ {cartItems?.reduce((acc, item) => acc + item.qty * item.product.price, 0).toFixed(2)}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button
                                type='button'
                                className='btn-block'
                                disabled={isOutOfStock || error || !cartItems || cartItems.length === 0 }
                                onClick={checkoutHandler}
                            >
                                Proceed To Checkout
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                    {
                        isOutOfStock ? <p className='text-danger text-center mt-3'>Some items are out of stock</p> : null
                    }
                </Card>
            </Col>
        </Row>



    )
}

export default CartScreen