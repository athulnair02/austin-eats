import React from 'react';
import restaurants from '../../temp-backend/restaurants.json'
import { Create_Restaurant_Cell, Get_User_Coordinates, Get_Data } from '../../SharedFunctions';
import Selection from './sub_components/Selection';
import Check from './sub_components/Check';
import InputField from './sub_components/InputField';
import PaginateTable from './sub_components/PaginateTable';
import { Row, Dropdown, Form} from "react-bootstrap";
import { Stack } from '@mui/system';
import { Divider } from '@mui/material';
import '../../styles/Models.css'

function Restaurants() {
    const columns = React.useMemo(() => [
      {
        Header: "Index",
        accessor: "i",
      },
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Rating",
        accessor: "rating",
      },
      {
        Header: "Review count",
        accessor: "review_count",
      },
      {
        Header: "Distance",
        accessor: "distance",
      },
      {
        Header: "Price",
        accessor: "price",
      },
    ], []);

    const [modelData, setModelData] = React.useState([]);
    React.useEffect(() => {
      Get_Data('restaurants').then(data => setModelData(data));
    }, [])

    const data = React.useMemo(() => {
      const t = [];
      for (const [i, restaurant] of Object.entries(modelData)) {
        t.push({
          i: i,
          id: restaurant.id,
          name: restaurant.name,
          rating: restaurant.rating,
          review_count: restaurant.review_count,
          distance: 0,
          price: restaurant.price,
        });
      }
      return t;
    }, [modelData])

    //const getCoordsPromise = Get_User_Coordinates();

    return (
      <>
        <div className='modelTitle'>Restaurants</div>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          justifyContent="center"
          alignItems="center"
          spacing={2}
          className='modelFilterBar'
        >
          <Selection text='Price' helpText='Filter by price' choices={Array.from(Array(4).keys(), x => '$'.repeat(x+1))} multiple={true}></Selection>
          <Selection text='Rating' helpText='Filter by rating' choices={Array.from(Array(5).keys(), x => `${x+1} star`)} multiple={true}></Selection>
          <InputField helpText='Filter by proximity' unit='mi'></InputField>
          <InputField helpText='Filter by min number of ratings' unit={<b>{'>'}</b>} unitPosition='start'></InputField>
          <Check text='Open now'></Check>
        </Stack>
        <PaginateTable columns={columns} data={data} create_cell={(id, index) => {
          return Create_Restaurant_Cell(modelData[index], id);
        }}/>

        {/* <div class = "restaurant-information">
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

            <Dropdown class="dropdownStyle">
              <Dropdown.Toggle variant="success" id="dropdown-basic">
              Rating
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">1 star</Dropdown.Item>
                <Dropdown.Item href="#/action-2">2 star</Dropdown.Item>
                <Dropdown.Item href="#/action-3">3 star</Dropdown.Item>
                <Dropdown.Item href="#/action-3">4 star</Dropdown.Item>
                <Dropdown.Item href="#/action-3">5 star</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Form.Group className="numRatings" controlId="formNumRatings">
              <Form.Control type="numRatings" placeholder="Minimum number of ratings" />
            </Form.Group>
          </Row>
        </div> */}
      </>
    );
  }
  
  export default Restaurants;
  