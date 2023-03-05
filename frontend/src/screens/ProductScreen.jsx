import BASE_URL from '../../constants'

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
import Selectors from '../components/Selectors'

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
        window.scrollTo(0, 0)
        dispatch(listProductDetails(id))
        dispatch(getWishlist())
    }, [dispatch, id, successProductReview, errorProductReview])


    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product, success } = productDetails

    useEffect(() => {

        if (success && product?.images) {
            setImage(product.images[0].image)
        }

        // scroll to top

    }, [success, product])


    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(id, {
            rating,
            comment
        }))
    }

    const addToCartHandler = (id, qty, size, color) => {
        // if the user is not logged in, redirect to login page
        if (!userInfo) {
            navigate('/login?redirect=shipping')
        } else {
            dispatch(addToCart(id, qty, size, color))
            // dispatch(addToCart(106, 1, 'M', 'Negro'))
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
        if (wishlistItems && wishlistItems.length > 0 && product && product.id && !was_added) {

            if (wishlistItems.find(item => item.product.id === parseInt(id))) {
                setWasAdded(true)
            } else {
                setWasAdded(false)
            }
        }

    }, [wishlistItems, id, loadingWishlist, successWishlist, errorWishlist, was_added, dispatch])

    return (
        <div>
            <div className='my-3' >
            {/* <Button onClick={() => navigate(-1)} className='btn btn-light my-3' >Go Back </Button> */}
            {/* BreadCrumbs */}
            <Link to='/' >Products</Link> / <Link to={`/?category=${product?.category}`}>{product?.category}</Link> / {product?.name}

            </div>
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
                                                                src={`${BASE_URL}${image.image}`}
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
                                            src={`${BASE_URL}${image}`}
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
                                                    {
                                                        success && product?.colors ? (
                                                            <Selectors
                                                                colors={product.colors}
                                                                id={id}
                                                                was_added={was_added}
                                                                addToCartHandler={addToCartHandler}
                                                                addToWishlistHandler={addToWishlistHandler}

                                                            ></Selectors>
                                                        )
                                                            : null
                                                    }
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
