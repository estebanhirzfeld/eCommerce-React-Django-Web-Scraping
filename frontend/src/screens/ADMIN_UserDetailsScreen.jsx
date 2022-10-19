import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Container, Col, Row, Form, Button, Table } from 'react-bootstrap'
import { useParams } from 'react-router-dom'


import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import axios from "axios";

function ADMIN_UserDetailsScreen() {

    const navigate = useNavigate()

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
                                <p>Last Location:
                                    {userOrders && userOrders.length > 0 ?
                                        (
                                            <Link to={`/order/${userOrders.at(-1).id}`}> {userOrders.at(-1).ShippingAddress?.address}, {userOrders.at(-1).ShippingAddress?.city} {userOrders.at(-1).ShippingAddress?.postalCode}, {userOrders.at(-1).ShippingAddress?.country}</Link>
                                        ) : (
                                            <p>No orders found</p>
                                        )
                                    }</p>
                                    <Link to={`/admin/user/${user.id}/edit`}><Button className='my-3'>Edit User</Button></Link>
                            </Col>
                            <Col md={7}>
                                {address ? (
                                    // 
                                    <MapContainer center={[userOrders.at(-1).ShippingAddress.lat, userOrders.at(-1).ShippingAddress.lon]} zoom={13} scrollWheelZoom={false} style={{ height: '350px', width: '100%' }}>
                                    
                                        <ChangeView center={
                                            [userOrders.at(-1).ShippingAddress.lat, userOrders.at(-1).ShippingAddress.lon]
                                        } zoom={18} />
                                        <TileLayer
                                            // attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        {/* draggable marker */}
                                        <Marker position={[userOrders.at(-1).ShippingAddress.lat, userOrders.at(-1).ShippingAddress.lon]}>
                                            <Popup>
                                                {address}
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                ) :
                                    (
                                        <p>No address found</p>
                                    )
                                }
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
                                        <th className='text-center'>STATUS</th>
                                        <th className='text-center'>DELIVERED</th>
                                        <th className='text-center'>MORE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userOrders.reverse().map(order => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>{order.createdAt.substring(0, 10)}</td>
                                            <td>${order.totalPrice}</td>
                                            <td>{order.paymentMethod}</td>
                                            <td className="text-center">{order.status === 'Paid'
                                                ? <span className='text-success'>{order.paidAt.substring(0, 10)}</span>
                                                : order.status === 'Pending'
                                                    ? <span className='text-warning'>{order.status}</span>
                                                    : order.status === 'Cancelled'
                                                        ? <span className='text-danger'>{order.status}</span>
                                                        : order.status === 'Expired'
                                                            ? <span className='text-danger'>{order.status}</span>
                                                            : order.status
                                            }</td>
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