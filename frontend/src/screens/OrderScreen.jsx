import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import { Container, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { createOrder } from '../actions/orderActions'


function OrderScreen() {

    const dispatch = useDispatch()
    const { id } = useParams()


    const orderPay = useSelector(state => state.orderPay)
    const { paymentLink, success } = orderPay

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails

    useEffect(() => {
        dispatch(getOrderDetails(id))

    }, [dispatch, id])

    useEffect(() => {
        if (success) {
            window.location.href = paymentLink
        }
    }, [success, paymentLink])

    const payHandler = () => {
        dispatch(payOrder(id))
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

                                {order.status == 'Paid' ? (
                                    <div className="alert alert-success" role="alert">
                                        Paid on {order.paidAt}
                                    </div>
                                ) : order.status == 'Pending' ? (
                                    <div className="alert alert-warning" role="alert">
                                        Pending
                                    </div>
                                ) : order.status == 'Cancelled' ? (
                                    <div className="alert alert-danger" role="alert">
                                        Cancelled
                                    </div>
                                ) : order.status == 'Expired' ? (
                                    <div className="alert alert-danger" role="alert">
                                        Expired
                                    </div>
                                ) : (
                                    <div className="alert alert-danger" role="alert">
                                        {order.status}
                                    </div>
                                )}
                                
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
                                    {order.ShippingAddress.address}, {order.ShippingAddress.city}{' '}
                                    {order.ShippingAddress.postalCode},{' '}
                                    {order.ShippingAddress.country}
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
                                                        <Image src={`http://localhost:8000${item.image}`} alt={item.name} fluid rounded />
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
                                        <Col>${order.totalPrice}</Col>
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
                                        <Col>Tax</Col>
                                        <Col>${order.taxPrice}</Col>
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
                    </Col>
                </Row>
            )}
        </Container>
    )
}


export default OrderScreen