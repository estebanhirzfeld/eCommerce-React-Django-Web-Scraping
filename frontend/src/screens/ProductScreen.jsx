// hooks
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Link, useNavigate } from 'react-router-dom'
import { Row, Col, Card, Image, ListGroup, Button, Form } from 'react-bootstrap'


// components 
import Rating from '../components/Rating'
import ItemDetailLoader from '../components/itemDetailsLoader'
import CartList from '../components/CartList'

// actions
import { listProductDetails } from '../actions/productActions'
import { addToCart, removeFromCart } from '../actions/cartActions'

import CartToastNotification from '../components/CartToastNotification'
import '../components/styles/CartToastNotification.css'

function ProductScreen() {
    const [qty, setQty] = useState(1)
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const cart = useSelector(state => state.cart)
    const { cartItems, was_clicked } = cart

    useEffect(() => {
        dispatch(listProductDetails(id))
        
    }, [dispatch, id])


    const addToCartHandler = (id,qty) => {
        dispatch(addToCart(id,qty))

        CartToastNotification()
    }


    return (
        <div>
            <Button onClick={() => navigate(-1)} className='btn btn-light my-3' >Go Back </Button>
            {
                loading ? <ItemDetailLoader />
                    : error ? <h3>{error}</h3>
                        : product ?
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
                                    ? <Col md={4}><CartList qty={qty} cartItems={cartItems}/></Col>
                                    :
                                    <Col md={3}>
                                        <Card>
                                            <ListGroup variant='flush'>
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>
                                                            Price:
                                                        </Col>
                                                        <Col>
                                                            <strong>${product.price}</strong>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>
                                                            Status:
                                                        </Col>
                                                        <Col>
                                                            {product.countInStock > 0 ? `${product.countInStock} In Stock` : 'Out of Stock'}
                                                        </Col>
                                                    </Row>

                                                </ListGroup.Item>
                                                {product.countInStock <= 0 ?
                                                    <ListGroup.Item className='text-center'>
                                                        <Button className='mt-3 col-12 btn-block' type='button' disabled={product.countInStock === 0}>
                                                            Send stock reminder <i className="fa-solid fa-bell"></i>
                                                        </Button>
                                                    </ListGroup.Item>
                                                    :
                                                    <ListGroup.Item className='text-center'>
                                                        <Row className='justify-content-start align-items-center' >
                                                            <Col lg={5}><span>Quantity:</span></Col>
                                                            <Col lg={7}>
                                                                <Form.Control
                                                                    className='text-center'
                                                                    as='select'
                                                                    value={qty}
                                                                    onChange={(e) => setQty(e.target.value)}
                                                                >
                                                                    {
                                                                        [...Array(product.countInStock).keys()].map((x) => (
                                                                            <option key={x + 1} value={x + 1}>
                                                                                {x + 1}
                                                                            </option>
                                                                        ))
                                                                    }
                                                                </Form.Control>
                                                            </Col>
                                                        </Row>
                                                        <Button onClick={() => addToCartHandler(product.id,qty)} className='mt-3 col-12 btn-block' type='button' disabled={product.countInStock === 0}>
                                                            Add to Cart
                                                        </Button>
                                                    </ListGroup.Item>
                                                }
                                            </ListGroup>
                                        </Card>
                                    </Col>

                                }
                            </Row>
                            :
                            <h2>No Product Found</h2>
            }
            <div id="toast"><div id="img"><i className="fas fa-shopping-cart"></i></div><div id="desc">Product Added to Cart! </div></div>
        </div>
    )
}

export default ProductScreen