import React from 'react';
import recipes from '../../temp-backend/recipes.json'
import { Create_Recipe_Cell, Get_Data } from '../../SharedFunctions';
import Selection from './sub_components/Selection';
import InputField from './sub_components/InputField';
import PaginateTable from './sub_components/PaginateTable';
import { Row, Dropdown, Form} from "react-bootstrap";
import { Stack } from '@mui/system';
import { Divider } from '@mui/material';
import '../../styles/Models.css'

function Recipes() {
    // todo: One more column for the additional sort attribute! Health score is not in backend model data!
    const columns = React.useMemo(() => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Total time",
        accessor: "ready_in_minutes",
      },
      {
        Header: "Number of ingredients",
        accessor: "num_ingredients",
      },
      {
        Header: "Dish types",
        accessor: "dish_types",
      },
      {
        Header: "Cuisines",
        accessor: "cuisine_type",
      },
    ], []);

    const [modelData, setModelData] = React.useState([]);
    React.useEffect(() => {
      Get_Data('recipes').then(data => setModelData(data));
    }, [])

    const data = React.useMemo(() => {
      const t = [];
      for (const [i, recipe] of Object.entries(modelData)) {
        t.push({
          id: recipe.id,
          name: recipe.name,
          ready_in_minutes: recipe.ready_in_minutes,
          ingredients: recipe.ingredients.length,
          dish_types: recipe.dish_types,
          cultures: recipe.cultures ? recipe.cultures[0] : null,
        });
      }
      return t;
    }, [modelData])

    return (
      <>
        <div className='modelTitle'>Recipes</div>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          justifyContent="center"
          alignItems="center"
          spacing={2}
          className='modelFilterBar'
        >
          <Selection text='Dish type' helpText='Filter by dish type' choices={['Breakfast', 'Lunch', 'Dinner', 'Appetizer']} multiple={true}></Selection>
          <InputField helpText='Filter by min healthiness' unit={<b>{'>'}</b>} unitPosition='start'></InputField>
          <InputField helpText='Filter by max ingredients' unit={<b>{'<'}</b>} unitPosition='start'></InputField>
          <InputField helpText='Filter by max time' unit={'mins'} unitPosition='end'></InputField>
          <InputField helpText='Search for cuisine'></InputField>
        </Stack>
        <PaginateTable columns={columns} data={data} create_cell={(id) => {
          return Create_Recipe_Cell(modelData[id], id);
        }}/>

        
        {/* <div class = "recipe-information">
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
        </div> */}
      </>
    );
  }
  
  export default Recipes;
  