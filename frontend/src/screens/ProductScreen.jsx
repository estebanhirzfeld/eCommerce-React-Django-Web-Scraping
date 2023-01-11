// hooks
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Link, useNavigate } from 'react-router-dom'
import { Row, Col, Card, Image, ListGroup, Button, Form, Container } from 'react-bootstrap'


// components 
import Rating from '../components/Rating'
import ItemDetailLoader from '../components/itemDetailsLoader'
import CartList from '../components/CartList'

// actions
import { getWishlist, addToWishlist, removeFromWishlist } from '../actions/listsActions'

import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

import { addToCart, getCart, removeFromCart } from '../actions/cartActions'

import CartToastNotification from '../components/CartToastNotification'
import '../components/styles/CartToastNotification.css'

function ProductScreen() {

    const [was_added, setWasAdded] = useState(false)
    const [stock, setStock] = useState('')
    const [color, setColor] = useState('')
    const [sizes, setSizes] = useState('');
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const [image, setImage] = useState('')

    const { id } = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // UseSelector
    const login = useSelector(state => state.login)
    const { userInfo } = login

    const productCreateReview = useSelector(state => state.productCreateReview)
    const { success: successProductReview, error: errorProductReview, loading: loadingProductReview } = productCreateReview


    const cart = useSelector(state => state.cart)
    const { cartItems, was_clicked } = cart

    const wishlist = useSelector(state => state.wishlist)
    const { wishlistItems, loading: loadingWishlist, success: successWishlist, error: errorWishlist } = wishlist


    useEffect(() => {
        dispatch(listProductDetails(id))
        dispatch(getWishlist())
    }, [dispatch, id, successProductReview, errorProductReview])


    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product, success } = productDetails

    useEffect(() => {

        if (success && product?.colors) {
            setColor(Object.keys(product.colors)[0])
            setSizes(Object.keys(product.colors[Object.keys(product.colors)[0]])[0])
        }

    }, [product, success, color, sizes, productDetails])


    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(id, {
            rating,
            comment
        }))
    }

    const addToCartHandler = (id, qty, size,) => {
        // if the user is not logged in, redirect to login page
        if (!userInfo) {
            navigate('/login?redirect=shipping')
        } else {
            dispatch(addToCart(id, qty, size))
            dispatch(getCart())
            CartToastNotification()
        }
    }

    const addToWishlistHandler = (id) => {
        // if the user is not logged in, redirect to login page
        if (!userInfo) {
            navigate('/login?redirect=shipping')
        } else {
            if (was_added) {
                dispatch(removeFromWishlist(id))
                setWasAdded(false)
            } else {
                dispatch(addToWishlist(id))
                setWasAdded(true)
            }
        }
    }

    useEffect(() => {

        // if product is in wishlist, set the state to true
        if (wishlistItems.find(item => item.product.id === parseInt(id))) {
            setWasAdded(true)
        } else {
            setWasAdded(false)
        }

    }, [wishlistItems, id, loadingWishlist, successWishlist, errorWishlist, was_added, dispatch])


    const handleColorChange = event => {
        setColor(event.target.value)
    };

    const handleSizeChange = event => {
        setSizes(event.target.value)
    };

    return (
        <div>
            <Button onClick={() => navigate(-1)} className='btn btn-light my-3' >Go Back </Button>
            {
                loading ? <ItemDetailLoader />
                    : error ? <h3>{error}</h3>
                        : product ?
                            <Container>
                                <Row>
                                    <Col md={1}>
                                        {/* column of images */}
                                        <Row>
                                            {
                                                product.images ?
                                                    product.images.map((image, index) => (
                                                        <Col md={12} className={'mb-2'} key={index}>
                                                            <Image
                                                                src={`http://localhost:8000${image.image}`}
                                                                alt={product.name}
                                                                fluid
                                                                // onhover change the main image
                                                                onMouseOver={() => setImage(image.image)}
                                                            />
                                                        </Col>
                                                    ))
                                                    : null
                                            }
                                        </Row>

                                    </Col>
                                    <Col md={4}>
                                        <Image
                                            src={`http://127.0.0.1:8000${image}`}
                                            alt={product.name}
                                            fluid />

                                    </Col>

                                    <Col md={was_clicked ? 3 : 4}>
                                        <ListGroup variant='flush'>
                                            <ListGroup.Item>
                                                <h3>{product.name}</h3>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                {product.rating
                                                    ? <Rating
                                                        value={product.rating ? product.rating : '0'}
                                                        text={product.numReviews ? `${product.numReviews} reviews` : '0'}
                                                        color={'#f8e825'} />
                                                    : 'There is no rating for this product yet'}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                Price: ${product.price}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                Description: {product.description}
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Col>

                                    {was_clicked
                                        ?
                                        <Col md={4}>
                                            <CartList />
                                        </Col>
                                        :
                                        <Col md={3}>
                                            <Card>
                                                <ListGroup variant='flush'>
                                                    <ListGroup.Item>
                                                        <Row className='align-items-center justify-content-between'>
                                                            <Col>
                                                                Price:
                                                            </Col>
                                                            <Col>
                                                                <strong>${product.price}</strong>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>

                                                    <ListGroup.Item className='text-center'>
                                                        <Row className='justify-content-center align-items-center' >

                                                            {/* Colors */}
                                                            <Col md={6}>
                                                                Color:
                                                            </Col>
                                                            <Col xs='auto' className='my-1' md={6}>

                                                                {success && product?.colors && (
                                                                    <Form.Control as="select" onChange={handleColorChange}>
                                                                        {Object.keys(product?.colors || {}).map(color => (
                                                                            <option key={color} value={color}>{color}</option>
                                                                        ))}
                                                                    </Form.Control>
                                                                )}

                                                            </Col>

                                                            <Col md={6}>
                                                                Size:
                                                            </Col>
                                                            <Col xs='auto' className='my-1' md={6}>
                                                                {success && color && product?.colors && (
                                                                    <Form.Control as="select" onChange={handleSizeChange}>
                                                                        {color && sizes && product.colors[color] && Object.keys(product.colors[color]).map(size => (
                                                                            <option key={size} value={size}>{size}</option>
                                                                        ))}
                                                                    </Form.Control>
                                                                )}
                                                            </Col>


                                                            {
                                                                stock === 0 ?
                                                                    <Col>
                                                                        <Button className='mt-3 col-12 btn-block ' type='button' disabled={product.countInStock === 0}>
                                                                            Send stock reminder <i className="fa-solid fa-bell"></i>
                                                                        </Button>
                                                                    </Col>
                                                                    :
                                                                    (
                                                                        <>

                                                                            <Col md={6}>
                                                                                Quantity
                                                                            </Col>
                                                                            <Col xs='auto' className='my-1' md={6}>

                                                                                {
                                                                                    success && sizes && (
                                                                                        <Form.Control as="select">
                                                                                            {Array.from(Array(product.colors[color][sizes] + 1).keys()).map(i => (
                                                                                                <option key={i} value={i + 1}>{i + 1}</option>
                                                                                            ))}
                                                                                        </Form.Control>
                                                                                    )
                                                                                }

                                                                            </Col>
                                                                        </>
                                                                    )

                                                            }
                                                        </Row>

                                                        <Row className='justify-content-around align-items-center'>

                                                            <Button className='mt-3 col-3 col-md-12 col-lg-3 btn-block' type='button' onClick={() => addToWishlistHandler(product.id)}>
                                                                <i className="fa-solid fa-heart" style={{ color: was_added ? 'red' : 'black' }}></i>
                                                            </Button>
                                                            <Button onClick={() => addToCartHandler(product.id, qty, size)} className='mt-3 col-8 col-md-12 col-lg-8 btn-block' type='button' disabled={stock === 0}>
                                                                Add to Cart
                                                            </Button>
                                                        </Row>

                                                    </ListGroup.Item>

                                                </ListGroup>
                                            </Card>
                                        </Col>
                                    }


                                </Row>
                                {/* Leave a Review */}
                                <Row className='mt-5'>
                                    <Col md={8}>
                                        <ListGroup variant='flush'>
                                            <ListGroup.Item>
                                                <h2>Reviews</h2>
                                                {product?.reviews?.length === 0 &&
                                                    <div className='alert alert-info'>There are no reviews for this product yet</div>}
                                                <ListGroup variant='flush'>
                                                    {product.reviews.map(review => (
                                                        <ListGroup.Item key={review.id}>
                                                            <strong>{review.name}</strong>
                                                            <Rating value={review.rating} color={'#f8e825'} />
                                                            <p>{review.createdAt.substring(0, 10)}</p>
                                                            <p>{review.comment}</p>
                                                        </ListGroup.Item>
                                                    ))}
                                                    <ListGroup.Item>
                                                        <h2>Write a Customer Review</h2>
                                                        {errorProductReview &&
                                                            <div className='alert alert-danger' role='alert'>
                                                                {errorProductReview}
                                                            </div>
                                                        }
                                                        {userInfo ? (
                                                            <Form onSubmit={submitHandler}>
                                                                <Form.Group controlId='rating'>
                                                                    <Form.Label>Rating</Form.Label>
                                                                    <Form.Control
                                                                        as='select'
                                                                        required
                                                                        value={rating}
                                                                        onChange={(e) => setRating(e.target.value)}
                                                                    >
                                                                        <option value=''>Select...</option>
                                                                        <option value='1'>1 - Poor</option>
                                                                        <option value='2'>2 - Fair</option>
                                                                        <option value='3'>3 - Good</option>
                                                                        <option value='4'>4 - Very Good</option>
                                                                        <option value='5'>5 - Excellent</option>
                                                                    </Form.Control>
                                                                </Form.Group>
                                                                <Form.Group controlId='comment'>
                                                                    <Form.Label>Comment</Form.Label>
                                                                    <Form.Control
                                                                        as='textarea'
                                                                        row='3'
                                                                        value={comment}
                                                                        maxLength='200'
                                                                        onChange={(e) => setComment(e.target.value)}
                                                                    ></Form.Control>
                                                                </Form.Group>
                                                                <Button
                                                                    disabled={loadingProductReview}
                                                                    type='submit'
                                                                    variant='primary'
                                                                >
                                                                    Submit
                                                                </Button>
                                                            </Form>
                                                        ) : (
                                                            <div className='container-fluid alert alert-info'>
                                                                Please <Link to='/login'>sign in</Link> to write a review{' '}
                                                            </div>
                                                        )}
                                                    </ListGroup.Item>
                                                </ListGroup>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Col>

                                </Row>
                            </Container>
                            :
                            <h2>No Product Found</h2>
            }
            <div id="toast"><div id="img"><i className="fas fa-shopping-cart"></i></div><div id="desc">Product Added to Cart! </div></div>
        </div >
    )
}

export default ProductScreen
