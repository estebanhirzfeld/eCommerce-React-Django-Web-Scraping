import BASE_URL from '../../constants'

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Container, Col, Row, Form, Button, Table } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { getUserOrders } from '../actions/orderActions'

import { getUserDetails } from '../actions/userActions'

import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet"
import {blueIcon} from '../components/LeafletIcons'
import 'leaflet/dist/leaflet.css'

function ADMIN_UserDetailsScreen() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const ordersList = useSelector(state => state.ordersList)
    const { loading, error, orders } = ordersList
    
    const login = useSelector(state => state.login)
    const { userInfo } = login

    // if user is not logged in or is not an admin, redirect to home
    useEffect(() => {
        if (!userInfo || !userInfo.is_Admin) {
            navigate('/')
        }

    }, [dispatch, navigate, userInfo])

    const userDetails = useSelector(state => state.userDetails)
    const { loading: loadingDetails, error: errorDetails, user } = userDetails

    const { id } = useParams()

    useEffect(() => {
        dispatch(getUserDetails(id))
        dispatch(getUserOrders(id))
    }, [dispatch, id])

    useEffect(() => {
        if (orders && userInfo && user) {
            console.log(ordersList)
            console.log(user)
            console.log('isAdmin:', userInfo.is_Admin)
        }
    }, [dispatch, orders, userInfo, user])

    function ChangeView({ center, zoom }) {
        const map = useMap()
        map.flyTo(center, zoom)
        return null
    }


    return (
        <Container className='mt-5'>
            {orders ?
                (
                    <>
                        <h1 className='text-center my-5'>User Details</h1>
                        <Row className='justify-content-between'>
                            
                            <Col md={4}>
                                <h2>User Info</h2>
                                <p>Name: {user.name} </p>
                                <p>Email Address: {user.email}</p>
                                <p>Last Location:
                                    {orders && orders.length > 0 ?
                                        (
                                            <Link to={`/order/${orders[0].id}`}>
                                                {orders[0].shippingAddress.address},
                                                {orders[0].shippingAddress.city} {orders[0].shippingAddress.postalCode}, 
                                                {orders[0].shippingAddress.province}
                                            </Link>
                                        ) : (
                                            <p>No orders found</p>
                                        )
                                    }
                                </p>
                                {/* <p> Last Address: {
                                        user && user.addresses.length > 0 ?
                                            (
                                                <p> {user.addresses[0].address}, {user.addresses[0].city} {user.addresses[0].postalCode}, {user.addresses[0].province}</p>
                                            ) : (
                                                <p>No Address found</p>
                                            )
                                    }
                                </p> */}

                                    <Link to={`/admin/user/${user.id}/edit`}><Button className='my-3'>Edit User</Button></Link>
                                    <Link to='/admin/users' className='btn btn-light my-3 mx-3'>Go Back</Link>
                            </Col>
                            <Col md={7}>
                                {orders && orders.length > 0 ?
                                    <MapContainer
                                        center={[orders[0].shippingAddress.lat, orders[0].shippingAddress.lon]}
                                        zoom={13}
                                        scrollWheelZoom={false}
                                        style={{ height: '350px', width: '100%' }}>

                                        <ChangeView
                                            center={[orders[0].shippingAddress.lat, orders[0].shippingAddress.lon]}
                                            zoom={18} />
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        
                                        <Marker
                                            position={[orders[0].shippingAddress.lat, orders[0].shippingAddress.lon]}
                                            icon={blueIcon}
                                        >
                                            <Popup>
                                                <span>{orders[0].shippingAddress.address}</span>
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
                                    {orders.map(order => (
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