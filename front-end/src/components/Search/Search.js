/* eslint-disable no-template-curly-in-string */
import React from "react";
import { useSearchParams } from "react-router-dom";
import { Stack } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { Set_Object_State, Create_Culture_Cell, Create_Recipe_Cell, Create_Restaurant_Cell, Get_Query_Data, Get_Elements_From_Data, Get_User_Coordinates } from "../../SharedFunctions";
import InputField from '../Models/sub_components/InputField';
import '../../styles/Search.css'
import '../../styles/Models.css'
import '../../styles/Instances.css'
import SearchIcon from '@mui/icons-material/Search'

function Search(props) {
  const [pageQueryParams, setPageQueryParams] = React.useState({});
  let [searchParams, setSearchParams] = useSearchParams();

  const MODELS = {
    Restaurant: Create_Restaurant_Cell,
    Recipe: Create_Recipe_Cell,
    Culture: Create_Culture_Cell,
  }

  const [results, setResults] = React.useState();
  const [loading, setLoading] = React.useState(false);

  const userCoords = React.useRef(false);
  const controller = React.useRef();
  function globalQuery() {
    if (controller.current) controller.current.abort();
    controller.current = new AbortController();

    // Get query data
    if (pageQueryParams.search) {
      setLoading(true);
      Get_Query_Data('all', '', pageQueryParams, userCoords.current, controller.current).then(([data, searchWords]) => {
        if (!data) return; // Request aborted or query failed
        setLoading(false);

        // Create elements from query
        let searchResults = [];
        for (const [model, create_cell] of Object.entries(MODELS)) {
          const elements = Get_Elements_From_Data(data[model.toLowerCase() + '_relations'], searchWords, (instance, id) => create_cell(instance, `/${model.toLowerCase()}s/${id}`));
          if (elements.length > 0) {
            searchResults = [...searchResults, (
              <React.Fragment key={model}>
                <div className='instanceSubTitle'>{model} results for "{pageQueryParams.search}"</div>
                <div className='modelGrid'>
                  {elements}
                </div>
              </React.Fragment>
            )];
          }
        }
        setResults(searchResults.length > 0 ? searchResults : (
          <div className='instanceSubTitle'>No results for "{pageQueryParams.search}"</div>
        ));
      });
    } else {
      setLoading(false);
      setResults();
    }
  }

  // Update page when user coordinates are received
  React.useEffect(() => {
    Get_User_Coordinates().then(coords => {
      userCoords.current = coords;
      console.log("coords effect");
      globalQuery();
    });
  }, []);

  // Query params change
  React.useEffect(() => {
    console.log("param hook");
    console.log(pageQueryParams);
    globalQuery();
  }, [pageQueryParams]);

  return (
    <>
      <div className="searchTitle">Search</div>
      <h1 className="title-wrapper">
        {searchParams.get("search") ? `Results for ${searchParams.get("search")}` : "Search in restaurants, recipes, and cultures"}
      </h1>
      <Stack
        direction="row"
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
      {loading ? (
        <Box sx={{ width: '100%', marginBottom: '15px' }}>
          <LinearProgress/>
        </Box>
      ) : null}
      {results}
    </> 
  )


}

export default Search;