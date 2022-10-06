import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Container, Col, Row, Form, Button, Table } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

import axios from "axios";

function ADMIN_UserDetailsScreen() {
    const { id } = useParams()
    const [user, setUser] = useState()
    const [userOrders, setUserOrders] = useState()
    const [address, setAddress] = useState('')

    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : null

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }

    const getUserDetails = async () => {
        const { data } = await axios.get(
            `http://localhost:8000/api/users/${id}/`,
            config
        );
        setUser(data)
    }

    const getUserOrders = async () => {
        const { data } = await axios.get(
            `http://localhost:8000/api/orders/user/${id}/`,
            config
        );
        setUserOrders(data)
        setAddress(`${userOrders[0].ShippingAddress?.country}, ${userOrders[0].ShippingAddress?.city}, Teniente Mario Agustin ${userOrders[0].ShippingAddress?.address}, ${userOrders[0].ShippingAddress?.postalCode}`)
    }

    useEffect(() => {
        getUserDetails()
        getUserOrders()
    }, [])

    useEffect(() => {
        getUserOrders()
    }, [userOrders])

    

    console.log(user)
    console.log(userOrders)
    console.log(address)



    return (
        <Container className='mt-5'>
            {user ?
                (
                    <>
                        <h1 className='text-center my-5'>User Details</h1>
                        <Row className='justify-content-between'>
                            <Col md={4}>
                                <h2>User Info</h2>
                                <p>Name: {user.name} </p>
                                <p>Email Address: {user.email}</p>
                                <p>Last Location:
                                    {userOrders && userOrders.length > 0 ?
                                        (
                                            <Link to={`/order/${userOrders[0].id}`}>{address}</Link>
                                        ) : (
                                            <p>No orders found</p>
                                        )
                                    }</p>
                            </Col>
                            <Col md={7}>
                                {/* <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1043.3257650178182!2d2.1765868833130946!3d41.37638718572824!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a257230ed68d%3A0x54c90bb381795eaa!2sLa%20Rambla%2C%201%2C%2008002%20Barcelona%2C%20Espa%C3%B1a!5e0!3m2!1ses!2sus!4v1664913992574!5m2!1ses!2sus" height="350" style={{border:'0',width:'100%'}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe> */}

                                {address? (
                                    <iframe src={`https://maps.google.com/maps?&hl=en&q=${address}&t=&z=14&ie=UTF8&iwloc=B&output=embed`} height="350" style={{ border: '0', width: '100%' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                ):
                                (
                                <p>No address found</p>
                                )
                                }


                                {/* <iframe src={`https://maps.google.com/maps?&hl=en&q=Buenos Aires, Argentina, Teniente Mario Agustin Del Castillo 1824&t=&z=14&ie=UTF8&iwloc=B&output=embed`} height="350" style={{border:'0',width:'100%'}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe> */}
                            </Col>
                        </Row>
                        <h2 className='text-center my-5'>{user.name}'s Orders</h2>
                        {userOrders ? (
                            <Table striped bordered hover responsive className='table-sm '>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>DATE</th>
                                        <th>TOTAL</th>
                                        <th>METHOD</th>
                                        <th className='text-center'>PAID</th>
                                        <th className='text-center'>DELIVERED</th>
                                        <th className='text-center'>MORE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userOrders.map(order => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>{order.createdAt.substring(0, 10)}</td>
                                            <td>${order.totalPrice}</td>
                                            <td>{order.paymentMethod}</td>
                                            <td className='text-center text-success'>
                                                {order.isPaid ? (
                                                    order.paidAt.substring(0, 10)
                                                ) : (
                                                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                                                )}
                                            </td>
                                            <td className='text-center text-success'>
                                                {order.isDelivered ? (
                                                    order.deliveredAt.substring(0, 10)
                                                ) : (
                                                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                                                )}
                                            </td>
                                            <td className='text-center'>
                                                <LinkContainer to={`/order/${order.id}`}>
                                                    <Button className='btn-sm' variant='light'>
                                                        Details
                                                    </Button>
                                                </LinkContainer>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) :
                            (<h2>There are no orders</h2>)

                        }
                    </>
                )
                : (
                    <h1 className='text-center my-5'>User Not Found</h1>
                )}
        </Container>

    )
}

export default ADMIN_UserDetailsScreen