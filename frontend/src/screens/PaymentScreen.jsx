import React, { useState, useEffect } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'

import { useDispatch, useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'

import { savePaymentMethod } from '../actions/cartActions'

import CheckoutSteps from '../components/CheckoutSteps'

import { ADDRESS_CREATE_RESET } from '../constants/addressConstants'


function PaymentScreen() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const addresses = useSelector(state => state.addresses)
    const { shippingAddresses } = addresses

    const [paymentMethod, setPaymentMethod] = useState()

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

    useEffect(() => {
        // dispatch ADDRESS_CREATE_RESET
        if (!shippingAddresses) {
            navigate('/shipping')
        }
        dispatch({ type: 'ADDRESS_CREATE_RESET' })
    }, [dispatch, navigate, shippingAddresses])

    return (

        <Container className='mt-5'>
            <Row className='justify-content-md-center'>
                <Col xs={12} md={6}>
                    <h1>Payment Method</h1>
                    <CheckoutSteps step1 step2 />
                    <Form onSubmit={(e) => { submitHandler(e) }}>
                        <Form.Group className="my-3" controlId='paymentMethod' >
                            <Form.Label as='legend'>Select Method</Form.Label>
                            <Row>

                                <Col>
                                    <Form.Check
                                        required
                                        type='radio'
                                        label='MercadoPago'
                                        id='MercadoPago'
                                        name='paymentMethod'
                                        value='MercadoPago'
                                        onClick={(e) => setPaymentMethod(e.target.value)}
                                    ></Form.Check>
                                </Col>
                                <Col>
                                    <Form.Check
                                        required
                                        type='radio'
                                        label='Transferencia Bancaria'
                                        id='Transferencia Bancaria'
                                        name='paymentMethod'
                                        value='Transferencia Bancaria'
                                        onClick={(e) => setPaymentMethod(e.target.value)}
                                    ></Form.Check>
                                    <span>
                                        <small>
                                            <p className='text-success'>+  10% de descuento</p>
                                        </small>
                                    </span>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Button type='submit' variant='primary'>
                            Continue
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default PaymentScreen