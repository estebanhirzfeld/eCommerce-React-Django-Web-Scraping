import { useSearchParams } from 'react-router-dom'
import { Breadcrumb, Button, Dropdown, Form, Nav, Collapse, Col, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';

import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

import './styles/FilterBar.css';

import Drawer from 'react-drawer';
import 'react-drawer/lib/react-drawer.css';

function FilterBar({ category, subcategory, keyword, pageNumber, categories, colors_list, min_price, max_price }) {
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState({});
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedColors, setSelectedColors] = useState([]);

    const [searchParams] = useSearchParams();

    const handlePriceChange = (value) => {
        setPriceRange(value);
    };

    const handleColorChange = (event) => {
        const color = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setSelectedColors((prevSelectedColors) => [...prevSelectedColors, color]);
        } else {
            setSelectedColors((prevSelectedColors) =>
                prevSelectedColors.filter((c) => c !== color)
            );
        }
    };

    const applyPriceRange = (e) => {
        e.preventDefault();
        searchParams.set('priceFrom', priceRange.min);
        searchParams.set('priceTo', priceRange.max);
        window.location.href = `/?${searchParams.toString()}`;
    };

    const clearFilters = () => {
        setSelectedCategory(null);
        setSelectedColors([]);
        setPriceRange({ min: min_price, max: max_price });
        searchParams.delete('category');
        searchParams.delete('subcategory');
        searchParams.delete('priceFrom');
        searchParams.delete('priceTo');
        searchParams.delete('color');
        searchParams.delete('sortBy');
        window.location.href = `/?${searchParams.toString()}`;
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    useEffect(() => {
        // set price range
        setPriceRange({ min: min_price, max: max_price });
    }, (min_price, max_price));

    // const categories = ['Vestidos', 'Shorts y bermudas', 'Faldas', 'Remeras y tops', 'Bodys', 'Hoodies/buzos/sweaters', 'Pantalones', 'Conjuntos', 'Mameluco', 'Calzado', 'Camisas', 'Accesorios', 'Chalecos', 'Corset', 'Camperas', 'Kids', 'Otros',
    // ]

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                {/* Breadcrumb */}
                <Breadcrumb className="d-none d-md-flex">
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item href="/">
                        {
                            searchParams.get('category') ? searchParams.get('category') : 'All'
                        }
                    </Breadcrumb.Item>
                    {/* // if subCategory exists, then show it */}
                    {
                        searchParams.get('subcategory') && (
                            <Breadcrumb.Item href="/category/subcategory" active>
                                {searchParams.get('subcategory')}
                            </Breadcrumb.Item>
                        )
                    }
                </Breadcrumb>
                
                    <Row className='d-flex align-items-center justify-content-between text-center'>
                        {/* Filter */}
                        <Col className='col-4'>
                            <Button variant="outline-primary" className="me-2" onClick={() => setShowFilters(!showFilters)}>
                                Filter
                            </Button>
                        </Col>
                        {/* Sort By*/}
                        <Col className='col-4'>
                            <Dropdown>
                                <Dropdown.Toggle id="dropdown-basic" variant="outline-primary">
                                    Sort By
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-1" onClick={() => {
                                        searchParams.set('sortBy', 'Lowest')
                                        window.location.href = `/?${searchParams.toString()}`
                                    }}>Price: Low to High</Dropdown.Item>

                                    <Dropdown.Item href="#/action-2" onClick={() => {
                                        searchParams.set('sortBy', 'Highest')
                                        window.location.href = `/?${searchParams.toString()}`
                                    }}>Price: High to Low</Dropdown.Item>

                                    <Dropdown.Item href="#/action-4" onClick={() => {
                                        searchParams.set('sortBy', 'Popularity')
                                        window.location.href = `/?${searchParams.toString()}`
                                    }}>Popularity</Dropdown.Item>

                                    <Dropdown.Item href="#/action-5" onClick={() => {
                                        searchParams.set('sortBy', 'Newest')
                                        window.location.href = `/?${searchParams.toString()}`
                                    }}>Newest</Dropdown.Item>

                                    <Dropdown.Item href="#/action-3" onClick={() => {
                                        searchParams.set('sortBy', 'Rating')
                                        window.location.href = `/?${searchParams.toString()}`
                                    }}>Rating</Dropdown.Item>

                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>

                        {/* clear filters */}
                        <Col className='col-4'>
                            <Button variant="primary" className="me-2" onClick={clearFilters}>
                                {/* Clear */}
                                <i className="fas fa-times"></i>
                            </Button>
                        </Col>
                    </Row>
            </div>

            <Collapse in={showFilters} className='mb-5'>
                <div className="mt-3">
                    <Form>
                        <Row>
                            <Col xs={12} md={4}>
                                <Form.Group>
                                    <Form.Label className='my-3'>Filter By Category</Form.Label>
                                    <Form.Select
                                        aria-label="Filter by category"
                                        value={category}
                                        onChange={
                                            (e) => {
                                                // clear search all params
                                                searchParams.delete('keyword')
                                                searchParams.delete('subcategory')
                                                // set new params
                                                searchParams.set('category', e.target.value)
                                                searchParams.set('page', 1)
                                                window.location.search = searchParams.toString()
                                            }
                                        }
                                    >
                                        <option>Select a category</option>
                                        {categories?.map((category) => (
                                            <option key={category}>{category}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            {/* Color */}
                            <Col xs={12} md={4}>
                                <Form.Group>
                                    <Form.Label className='my-3'>Filter By Color</Form.Label>
                                    <Form.Select
                                        aria-label="Filter by color"
                                        // value={selectedColors}
                                        onChange={
                                            (e) => {
                                                // clear search all params
                                                searchParams.delete('keyword')
                                                searchParams.delete('subcategory')
                                                // set new params
                                                searchParams.set('color', e.target.value)
                                                searchParams.set('page', 1)
                                                window.location.search = searchParams.toString()
                                            }
                                        }
                                    >
                                        <option>Select a color</option>
                                        {
                                            colors_list?.map((color) => (
                                                <option key={color}>{color}</option>
                                            ))
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            {/* in Desktop show slider, in mobile show 2 inputs */}
                            {/* Slider */}
                            <Col className='d-none d-md-block col-md-4' xs={12} md={4}> {/* show on desktop and hide on mobile */}
                                <Form.Group>
                                    <Form.Label className='my-3'>Filter By Price: ${priceRange.min} - ${priceRange.max}</Form.Label>
                                    <div className="d-flex align-items-center">
                                        <InputRange
                                            minValue={min_price}
                                            maxValue={max_price}
                                            value={priceRange}
                                            onChange={handlePriceChange}
                                        />
                                        <Button variant="outline-primary" className="ms-3" onClick={applyPriceRange}>
                                            Apply
                                        </Button>
                                    </div>
                                </Form.Group>
                            </Col>
                            {/* Inputs */}
                            <Col className='d-block d-md-none col-md-4' xs={12} md={4}> {/* show on mobile and hide on desktop */}
                            
                                <Form.Group onSubmit={(e) => applyPriceRange(e)}>
                                    <Form.Label className='my-3'>Filter By Price</Form.Label>
                                    <div className="d-flex align-items-center">
                                        {/* label Min */}
                                        <Form.Label className="me-3">Min</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange.min}
                                            onChange={(e) =>
                                                handlePriceChange({
                                                    ...priceRange,
                                                    min: e.target.value,
                                                })
                                            }
                                        />
                                        <div className="mx-3"></div>
                                        {/* label Max */}
                                        <Form.Label className="me-3">Max</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange.max}
                                            onChange={(e) =>
                                                handlePriceChange({
                                                    ...priceRange,
                                                    max: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <Button variant="primary" className="mt-4 w-100" type='submit' onClick={applyPriceRange}>
                                        Apply
                                    </Button>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Collapse>
        </>
    );
}

export default FilterBar;
