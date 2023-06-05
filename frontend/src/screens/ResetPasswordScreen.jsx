import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Button, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../actions/userActions'

import { USER_PASSWORD_SEND_RESET_EMAIL_RESET, USER_PASSWORD_RESET_RESET } from '../constants/userConstants'

function ResetPasswordScreen() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { token, id } = useParams()
    const login = useSelector(state => state.login)
    const { userInfo } = login

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const userPasswordReset = useSelector(state => state.userPasswordReset)
    const { loading, error, success } = userPasswordReset

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert('Passwords do not match')
        }
        else {
            dispatch(resetPassword(id, token, password))
        }
    }

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                navigate('/login')
            }, 3000)
        }
    }, [success])

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
                        <h1 className='text-center mt-5'>Password Reset Successfully</h1>
                        <p className='text-center'>You will be redirected to the login page in 3 seconds.</p>
                    </>
                    :
                    <>
                        <h1 className='text-center mt-5'>Reset Password</h1>
                        <Form className='my-5 col-10 col-md-6' onSubmit={submitHandler}>
                            <Form.Group controlId='password'>
                                <Form.Label>New Password</Form.Label>
                                <Form.Control className='mb-4' type='password' required placeholder='Enter Password' name='password' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId='confirmPassword'>
                                <Form.Label>Confirm New Password</Form.Label>
                                <Form.Control className='mb-3' type='password' required placeholder='Confirm Password' name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Button type='submit' variant='primary' className='mt-3'>
                                {
                                    loading ?
                                        <div className="spinner-border text-light" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                        :
                                        'Reset Password'
                                }
                            </Button>
                        </Form>
                    </>
            }
        </Row>
    )
}

export default ResetPasswordScreen