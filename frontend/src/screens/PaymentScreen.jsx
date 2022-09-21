import React, { useState, useEffect } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { savePaymentMethod } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'



function PaymentScreen() {

    const dispatch = useDispatch()

    const navigate = useNavigate()
    const cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart

    if (!shippingAddress.address) {
        navigate('/shipping')
    }

    const [paymentMethod, setPaymentMethod] = useState('MercadoPago')

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

    return (
        
        <Container className='mt-5'>
            <Row className='justify-content-md-center'>
                <Col xs={12} md={6}>    
                    <h1>Payment Method</h1>
                    <CheckoutSteps step1 step2 />
                    <Form onSubmit={(e) => { submitHandler(e) }}>   
                        <Form.Group className="my-3" controlId='paymentMethod'>
                            <Form.Label as='legend'>Select Method</Form.Label>  
                            <Col>
                                <Form.Check
                                    type='radio'
                                    label='MercadoPago' 
                                    id='MercadoPago'    
                                    name='paymentMethod'    
                                    value='MercadoPago'
                                    checked
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                ></Form.Check>
                            </Col>
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