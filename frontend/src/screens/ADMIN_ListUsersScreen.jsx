import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Container, Col, Row, Form, Button, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listUsers, deleteUser } from '../actions/userActions'


function ADMIN_ListUsersScreen() {
    const dispatch = useDispatch()

    const userList = useSelector(state => state.userList)
    const { loading, error, users } = userList

    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete } = userDelete


    const deleteUserHandler = (id) => {
        if (window.confirm('Are you sure?')) {
            dispatch(deleteUser(id))
        }
    }

    useEffect(() => {
        dispatch(listUsers())
    }, [dispatch, successDelete])
    
    return (
        <Container className='mt-5'>
                    <h1 className='my-5 text-center'>Users</h1>
            <Row className='justify-content-md-center'>
                <Col xs={12} md={12}>
                    {loading ? <h2>Loading...</h2> : error ? <h2>{error}</h2> : (
                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>EMAIL</th>
                                    <th className='text-center'>ADMIN</th>
                                    <th className='text-center'>EDIT</th>
                                    <th className='text-center'>MORE INFO</th>
                                    <th className='text-center'>DELETE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                        <td className='text-center'>
                                            {user.is_Admin ? (
                                                <i className='fas fa-check' style={{color: 'green'}}></i>
                                            ) : (
                                                <i className='fas fa-times' style={{color: 'red'}}></i>
                                            )}
                                        </td>
                                        <td className='text-center'>
                                            <LinkContainer to={`/admin/user/${user.id}/edit`}>
                                                <Button variant='light' className='btn-sm'>
                                                    <i className='fas fa-edit'></i>
                                                </Button>
                                            </LinkContainer>
                                        </td>
                                        <td className='text-center'>
                                            <LinkContainer to={`/admin/users/${user.id}`}>
                                                <Button variant='light' className='btn-sm'>
                                                    <i className='fa-solid fa-user'></i>
                                                </Button>
                                            </LinkContainer>
                                        </td>

                                        <td className='text-center'>
                                            <Button variant='danger' className='btn-sm' onClick={() => deleteUserHandler(user.id)}>
                                                <i className='fas fa-trash'></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default ADMIN_ListUsersScreen