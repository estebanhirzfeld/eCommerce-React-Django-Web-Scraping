import React, { useState, useEffect } from 'react'
import '../assets/css/Markers.css'


import { Link, useNavigate } from 'react-router-dom'
import { Container, Col, Row, Form, Button, Table, Image } from 'react-bootstrap'


import { greenIcon, redIcon, goldIcon } from '../components/LeafletIcons'
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet"
import 'leaflet/dist/leaflet.css'

import { listAllOrders } from '../actions/orderActions'
import {useDispatch, useSelector} from 'react-redux'
import { ordersListAdminReducer } from '../reducers/orderReducers'



function ADMIN_ListOrdersScreen() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [coords, setCoords] = useState([-34.608354, -58.438682])
    
    const ordersListAdmin = useSelector(state => state.ordersListAdmin)
    const { loading, error, orders: orders } = ordersListAdmin
    
    const getOrders = () => {
        dispatch(listAllOrders())
    }
    
    useEffect(() => {
        getOrders()
    }, [])
    


    function ChangeView({ center, zoom }) {
        const map = useMap()
        map.flyTo(center, zoom)
        return null
    }

    return (

        <Container className='mt-5'>
            <h1 className='my-5 text-center'>Orders</h1>

            <h2 className='text-center'>Total: {orders?.length}</h2>

            <Row className='my-5 text-center'>
                <Col xs={4}>
                    <Link to={'/admin/orders/pending'}>
                        <span className='form-control w-25 m-auto mb-3'>
                            {pendingOrder?.length}
                        </span>
                        <span>Pending</span>
                    </Link>
                </Col>
                <Col xs={4}>
                    <Link to={'/admin/orders/success'}>
                        <span className='form-control w-25 m-auto mb-3'>
                            {successOrder?.length}
                        </span>
                        <span>Success</span>
                    </Link>
                </Col>
                <Col xs={4}>
                    <Link to={'/admin/orders/cancelled'}>
                        <span className='form-control w-25 m-auto mb-3'>
                            {cancelledOrder?.length + expiredOrder?.length}
                        </span>
                        <span>Cancelled</span>
                    </Link>
                </Col>
            </Row>




            <Row className='mt-5'>
                <MapContainer center={[-34.608354, -58.438682]} zoom={8} scrollWheelZoom={true} style={{ height: '400px', width: '100%' }}>

                    <ChangeView center={coords} zoom={10} />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Paid */}
                    {successOrder?.map((order) => (
                        <Marker position={[order?.ShippingAddress?.lat, order?.ShippingAddress?.lon]}
                            icon={greenIcon}
                            key={order.id} eventHandlers={{
                                click: () =>
                                    setCoords([order?.ShippingAddress?.lat +10, order?.ShippingAddress?.lon])
                            }}

                        >
                            <Popup>
                            <span className='text-success'>Paid</span>
                                <Row>
                                    {order?.OrderItems?.map((item,index) => (
                                        <img key={index} src={`http://localhost:8000${item?.image}`} alt={item?.name} style={{ width: '100px' }} />
                                    ))}
                                </Row>
                                <Link to={`/order/${order.id}`}>
                                    <p>Order: {order.id}</p>
                                </Link>
                                <p>Address: {order?.ShippingAddress?.address}</p>
                            </Popup>
                        </Marker>
                    ))}
                    {/* Pending */}
                    {pendingOrder?.map((order) => (
                        <Marker position={[order?.ShippingAddress?.lat, order?.ShippingAddress?.lon]}
                            icon={goldIcon}
                            key={order.id} eventHandlers={{
                                click: () =>
                                    setCoords([order?.ShippingAddress?.lat, order?.ShippingAddress?.lon])
                            }}
                        >
                            <Popup>
                            <span className='text-warning'>Pending</span>
                                <Row>
                                    {order?.OrderItems?.map((item,index) => (
                                        <img key={index} src={`http://localhost:8000${item?.image}`} alt={item?.name} style={{ width: '100px' }} />
                                    ))}
                                </Row>
                                <Link to={`/order/${order.id}`}>
                                    <p>Order: {order.id}</p>
                                </Link>
                                <p>Address: {order?.ShippingAddress?.address}</p>
                            </Popup>
                        </Marker>
                    ))}
                    {/* Cancelled */}
                    {cancelledOrder?.map((order) => (
                        <Marker position={[order?.ShippingAddress?.lat, order?.ShippingAddress?.lon]}
                            icon={redIcon}
                            key={order.id} eventHandlers={{
                                click: () =>
                                    setCoords([order?.ShippingAddress?.lat, order?.ShippingAddress?.lon])
                            }}
                        >
                            <Popup>
                            <span className='text-danger'>Cancelled</span>
                                <Row>
                                    {order?.OrderItems?.map((item,index) => (
                                        <img key={index} src={`http://localhost:8000${item?.image}`} alt={item?.name} style={{ width: '100px' }} />
                                    ))}
                                </Row>
                                <Link to={`/order/${order.id}`}>
                                    <p>Order: {order.id}</p>
                                </Link>
                                <p>Address: {order?.ShippingAddress?.address}</p>
                            </Popup>
                        </Marker>
                    ))}
                    {/* Expired */}
                    {expiredOrder?.map((order) => (
                        <Marker position={[order?.ShippingAddress?.lat, order?.ShippingAddress?.lon]}
                            icon={redIcon}
                            key={order.id} eventHandlers={{
                                click: () =>
                                    setCoords([order?.ShippingAddress?.lat, order?.ShippingAddress?.lon])
                            }}
                        >
                            <Popup>
                                    <span className='text-danger text-center'>Expired</span>
                                <Row>
                                    {order?.OrderItems?.map((item,index) => (
                                        <img key={index} src={`http://localhost:8000${item?.image}`} alt={item?.name} style={{ width: '100px' }} />
                                    ))}
                                </Row>
                                <Link to={`/order/${order.id}`}>
                                    <p style={{ maxWidth: '100px' }}>Order: {order.id}</p>
                                </Link>
                                <p>Address: {order?.ShippingAddress?.address}</p>
                            </Popup>
                        </Marker>
                    ))}


                </MapContainer>

            </Row>


            <h2 className='text-center my-5'>Most Selled</h2>
            <Row>
                <Col md={3} >
                    <Form>
                        <Form.Group controlId='filter'>
                            <span>Period:</span>
                            <Form.Control as='select'>
                                <option>Year</option>
                                <option>Month</option>
                                <option>Week</option>
                                <option>Day</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='filter'>
                            <span>Categorie:</span>
                            <Form.Control as='select'>
                                <option>Hoodies</option>
                                <option>T-Shirts</option>
                                <option>Shoes</option>
                                <option>Accessories</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='filter'>
                            <span>Size:</span>
                            <Form.Control as='select'>
                                <option>XS</option>
                                <option>S</option>
                                <option>M</option>
                                <option>L</option>
                                <option>XL</option>
                                <option>XXL</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='filter'>
                            <span>Color:</span>
                            <Form.Control as='select'>
                                <option>Black</option>
                                <option>White</option>
                                <option>Red</option>
                                <option>Blue</option>
                                <option>Green</option>
                                <option>Yellow</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='filter'>
                            <span>Seller:</span>
                            <Form.Control as='select'>
                                <option>Satana</option>
                                <option>Kitanas</option>
                                <option>HippyKiller</option>
                                <option>Zoldyck</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Col>
                <Col md={9} className='text-center'>
                    <Image src={'https://reactjsexample.com/content/images/2021/12/Snipaste_2021-12-12_20-14-33.jpg'} fluid />
                </Col>
            </Row>
        </Container>
    )
}

export default ADMIN_ListOrdersScreen