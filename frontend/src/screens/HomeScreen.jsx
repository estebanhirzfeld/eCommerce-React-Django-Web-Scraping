import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import { was_clicked_reset } from '../actions/cartActions'

import { productListReducers } from '../reducers/productReducers'

// pagination
import { Pagination } from 'react-bootstrap'

import { useSearchParams } from 'react-router-dom'

import ItemLoader from '../components/ItemLoader'

import { Row, Col, Container, Form } from 'react-bootstrap'
import Product from '../components/Product'

const categories = [
    'Inicio',
    'Vestidos',
    'Shorts y bermudas',
    'Faldas',
    'Remeras y tops',
    'Bodys',
    'Hoodies/buzos/sweaters',
    'Pantalones',
    'Remerones',
    'Conjuntos',
    'Mameluco',
    'Calzado',
    'Accesorios',
    'Remeras',
    'Trajes de baño',
    'Chalecos',
    'Corset',
    'Camperas',
    'Colección',
    'Sale !',
    'Sandalias',
    'Borcegos',
    'Botinetas',
    'Crema para cueros',
    'The end of $tw',
    'Shorts',
    'Buzos',
    'Mustaqe kids',
    'Mallas y bermudas',
    'Buzos y abrigos',
    'Gorras y beanies',
    'Otros',
]



function HomeScreen() {
    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const { loading, error, products, page, pages } = productList

    const [searchParams] = useSearchParams();

    const keyword = searchParams.get('keyword') ? searchParams.get('keyword') : ''
    const category = searchParams.get('category') ? searchParams.get('category') : ''
    const [pageNumber, setPageNumber] = useState(searchParams.get('page') ? searchParams.get('page') : 1)

    useEffect(() => {
        // scroll to top
        window.scrollTo(0, 0)

        // if link has category, then dispatch listProducts with category
        if (searchParams.get('category')) {
            dispatch(listProducts(keyword, pageNumber, category))
            dispatch(was_clicked_reset())
        }
        else {
            dispatch(listProducts(keyword, pageNumber))
            dispatch(was_clicked_reset())
        }

    }, [dispatch, keyword, pageNumber])

    function getPaginationButtons(pages, page) {
        const MAX_BUTTONS = 10; // maximum number of pagination buttons to display
    
        const startPage = Math.max(1, page - 5);
        const endPage = Math.min(startPage + MAX_BUTTONS - 1, pages);
    
        const buttons = [...Array(endPage - startPage + 1).keys()].map((i) => (
            <Pagination.Item 
                key={startPage + i} 
                active={startPage + i === page} 
                onClick={() => {
                    searchParams.set('page', startPage + i)
                    window.location.search = searchParams.toString()
                }}
            >
                {startPage + i}
            </Pagination.Item>
        ));
    
        return (
            <>
                {page > 1 && (
                    <Pagination.Prev 
                        onClick={() => {
                            searchParams.set('page', page - 1)
                            window.location.search = searchParams.toString()
                        }} 
                    />
                )}
                {buttons}
                {page < pages && (
                    <Pagination.Next 
                        onClick={() => {
                            searchParams.set('page', page + 1)
                            window.location.search = searchParams.toString()
                        }} 
                    />
                )}
            </>
        );
    }


    return (
        <>
            {
                // if link has category, then show category name
                searchParams.get('category')
                    ? <h1 className='text-center' >{searchParams.get('category')}</h1>
                    : <h1 className='text-center' >All Products</h1>

            }
            {/* filters Category and Price selects */}
            {/* <div className='d-flex justify-content-center'>
                <div className='d-flex flex-column'>
                    <label htmlFor='category'>Category</label>
                    <select name='category' id='category' className='form-select' onChange={(e) => {
                        searchParams.set('category', e.target.value)
                        searchParams.set('page', 1)
                        window.location.search = searchParams.toString()
                    }}>
                        {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))
                        }
                    </select>

                </div> */}
            {/* select using React-Bootstrap Form.Control */}
            <Container className='d-flex justify-content-center'>
                <Col md={4} justify-content-center align="center">
                    <Form.Group>
                        {/* Label Category */}

                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            as="select"
                            // default value params or all
                            value={searchParams.get('category') ? searchParams.get('category') : 'All'}
                            onChange={
                                (e) => {
                                    searchParams.set('category', e.target.value)
                                    searchParams.set('page', 1)
                                    window.location.search = searchParams.toString()
                                }
                            }
                            className='text-center'
                        >
                            {
                                categories ?
                                    categories.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))
                                    :
                                    <option>None</option>
                            }
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Container>



            <div>

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
                                            {getPaginationButtons(pages, page)}
                                        </Pagination>
                                    )

                                }
                            </Row>



                        ) : (
                            <p className='text-center mt-5'>No Products Found 😞</p>
                        )
                }

            </div>
        </>


    )
}

export default HomeScreen