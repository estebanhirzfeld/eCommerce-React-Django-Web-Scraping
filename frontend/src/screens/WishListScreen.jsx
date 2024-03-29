import BASE_URL from '../../constants'

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {LinkContainer} from 'react-router-bootstrap'

import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'

import { getWishlist, addToWishlist, removeFromWishlist } from '../actions/listsActions'

import '../components/styles/WishList.css'

function WishlistScreen() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const wishlist = useSelector(state => state.wishlist)
    const { wishlistItems, success, loading } = wishlist

    const removeFromWishListHandler = (wishlistItemId) => {
        dispatch(removeFromWishlist(wishlistItemId))
    }

    useEffect(() => {
        dispatch(getWishlist())
    }, [dispatch])
    
    console.log(wishlistItems)

    return (
        <Row>
            <Col md={8}>
                <h1>Wish List</h1>
                <ListGroup variant='flush'>
                    <Row>
                        {
                            wishlistItems && wishlistItems.length > 0 ? (
                                wishlistItems.map(item => (
                                    <Col md={4} className='col-6 mt-3' key={item.product.id}>
                                        <ListGroup.Item className='my-2 h-100' key={item.product.id}>
                                            <Row>
                                                <LinkContainer to={`/product/${item.product.id}`}>
                                                    <Col md={12} className='ratio ratio-1x1'>
                                                        <Image
                                                        src={`${BASE_URL}${item.product.images[0]?.image}`}
                                                        alt={item.product.name}
                                                        className='cardImage w-100' />
                                                    </Col>
                                                </LinkContainer>
                                                <Col md={12}>
                                                    <Link to={`/product/${item.product.id}`}>
                                                        {/* {item.product.name} */}
                                                        <p className='mt-2'>{item.product.name.length > 20 ? item.product.name.substring(0, 20) + '...' : item.product.name}</p>
                                                    </Link>
                                                </Col>
                                                <Col md={12}>
                                                    {item.product.price}
                                                </Col>
                                                <Col md={12}>
                                                    <Button className='col-12' type='button' variant='light' onClick={() => removeFromWishListHandler(item.product.id)}>
                                                        <i className='fas fa-trash'></i>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    </Col>
                                ))
                            ) : (
                                <p>Your wishlist is empty</p>
                            )
                        }
                    </Row>
                </ListGroup>
            </Col>
        </Row>

    )
}

export default WishlistScreen