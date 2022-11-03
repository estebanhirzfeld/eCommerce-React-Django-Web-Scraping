import React, { useEffect } from 'react'
import { Card, Col, Row, ListGroup, Image, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import './styles/CartList.css'

import { addToCart } from '../actions/cartActions'
import { Link } from 'react-router-dom'

function CartList({ cartItems }, qty) {

    const dispatch = useDispatch()

    const addToCartHandler = (id, qty, size, countInStock) => {
        dispatch(addToCart(id, qty, size, countInStock))
    }


    return (
        <>
            <Card className='mb-4 listCard removeArrows'>
                {
                    cartItems.map((item, index) => (
                        <ListGroup key={index} variant='flush'>
                            <ListGroup.Item className=''>
                                <Row className='text-center justify-content-center align-items-center'>
                                    <Col lg={5}><Image style={{ objectFit: 'cover', height: '100px', width: '100px' }} src={`http://127.0.0.1:8000${item.image}`} alt={item.name} fluid /></Col>
                                    <Col lg={7}>
                                        <Link to={`/product/${item.product}`}>{item.name} ({item.size})</Link>
                                        </Col>
                                    
                                    <Col>
                                        <Row className='justify-content-start align-items-center' >
                                            <Col lg={5}><span>Quantity:</span></Col>
                                            <Col lg={7}>
                                                <Form.Control
                                                    as='select'
                                                    value={item.qty}
                                                    onChange={(e) => addToCartHandler(item.product, Number(e.target.value), item.size, item.countInStock)}>
                                                    {
                                                        [...Array(item.countInStock).keys()].map((x, index) => (
                                                            <option className='text-center' key={index} value={x + 1}>{x + 1}</option>
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
            {/* <Button className='w-100'></Button> */}
            <Link to={'/cart'} className=" col-12 btn-block btn btn-primary">View in Cart <i className="fas fa-shopping-cart"></i></Link>
        </>
    )
}

export default CartList