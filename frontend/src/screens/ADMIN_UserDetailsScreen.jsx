import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Container, Col, Row, Form, Button, Table } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { getUserOrders } from '../actions/orderActions'

import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import axios from "axios";

function ADMIN_UserDetailsScreen() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const ordersList = useSelector(state => state.ordersList)
    const { loading, error, orders } = ordersList

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

    useEffect(() => {
        getUserDetails()
        dispatch(getUserOrders(id))
    }, [dispatch, id])

    function ChangeView({ center, zoom }) {
        const map = useMap()
        map.flyTo(center, zoom)
        return null
    }


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
                                {/* <p>Last Location:
                                    {userOrders && userOrders.length > 0 ?
                                        (
                                            <Link to={`/order/${userOrders.at(-1).id}`}> {userOrders.at(-1).ShippingAddress?.address}, {userOrders.at(-1).ShippingAddress?.city} {userOrders.at(-1).ShippingAddress?.postalCode}, {userOrders.at(-1).ShippingAddress?.country}</Link>
                                        ) : (
                                            <p>No orders found</p>
                                        )
                                    }
                                    </p> */}
                                <p> Last Address: {
                                    ordersList && ordersList.orders && ordersList.orders.length > 0 ?
                                        (
                                            <Link to={`/order/${ordersList.orders.at(-1).id}`}> {ordersList.orders.at(-1).shippingAddress?.address}, {ordersList.orders.at(-1).shippingAddress?.city} {ordersList.orders.at(-1).shippingAddress?.postalCode}, {ordersList.orders.at(-1).shippingAddress?.country}</Link>
                                        ) : (
                                            <p>No Address found</p>
                                        )
                                }
                                </p>

                                <Link to={`/admin/user/${user.id}/edit`}><Button className='my-3'>Edit User</Button></Link>
                            </Col>
                            <Col md={7}>
                                {ordersList ?
                                    <MapContainer
                                        center={[ordersList.orders.at(-1).shippingAddress.lat, ordersList.orders.at(-1).shippingAddress.lon]}
                                        zoom={13}
                                        scrollWheelZoom={false}
                                        style={{ height: '350px', width: '100%' }}>

                                        <ChangeView
                                            center={[ordersList.orders.at(-1).shippingAddress.lat, ordersList.orders.at(-1).shippingAddress.lon]}
                                            zoom={18} />
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        {/* draggable marker */}
                                        <Marker
                                            position={[ordersList.orders.at(-1).shippingAddress.lat, ordersList.orders.at(-1).shippingAddress.lon]}
                                        >
                                            <Popup>
                                                <span>{ordersList.orders.at(-1).shippingAddress.address}</span>
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                    : <p>No Address found</p>
                                }
                            </Col>
                        </Row>
                        <h2 className='text-center my-5'>{user.name}'s Orders</h2>
                        {ordersList ?
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
                                    {ordersList.orders.map(order => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>{order.createdAt.substring(0, 10)}</td>
                                            <td>${order.totalPrice}</td>
                                            <td>{order.paymentMethod}</td>
                                            <td className="text-center text-success">{order.isPaid ? order.paidAt.substring(0, 10) : (
                                                <i className='fas fa-times' style={{ color: 'red' }}></i>
                                            )}</td>
                                            <td className="text-center text-success">{order.isDelivered ? order.deliveredAt.substring(0, 10) : (
                                                <i className='fas fa-times' style={{ color: 'red' }}></i>
                                            )}</td>
                                            <td className='text-center'>
                                                <LinkContainer to={`/order/${order.id}`}>
                                                    <Button variant='light' className='btn-sm'>
                                                        <i className='fas fa-info'></i>
                                                    </Button>
                                                </LinkContainer>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            : <p>No orders found</p>
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