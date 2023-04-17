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
        // if product has no images set image placeholder
        if (product.images.length === 0) {
            setImage('https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png')
        }

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
        <Card className='h-100 my-3 border-0'
        style={{ transform: isHovered ? 'translateY(-10px)' : 'translateY(0px)', transition: 'transform 0.3s ease-in-out' }}
        >


        
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
                <Link to={`/product/${product.id}`} className='text-decoration-none text-dark text-start'>
                    <Card.Title as='div'>
                    
                        {/* <strong>{product.name}</strong> */}
                        {/* <strong>{product.name.toUpperCase()}</strong> */}
                        {/* to lower and then capital case every word */}
                        <strong>{product.name.toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase())}</strong> 
                        
                    </Card.Title>
                </Link>
                <Card.Text as='div'>
                    <div className='my-3'>
                        {/* if product has no rating, don't show the rating component */}
                        {
                            product.rating ? (
                                <Rating
                                    value={product.rating ? product.rating : '0'}
                                    text={product.numReviews ? `${product.numReviews} reviews` : '0'}
                                    color={'#f8e825'}
                                />
                            )
                                : null

                        }
                    </div>
                </Card.Text>
                <Card.Text as='h3' className='mb-3'>
                    ${product.price}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Product