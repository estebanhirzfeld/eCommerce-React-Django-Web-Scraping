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
import FilterBar from '../components/FilterBar'



function HomeScreen() {
    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const { loading, error, products, page, pages, categories, min_price, max_price, colors_list } = productList

    const [searchParams] = useSearchParams();

    const keyword = searchParams.get('keyword') ? searchParams.get('keyword') : ''
    const [pageNumber, setPageNumber] = useState(searchParams.get('page') ? searchParams.get('page') : 1)
    const category = searchParams.get('category') ? searchParams.get('category') : ''
    const subcategory = searchParams.get('subcategory') ? searchParams.get('subcategory') : ''
    const priceFrom = searchParams.get('priceFrom') ? searchParams.get('priceFrom') : ''
    const priceTo = searchParams.get('priceTo') ? searchParams.get('priceTo') : ''
    const sortBy = searchParams.get('sortBy') ? searchParams.get('sortBy') : ''
    const color = searchParams.get('color') ? searchParams.get('color') : ''

    useEffect(() => {
        // scroll to top
        window.scrollTo(0, 0)
        // if link has category, then dispatch listProducts with category
        // if (searchParams.get('subcategory')) {
        //     dispatch(listProducts(keyword, pageNumber, category, subcategory))
        //     dispatch(was_clicked_reset())
        // }

        // else if (searchParams.get('category')) {
        //     dispatch(listProducts(keyword, pageNumber, category))
        //     dispatch(was_clicked_reset())
        // }
        // else {
        //     dispatch(listProducts(keyword, pageNumber))
        //     dispatch(was_clicked_reset())
        // }

        // export const listProducts = (keyword = '', pageNumber = 1, category = '', subcategory = '', priceFrom = '', priceTo = '', sortBy = '') => async (dispatch) => {
        dispatch(listProducts(keyword, pageNumber, category, subcategory, priceFrom, priceTo, sortBy, color))

    }, [dispatch, keyword, pageNumber, category, subcategory])

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
                searchParams.get('subcategory') ? <h1 className='text-center my-4'>{subcategory}</h1>
                    : searchParams.get('category') ? <h1 className='text-center my-4'>{category}</h1>
                        : <h1 className='text-center my-4'>All</h1>
            }

            {/* show params as tags */}
            <div className='d-flex justify-content-center'>
                <div className='d-flex flex-wrap justify-content-center'>
                    {
                        // keyword && <span className='badge bg-dark badge-pill badge-primary mx-1 my-1'>{keyword}</span> //cross icon to remove keyword
                        keyword && <span className='badge bg-dark badge-pill badge-primary mx-1 my-1'>{keyword}
                            {/* //cross icon to remove keyword */}
                            <i style={{cursor:'pointer'}} className="fas fa-times-circle mx-1" onClick={() => {
                                searchParams.delete('keyword')
                                window.location.search = searchParams.toString()
                            }}></i>
                        </span>
                    }
                    {
                        category && <span className='badge bg-dark badge-pill badge-primary mx-1 my-1'>{category}
                            <i style={{cursor:'pointer'}} className="fas fa-times-circle mx-1" onClick={() => {
                                searchParams.delete('category')
                                window.location.search = searchParams.toString()
                            }
                            }></i>
                        </span>
                    }
                    {
                        subcategory && <span className='badge bg-dark badge-pill badge-primary mx-1 my-1'>{subcategory}
                            <i style={{cursor:'pointer'}} className="fas fa-times-circle mx-1" onClick={() => {
                                searchParams.delete('subcategory')
                                window.location.search = searchParams.toString()
                            }
                            }></i>
                        </span>
                    }
                    {
                        priceFrom && <span className='badge bg-dark badge-pill badge-primary mx-1 my-1'>${priceFrom} - ${priceTo}
                            <i style={{cursor:'pointer'}} className="fas fa-times-circle mx-1" onClick={() => {
                                searchParams.delete('priceFrom')
                                searchParams.delete('priceTo')
                                window.location.search = searchParams.toString()
                            }
                            }></i>
                        </span>
                    }
                    {
                        sortBy && <span className='badge bg-dark badge-pill badge-primary mx-1 my-1'>{sortBy}
                            <i style={{cursor:'pointer'}} className="fas fa-times-circle mx-1" onClick={() => {
                                searchParams.delete('sortBy')
                                window.location.search = searchParams.toString()
                            }
                            }></i>
                        </span>
                    }
                    {
                        color && <span className='badge bg-dark badge-pill badge-primary mx-1 my-1'>{color}
                            <i style={{cursor:'pointer'}} className="fas fa-times-circle mx-1" onClick={() => {
                                searchParams.delete('color')
                                window.location.search = searchParams.toString()
                            }
                            }></i>
                        </span>
                    }
                </div>
            </div>





            <FilterBar
                category={category}
                subcategory={subcategory}
                keyword={keyword}
                pageNumber={pageNumber}

                categories={categories}
                colors_list={colors_list}
                min_price={min_price}
                max_price={max_price}
            />
            <div>
                {loading ? <ItemLoader />
                    : error ? <h3>{error}</h3>
                        : products && products?.length > 0 ? (
                            <Row>
                                {products.map((product) => (
                                    <Col key={product.id} sm={6} md={6} lg={4} xl={3} className='mb-5 col-6'
                                        // max-height=''50vh'
                                        style={{ maxHeight: '50%' }}
                                    >
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