import BASE_URL from '../../constants'

// hooks
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Link, useNavigate } from 'react-router-dom'
import { Row, Col, Card, Image, ListGroup, Button, Form, Container, ButtonGroup } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel';

// components 
import Rating from '../components/Rating'
import ItemDetailLoader from '../components/itemDetailsLoader'
import CartList from '../components/CartList'
import Selectors from '../components/Selectors'
import Product from '../components/Product'

// actions
import { getWishlist, addToWishlist, removeFromWishlist } from '../actions/listsActions'
import { listProductRecommendations } from '../actions/productActions'


import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

import { addToCart, getCart, removeFromCart } from '../actions/cartActions'

import CartToastNotification from '../components/CartToastNotification'
import '../components/styles/CartToastNotification.css'

// import ProductScreen css
import './styles/ProductScreen.css'

function ProductScreen() {

    const [was_added, setWasAdded] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [isDescription, setIsDescription] = useState(true)


    const [selectedImage, setSelectedImage] = useState('')

    const [activeIndex, setActiveIndex] = useState(0);

    const handleImageHover = (index) => {
        setActiveIndex(index);
    };

    const handleCarouselSelect = (selectedIndex, e) => {
        setActiveIndex(selectedIndex);
    };


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

    const productRecommend = useSelector(state => state.productRecommend)
    const { loading: loadingRecommendations, error: errorRecommendations, products: recommendations } = productRecommend




    useEffect(() => {
        window.scrollTo(0, 0)
        dispatch(listProductDetails(id))
        dispatch(getWishlist())
    }, [dispatch, id, successProductReview, errorProductReview])


    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product, success } = productDetails

    // if product not found, redirect to home page
    useEffect(() => {
        if (error) {
            // wait 3 seconds and redirect to home page
            setTimeout(() => {
                navigate('/')
            }
                , 3000)

        }
    }, [error, navigate])

    useEffect(() => {

        if (success && product?.images) {
            setSelectedImage(product.images[0])
        }
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

    // get product recommendations
    useEffect(() => {
        if (success) {
            dispatch(listProductRecommendations(id))
        }
    }, [dispatch, id, success])


    // const productUrl = this url
    // const productUrl = window.location.href;
    const productUrl = "https://www.satanaclothes.com/productos/camiseta-tul-bones"

    const pinterestShareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(productUrl)}`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}`;
    const instagramShareUrl = `https://www.instagram.com/zoldyck-clothes/`;


    return (
        <div>
            {
                loading ? <ItemDetailLoader />
                    : error ? <h3>{error}</h3>
                        : product ?
                            <Container>
                                <Row>
                                    <Col md={1} className={'d-none d-md-block'} style={{ maxHeight: '95vh', overflowY: 'scroll' }}>
                                        {/* column of images */}
                                        <Row>
                                            {product.images &&
                                                product.images.map((image, index) => (
                                                    <Col md={12} className={'mb-2'} key={index}>
                                                        <Image
                                                            src={`${BASE_URL}${image.image}`}
                                                            alt={product.name}
                                                            fluid
                                                            onMouseOver={() => handleImageHover(index)}
                                                        />
                                                    </Col>
                                                ))}
                                        </Row>
                                    </Col>
                                    <Col md={6}>
                                        <Carousel activeIndex={activeIndex} onSelect={handleCarouselSelect}>
                                            {product.images &&
                                                product.images.map((image, index) => (
                                                    <Carousel.Item key={index}>
                                                        <img className="d-block w-100" src={`${BASE_URL}${image.image}`} alt={product.name} />
                                                    </Carousel.Item>
                                                ))}
                                        </Carousel>
                                        <div className="text-center my-3">
                                            {/* Pinterest share button */}
                                            <a href={pinterestShareUrl} target="_blank" rel="noopener noreferrer">
                                                <i className="fab fa-pinterest-p fa-lg mx-2"></i>
                                            </a>
                                            {/* Facebook share button */}
                                            <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer">
                                                <i className="fab fa-facebook-f fa-lg mx-2"></i>
                                            </a>
                                            {/* Twitter share button */}
                                            <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer">
                                                <i className="fab fa-twitter fa-lg mx-2"></i>
                                            </a>
                                            {/* Instagram share button */}
                                            <a href={instagramShareUrl} target="_blank" rel="noopener noreferrer">
                                                <i className="fab fa-instagram fa-lg mx-2"></i>
                                            </a>
                                        </div>
                                    </Col>

                                    {was_clicked
                                        ?
                                        <Col md={5}>
                                            <CartList status={was_clicked} />
                                        </Col>
                                        :
                                        <Col md={5}>
                                            <div className='my-3 text-muted text-decoration-none'>
                                                {/* <Button onClick={() => navigate(-1)} className='btn btn-light my-3' >Go Back </Button> */}
                                                {/* BreadCrumbs */}
                                                {/* // to='/' className='text-decoration-none text-muted'>Home</Link> / <Link className='text-decoration-none text-muted' to={`/?category=${product?.category}`}>{product?.category}</Link> / {product?.subCategory ? <Link className='text-decoration-none text-muted' to={`/?category=${product?.category}&subcategory=${product?.subCategory}`}>{product?.subCategory}</Link> : ''} / {product?.name} */}
                                                {/* // Home / product?.category / product?.subcategory / product?.name */}

                                                <Link to='/' className='text-decoration-none text-muted'>
                                                    Home
                                                </Link>
                                                /
                                                <Link to={`/?category=${product?.category}`} className='text-decoration-none text-muted'>
                                                    {product?.category}
                                                </Link>
                                                {product?.subCategory
                                                    ?
                                                    <Link to={`/?category=${product?.category}&subcategory=${product?.subCategory}`} className='text-decoration-none text-muted'>
                                                        /{product?.subCategory}
                                                    </Link>
                                                    :
                                                    ''
                                                }
                                                /
                                                {product?.name}

                                            </div>
                                            <ListGroup variant='flush'>
                                                <ListGroup.Item>
                                                    <h3>{product.name}
                                                        {/* if user is admin add update button*/}
                                                        {userInfo && userInfo.is_Admin &&
                                                            <a href={`http://localhost:8000/api/products/scrape/${product.id}`} target="_blank" className='btn btn-light my-3' rel="noopener noreferrer">
                                                                <i className='fas fa-sync text-success'></i>
                                                            </a>
                                                        }
                                                        {/* if user is admin add link to django admin */}
                                                        {userInfo && userInfo.is_Admin &&
                                                            <a href={`http://localhost:8000/admin/base/product/${product.id}/change/`} target="_blank" className='btn btn-light my-3' rel="noopener noreferrer">
                                                                <i className='fas fa-edit text-danger'></i>
                                                            </a>
                                                        }
                                                        {/* if user is admin add link edit product */}
                                                        {userInfo && userInfo.is_Admin &&
                                                            <Link to={`/admin/product/${product.id}/edit`} className='btn btn-light my-3'>
                                                                <i className='fas fa-edit text-warning'></i>
                                                            </Link>
                                                        }

                                                        {
                                                            userInfo && userInfo.is_Admin &&
                                                            <a href={product.original_url} target="_blank" className='btn btn-light my-3' rel="noopener noreferrer">
                                                                <i className='fas fa-eye text-primary'></i>
                                                            </a>

                                                        }

                                                    </h3>

                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    {product.rating
                                                        ? <Rating
                                                            value={product.rating ? product.rating : '0'}
                                                            text={product.numReviews ? `${product.numReviews} reviews` : '0'}
                                                            color={'#f8e825'} />
                                                        : 'There is no rating for this product yet'}
                                                </ListGroup.Item>
                                                <ListGroup.Item className='my-3'>
                                                    ${product.price}
                                                </ListGroup.Item>
                                            </ListGroup>
                                            <Card className='border-0'>
                                                <ListGroup variant='flush'>
                                                    {
                                                        success && product?.colors ? (
                                                            <Selectors
                                                                colors={product.colors}
                                                                id={id}
                                                                was_added={was_added}
                                                                is_active={product.is_active}
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
                                {/* button to change between reviews amd description of the product */}
                                <ButtonGroup className='my-3 w-100 justify-content-between align-items-center'>
                                    <Button
                                        variant='outline-secondary'
                                        onClick={() => setIsDescription(true)}
                                    >
                                        Description
                                    </Button>
                                    <Button
                                        variant='outline-secondary'
                                        onClick={() => setIsDescription(false)}
                                    >
                                        Reviews
                                    </Button>
                                </ButtonGroup>
                                {/* if isDescription is true, show the description of the product */}
                                {isDescription
                                    ? <div>
                                        <h2>Description</h2>
                                        <p>{product.description}</p>
                                    </div>
                                    : <Row className='mt-5'>
                                        <Col md={12} lg={8} className='col-12'>
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
                                                                            <option value=''>Select... ⭐</option>
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
                                }
                                {/* Related Products */}
                                {
                                    recommendations?.length > 0 &&
                                    <Row className='mt-5'>
                                        <Col sm={12} className='col-12 mt-5'>
                                            <h4 className='text-center' >Related Products</h4>

                                            <Row>
                                                {recommendations?.map((product) => (
                                                    <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
                                                        <Product product={product} />
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Col>
                                    </Row>
                                }

                                <div className='mt-5 justify-content-center align-items-center text-center'>
                                    <Button className='btn btn-primary my-3 text-center'
                                        onClick={() => navigate('/')}
                                    >
                                        All Products
                                    </Button>
                                </div>

                            </Container>
                            :
                            <h2>No Product Found</h2>
            }
            <div id="toast"><div id="img"><i className="fas fa-shopping-cart"></i></div><div id="desc">Product Added to Cart! </div></div>
        </div >
    )
}



export default ProductScreen
