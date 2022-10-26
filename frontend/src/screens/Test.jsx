import React, { useState } from "react"
import { Form, Button, Container, Col } from "react-bootstrap"

import SearchBar from "../components/SearchBar"

const Test = () => {

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
        </>
    )
}

export default Test