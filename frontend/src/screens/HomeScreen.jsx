import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import { was_clicked_reset } from '../actions/cartActions'

import ItemLoader from '../components/ItemLoader'

import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'

function HomeScreen() {
    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const { loading, error, products } = productList

    useEffect(() => {
        dispatch(listProducts())
        dispatch(was_clicked_reset())


    }, [dispatch])



    return (
        <div>
            <h1 className='text-center' >Latest Products</h1>
            {loading ? <ItemLoader/>

                : error ? <h3>{error}</h3>
                    : products ?
                        <Row>
                            {products.map((product) => (
                                <Col key={product.id} sm={6} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                        : <h2>No Products Found</h2>
            }
        </div>


    )
}

export default HomeScreen