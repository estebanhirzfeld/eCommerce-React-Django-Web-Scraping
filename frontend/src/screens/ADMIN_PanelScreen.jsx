import React,{useEffect} from 'react'
import {Link} from 'react-router-dom'

import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {useDispatch} from 'react-redux'
import { Container } from 'react-bootstrap'

function ADMIN_PanelScreen() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const login = useSelector(state => state.login)
    const { userInfo } = login
    
    // if user is not logged in or is not an admin, redirect to home
    useEffect(() => {
        if (!userInfo || !userInfo.is_Admin) {
            navigate('/')
        }
    }, [navigate, userInfo])

    return (
    <Container className='mt-5 text-center'>
        <h1>Welcome to the Admin Panel!</h1>

        <Link to="/admin/users"><h2 className='my-5'>Users</h2></Link>
        <Link to="/admin/orders"><h2 className='my-5'>Orders</h2></Link>
        <Link to="/admin/products"><h2 className='my-5'>Products</h2></Link>

        </Container>
    )
}

export default ADMIN_PanelScreen