import React from 'react';
import restaurants from '../../temp-backend/restaurants.json'
import { Set_Object_State, Create_Restaurant_Cell } from '../../SharedFunctions';
import Selection from './sub_components/Selection';
import Check from './sub_components/Check';
import InputField from './sub_components/InputField';
import { PaginateTable } from './sub_components/PaginateTable';
import SearchIcon from '@mui/icons-material/Search';
import { Stack } from '@mui/system';
import { Divider } from '@mui/material';
import '../../styles/Models.css'

function Restaurants() {
    const [pageQueryParams, setPageQueryParams] = React.useState({});

    const prices = Array.from(Array(4).keys(), x => x); // [0, 1, 2, 3]
    const priceChoices = Array.from(prices.keys(), x => '$'.repeat(x+1)); // [$, $$, $$$, $$$$]

    const ratings = Array.from(Array(5).keys(), x => x); // [0, 1, 2, 3, 4]
    const ratingChoices = Array.from(ratings.keys(), x => x+1); // [1, 2, 3, 4, 5]

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
            text='Price'
            helpText='Filter by price'
            defaultValue={prices}
            choices={priceChoices}
            multiple={true}
            onChange={(_, choices) => Set_Object_State(pageQueryParams, setPageQueryParams, 'price', choices, [...priceChoices])}>
          </Selection>
          <Selection 
            text='Rating'
            helpText='Filter by rating'
            defaultValue={ratings}
            choices={ratingChoices}
            multiple={true}
            onChange={(_, choices) => Set_Object_State(pageQueryParams, setPageQueryParams, 'rating', choices, [...ratingChoices])}>
          </Selection>
          <InputField 
            helpText='Filter by proximity'
            unit='mi'
            onBlur={(proximity) => Set_Object_State(pageQueryParams, setPageQueryParams, 'max_distance', proximity, '')}>
          </InputField>
          <InputField 
            helpText='Filter by min number of reviews'
            unit={<b>{'≥'}</b>}
            unitPosition='start'
            onBlur={(minReviews) => Set_Object_State(pageQueryParams, setPageQueryParams, 'review_count_GE', minReviews, '')}>
          </InputField>
          <Check 
            text='Open now'
            onChange={(checked) => Set_Object_State(pageQueryParams, setPageQueryParams, 'open_now', checked, false)}>
          </Check>
        </Stack>
        <PaginateTable model='restaurants' pageQueryParams={pageQueryParams} create_cell={Create_Restaurant_Cell} use_location={true}/>
      </>
    );
  }
  
  export default Restaurants;
  