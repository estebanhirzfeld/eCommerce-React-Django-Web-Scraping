import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Container, Col, Row, Form, Button, Table, Image } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import axios from "axios";

function ADMIN_ListOrdersStatusScreen() {

    const { status } = useParams()
    const [orders, setOrders] = useState([])

    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : null

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }

    const getOrders = async () => {
        const { data } = await axios.get(
            `http://localhost:8000/api/orders`,
            config
        );
        switch (status) {
            case 'pending':
                setOrders(data.filter(order => order.status === 'Pending' || order.isDelivered === false))
                break;
            case 'success':
                setOrders(data.filter(order => order.status === 'Paid' && order.isDelivered === true))
                break;
            case 'cancelled':
                setOrders(data.filter(order => order.status === 'Cancelled' || order.status === 'Expired'))
                break;
        }
    }

    useEffect(() => {
        getOrders()
    }, [])

    return (
        <Container className='mt-5'>
            <h1 className='my-5 text-center'>{status} Orders</h1>

            <h2 className='text-center'>Total: {orders.length}</h2>

            <Table striped bordered hover responsive className='table-sm mt-5'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>USER</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th className='text-center'>STATUS</th>
                        <th className='text-center'>DELIVERED</th>
                        <th className='text-center'>MORE</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.reverse().map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>

                                <Link to={`/admin/users/${order.user.id}`}>
                                    {order.user && order.user.name}
                                </Link>
                            </td>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td>${order.totalPrice}</td>
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
                                    <Button variant='light' className='btn-sm'>
                                        Details
                                    </Button>
                                </LinkContainer>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}

export default ADMIN_ListOrdersStatusScreen