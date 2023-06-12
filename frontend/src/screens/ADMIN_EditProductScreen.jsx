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

    const [color_sizes, setColor_sizes] = useState([])
    const [sizes_to_delete, setSizes_to_delete] = useState([])

    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)

    // if user is not logged in or is not an admin, redirect to home
    useEffect(() => {
        if (!userInfo || !userInfo.is_Admin) {
            navigate('/')
        }

    }, [dispatch, navigate, userInfo])

    useEffect(() => {
        if (product) {
            console.log('product colors', product.colors);

            const updatedColorSizes = []; // Temporary array to hold the updated color sizes

            // Iterate through each color in product.colors
            for (const color in product.colors) {
                if (product.colors.hasOwnProperty(color)) {
                    const sizes = product.colors[color]; // Get the sizes object for the current color

                    // Iterate through each size in the sizes object
                    for (const size in sizes) {
                        if (sizes.hasOwnProperty(size)) {
                            const stock = Number(sizes[size]); // Get the stock value for the current size

                            // Create a new color_sizes object for the current color and size
                            const newColorSize = {
                                color: color,
                                size: size,
                                stock: stock,
                                id: size + color.charAt(0).toUpperCase() + color.slice(1), // Generate the ID based on the size and color
                            };

                            updatedColorSizes.push(newColorSize); // Add the new color_sizes object to the temporary array
                        }
                    }
                }
            }

            setColor_sizes(updatedColorSizes); // Set the state with the updated color sizes array
            console.log('color_sizes', updatedColorSizes);
        }
    }, [product]);



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
        // dispatch(updateProduct({
        //     id,
        //     name,
        //     price,
        //     brand,
        //     category,
        //     sizes,
        //     description,
        //     sizeToDel
        // }))

        console.log('Changes',
            {
                id,
                name,
                price,
                category,
                description,
                color_sizes,
                sizes_to_delete,
            })

        dispatch(updateProduct({
            id,
            name,
            price,
            category,
            description,
            color_sizes,
            sizes_to_delete,
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
                                            value={Number(stock)}
                                            onChange={(e) => setStock(Number(e.target.value))}
                                        ></Form.Control>
                                    </Col>
                                    {/* Add Button to add more sizes */}
                                    <Col md={3}>
                                        <Button variant='primary' className='my-3 w-100'

                                            onClick={
                                                () => {
                                                    // get size color and stock from inputs state and create an object
                                                    const sizeObject = { color, size, stock, id: size + color }
                                                    console.log('sizeObject', sizeObject)
                                                    // on every click add the object to the sizes array
                                                    // setColor_sizes([...color_sizes, sizeObject])
                                                    // if the size and color already exist in the array, just update the stock
                                                    if (color_sizes.some(e => e.id === sizeObject.id)) {
                                                        // get the index of the object
                                                        const index = color_sizes.findIndex(e => e.id === sizeObject.id)
                                                        // update the stock
                                                        Number(color_sizes[index].stock = Number(sizeObject.stock))
                                                        // update the state
                                                        setColor_sizes([...color_sizes])

                                                    } else {
                                                        // if the size and color dont exist in the array, just add the object
                                                        setColor_sizes([...color_sizes, sizeObject])
                                                    }


                                                    // clear inputs
                                                    setColor('')
                                                    setSize('')
                                                    setStock(0)
                                                    console.log('color_sizes', color_sizes)

                                                }
                                            }
                                        >
                                            <i className="fas fa-plus"></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Group>
                            {/* aqui va el map de los color_sizes que se agregan */}
                            {
                                color_sizes.map((sizeObject, index) => (
                                    <Row className='justify-content-md-center align-items-center' key={index}>
                                        <Col md={3}>
                                            <Form.Control
                                                className='text-center'
                                                type='text'
                                                placeholder='Color'
                                                value={sizeObject.color}
                                                onChange={(e) =>
                                                //    // get the index of the object to update the color
                                                {
                                                    const index = color_sizes.findIndex(e => e.id === sizeObject.id)
                                                    // update the color
                                                    color_sizes[index].color = e.target.value
                                                    // update the state
                                                    // setColor_sizes([...color_sizes])
                                                    // update the id of the object
                                                    color_sizes[index].id = color_sizes[index].size + e.target.value
                                                    // update the state
                                                    setColor_sizes([...color_sizes])
                                                }
                                                }


                                            ></Form.Control>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Control
                                                className='text-center'
                                                type='text'
                                                placeholder='Size'
                                                value={sizeObject.size}
                                                onChange={(e) =>
                                                // get the index of the object to update the size
                                                {
                                                    const index = color_sizes.findIndex(e => e.id === sizeObject.id)
                                                    // update the size
                                                    color_sizes[index].size = e.target.value
                                                    // update the state
                                                    // setColor_sizes([...color_sizes])
                                                    // update the id of the object
                                                    color_sizes[index].id = e.target.value + color_sizes[index].color
                                                    // update the state
                                                    setColor_sizes([...color_sizes])
                                                }
                                                }

                                            ></Form.Control>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Control
                                                className='text-center'
                                                type='number'
                                                placeholder='Stock'
                                                value={Number(sizeObject.stock)}
                                                onChange={(e) =>
                                                // get the index of the object to update the stock
                                                {
                                                    const index = color_sizes.findIndex(e => e.id === sizeObject.id)
                                                    // update the stock
                                                    color_sizes[index].stock = Number(e.target.value)
                                                    // update the state
                                                    setColor_sizes([...color_sizes])
                                                }
                                                }
                                            ></Form.Control>
                                        </Col>
                                        {/* Add Button to remove sizes with id */}
                                        <Col md={3}>
                                            <Button variant='danger' className='my-3 w-100'
                                                onClick={
                                                    () => {
                                                        // filter the sizes array to remove the size with the size id (size + color)
                                                        // add obj to the array sizes_to_delete
                                                        setColor_sizes(color_sizes.filter(size => size.id !== sizeObject.id)),
                                                            setSizes_to_delete([...sizes_to_delete, sizeObject])

                                                    }
                                                }
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                                
                                            </Button>
                                        </Col>
                                    </Row>
                                ))

                            }
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
