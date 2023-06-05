import BASE_URL from '../../constants'

import React, { useEffect } from 'react';
import { Container, Row, Col, Carousel, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';

const LandingPageScreen = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listProducts());
    }, [dispatch]);

    const productList = useSelector((state) => state.productList);
    const { loading, error, products } = productList;


    const categories = ['Vestidos', 'Faldas', 'Remeras y tops', 'Bodys', 'Remeras y Tops', 'Shorts y Bermudas', 'Pantalones', 'Shorts y bermudas', 'Hoodies/buzos/sweaters', 'Mamelucos', 'Accesorios', 'Remeras', 'REMERONES', 'OUTLET', 'CHALECOS', 'TOPS', 'Hoodies/Buzos/Sweaters', 'Buzos y Abrigos', 'Mallas y bermudas', 'ACCESORIOS', 'Productos', 'Gorras y Beanies', 'MONOPRENDAS']



    return (
        <div>
            <header>
                {/* Aquí puedes agregar tu encabezado */}
            </header>

            <main>
                <Container fluid>
                    {/* ... */}
                    {categories.map((category) => (
                        <Row key={category}>
                            <Col>
                                <h2>{category}</h2>
                                {loading ? (
                                    <p>Cargando productos...</p>
                                ) : error ? (
                                    <p>Error al cargar los productos.</p>
                                ) : (
                                    <Carousel>
                                        {products
                                            .filter((product) => product.category === category)
                                            .map((product) => (
                                                <Carousel.Item key={product._id}>
                                                    <Image
                                                        className="d-block w-100"
                                                        src={`${BASE_URL}${product.images[0]?.image}`}
                                                        alt={product.name}
                                                        style={{ height: '400px', objectFit: 'cover' }}
                                                    />
                                                    <Carousel.Caption>
                                                        <h3>{product.name}</h3>
                                                        <p>{product.description}</p>
                                                    </Carousel.Caption>
                                                </Carousel.Item>
                                            ))}
                                    </Carousel>
                                )}
                            </Col>
                        </Row>
                    ))}
                </Container>
            </main>

            <footer>
                {/* Aquí puedes agregar tu pie de página */}
            </footer>
        </div>
    );
};

export default LandingPageScreen;
