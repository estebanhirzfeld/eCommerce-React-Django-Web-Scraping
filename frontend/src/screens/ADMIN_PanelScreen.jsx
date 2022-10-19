import React from 'react'
import {Link} from 'react-router-dom'

import {useNavigate} from 'react-router-dom'

function ADMIN_PanelScreen() {


    const navigate = useNavigate()

    useEffect(() => {


    }, [])        

    return (
    <>
        <h1>Welcome to the Admin Panel!</h1>

        <Link to="/admin/users"><h2 className='my-5'>Users</h2></Link>
        <Link to="/admin/orders"><h2 className='my-5'>Orders</h2></Link>

        </>
    )
}

export default ADMIN_PanelScreen