import React from 'react'
import { Form, Col } from 'react-bootstrap'

function Selector({ label, handleChange, options }) {
    return (
        <>
            <Col md={6}>
                {label}:
            </Col>
            <Col xs='auto' className='my-1' md={6}>
                <Form.Control
                    as="select"
                    onClick={handleChange}
                >
                    {
                        options ?
                            options.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))
                            :
                            <option>None</option>
                    }
                </Form.Control>
            </Col>
        </>
    )
}

export default Selector

