import BASE_URL from '../../constants'

import React, { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'

// import product styles
import './styles/Product.css'

function Product({ product }) {

    const [isHovered, setIsHovered] = React.useState(false)
    const [image, setImage] = useState('')

    useEffect(() => {
        setImage(product.images[0]?.image)
    }, [product])

    useEffect(() => {
        if (isHovered && product.images[1]) {
            setImage(product.images[1]?.image)
        } else {
            setImage(product.images[0]?.image)
        }

    }, [isHovered])

    return (
        <Card className='h-100 my-3 rounded'>
            <Link to={`/product/${product.id}`}>
                <Card.Img
                    className='cardImage'
                    variant='top'
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    src={`${BASE_URL}${image}`}
                />

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
                    ${product.price}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Product