import React from 'react';
import cultures from '../../temp-backend/cultures.json'
import { Set_Object_State, Create_Culture_Cell } from '../../SharedFunctions';
import Selection from './sub_components/Selection';
import InputField from './sub_components/InputField';
import { PaginateTable } from './sub_components/PaginateTable';
import SearchIcon from '@mui/icons-material/Search';
import { Stack } from '@mui/system';
import { Divider } from '@mui/material';
import '../../styles/Models.css'

function Cultures() {
    const [pageQueryParams, setPageQueryParams] = React.useState({});

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
          <InputField 
            icon={<SearchIcon/>}
            label='Search'
            unitPosition='end'
            width='75ch'
            onBlur={(search) => Set_Object_State(pageQueryParams, setPageQueryParams, 'search', search, '')}>
          </InputField>
        </Stack>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          justifyContent="center"
          alignItems="center"
          spacing={2}
          className='modelFilterBar'
        >
          <Selection 
            text='Independence'
            helpText='Filter by independence status' 
            choices={['Independent', 'Not independent']}
            onChange={(value) => Set_Object_State(pageQueryParams, setPageQueryParams, 'independent', value >= 0 ? value == 0 : value, -1)}>
          </Selection>
          <InputField
            helpText='Filter by min population'
            unit={<b>{'≥'}</b>}
            unitPosition='start'
            onBlur={(minPopulation) => Set_Object_State(pageQueryParams, setPageQueryParams, 'population_GE', minPopulation, '')}>
          </InputField>
          <InputField
            helpText='Search for region'
            onBlur={(search) => Set_Object_State(pageQueryParams, setPageQueryParams, 'region_PRT', search, '')}>
          </InputField>
          <InputField 
            helpText='Search for subregion'
            onBlur={(search) => Set_Object_State(pageQueryParams, setPageQueryParams, 'subregion_PRT', search, '')}>
          </InputField>
          <InputField 
            helpText='Search for language'
            onBlur={(search) => Set_Object_State(pageQueryParams, setPageQueryParams, 'languages_PRT', search, '')}> 
          </InputField>
        </Stack>
        <PaginateTable model='cultures' pageQueryParams={pageQueryParams} create_cell={Create_Culture_Cell}/>
      </>
    );
  }
  
  export default Cultures;
  