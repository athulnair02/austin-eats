import React from 'react';
import cultures from '../../temp-backend/cultures.json'
import ModelListItem from './sub_components/ModelListItem';
import { Row, Dropdown, Form} from "react-bootstrap";
import './Models.css'

function Cultures() {
    const cultureElements = cultures.map((culture, index) => 
      <ModelListItem name={culture.name} image={culture.flags.png} link={index} />
    )

    return (
      <React.Fragment>
        <div className='recipesTitle'>Cultures</div>
        <div class = "cultures-information">
          <Row>
            <Dropdown class="dropdownStyle">
              <Dropdown.Toggle variant="success" id="dropdown-basic">
              Independence status
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Independent</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Not independent</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Form.Group className="population" controlId="formPopulation">
              <Form.Control type="population" placeholder="Minimum population" />
            </Form.Group>

            <Form.Group className="region" controlId="formRegion">
              <Form.Control type="region" placeholder="Region" />
            </Form.Group>

            <Form.Group className="subregion" controlId="formSubregion">
              <Form.Control type="subregion" placeholder="Subregion" />
            </Form.Group>

            <Form.Group className="regionalBlocs" controlId="formRegionalBlocs">
              <Form.Control type="regionalBlocs" placeholder="# of regional blocs" />
            </Form.Group>
          </Row>
        </div>
        <div className='recipesList'>{cultureElements}</div>
      </React.Fragment>
    );
  }
  
  export default Cultures;
  