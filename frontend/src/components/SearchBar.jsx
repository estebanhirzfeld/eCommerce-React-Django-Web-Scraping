import React, { useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { createSearchParams, useNavigate } from 'react-router-dom'

function SearchBar() {


    const navigate = useNavigate()

    const [keyword, setKeyword] = useState('')

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/?${createSearchParams({ keyword: keyword, page: 1 })}`);
        } else {
            navigate('/');
        }
    }

    return (
        <Form onSubmit={submitHandler} className='d-flex'>
            <Row className='align-items-center'>
                <Col sm={12} md={8} lg={10}>
                    <Form.Control
                        type="text"
                        name="search"
                        onChange={(e) => setKeyword(e.target.value)}
                        value={keyword}
                        placeholder={"Search Products..."}
                        className="mr-sm-2 ml-sm-5"
                    >
                    </Form.Control>
                    {/* Clear search button */}
                    {/* {keyword ?
                        <Button
                            type="button"
                            variant="light"
                            onClick={() => setKeyword('')}
                            style={{ marginTop:'-71px', zIndex: '-100', marginLeft: '187px' }}
                        >
                            <i className="fas fa-times"></i>
                        </Button>
                        : null} */}





                </Col>
                <Col sm={12} md={4} lg={2}>
                    <Button
                        type="submit"
                        variant="outline-success"
                        className="p-2 mr-5"
                    >
                        Search
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default SearchBar