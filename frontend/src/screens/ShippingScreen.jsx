import React, { useState, useEffect } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { saveShippingAddress } from '../actions/cartActions'

import CheckoutSteps from '../components/CheckoutSteps'


function ShippingScreen() {

    const navigate = useNavigate()

    const cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart

    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country)

    const dispatch = useDispatch()

    

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ address, city, postalCode, country }))
        navigate('/payment')
    }

    let paymentData = localStorage.getItem('paymentMethod')

    console.log(paymentData)


    return (

        <Container className='mt-5'>
            <Row className='justify-content-md-center'>
                <Col xs={12} md={6}>
                    <h1>Shipping</h1>
                    {
                        paymentData ? (
                            <CheckoutSteps step1 step2 /> 
                        ) : (
                            <CheckoutSteps step1 />
                        )
                    }
                    <Form onSubmit={(e) => { submitHandler(e) }}>

                        <Form.Group className="my-3" controlId='country'>
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                required
                                type='text'
                                placeholder='Enter country'
                                onChange={(e) => setCountry(e.target.value)}
                                value={country}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="my-3" controlId='city'>
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                required
                                type='text'
                                placeholder='Enter city'
                                onChange={(e) => setCity(e.target.value)}
                                value={city}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="my-3" controlId='postalCode'>
                            <Form.Label>Postal Code</Form.Label>
                            <Form.Control
                                required
                                type='text'
                                placeholder='Enter postal code'
                                onChange={(e) => setPostalCode(e.target.value)}
                                value={postalCode}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="my-3" controlId='address'>
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                required
                                type='text'
                                placeholder='Enter address'
                                onChange={(e) => setAddress(e.target.value)}
                                value={address}
                            ></Form.Control>
                        </Form.Group>

                        <div className='mt-5 d-flex justify-content-end'>
                            <Button type='submit' variant='primary'>
                                Continue
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>

    )
}

export default ShippingScreen