import React, { useEffect, useState} from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { listAllOrders } from '../actions/orderActions'

import { Container, Row, Col, Table, Button, Image } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link, useNavigate } from 'react-router-dom'


import { greenIcon, redIcon, goldIcon } from '../components/LeafletIcons'
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'



function ADMIN_ListOrdersScreen() {

    const navigate = useNavigate();
    const dispatch = useDispatch()


    const [coords, setCoords] = useState([-34.608354, -58.438682]);

    const [successOrders, setSuccessOrders] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [cancelledOrders, setCancelledOrders] = useState([]);

    const login = useSelector(state => state.login)
    const { userInfo } = login

    const ordersListAdmin = useSelector(state => state.ordersListAdmin)
    const { loading, error, orders } = ordersListAdmin
    
    useEffect(() => {
        dispatch(listAllOrders())
    }, [dispatch])
    
    const ChangeView = ({ center, zoom }) => {
        const map = useMap();
        map.flyTo(center, zoom)
        return null
    }

    return (

        <Container className='mt-5'>
            {
                userInfo && userInfo.is_Admin ? (
                    <>
                            <h1 className='text-center'>Total Orders {orders?.length}</h1>
                        <Row className='text-center my-5'>
                            <Col md={4}>
                                Pending Orders {orders?.filter(order => order.status === 'Pending').length}
                            </Col>
                            <Col md={4}>
                                Success Orders {orders?.filter(order => order.status === 'Success').length}
                            </Col>
                            <Col md={4}>
                                Cancelled Orders {orders?.filter(order => order.status === 'Cancelled').length} 
                            </Col>
                        </Row>

                        <Row className='mt-5'>
                            <MapContainer center={[-34.608354, -58.438682]} zoom={8} scrollWheelZoom={true} style={{height:'400px', width:'100%'}}>
                                <ChangeView center={coords} zoom={8} />
                                <TileLayer
                                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                                />
                                {
                                    orders?.filter(order => order.status === 'Success').map(order => (
                                    <Marker position={[order.ShippingAddress?.lat, order.ShippingAddress?.lon]}
                                            icon={greenIcon}
                                            key={order.id}
                                    >
                                            <Popup>
                                                <span className='text-success'>Success</span>
                                                <Row>
                                                    {
                                                        order?.OrderItems?.map((item,index) => (
                                                            <Image key={index} src={`http://localhost:8000${item?.image}`} alt={item.name} fluid rounded />
                                                        ))
                                                        }
                                                </Row>
                                                <Link to={`/order/${order.id}`}>View Order</Link>
                                                <p>{order.address}</p>
                                            </Popup>
                                        </Marker>
                                    ))
                                }
                                {
                                    orders?.filter(order => order.status === 'Pending').map(order => (
                                        <Marker position={[order.ShippingAddress?.lat, order.ShippingAddress?.lon]}
                                            icon={goldIcon}
                                            key={order.id}
                                            >
                                            <Popup>
                                                <span className='text-warning'>Pending</span>
                                                <Row>
                                                    {
                                                        order?.OrderItems?.map((item,index) => (
                                                            <Image key={index} src={`http://localhost:8000${item?.image}`} fluid rounded />
                                                        ))
                                                        }
                                                </Row>
                                                <Link to={`/order/${order.id}`}>View Order</Link>
                                                <p>{order.address}</p>
                                            </Popup>
                                        </Marker>
                                    ))
                                }
                                {
                                    orders?.filter(order => order.status === 'Cancelled').map(order => (
                                        <Marker position={[order.ShippingAddress?.lat, order.ShippingAddress?.lon]}
                                            icon={redIcon}
                                            key={order.id}
                                            >
                                            <Popup>
                                                <span className='text-danger'>Cancelled</span>
                                                <Row>
                                                    {
                                                        order?.OrderItems?.map((item,index) => (
                                                            <Image key={index}  src={`http://localhost:8000${item?.image}`} alt={item.name} fluid rounded />
                                                        ))
                                                        }
                                                </Row>
                                                <Link to={`/order/${order.id}`}>View Order</Link>
                                                <p>{order.address}</p>
                                            </Popup>
                                        </Marker>
                                    ))
                                }
                            </MapContainer>
                        </Row>

                        <Row>
                            <Col>
                                <h1 className='text-center my-5'>Orders</h1>
                                {
                                    loading ? (
                                        <h2>Loading...</h2>
                                    ) : error ? (
                                        <h2>{error}</h2>
                                    ) : (
                                        <Table striped bordered hover responsive className='table-sm'>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>USER</th>
                                                    <th>DATE</th>
                                                    <th>TOTAL</th>
                                                    <th className='text-center'>PAID</th>
                                                    <th className='text-center'>DELIVERED</th>
                                                    <th className='text-center'>STATUS</th>
                                                    <th className='text-center'>MORE</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders
                                                    .map(order => (
                                                        <tr key={order.id}>
                                                            <td>{order.id}</td>
                                                            <td><Link to={`/admin/user/${order.user.id}`}>{order.user.name}</Link></td>
                                                            <td>{order.createdAt.substring(0, 10)}</td>
                                                            <td>${order.totalPrice}</td>
                                                            <td className='text-center text-success'>{order.isPaid ? order.paidAt.substring(0, 10) : (
                                                                <i className='fas fa-times' style={{ color: 'red' }}></i>
                                                            )}</td>
                                                            <td className='text-center text-success'>{order.isDelivered ? order.deliveredAt.substring(0, 10) : (
                                                                <i className='fas fa-times' style={{ color: 'red' }}></i>
                                                            )}</td>
                                                            <td className='text-center'>
                                                                {order.status === 'Pending' ? (
                                                                    <span className='text-warning'>{order.status}</span>
                                                                ) : order.status === 'Success' ? (
                                                                    <span className='text-success'>{order.status}</span>
                                                                ) : (
                                                                    <span className='text-danger'>{order.status}</span>
                                                                )}
                                                            </td>
                                                            <td className='text-center'>
                                                                <LinkContainer to={`/order/${order.id}`}>
                                                                    <Button variant='light' className='btn-sm'>
                                                                        Details
                                                                    </Button>
                                                                </LinkContainer>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </Table>
                                    )
                                }
                            </Col>
                        </Row>
                    </>
                ) : (
                    <>
                        <h1>Not Authorized</h1>
                        <Link to='/'>Go shopping</Link>
                    </>
                )

            }
        </Container>
    )
}

export default ADMIN_ListOrdersScreen