import React from 'react'

import { Link } from 'react-router-dom'

const categories = ['hombre', 'mujer', 'ninos', 'accesorios']

const handleCloseNav = () => {
    alert('close')
}

const pages = [
    {
        name: 'Home',
        link: '/'
    },
    {
        name: 'Women',
        link: '/category/women clothing'
    },
    {
        name: 'Men',
        link: '/category/men clothing'
    }
]

function Test() {
    return (
        <>

            <div className="container">
                <div className="row">
                    <h1 className='col-12 my-2 text-center text-primary'>Rusty</h1>
                    <h2 className='col-12 my-2 text-center text-primary'>Temporada 2023 Comming Soon</h2>
                    <img className='col-12 my-5 rounded' src="https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />

                    <div className='col-4'>
                        <img className='col-12 rounded' src="https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
                        <p className='text-center'>texto imagen 1</p>
                    </div>
                    <div className='col-4'>
                        <img className='col-12 rounded' src="https://images.pexels.com/photos/1314550/pexels-photo-1314550.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
                        <p className='text-center'>texto imagen 2</p>
                    </div>
                    <div className='col-4'>
                        <img className='col-12 rounded' src="https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
                        <p className='text-center'>texto imagen 3</p>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    {
                        pages.map((page, index) => (
                            <Link to={page.link}>
                                <buttton onClick={handleCloseNav} className='col-4 btn btn-primary' key={index}>
                                    {page.name}
                                </buttton>
                            </Link>
                        ))
                    }
                </div>
            </div>

        </>
    )
}

export default Test