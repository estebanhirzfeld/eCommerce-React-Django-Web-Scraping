import React, { useState, useEffect } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { Container, Col, Row, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { userLogin } from '../actions/userActions'

import FormContainer from '../components/FormContainer'


function LoginScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const login = useSelector(state => state.login)
    const { loading, error, userInfo } = login

    useEffect(() => {
        if (userInfo) {
            navigate(-1)
        }
    }, [userInfo, navigate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(userLogin(email, password))
    }


    return (
        <Container className='mt-5'>
            <Row className='justify-content-md-center'>
                <Col xs={12} md={6}>
                    <h1>Sign In</h1>


                    <Form onSubmit={submitHandler}>
                        <Form.Group className="my-3" controlId='email'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type='email'
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                placeholder='Enter email'
                                ></Form.Control>
                        </Form.Group>
                        <Form.Group className="my-3" controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                type='password'
                                placeholder='Enter password'
                                ></Form.Control>
                        </Form.Group>
                        <Button className="my-3" type='submit' variant='primary'>Sign In</Button>
                                {error && <p className='container-fluid alert alert-danger'>{error}</p>}
                    </Form>
                    <Row className='py-3'>
                        <Col>
                            New Customer? <Link to='/register'>Register</Link>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default LoginScreen