import { Container, Row, Col } from 'react-bootstrap';

import React from 'react'

function Footer() {
    return (
        <footer className="bg-dark text-light py-5">
  <div className="container">
    <div className="row">
      <div className="col-md-3">
        <h5>Section 1</h5>
        <ul className="nav flex-column">
          <li className="nav-item mb-2"><a href="#" className="nav-link p-0">Home</a></li>
          <li className="nav-item mb-2"><a href="#" className="nav-link p-0">Features</a></li>
          <li className="nav-item mb-2"><a href="#" className="nav-link p-0">Pricing</a></li>
          <li className="nav-item mb-2"><a href="#" className="nav-link p-0">FAQs</a></li>
          <li className="nav-item mb-2"><a href="#" className="nav-link p-0">About</a></li>
        </ul>
      </div>

      <div className="col-md-3">
        <h5>Section 2</h5>
        <ul className="nav flex-column">
          <li className="nav-item mb-2"><a href="#" className="nav-link p-0">Home</a></li>
          <li className="nav-item mb-2"><a href="#" className="nav-link p-0">Features</a></li>
          <li className="nav-item mb-2"><a href="#" className="nav-link p-0">Pricing</a></li>
          <li className="nav-item mb-2"><a href="#" className="nav-link p-0">FAQs</a></li>
          <li className="nav-item mb-2"><a href="#" className="nav-link p-0">About</a></li>
        </ul>
      </div>

      <div className="col-md-3">
        <h5>Section 3</h5>
        <ul className="nav flex-column">
          <li className="nav-item mb-2"><a href="#" className="nav-link p-0">Home</a></li>
          <li className="nav-item mb-2"><a href="#" className="nav-link p-0">Features</a></li>
          <li className="nav-item mb-2"><a href="#" className="nav-link p-0">Pricing</a></li>
          <li className="nav-item mb-2"><a href="#" className="nav-link p-0">FAQs</a></li>
          <li className="nav-item mb-2"><a href="#" className="nav-link p-0">About</a></li>
        </ul>
      </div>

      <div className="col-md-3">
        <h5>Subscribe to our newsletter</h5>
        <p>Monthly digest of whats new and exciting from us.</p>
        <form
            className="form-inline mb-2 d-flex justify-content-center"
            action="#"
            method="POST"
            >
            <input
                className="form-control mr-sm-2"
                type="text"
                placeholder="Email"
                aria-label="Search"
                />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
                Subscribe
            </button>
        </form>
        </div>
    </div>
    </div>
    </footer>
    )
}

export default Footer