import BASE_URL from '../../constants'

import React, { useState, useEffect } from 'react'
import { Form, Button, Container, Row, Col, Image, Card, ListGroup } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'

import { createOrder } from '../actions/orderActions'
import { payOrder } from '../actions/orderActions'
import { calculateOrder } from '../actions/orderActions'


import { getCart, clearCart } from '../actions/cartActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'

import { getAddress } from '../actions/addressActions'


function PlaceOrderScreen() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const { cartItems, loading, error: errorCart } = cart

    const addresses = useSelector(state => state.addresses)
    const { shippingAddresses } = addresses

    const orderCreate = useSelector((state) => state.orderCreate)
    const { order, success, error } = orderCreate

    const orderPreCreate = useSelector((state) => state.orderPreCreate)
    const { order: orderPre, success: successPre, error: errorPre } = orderPreCreate

    // const [itemsPrice, setItemsPrice] = useState(0)
    // const [shippingPrice, setShippingPrice] = useState(0)
    // const [totalPrice, setTotalPrice] = useState(0)
    // const [discount, setDiscount] = useState(0)

    const [address, setAddress] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [city, setCity] = useState('')
    const [province, setProvince] = useState('')

    useEffect(() => {
        // if not paymentMethod redirect to payment screen
        if (!cart.paymentMethod) {
            navigate('/payment')
        }
        // if not shippingAddress redirect to shipping screen
    }, [cart, navigate])


    useEffect(() => {
        dispatch(getCart())
        dispatch(getAddress())
    }, [dispatch])

    useEffect(() => {
        if (shippingAddresses.length > 0) {
            setAddress(shippingAddresses[0].address)
            setPostalCode(shippingAddresses[0].postalCode)
            setCity(shippingAddresses[0].city)
            setProvince(shippingAddresses[0].province)
        }
    }, [shippingAddresses])

    useEffect(() => {
        if (cartItems.length > 0) {
            dispatch(calculateOrder({
                paymentMethod: cart.paymentMethod,
                shippingAddress: Number(shippingAddresses[0].id),
                orderItems: cartItems,
            }))
        }
    }, [cartItems, navigate, dispatch, shippingAddresses, cart.paymentMethod])

    useEffect(() => {
        if (success) {
            navigate(`/order/${order.id}`)
            dispatch({ type: ORDER_CREATE_RESET })
            dispatch(clearCart())
            if (cartItems.length === 0) {
                navigate('/')
            }
        }
    }, [success, navigate, order])

    const placeOrderHandler = () => {
        console.log('shippingAddress', shippingAddresses[0])
        // dispatch(createOrder({
        //     paymentMethod: cart.paymentMethod,
        //     shippingPrice: shippingPrice,
        //     orderItems: cartItems,
        //     shippingAddress: Number(shippingAddresses[0].id),
        //     itemsPrice: itemsPrice,
        //     totalPrice: totalPrice
        // }))
        if (orderPre) {
            dispatch(payOrder({
                paymentMethod: cart.paymentMethod,
                shippingPrice: orderPre.shippingPrice,
                orderItems: cartItems,
                shippingAddress: Number(shippingAddresses[0].id),
                itemsPrice: orderPre.itemsPrice,
                totalPrice: orderPre.totalPrice
            }))
        }
    }

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>

                            <p>
                                <strong>Shipping: </strong>
                                {address},  {city}
                                {'  '}
                                {postalCode},
                                {'  '}
                                {province}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {
                                    cart.paymentMethod === 'Transferencia Bancaria' ?
                                        <>
                                            {cart.paymentMethod}
                                            {
                                                successPre ?
                                                    <span className='text-success'> {orderPre.discountPercentage * 100}% OFF</span>
                                                    :
                                                    null
                                            }
                                        </>
                                        :
                                        cart.paymentMethod
                                }
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cart?.cartItems?.length === 0
                                ? <div className="alert alert-warning" role="alert">Your cart is empty</div>
                                : (
                                    <ListGroup variant='flush'>
                                        {cart.cartItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={`${BASE_URL}${item.product.images[0]?.image}`} alt={item.product.name} fluid rounded />
                                                    </Col>

                                                    <Col>
                                                        <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                                                        <p className='my-1'>Size: {item.size}</p>
                                                    </Col>

                                                    <Col md={6}>
                                                        {item.qty} X ${item.product.price} = ${(item.qty * item.product.price).toFixed(2)}
                                                        {item.stock <= 0 || item.stock < item.qty ? <p className='text-danger'>Out of stock</p> : null}
                                                    </Col>

                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                        </ListGroup.Item>

                    </ListGroup>

                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    {/* <Col>${itemsPrice}</Col> */}
                                    {
                                        successPre ?
                                            <Col>${orderPre.orderItemsPrice}</Col>
                                            :
                                            null
                                    }
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    {
                                        successPre ?
                                            <Col>${orderPre.shippingPrice}</Col>
                                            :
                                            null
                                    }
                                </Row>
                            </ListGroup.Item>

                            {
                                successPre && orderPre.discount ?
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Discount:</Col>
                                            {
                                                successPre ?
                                                    <Col className='text-danger'>-${orderPre.discount}</Col>
                                                    :
                                                    null
                                            }
                                        </Row>

                                    </ListGroup.Item>
                                    :
                                    null
                            }
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    {
                                        successPre ?
                                            <Col className='text-success'>${orderPre.totalPrice}</Col>
                                            :
                                            null
                                    }
                                </Row>
                            </ListGroup.Item>


                            <ListGroup.Item>
                                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                {cart?.cartItems?.length === 0
                                    ? <Button className='btn-block' type='button' disabled>Place Order</Button>
                                    :
                                    <Button
                                        type='button'
                                        className='btn-block'
                                        disabled={cart.cartItems === 0}
                                        onClick={placeOrderHandler}
                                    >
                                        Place Order
                                    </Button>
                                }
                            </ListGroup.Item>

                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default PlaceOrderScreen