import React from 'react';
import recipes from '../../temp-backend/recipes.json'
import ModelListItem from './sub_components/ModelListItem';
import { Row, Dropdown, Form} from "react-bootstrap";
import './Models.css'

function Recipes() {
    const recipeElements = recipes.map((recipe, index) => 
      <ModelListItem name={recipe.name} image={recipe.image} link={index} />
    )

    return (
      <React.Fragment>
        <div className='recipesTitle'>Recipes</div>
        <div class = "recipe-information">
          <Row>
            <Dropdown class="dropdownStyle">
              <Dropdown.Toggle variant="success" id="dropdown-basic">
              Dish type
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Breakfast</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Lunch</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Dinner</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Form.Group className="healthScore" controlId="formHealthScore">
              <Form.Control type="healthScore" placeholder="Health Score" />
            </Form.Group>

            <Form.Group className="ingredients" controlId="formNumIngredients">
              <Form.Control type="ingredients" placeholder="# ingredients" />
            </Form.Group>

            <Form.Group className="cuisine" controlId="formCuisine">
              <Form.Control type="cuisine" placeholder="Cuisine" />
            </Form.Group>

            <Form.Group className="timeToPrepare" controlId="formTimeToPrepare">
              <Form.Control type="timeToPrepare" placeholder="Time to prepare" />
            </Form.Group>
          </Row>
        </div>
        <div className='recipesList'>{recipeElements}</div>
      </React.Fragment>
    );
  }
  
  export default Recipes;
  