import React, { useEffect } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'

import { addToCart, removeFromCart } from '../actions/cartActions'
import { useParams } from 'react-router-dom'

function CartScreen() {

    const navigate = useNavigate()

    const cart = useSelector(state => state.cart)
    const { cartItems } = cart
    
    const dispatch = useDispatch()

    const addToCartHandler = (id, qty) => {
        dispatch(addToCart(id, qty))
    }

    const checkoutHandler = () => {
        navigate('/shipping')
    }

    const removeFromCartHandler = (id, size) => {
        dispatch(removeFromCart(id, size))
    }
    

console.log('cartItems',cartItems)

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length <= 0 ? (
                    <p className='mt-5'>
                        Your cart is empty <Link to='/'>Go Back</Link>
                    </p>
                ) : (
                    <ListGroup variant='flush'>
                        {cartItems.map(item => (
                            <ListGroup.Item className='my-2' key={item.product + item.size}>
                                <Row>
                                    <Col className="col-4" md={2}>
                                        <Image style={{aspectRatio:'1/1', objectFit:'cover',}} src={`http://127.0.0.1:8000${item.image}`} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col className="col-8" md={3}>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                        {
                                            item.color ?
                                            <>
                                            <p className='mt-2'>Color: {item.color}</p>
                                            <p className='mt-2'>Size: {item.size}</p>
                                            </>

                                            : null
                                        }
                                        <p className='mt-2'>Size: {item.size}</p>
                                        
                                    </Col>
                                    
                                    <Col className="text-center col-12 my-3" md={2}><span>${item.price}</span></Col>
                                    <Col className="col-6" md={2}>
                                        <Form.Control
                                            as='select'
                                            value={item.qty}
                                            onChange={(e) =>
                                                dispatch(
                                                    addToCart(item.product, Number(e.target.value), item.size, item.countInStock)
                                                )}
                                        >
                                            {[...Array(item.countInStock).keys()].map((x) => (
                                                <option className='text-center' key={item.size + x} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                    <Col className="col-6" md={2}>
                                        <Button
                                            className='col-12'
                                            type='button'
                                            variant='light'
                                            onClick={() => removeFromCartHandler(item.product, item.size)}
                                        >
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>
                                Subtotal ({cartItems.reduce((acc, item) => acc + Number(item.qty), 0)})
                                items   
                            </h2>   
                            ${cartItems 
                                .reduce((acc, item) => acc + Number(item.qty) * item.price, 0)  
                                .toFixed(2)}    
                        </ListGroup.Item>   
                        <ListGroup.Item>    
                            <Button
                                type='button'
                                className='btn-block'   
                                disabled={cartItems.length === 0}   
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