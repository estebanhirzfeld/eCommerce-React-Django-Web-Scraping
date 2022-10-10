import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Container, Col, Row, Form, Button, Table, Image } from 'react-bootstrap'

import axios from "axios";

function ADMIN_ListOrdersScreen() {

    const [orders, setOrders] = useState([])

    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : null

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }

    const getOrders = async () => {
        const { data } = await axios.get(
            `http://localhost:8000/api/orders`,
            config
        );
        setOrders(data)
    }

    useEffect(() => {
        getOrders()
    }, [])

    console.log(orders)


    return (
        <Container className='mt-5'>
            <h1 className='my-5 text-center'>Orders</h1>

            <h2 className='text-center'>Total: {orders.length}</h2>

            <Row className='my-5 text-center'>
                <Col xs={4}>
                    <Link to={'/admin/orders/pending'}>
                        <span className='form-control w-25 m-auto mb-3'>
                            {orders.filter(order => order.status === 'Pending' || order.isDelivered === false).length}
                        </span>
                        <span>Pending</span>
                    </Link>
                </Col>
                <Col xs={4}>
                    <Link to={'/admin/orders/success'}>
                        <span className='form-control w-25 m-auto mb-3'>
                            {orders.filter(order => order.status === 'Paid' && order.isDelivered === true).length}
                        </span>
                        <span>Success</span>
                    </Link>
                </Col>
                <Col xs={4}>
                    <Link to={'/admin/orders/cancelled'}>
                        <span className='form-control w-25 m-auto mb-3'>
                            {orders.filter(order => order.status === 'Cancelled' || order.status === 'Expired').length}
                        </span>
                        <span>Cancelled</span>
                    </Link>
                </Col>
            </Row>




            <Row className='mt-5'>
                <Col xs={12} md={4}>
                    <iframe src={`https://maps.google.com/maps?&hl=en&q=Teniente Mario Agustin Del Castillo 1824&t=&z=14&ie=UTF8&iwloc=B&output=embed`} height="350" style={{ border: '0', width: '100%' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </Col>
                <Col xs={12} md={4}>
                    <iframe src={`https://maps.google.com/maps?&hl=en&q=Teniente Mario Agustin Del Castillo 1824&t=&z=14&ie=UTF8&iwloc=B&output=embed`} height="350" style={{ border: '0', width: '100%' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </Col>
                <Col xs={12} md={4}>
                    <iframe src={`https://maps.google.com/maps?&hl=en&q=Teniente Mario Agustin Del Castillo 1824&t=&z=14&ie=UTF8&iwloc=B&output=embed`} height="350" style={{ border: '0', width: '100%' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </Col>
            </Row>

            <h2 className='text-center my-5'>Most Selled</h2>
            <Row>
                <Col md={3} >
                    <Form>
                        <Form.Group controlId='filter'>
                            <span>Period:</span>
                            <Form.Control as='select'>
                                <option>Year</option>
                                <option>Month</option>
                                <option>Week</option>
                                <option>Day</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='filter'>
                            <span>Categorie:</span>
                            <Form.Control as='select'>
                                <option>Hoodies</option>
                                <option>T-Shirts</option>
                                <option>Shoes</option>
                                <option>Accessories</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='filter'>
                            <span>Size:</span>
                            <Form.Control as='select'>
                                <option>XS</option>
                                <option>S</option>
                                <option>M</option>
                                <option>L</option>
                                <option>XL</option>
                                <option>XXL</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='filter'>
                            <span>Color:</span>
                            <Form.Control as='select'>
                                <option>Black</option>
                                <option>White</option>
                                <option>Red</option>
                                <option>Blue</option>
                                <option>Green</option>
                                <option>Yellow</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='filter'>
                            <span>Seller:</span>
                            <Form.Control as='select'>
                                <option>Satana</option>
                                <option>Kitanas</option>
                                <option>HippyKiller</option>
                                <option>Zoldyck</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Col>
                <Col md={9} className='text-center'>
                    <Image src={'https://reactjsexample.com/content/images/2021/12/Snipaste_2021-12-12_20-14-33.jpg'} fluid />
                </Col>
            </Row>
        </Container>
    )
}

export default ADMIN_ListOrdersScreen