import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import React from 'react';

function Footer() {
  return (
    <footer className="bg-dark text-light py-5">
      <Container>
        <Row>
          <Col md={3}>
            <h5>Navigation</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <a href="/" className="nav-link p-0 ">
                  Home
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="/" className="nav-link p-0 ">
                  Products
                </a>
              </li>
              <li className="nav-item mb-2">
                <Link to="/Contact" className="nav-link p-0">
                  Contact
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h5>Contact Us</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="/Contact" className="nav-link p-0">
                  Contact
                </Link>
              </li>
              <li className="nav-item mb-2">
                <a href="#" className="nav-link p-0">
                  example@mail.com
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="#" className="nav-link p-0">
                  +91 1234567890
                </a>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h5>Follow Us</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <a href="https://www.instagram.com/zoldyck-clothes/"
                  target="_blank"
                  className="nav-link p-0">
                  {/* insta icon */}
                  <i className="fab fa-instagram fa-lg"></i>
                  <span className="ms-1">Instagram</span>
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="https://www.facebook.com/Zoldyck-Clothes"
                  target="_blank"
                  className="nav-link p-0">
                  {/* facebook icon */}
                  <i className="fab fa-facebook fa-lg"></i>
                  <span className="ms-1">Facebook</span>
                </a>
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
