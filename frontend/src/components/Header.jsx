import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../actions/userActions";

import SearchBar from "../components/SearchBar";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom'
import Ticker from "./Ticker";


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
      <Ticker />
      <Navbar expand="lg" collapseOnSelect style={{ backgroundColor: '#080808 !important' }}>
        <Container>
          {/* <Navbar.Brand as={Link} to="/">Zoldyck</Navbar.Brand> */}
          <Navbar.Brand as={Link} to="/">Zoldyck</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBar />
            <Nav className="ms-auto">
              {/* wishlist*/}
              <Nav.Link as={Link} to="/wishlist"><i className="fas fa-heart"></i> Wishlist</Nav.Link>
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
              {
                userInfo && userInfo.is_Admin && (
                  <NavDropdown title="Admin" id="adminmenu">
                    <NavDropdown.Item as={Link} to="/admin/users">Users</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/products">Products</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/orders">Orders</NavDropdown.Item>
                  </NavDropdown>
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




