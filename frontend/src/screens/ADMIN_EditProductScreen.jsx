import BASE_URL from '../../constants.js'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap'

import { listProductDetails, updateProduct, deleteProductImage } from '../actions/productActions'
import { PRODUCT_DETAILS_RESET, PRODUCT_UPDATE_RESET } from '../constants/productConstants'

import { useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'


import '..//components//styles///EditProductScreen.css'

const ADMIN_EditProductScreen = () => {

    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const login = useSelector(state => state.login)
    const { userInfo } = login

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate

    const productImageDelete = useSelector(state => state.productImageDelete)
    const { loading: loadingImageDelete, error: errorImageDelete, success: successImageDelete } = productImageDelete

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')

    const [stock, setStock] = useState(0)
    const [size, setSize] = useState('')
    const [color, setColor] = useState('')

    const [sizes, setSizes] = useState([])
    const [sizeToDel, setSizeToDel] = useState([])

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
                if (product.image) {
                    setImage(product.image)
                }
                setBrand(product.brand)
                setCategory(product.category)
                setSizes(product.sizes)
                setDescription(product.description)
            }
        }
    }, [dispatch, id, product, successUpdate, navigate])

    const uploadFilesHandler = async (e) => {
        const files = e.target.files
        const length = files.length
        const formData = new FormData()
        formData.append('product_id', id)
        formData.append('images', files[0])
        for (let i = 1; i < length; i++) {
            formData.append('images', files[i])
        }

        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${userInfo.token}`
                }
            }

            const { data } = await axios.post(`${BASE_URL}/api/products/upload/`, formData, config)

            setImage(data)
            console.log(data)
            setUploading(false)
            dispatch(listProductDetails(id))
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
            sizes,
            description,
            sizeToDel
        }))

    }

    const deleteProductImageHandler = (id) => {
        if (window.confirm('Are you sure?')) {
            dispatch(deleteProductImage(id))
        } else
            return
    }

    useEffect(() => {
        if (successImageDelete) {
            dispatch({ type: PRODUCT_UPDATE_RESET })
            dispatch(listProductDetails(id))
        }
    }, [dispatch, id, successImageDelete])

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

                            <Form.Group controlId='images' className='my-3'>
                                <Form.Label>Image</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter image url'
                                    value={image}
                                    disabled
                                    onChange={(e) => setImage(e.target.value)}
                                ></Form.Control>

                                {/* display imagenes overflow scroll */}
                                <Row
                                    // overflow scroll
                                    className='my-3 
                                w-100
                                overflow-scroll
                                overflow-y-hidden
                                flex-nowrap
                                '
                                >
                                    {
                                        product.images?.map((image, index) => (
                                            <Col md={4} className='productImageContainer'>
                                                <img src={`${BASE_URL}${image.image}`} alt={name} className='productImage' />
                                                <div className='imageDeleteDiv'>
                                                    {/* trash button on center */}
                                                    <Button className='deleteButton' onClick={() => { deleteProductImageHandler(image.id) }
                                                    } variant='danger'>
                                                        <i className="fas fa-trash-alt" style={{ color: 'white', fontSize: '2rem' }}></i>
                                                    </Button>
                                                </div>
                                            </Col>
                                        ))
                                    }
                                </Row>

                                <Form.Control
                                    className='my-3'
                                    type='file'
                                    label='Choose File'
                                    multiple
                                    onChange={uploadFilesHandler}
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

                            <Form.Group controlId='size' className='my-3'>

                                <Form.Label>Color, Size and Stock</Form.Label>


                                <Row className='justify-content-md-center align-items-center'>
                                    <Col md={3}>
                                        <Form.Control
                                            className='text-center'
                                            type='text'
                                            placeholder='Color'
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                        ></Form.Control>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Control
                                            className='text-center'
                                            type='text'
                                            placeholder='Size'
                                            value={size}
                                            onChange={(e) => setSize((e.target.value).toUpperCase())}
                                        ></Form.Control>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Control
                                            className='text-center'
                                            type='number'
                                            placeholder='Stock'
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                        ></Form.Control>
                                    </Col>
                                    {/* Add Button to add more sizes */}
                                    <Col md={3}>
                                        <Button variant='primary' className='my-3 w-100'
                                            onClick={
                                                // if size already exists, update stock
                                                // else add new size
                                                () => {
                                                    if (sizes?.some((item) => item.size === size)) {
                                                        console.log('size already exists')
                                                        const newSizes = sizes.map((item) => {
                                                            if (item.size === size) {
                                                                return { id: item.id, size: item.size, stock: stock }
                                                            } else {
                                                                return item
                                                            }
                                                        })
                                                        console.log('newSizes', newSizes)
                                                        setSizes(newSizes)
                                                        setSize('')
                                                        setStock('')
                                                    } else {
                                                        setSizes([...sizes, { size, stock }])
                                                        setSize('')
                                                        setStock('')
                                                    }
                                                }
                                            }
                                        >
                                            <i className="fas fa-plus"></i>
                                        </Button>
                                    </Col>
                                </Row>
                                {

                                    sizes?.map((size, index) => (

                                        <Row key={index} className='justify-content-center align-items-center my-2'>

                                            <Col md={5}>
                                                <Form.Control
                                                    className='text-center'
                                                    type='text'
                                                    placeholder='Enter size'
                                                    value={size.size}
                                                    onChange={(e) => {
                                                        const values = [...sizes]
                                                        values[index].size = e.target.value
                                                        setSizes(values)
                                                    }}
                                                ></Form.Control>
                                            </Col>
                                            <Col md={5}>
                                                <Form.Control
                                                    className='text-center'
                                                    type='number'
                                                    placeholder='Enter stock'
                                                    value={size.stock}
                                                    onChange={(e) => {
                                                        const values = [...sizes]
                                                        values[index].stock = e.target.value
                                                        setSizes(values)
                                                    }}
                                                ></Form.Control>
                                            </Col>

                                            <Col md={2}>
                                                {/* Delete size button */}
                                                <Button variant='danger' className='btn-sm w-100 h-100'
                                                    onClick={
                                                        () => {
                                                            setSizes(sizes.filter((s, i) => i !== index))
                                                            // if has id add to setSizeToDel
                                                            if (size.id) {
                                                                setSizeToDel([...sizeToDel, size.id])
                                                            }
                                                        }
                                                    }
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </Button>
                                            </Col>
                                        </Row>
                                    ))

                                }

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

        </Container >
    )
}

export default ADMIN_EditProductScreen
