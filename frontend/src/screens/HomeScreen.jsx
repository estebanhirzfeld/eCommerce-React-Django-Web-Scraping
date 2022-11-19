import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import { was_clicked_reset } from '../actions/cartActions'

import { productListReducers } from '../reducers/productReducers'

// pagination
import { Pagination } from 'react-bootstrap'

import { useSearchParams } from 'react-router-dom'

import ItemLoader from '../components/ItemLoader'

import { Row, Col, Button } from 'react-bootstrap'
import Product from '../components/Product'

function HomeScreen() {
    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const { loading, error, products, page, pages } = productList

    const [searchParams] = useSearchParams();

    const keyword = searchParams.get('keyword') ? searchParams.get('keyword') : ''
    const [pageNumber, setPageNumber] = useState(searchParams.get('page') ? searchParams.get('page') : 1)

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber))
        dispatch(was_clicked_reset())
    }, [dispatch, keyword, pageNumber])


    return (
        <div>
            <h1 className='text-center' >Latest Products</h1>
            {loading ? <ItemLoader />

                : error ? <h3>{error}</h3>
                    : products && products?.length > 0 ? (
                        <Row>
                            {products.map((product) => (
                                <Col key={product.id} sm={6} md={6} lg={4} xl={3} className='mb-5'>
                                    <Product product={product} />
                                </Col>
                            ))}

                            {
                                pages > 1 && (
                                    <Pagination className='justify-content-center mt-5'>
                                        <>
                                            <Pagination.Prev onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 1} />
                                            {[...Array(pages).keys()].map((x) => (
                                                <Pagination.Item key={x + 1} active={x + 1 === page} onClick={() => setPageNumber(x + 1)}>
                                                    {x + 1}
                                                </Pagination.Item>
                                            ))}
                                            <Pagination.Next onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber === pages}/>
                                        </>
                                    </Pagination>
                                )

                            }
                        </Row>



                    ) : (
                        <p className='text-center mt-5'>No Products Found 😞</p>
                    )
            }
        </div>


    )
}

export default HomeScreen