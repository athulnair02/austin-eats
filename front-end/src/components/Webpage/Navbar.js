import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import logo from '../../assets/favicon.svg'
import "bootstrap/dist/css/bootstrap.min.css";
import './Navbar.css';


function MainNavbar() {
    return (
      <Navbar className='color-nav' variant='dark'>
        <Container>
          <a href='/'>
            <img className='brand-logo' src={logo} alt="Logo"/>
          </a>
          <Navbar.Brand className='brand-link' href='/'>AustinEats</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link className='color-link' href='/restaurants'>Restaurants</Nav.Link>
            <Nav.Link className='color-link' href='/recipes'>Recipes</Nav.Link>
            <Nav.Link className='color-link' href='/cultures'>Cultures</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link className='color-link' href='/about'>About</Nav.Link>
            <Nav.Link className='color-link' href ='/search' eventKey='search' disabled>Search</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    );
}
  
export default MainNavbar;
