import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_DETAILS_RESET, PRODUCT_UPDATE_RESET } from '../constants/productConstants'

import { useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

const ADMIN_EditProductScreen = () => {

    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET })
            navigate('/admin/products')
        } else {
            if (!product?.name || product.id !== Number(id)) {
                dispatch({ type: PRODUCT_DETAILS_RESET })
                dispatch(listProductDetails(id))
            } else {
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
                // }
            }
        }
    }, [dispatch, id, product, successUpdate, navigate])

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        formData.append('id', id)

        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post('http://localhost:8000/api/products/upload/', formData, config)

            setImage(data)
            setUploading(false)
        } catch (error) {
            console.error(error)
            setImage('Error uploading file: ' + error.message)
            setUploading(false)
        }
    }



    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({
            id,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }))
    }

    return (

        <Container className='my-5'>
            <Link to='/admin/products' className='btn btn-light my-3'>Go Back</Link>
            <Row className='justify-content-md-center'>
                <Col md={6}>
                    <h1>Edit Product</h1>
                    {loading ? <h2>Loading...</h2> : error ? <h2>{error}</h2> : (

                        <Form onSubmit={submitHandler}>

                            <Form.Group controlId='name' className='my-3'>

                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type='name'
                                    placeholder='Enter name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='price' className='my-3'>
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='Enter price'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='image' className='my-3'>
                                <Form.Label>Image</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter image url'
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                ></Form.Control>
                                <Form.Control
                                    className='my-3'
                                    type='file'
                                    label='Choose File'
                                    onChange={uploadFileHandler}
                                ></Form.Control>
                                {uploading && <h2>Uploading...</h2>}
                            </Form.Group>


                            <Form.Group controlId='brand' className='my-3'>
                                <Form.Label>Brand</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter brand'
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='countInStock' className='my-3'>
                                <Form.Label>Count In Stock</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='Enter countInStock'
                                    value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='category' className='my-3'>
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter category'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='description' className='my-3'>
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type='text'
                                    as="textarea"
                                    rows={4}
                                    style={{ minHeight: '120px' }}
                                    placeholder='Enter description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            {/* greyed button on Uploading */}
                            {
                                uploading ? <Button variant='primary' type='submit' disabled>Update</Button> : <Button variant='primary' type='submit'>Update</Button>
                            }
                        </Form>
                    )}
                </Col>
            </Row>

        </Container>
    )
}

export default ADMIN_EditProductScreen
