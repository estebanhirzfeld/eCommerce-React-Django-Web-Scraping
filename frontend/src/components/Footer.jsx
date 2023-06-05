import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import React from 'react';

function Footer() {
  return (
    <footer className="bg-dark text-light py-5">
      <Container>
        <Row>
          <Col md={3}>
            <h5>Section 1</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="/" className="nav-link p-0">
                  Home
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/category" className="nav-link p-0">
                  Features
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/pricing" className="nav-link p-0">
                  Pricing
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/faqs" className="nav-link p-0">
                  FAQs
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/about" className="nav-link p-0">
                  About
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h5>Section 2</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="/" className="nav-link p-0">
                  Home
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/category" className="nav-link p-0">
                  Features
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/pricing" className="nav-link p-0">
                  Pricing
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/faqs" className="nav-link p-0">
                  FAQs
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/about" className="nav-link p-0">
                  About
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h5>Section 3</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="/" className="nav-link p-0">
                  Home
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/category" className="nav-link p-0">
                  Features
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/pricing" className="nav-link p-0">
                  Pricing
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/faqs" className="nav-link p-0">
                  FAQs
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/about" className="nav-link p-0">
                  About
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h5>Subscribe to our newsletter</h5>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>

          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
