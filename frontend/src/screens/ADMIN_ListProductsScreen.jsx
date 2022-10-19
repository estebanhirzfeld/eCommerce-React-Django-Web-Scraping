import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { listProducts, deleteProduct, createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

import { Table, Button, Row, Col, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

function ADMIN_ListProductsScreen() {

    const dispatch = useDispatch()
    const navigate = useNavigate()


    const login = useSelector(state => state.login)
    const { userInfo } = login

    const productDelete = useSelector(state => state.productDelete)
    const { loading: loadingDelete, success: successDelete, error: errorDelete } = productDelete

    const productCreate = useSelector(state => state.productCreate)
    const { loading: loadingCreate, success: successCreate, error: errorCreate, product: createdProduct } = productCreate

    const productList = useSelector(state => state.productList)
    const { loading, error, products } = productList

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure?')) {
            dispatch(deleteProduct(id))
        }
    }

    const updateHandler = (id) => {
        navigate(`/admin/product/${id}/edit`)
    }


    const createProductHandler = () => {
        dispatch(createProduct())
    }


    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET })
        if (!userInfo.is_Admin) {
            navigate('/')
        }
        if (successCreate) {
            navigate(`/admin/product/${createdProduct.id}/edit`)
        } else {
            dispatch(listProducts())
        }
    }, [dispatch, navigate, userInfo, successDelete, successCreate, createdProduct])

return (
    <Container className="mt-5">
        <Row className="align-items-center justify-content-between">
            <Col md={10} xs={6}>
                <h1>Products</h1>
            </Col>
            <Col className="text-right" md={2} xs={6}>
                <Button onClick={createProductHandler} className="my-3">
                    <i className="fas fa-plus"></i> Create Product
                </Button>
            </Col>
        </Row>


        {loadingDelete && <h2>Loading...</h2>}
        {errorDelete && <h2>{errorDelete}</h2>}


        {loadingCreate && <h2>Loading...</h2>}
        {errorCreate && <h2>{errorCreate}</h2>}



        {loading ? <h2>Loading...</h2> : error ? <h3>{error}</h3> : (
            <Table striped bordered hover responsive className="table-sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th className="text-center">IMAGE</th>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>CATEGORY</th>
                        <th>BRAND</th>
                        <th className="text-center">STOCK</th>
                        <th className='text-center'>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td className="text-center"><img src={`http://localhost:8000${product.image}`} alt={product.name} style={{ width: '50px' }} /></td>
                            <td>
                                <Link to={`/product/${product.id}`}>{product.name}</Link>
                            </td>
                            <td>{product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>
                            <td className="text-center">{product.countInStock}</td>
                            <td className='text-center'>
                                <Button onClick={() => updateHandler(product.id)} variant="light" className="btn-sm">
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <Button
                                    onClick={() => deleteHandler(product.id)}
                                    variant="danger" className="btn-sm">
                                    <i className="fas fa-trash"></i>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )}
    </Container>
)
}

export default ADMIN_ListProductsScreen