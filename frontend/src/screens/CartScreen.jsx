import React, { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'

import { addToCart, removeFromCart, getCart } from '../actions/cartActions'
import { useParams } from 'react-router-dom'

function CartScreen() {

    const navigate = useNavigate()

    const [isOutOfStock, setIsOutOfStock] = useState(false)

    const cart = useSelector(state => state.cart)
    const { cartItems, loading } = cart

    const dispatch = useDispatch()

    const checkoutHandler = () => {
        navigate('/shipping')
    }

    const removeFromCartHandler = (id, size) => {
        dispatch(removeFromCart(id, size))
    }

    useEffect(() => {
        dispatch(getCart())

        // if one of the items in the cart is out of stock, set isOutOfStock to true
        cartItems.forEach(item => {
            if (item.stock === 0) {
                setIsOutOfStock(true)
            }
        })

    }, [dispatch])

    const addToCartHandler = (id, qty, size) => {
        dispatch(addToCart(id, qty, size))
    }



    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems ? (
                    <ListGroup variant='flush'>
                        {cartItems.map(item => (

                            <ListGroup.Item className='my-2' key={item.product.id + item.size}>
                                
                                <Row>
                                    <Col className="col-4" md={2}>
                                        <Image style={{ aspectRatio: '1/1', objectFit: 'cover', }} src={`http://127.0.0.1:8000${item.product.image}`} alt={item.product.name} fluid rounded />
                                    </Col>
                                    <Col className="col-8" md={3}>
                                        <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                                        <p className='mt-2'>Size: {item.size}</p>
                                        {
                                            item.stock === 0 ? <p className='text-danger'>Out of stock</p> : null
                                        }
                                    </Col>

                                    <Col className="text-center col-12 my-3" md={2}><span>${item.product.price}</span></Col>
                                    <Col className="col-6" md={2}>
                                        <Form.Control
                                            as='select'
                                            value={item.qty}
                                            className='text-center'
                                            onChange={(e) => addToCartHandler(item.product.id, Number(e.target.value), item.size)}>
                                            {

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
                                        // onClick={() => removeFromCartHandler(item.product, item.size)}
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
                                disabled={isOutOfStock}
                                onClick={checkoutHandler}
                            >
                                Proceed To Checkout
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>



    )
}

export default CartScreen