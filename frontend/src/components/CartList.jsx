import BASE_URL from '../../constants'

import React, { useEffect } from 'react'
import { Card, Col, Row, ListGroup, Image, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import {getCart} from '../actions/cartActions'

import './styles/CartList.css'

import { addToCart } from '../actions/cartActions'
import { Link } from 'react-router-dom'

function CartList() {

    const dispatch = useDispatch()

    const addToCartHandler = (id, qty, size) => {
        getCart()
        dispatch(addToCart(id, qty, size))
    }
    const cart = useSelector(state => state.cart)
    const { cartItems, loading, error } = cart

    console.log(cartItems)


    // let stock = cartItems[1].product.sizes.find(size => size.size === 'M').stock
    // console.log(stock)

    return (
        <>
            <Card className='mb-4 listCard removeArrows'>
                {
                    cartItems?.map((item, index) => (
                        <ListGroup key={index} variant='flush'>
                            <ListGroup.Item className=''>
                                <Row className='text-center justify-content-center align-items-center'>
                                    <Col lg={5}><Image style={{ objectFit: 'cover', height: '100px', width: '100px' }} src={`${BASE_URL}${item.product.images[0]?.image}`} alt={item.product?.name} fluid /></Col>
                                    <Col lg={7}>
                                        <Link to={`/product/${item.product?.id}`}>{item.product?.name} ({item.size})</Link>
                                        </Col>
                                    
                                    <Col>
                                        <Row className='justify-content-start align-items-center' >
                                            <Col lg={5}><span>Quantity:</span></Col>
                                            <Col lg={7}>
                                                <Form.Control
                                                    as='select'
                                                    className='text-center'
                                                    value={item.qty}
                                                    onChange={(e) => addToCartHandler(item.product?.id, Number(e.target.value), item.size)}>
                                                    {

                                                        [...Array(item.stock).keys()].map((x) => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))
                                                        
                                                    }
                                                </Form.Control>

                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                    ))}
            </Card>
            <Link to={'/cart'} className=" col-12 btn-block btn btn-primary">View in Cart <i className="fas fa-shopping-cart"></i></Link>
        </>
    )
}

export default CartList