import React, { useEffect, useState } from 'react'
import { Container, Form, Button, Row } from 'react-bootstrap'
import { sendPasswordResetEmail } from '../actions/userActions.js'

import { Link } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { USER_PASSWORD_SEND_RESET_EMAIL_RESET, USER_PASSWORD_RESET_RESET } from '../constants/userConstants.js'




function ForgotPasswordScreen() {

    const dispatch = useDispatch()

    const [email, setEmail] = useState('')

    const login = useSelector(state => state.login)
    const { userInfo } = login

    // get userLogin state from store.js
    const userPasswordSendResetEmail = useSelector(state => state.userPasswordSendResetEmail)
    const { loading, error, success } = userPasswordSendResetEmail

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(sendPasswordResetEmail(email))
    }

    useEffect(() => {

        if (userInfo) {
            navigate('/')
        }

        dispatch({ type: USER_PASSWORD_SEND_RESET_EMAIL_RESET })
        dispatch({ type: USER_PASSWORD_RESET_RESET })
    }, [dispatch, userInfo])




    return (
        <Row className='d-flex justify-content-center align-items-center '>

            {
                success ?
                    <>

                        <h1 className='text-center my-5'>Email Sent</h1>
                        <p className='text-center'>
                            If the email you entered is associated with an account, you will receive an email with a link to reset your password.
                            <Link to='/login' className='text-center mt-4'>Return to Login</Link></p>
                        


                    </>
                    :

                    <>
                        <h1 className='text-center mt-5'>Forgot Password?</h1>
                        <Form className='my-5 col-10 col-md-6' onSubmit={submitHandler}>
                            <Form.Group controlId='email'>
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control type='email' required placeholder='Enter Email' name='email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Button type='submit' variant='primary' className='mt-3'>
                                {
                                    loading ?
                                    
                                    <div className="spinner-border text-light" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    :
                                    'Send Email'
                                }
                            </Button>
                        </Form>
                    </>
            }

        </Row>
    )
}

export default ForgotPasswordScreen