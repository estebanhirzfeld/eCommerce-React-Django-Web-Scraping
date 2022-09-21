import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'

// import product styles
import './styles/Product.css'

function Product({ product }) {

    return (
        <Card className='h-100 my-3 rounded'>
            <Link to={`/product/${product.id}`}>
                <Card.Img className='cardImage'  src={`http://127.0.0.1:8000${product.image}`} variant='top' />
                {/* <Card.Img className='cardImage' src={product.images[0]} variant='top' /> */}
            </Link>
            <Card.Body >
                <Link to={`/product/${product.id}`}>
                    <Card.Title as='div'>
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>
                <Card.Text as='div'>
                    <div className='my-3'>
                        <Rating
                            value={product.rating ? product.rating : '0'}
                            text={product.numReviews ? `${product.numReviews} reviews` : '0'}
                            color={'#f8e825'}
                        />
                    </div>
                </Card.Text>
                <Card.Text as='h3'>
                    {product.price }
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Product