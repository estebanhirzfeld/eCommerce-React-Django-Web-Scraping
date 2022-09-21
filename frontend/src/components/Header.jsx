import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../actions/userActions";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Link, useNavigate}  from 'react-router-dom'


function Header() {

const navigate = useNavigate()

const dispatch = useDispatch();
const login = useSelector((state) => state.login);
const { userInfo } = login;


const logoutHandler = () => {
  dispatch(userLogout())
  navigate('/login')
};

  return (
    <header>
      <Navbar bg="dark" expand="lg" collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to="/">Django + React</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/cart"><i className="fas fa-shopping-cart"></i> Cart</Nav.Link>
            {
              userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler} >Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login"><i className="fas fa-user"></i> Sign In</Nav.Link>
              )
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </header>
  );
}

export default Header;




