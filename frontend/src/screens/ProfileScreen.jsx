import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Col, Row, Form, Button, Table, } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

import { listOrders } from '../actions/orderActions'

function ProfileScreen() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails

    const login = useSelector(state => state.login)
    const { userInfo } = login

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

    const ordersList = useSelector(state => state.ordersList)
    const { loading: loadingOrders, error: errorOrders, orders } = ordersList


    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        } else {
            if (!user || !user.name || success || userInfo.id !== user.id) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET })
                dispatch(getUserDetails('profile'))
                dispatch(listOrders())
            } else {
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [dispatch, navigate, userInfo, user, success, orders])


    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert('Passwords do not match')
        } else {
            dispatch(updateUserProfile({ name, email, password }))
        }
    }

    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label className='my-2'>Name</Form.Label>
                        <Form.Control
                            maxLength='20'
                            required
                            type='name'
                            placeholder='Enter name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='email'>
                        <Form.Label className='my-2'>Email Address</Form.Label>
                        <Form.Control
                            required
                            type='email'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='password'>
                        <Form.Label className='my-2'>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='confirmPassword'>
                        <Form.Label className='my-2'>Confirm Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Confirm password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Button className='my-2' type='submit' variant='primary'>
                        Update
                    </Button>
                </Form>
            </Col>
            <Col md={9}>
                <h2>My Orders</h2>
                {
                    orders && orders.length > 0
                        ? (
                            loadingOrders ? <h2>Loading...</h2> : errorOrders ? <h2>{errorOrders}</h2> : (
                                <Table striped bordered hover responsive className='table-sm'>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>DATE</th>
                                            <th>TOTAL</th>
                                            <th className='text-center'>STATUS</th>
                                            <th className='text-center'>DELIVERED</th>
                                            <th className='text-center'>MORE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            loadingOrders ? <h2>Loading...</h2> :
                                                orders.reverse().map(order => (
                                                    <tr key={order.id}>
                                                        <td>{order.id}</td>
                                                        <td>{order.createdAt.substring(0, 10)}</td>
                                                        <td>${order.totalPrice}</td>

                                                        {/* <td className="text-center text-success">{order.isPaid ? order.paidAt.substring(0, 10) : (
                                                            <i className='fas fa-times' style={{ color: 'red' }}></i>
                                                        )}</td> */}

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


                                                        <td className="text-center text-success">{order.isDelivered ? order.deliveredAt.substring(0, 10) : (
                                                            <i className='fas fa-times' style={{ color: 'red' }}></i>
                                                        )}</td>
                                                        <td className='text-center'>
                                                            <LinkContainer to={`/order/${order.id}`}>
                                                                <Button className='btn-sm' variant='light'>Details</Button>
                                                            </LinkContainer>
                                                        </td>
                                                    </tr>
                                                ))}
                                    </tbody>
                                </Table>
                            )
                        )
                        :
                        <p className='mt-5'>
                            You have not placed any orders yet. <Link to='/'>Go Shopping</Link>
                        </p>

                }
            </Col>

        </Row>
    )
}

export default ProfileScreen