import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import "bootstrap/dist/css/bootstrap.min.css";

function MainNavbar() {
    return (
      <Navbar className='Navbar-custom' variant='dark' bg='dark'>
        <Container>
          <Navbar.Brand className='Title' href='/'>AustinEats</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href='/restaurants'>Restaurants</Nav.Link>
            <Nav.Link href='/recipes'>Recipes</Nav.Link>
            <Nav.Link href='/cultures'>Cultures</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href='/about'>About</Nav.Link>
            <Nav.Link href ='/search' eventKey='search' disabled>Search</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    );
  }
  
  export default MainNavbar;
  