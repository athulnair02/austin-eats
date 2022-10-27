import React from 'react';
import cultures from '../../temp-backend/cultures.json'
import { Create_Culture_Cell, Get_Data } from '../../SharedFunctions';
import Selection from './sub_components/Selection';
import InputField from './sub_components/InputField';
import PaginateTable from './sub_components/PaginateTable';
import { Row, Dropdown, Form} from "react-bootstrap";
import { Stack } from '@mui/system';
import { Divider } from '@mui/material';
import '../../styles/Models.css'

function Cultures() {
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
        Header: "Region",
        accessor: "region",
      },
      {
        Header: "Subregion",
        accessor: "subregion",
      },
      {
        Header: "Population",
        accessor: "population",
      },
      {
        Header: "Independent",
        accessor: "independent",
      },
    ], []);

    const [modelData, setModelData] = React.useState([]);
    React.useEffect(() => {
      Get_Data('cultures').then(data => setModelData(data));
    }, [])

    const data = React.useMemo(() => {
      const t = [];
      for (const [i, culture] of Object.entries(modelData)) {
        t.push({
          id: culture.id,
          name: culture.name,
          region: culture.region,
          subregion: culture.subregion,
          population: culture.population,
          independent: culture.independent,
        });
      }
      return t;
    }, [modelData])

    return (
      <>
        <div className='modelTitle'>Cultures</div>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          justifyContent="center"
          alignItems="center"
          spacing={2}
          className='modelFilterBar'
        >
          <Selection text='Independence' helpText='Filter by independence status' choices={['Independent', 'Not independent']}></Selection>
          <InputField helpText='Filter by min population' unit={<b>{'>'}</b>} unitPosition='start'></InputField>
          <InputField helpText='Search for region'></InputField>
          <InputField helpText='Search for subregion'></InputField>
          <InputField helpText='Filter by min number of blocs' unit='blocs' unitPosition='end'></InputField>
        </Stack>
        <PaginateTable columns={columns} data={data} create_cell={(id) => {
          return Create_Culture_Cell(modelData[id-1], id);
        }}/>

        {/* <div class = "cultures-information">
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
        </div> */}
      </>
    );
  }
  
  export default Cultures;
  