import React from 'react';
import restaurants from '../../temp-backend/restaurants.json'
import ModelListItem from './sub_components/ModelListItem';
import { Container, Col, Row, Dropdown, Form} from "react-bootstrap";
import './Models.css'

function Restaurants() {
    const restaurantElements = restaurants.map((restaurant, index) => 
      <ModelListItem name={restaurant.name} image={restaurant.image_url} link={index} />
    )

    return (
      <React.Fragment>
        <div className='recipesTitle'>Restaurants</div>
        <div class = "restaurant-information">
          <Row>
            <Dropdown class="dropdownStyle">
              <Dropdown.Toggle variant="success" id="dropdown-basic">
              Price
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">$</Dropdown.Item>
                <Dropdown.Item href="#/action-2">$$</Dropdown.Item>
                <Dropdown.Item href="#/action-3">$$$</Dropdown.Item>
                <Dropdown.Item href="#/action-3">$$$$</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown class="dropdownStyle">
              <Dropdown.Toggle variant="success" id="dropdown-basic">
              Hours of Operation
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Open now</Dropdown.Item>
                <Dropdown.Item href="#/action-2">All</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Form.Group className="radius" controlId="formRadius">
              <Form.Control type="radius" placeholder="Radius (in meters, integer)" />
            </Form.Group>
          </Row>
        </div>
        
        <Container>
          <Row>

          </Row>
        </Container>
        <div className='recipesList'>{restaurantElements}</div>
      </React.Fragment>
    );
  }
  
  export default Restaurants;
  