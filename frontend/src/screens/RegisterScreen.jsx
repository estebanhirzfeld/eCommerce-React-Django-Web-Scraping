import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Col, Row, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { userLogin, userRegister } from '../actions/userActions'

import { GoogleLogin } from 'react-google-login';


function RegisterScreen() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const login = useSelector(state => state.login)
    const { loading, error, userInfo } = login

    useEffect(() => {
        if (userInfo) {
            navigate('/')
        }
    }, [userInfo, navigate])

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert('Passwords do not match')
        } else {
            dispatch(userRegister(name, email, password))
            dispatch(userLogin(email, password))
        }
    }

    // Google Register
    const responseGoogle = (response) => {
        console.log("Google Register Response: ", response);
        // dispatch(userRegister(response.profileObj.name, response.profileObj.email, response.profileObj.googleId))
        // dispatch(userLogin(response.profileObj.email, response.profileObj.googleId))
    }

    const responseGoogleFailure = (response) => {
        console.log("Google Register Failure: Response: ", response);
    }


    return (
        <Container className='mt-5'>
            <Row className='justify-content-md-center'>
                <Col xs={12} md={6}>
                    <h1>Sign Up</h1>

                    {/* Register with Google */}
                    
                    <GoogleLogin
                        clientId="872171782252-80ut0gm3elrth3b26601tqf6eifvpn2p.apps.googleusercontent.com"
                        buttonText="Register with Google"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogleFailure}
                    />

                    {/* Register with Email */}
                    <p className='my-3'>Or Register with Email</p>


                    <Form onSubmit={(e) => { submitHandler(e) }}>
                        <Form.Group className="my-3" controlId='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                maxLength='20'
                                required
                                type='text'
                                placeholder='Enter name'
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="my-3" controlId='email'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                required
                                type='email'
                                placeholder='Enter email'
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="my-3" controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                required
                                type='password'
                                placeholder='Enter password'
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="my-3" controlId='confirmPassword'>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                required
                                type='password'
                                placeholder='Confirm password'
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                            ></Form.Control>
                        </Form.Group>
                        <Button className="my-3" type='submit' variant='primary'>Sign Up</Button>
                    </Form>

                    <Row className='py-3'>
                        <Col>
                            Have an Account? {' '}
                            <Link to='/login'>
                                Login
                            </Link>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default RegisterScreen
