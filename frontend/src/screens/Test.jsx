import React, { useState } from "react"
import { useEffect } from "react"
import { Form, Button, Container, Col, Image } from "react-bootstrap"

import SearchBar from "../components/SearchBar"

const Test = () => {

    const [hover, setHover] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')

    const products = [
        {
            name: 'Product 1',
            price: 100,
            description: 'Product 1 description',
            image: 'https://picsum.photos/200/300'
        },
        {
            name: 'Product 2',
            price: 200,
            description: 'Product 2 description',
            image: 'https://picsum.photos/200/300'
        }
    ]

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = {
            name,
            email,
            address,

            products
        }

        console.log('Order', data)
    }

    const submitHandler = (e) => {
        e.preventDefault();
        console.log(search);
    }


    return (
        <>
            <h1>Search Bar</h1>

            {/* image with div overlap */}
            <div style={{ position: 'relative', width: '300px', height: '300px' }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                <img src={'http://localhost:8000/images/BONES_1_cWukhjH.jpg'} style={{ width: '100%', height: '100%' }} />
                <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: hover ? 'block' : 'none' }}>
                    {/* trash button on center */}
                    <Button style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} onClick={() => alert('delete')} variant='danger'>
                        <i className="fas fa-trash-alt" style={{ color: 'white', fontSize: '2rem' }}></i>
                    </Button>
                </div>
            </div>















            {/* <Form onSubmit={submitHandler} inline>
                <Form.Control
                    type='text'
                    name='q'
                    onChange={(e) => setKeyword(e.target.value)}
                    className='mr-sm-2 ml-sm-5'
                ></Form.Control>

                <Button
                    type='submit'
                    variant='outline-success'
                    className='p-2'
                >
                    Submit
                </Button>
            </Form> */}

            <SearchBar />

            <Container>
                <p>Product List</p>
                {products.map((product, index) => (
                    <Col key={index} sm={12} md={6} lg={4} xl={3}>
                        <strong>
                            {product.name}
                        </strong>
                    </Col>
                ))}
            </Container>

            <Form onSubmit={handleSubmit}>

                {/* name */}
                <Form.Group className="my-4" controlId="name">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Ingrese el nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                {/* email */}
                <Form.Group className="my-4" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        required
                        type="email"
                        placeholder="Ingrese el email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                {/* address */}
                <Form.Group className="my-4" controlId="address">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Ingrese la dirección"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                {/* submit */}
                <Button type="submit" variant="primary">
                    Submit
                </Button>


            </Form>

            {/* Satana */}
            Bodys
            Calzas
            Monoprendas

            {/* Kitanas */}
            Lovers Era Ss'23
            Mayoristas
            Temporada Pasada
            Accesorios

            {/* Hippy Killer */}
            Chombas
            Camisas
            {/* Shorts */} {/* Bermudas */}
            Shorts Y Bermudas
            {/* Buzos */} {/* Sweaters */}
            Buzos Y Sweaters
            {/* Remeras */} {/* Top */} {/* Crop Top */}
            Remeras Y Tops
            Hawaiana
            Pantalones
            Polleras
            Bikers
            {/* Shorts */} {/* Faldas */}
            Faldas Y Shorts
            Camperas
            Vestidos
            Conjuntos Deportivos



            {/* Scraping */}

            Important:+ products from last update to last update
            1st products with more views
            2nd products more selled
            3rd products with more cart items
            4th products with more wishlist items
            5th products with more reviews

            {/* Envios gratis en todos los productos */}







        </>
    )
}

export default Test
