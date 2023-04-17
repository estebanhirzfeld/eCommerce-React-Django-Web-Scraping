import BASE_URL from '../../constants'

import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import { Container, Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import { updateDeliverOrder, updatePaidOrder } from '../actions/orderActions'
import Test from './Test'

function OrderScreen() {

    const dispatch = useDispatch()
    const { id } = useParams()
    const navigate = useNavigate()

    const orderPay = useSelector(state => state.orderPay)
    const { paymentLink, success, error: errorPay } = orderPay

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails

    const login = useSelector(state => state.login)
    const { userInfo } = login

    const orderUpdatePaid = useSelector(state => state.orderUpdatePaid)
    const { success: successPaid } = orderUpdatePaid

    const orderUpdateDelivered = useSelector(state => state.orderUpdateDelivered)
    const { success: successDeliver } = orderUpdateDelivered

    useEffect(() => {
        dispatch(getOrderDetails(id))
    }, [dispatch, id, successPaid, successDeliver])

    useEffect(() => {

        if (success && order.paymentMethod === 'Mercado Pago') {
            window.location.href = paymentLink
        }
        else if (success && order.paymentMethod === 'Tranferencia Bancaria') {
            // reload the page
            dispatch(getOrderDetails(id))
        }


    }, [success, paymentLink, dispatch, successPaid, successDeliver])

    const payHandler = () => {
        dispatch(payOrder(id, order.paymentMethod))
    }

    const updatePaidHandler = () => {
        dispatch(updatePaidOrder(id))
    }

    const updateDeliverHandler = () => {
        if (!order.isPaid) {
            if (window.confirm('Are you sure? This order is not paid yet')) {
                dispatch(updateDeliverOrder(id))
            }
        } else {
            dispatch(updateDeliverOrder(id))
        }

    }

    return (
        <Container className='mt-5'>
            {loading ? <h2>Loading...</h2> : error ? <h3>{error}</h3> : (
                <Row>
                    <Col md={8}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method: </strong>
                                    {order.paymentMethod}
                                </p>

                                {/* if order.paymentMethod is Tranferencia Bancaria show the button to upload the proof of payment */}


                                {order.isPaid ? (
                                    <>
                                        <div className='alert alert-success'>Paid on {order.paidAt}</div>
                                    </>
                                )
                                    : new Date(order.expiryDate).getTime() < Date.now() ?
                                        <div className='alert alert-danger'>Order Expired on {order.expiryDate.slice(0, 10)}</div>
                                        : <div className={order.paymentMethod === 'Tranferencia Bancaria' ? 'alert alert-info' : 'alert alert-danger'}>

                                            {/* if paymentProof ! null show the image */}
                                            {order.paymentProof ?
                                                <>
                                                    <p>Proof of payment</p>
                                                    <Image src={`${BASE_URL}${order.paymentProof}`} alt={order.paymentProof} fluid rounded />
                                                </>
                                                :
                                                order.paymentMethod === 'Tranferencia Bancaria' && !order.isPaid && order.user.id === userInfo.id ? (
                                                    <>
                                                        <p>Attach the proof of payment</p>
                                                        <Test
                                                            id={order.id}
                                                        />
                                                    </>
                                                ) : (
                                                    <>Not Paid</>
                                                )}






                                        </div>
                                }

                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Shipping</h2>
                                <p>
                                    <strong>Name: </strong>
                                    {order.user.name}
                                </p>
                                <p>
                                    <strong>Email: </strong>
                                    <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                                </p>
                                <p>
                                    <strong>Address: </strong>
                                    {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                                    {order.shippingAddress.postalCode},{' '}
                                    {order.shippingAddress.province}
                                </p>
                                {order.isDelivered ? (
                                    <div className="alert alert-success" role="alert">
                                        Delivered on {order.deliveredAt}
                                    </div>
                                ) : (
                                    <div className="alert alert-danger" role="alert">
                                        Not Delivered
                                    </div>
                                )}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Order Items</h2>
                                {order.OrderItems.length === 0 ? (
                                    <h3>Order is empty</h3>
                                ) : (
                                    <ListGroup variant='flush'>
                                        {order.OrderItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={`${BASE_URL}${item.image}`} alt={item.name} fluid rounded />
                                                    </Col>
                                                    <Col>
                                                        <a href={`/product/${item.product}`}>{item.name}</a>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.qty} x ${item.price} = ${item.qty * item.price}
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
                                        <Col>Items</Col>
                                        <Col>${
                                            order?.OrderItems?.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
                                        }</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${order.shippingPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Total</Col>
                                        <Col>${order.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>

                        </Card>

                        {!order?.isPaid && order?.user?.id === userInfo?.id && order?.paymentMethod === 'MercadoPago' && (
                            <ListGroup.Item>
                                {errorPay || new Date(order.expiryDate).getTime() < Date.now() ?
                                    <></>
                                    : (
                                        <Button type='button' className='btn-block w-100 my-5' onClick={payHandler}>
                                            Pagar con Mercado Pago
                                        </Button>)
                                }
                            </ListGroup.Item>
                        )}

                        <ListGroup.Item>

                            {/* button to mark the order as paid */}
                            {userInfo?.is_Admin && (
                                <Button type='button' className='btn-block btn-outline-dark w-100 my-2' onClick={updatePaidHandler}>
                                    Change Paid Status
                                </Button>
                            )}
                            {/* button to mark the order as delivered */}
                            {userInfo?.is_Admin && (
                                <Button type='button' className='btn-block btn-outline-dark w-100 my-2' onClick={updateDeliverHandler}>
                                    Change Deliver Status
                                </Button>
                            )}


                        </ListGroup.Item>
                    </Col>
                </Row>
            )}
        </Container>
    )
}


export default OrderScreen