import React from 'react'
import {Link} from 'react-router-dom'
function ADMIN_Panel() {
    return (
    <>
        <h1>Welcome to the Admin Panel!</h1>

        <Link to="/admin/users"><h2 className='my-5'>Users</h2></Link>
        <Link to="/admin/orders"><h2 className='my-5'>Orders</h2></Link>

        </>
    )
}

export default ADMIN_Panel