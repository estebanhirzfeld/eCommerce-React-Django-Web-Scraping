import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstants'

import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'


function ADMIN_EditUserScreen() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate


    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({ id: id, name, email, isAdmin }))
    }


    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET })
            navigate('/admin/users')
        } else {
            if (!user.name || user.id !== Number(id)) {
                dispatch(getUserDetails(id))
            } else {
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.is_Admin)
            }
        }
    }, [dispatch, id, user, successUpdate, navigate])

    return (
        <Container className='my-5'>
            <Link to='/admin/users' className='btn btn-light my-3'>Go Back</Link>
            <Row className='justify-content-md-center'>
                <Col xs={12} md={6}>
                    <h1>Edit User</h1>
                    <Form onSubmit={submitHandler}>
                        <Form.Group className="my-4" controlId='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type='name'
                                placeholder='Enter name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group className="my-4" controlId='email'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group className="my-4" controlId='isadmin'>
                            <Form.Check
                                type='checkbox'
                                label='Is Admin'
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                            ></Form.Check>
                        </Form.Group>

                        <Button type='submit' variant='primary'>Update</Button>
                    </Form>
                </Col>
            </Row>
        </Container>

    )
}

export default ADMIN_EditUserScreen