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
import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

import { addToCart, removeFromCart } from '../actions/cartActions'

import CartToastNotification from '../components/CartToastNotification'
import '../components/styles/CartToastNotification.css'

function ProductScreen() {

    const [stock, setStock] = useState(1)
    const [size, setSize] = useState('')
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const { id } = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const login = useSelector(state => state.login)
    const { userInfo } = login

    const productCreateReview = useSelector(state => state.productCreateReview)
    const { success: successProductReview, error: errorProductReview, loading: loadingProductReview } = productCreateReview

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const cart = useSelector(state => state.cart)
    const { cartItems, was_clicked } = cart

    useEffect(() => {
        dispatch(listProductDetails(id))

    }, [dispatch, id, successProductReview, errorProductReview])


    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(id, {
            rating,
            comment
        }))

    }


    const addToCartHandler = (id, qty, size, countInStock) => {
        dispatch(addToCart(id, qty, size, countInStock))

        CartToastNotification()
    }

    console.log('product', product.sizes)

    return (
        <div>
            <Button onClick={() => navigate(-1)} className='btn btn-light my-3' >Go Back </Button>
            {
                loading ? <ItemDetailLoader />
                    : error ? <h3>{error}</h3>
                        : product ?
                            <Container>
                                <Row>
                                    <Col md={5}>
                                        <Image src={`http://127.0.0.1:8000${product.image}`} alt={product.name} fluid />
                                        {/* <Image src={product.images[0]} alt={product.name} fluid /> */}
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
                                        ? <Col md={4}><CartList qty={qty} cartItems={cartItems} /></Col>
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

                                                            <Col md={6}>
                                                                Size:
                                                            </Col>
                                                            <Col xs='auto' className='my-1' md={6}>
                                                                <Form.Control
                                                                    as='select'
                                                                    className='mr-sm-2 text-center'
                                                                    id='inlineFormCustomSelect'
                                                                    value={size.size}

                                                                    // onChange call 2 functions, one to set the size and one to set the stock based on the size selected
                                                                    onChange={(e) => {
                                                                        setSize(e.target.value)
                                                                        setStock(product.sizes.find((product) => product.size === e.target.value).stock)
                                                                    }}
                                                                >
                                                                    {
                                                                        product?.sizes?.map((size) => (
                                                                            <option key={size.id} value={size.size}>{size.size}</option>
                                                                        ))}
                                                                </Form.Control>
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
                                                                                <Form.Control
                                                                                    as='select'
                                                                                    className='mr-sm-2 text-center'
                                                                                    id='inlineFormCustomSelect'
                                                                                    value={qty}
                                                                                    onChange={(e) => setQty(e.target.value)}
                                                                                >
                                                                                    {
                                                                                        [...Array(stock).keys()].map((x) => (
                                                                                            <option key={x + 1} value={x + 1}>
                                                                                                {x + 1}
                                                                                            </option>
                                                                                        ))}
                                                                                </Form.Control>
                                                                            </Col>
                                                                        </>
                                                                    )

                                                            }
                                                        </Row>

                                                        <Row className='justify-content-around align-items-center'>

                                                            <Button className='mt-3 col-3 col-md-12 col-lg-3 btn-block' type='button' onClick={() => addToCartHandler(product.id, qty)}>
                                                                <i className="fa-solid fa-heart"></i>
                                                            </Button>
                                                            <Button onClick={() => addToCartHandler(product.id, qty, size, stock)} className='mt-3 col-8 col-md-12 col-lg-8 btn-block' type='button' disabled={stock === 0}>
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
