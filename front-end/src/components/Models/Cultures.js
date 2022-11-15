import React from 'react';
import cultures from '../../temp-backend/cultures.json'
import { Create_Culture_Cell } from '../../SharedFunctions';
import Selection from './sub_components/Selection';
import InputField from './sub_components/InputField';
import { PaginateTable } from './sub_components/PaginateTable';
import SearchIcon from '@mui/icons-material/Search';
import { Stack } from '@mui/system';
import { Divider } from '@mui/material';
import '../../styles/Models.css'

function Cultures() {
    const [pageQueryParams, setPageQueryParams] = React.useState({});

    // Set query param to value, if value == defaultValue remove query param (remove key from state object, no need to specify in query)
    function setParamsDefaultValue(key, value, defaultValue) {
      if ((Array.isArray(value) && JSON.stringify(value) == JSON.stringify(defaultValue)) || value == defaultValue) {
        const obj = {...pageQueryParams};
        delete obj[key];
        setPageQueryParams(obj);
        console.log("deleted " + key);
      } else {
        setPageQueryParams({...pageQueryParams, [key]: value});
      }
    }

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
            onBlur={(search) => setParamsDefaultValue('search', search, '')}>
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
            onChange={(value) => setParamsDefaultValue('independent', value >= 0 ? value == 0 : value, -1)}>
          </Selection>
          <InputField
            helpText='Filter by min population'
            unit={<b>{'≥'}</b>}
            unitPosition='start'
            onBlur={(minPopulation) => setParamsDefaultValue('population_GE', minPopulation, '')}>
          </InputField>
          <InputField
            helpText='Search for region'
            onBlur={(search) => setParamsDefaultValue('region_PRT', search, '')}>
          </InputField>
          <InputField 
            helpText='Search for subregion'
            onBlur={(search) => setParamsDefaultValue('subregion_PRT', search, '')}>
          </InputField>
          <InputField 
            helpText='Search for language'
            onBlur={(search) => setParamsDefaultValue('languages_PRT', search, '')}> 
          </InputField>
        </Stack>
        <PaginateTable model='cultures' pageQueryParams={pageQueryParams} create_cell={Create_Culture_Cell}/>
      </>
    );
  }
  
  export default Cultures;
  