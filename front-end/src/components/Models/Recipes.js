import React from 'react';
import recipes from '../../temp-backend/recipes.json'
import { Set_Object_State, Create_Recipe_Cell } from '../../SharedFunctions';
import Selection from './sub_components/Selection';
import InputField from './sub_components/InputField';
import { PaginateTable } from './sub_components/PaginateTable';
import SearchIcon from '@mui/icons-material/Search';
import { Stack } from '@mui/system';
import { Divider } from '@mui/material';
import '../../styles/Models.css'

function Recipes() {
    const [pageQueryParams, setPageQueryParams] = React.useState({});

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
            text='Dish type'
            helpText='Filter by dish type'
            choices={['Breakfast', 'Lunch', 'Dinner', 'Appetizer']}
            multiple={true}
            onChange={(_, choices) => Set_Object_State(pageQueryParams, setPageQueryParams, 'dish_types', choices, [])}>
          </Selection>
          <InputField 
            helpText='Filter by min healthiness' 
            unit={<b>{'≥'}</b>} 
            unitPosition='start'
            onBlur={(minHealth) => Set_Object_State(pageQueryParams, setPageQueryParams, 'health_score_GE', minHealth, '')}>
          </InputField>
          <InputField 
            helpText='Filter by max ingredients' 
            unit={<b>{'≤'}</b>} 
            unitPosition='start'
            onBlur={(maxIngredients) => Set_Object_State(pageQueryParams, setPageQueryParams, 'num_ingredients_LE', maxIngredients, '')}>
          </InputField>
          <InputField 
            helpText='Filter by max time' 
            unit={'mins'} 
            unitPosition='end'
            onBlur={(maxMins) => Set_Object_State(pageQueryParams, setPageQueryParams, 'ready_in_minutes_LE', maxMins, '')}>
          </InputField>
          <InputField 
            helpText='Search for cuisine'
            onBlur={(search) => Set_Object_State(pageQueryParams, setPageQueryParams, 'cuisine_type_PRT', search, '')}>
          </InputField>
        </Stack>
        <PaginateTable model='recipes' pageQueryParams={pageQueryParams} create_cell={Create_Recipe_Cell}/>
      </>
    );
  }
  
  export default Recipes;
  