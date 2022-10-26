import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import { was_clicked_reset } from '../actions/cartActions'

import { useParams } from 'react-router-dom'

import ItemLoader from '../components/ItemLoader'

import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Paginate from '../components/Paginate'

function HomeScreen() {
    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const { loading, error, products, page, pages } = productList

    const { keyword } = useParams()

    useEffect(() => {
        if (keyword) {
            dispatch(listProducts(keyword))
        } else {
            dispatch(listProducts())
        }
        dispatch(was_clicked_reset())

    }, [dispatch, keyword])

    return (
        <div>
            <h1 className='text-center' >Latest Products</h1>
            {loading ? <ItemLoader />

                : error ? <h3>{error}</h3>
                    : products && products?.length > 0 ? (
                        <Row>
                            {products.map((product) => (
                                <Col key={product.id} sm={6} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                            <Col className='mt-5 d-flex justify-content-center' sm={12} md={12} lg={12} xl={12}>
                                <Paginate pages={pages} page={page} keyword={keyword} />
                            </Col>
                        </Row>

                    ) : (
                        <p className='text-center mt-5'>No Products Found 😞</p>
                    )
            }
        </div>


    )
}

export default HomeScreen