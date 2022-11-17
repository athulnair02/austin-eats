/* eslint-disable no-template-curly-in-string */
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import { TextField, Typography, Stack, Button, Input } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { Set_Object_State, Create_Culture_Cell, Create_Recipe_Cell, Create_Restaurant_Cell, Get_Query_Data, Get_Elements_From_Data, Get_User_Coordinates } from "../../SharedFunctions";
import InputField from '../Models/sub_components/InputField';
import { API_URL } from "../../Global";
import '../../styles/Search.css'
import '../../styles/Models.css'
import '../../styles/Instances.css'
import SearchCard from "./SearchCard";
import SearchIcon from '@mui/icons-material/Search'

const SEARCH_PATHS = ["cultures", "restaurants", "recipes"];
const RESULT_LIMIT = 25;

function Search(props) {
  const [pageQueryParams, setPageQueryParams] = React.useState({});
  let [searchParams, setSearchParams] = useSearchParams();

  let [params, setParams] = useState("");
  const [searchQ, setSearch] = useState("");

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
          const elements = Get_Elements_From_Data(data[model.toLowerCase() + '_relations'], searchWords, create_cell);
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


    // let navigate = useNavigate();

    // const updateSearch = (search) => {
    //     let path = `?search=${search}`;
    //     navigate(path);
    //     setParams(search);
    // };

    // useEffect(() => {
    //     if (searchParams.get("search")) {
    //         setParams(searchParams.get("search"));
    //         setSearch(searchParams.get("search"));
    //     }

    //     const constructParams = (params) => {
    //         let p = "";
    //         if (params) {
    //             p = "search=" + params;
    //         }
    //         return p;
    //     }

    //     const getResults = async ( { model, params} ) => {
    //         let url = API_URL + `/${model}?page=1&per_page=${RESULT_LIMIT}`;
    //         if (params) {
    //             url = `${url}&${constructParams(params)}`;
    //         }
    //         let data = await fetch(url);
    //         data = await data.json();
    //         return data;
    //     }

    //     const getData = async () => {
    //         try {
    //             let promises = SEARCH_PATHS.map((model) => {
    //                 return getResults({
    //                     model: model,
    //                     params: searchParams.get("search"),
    //                 });
    //             });
    //             let resolved = await Promise.all(promises);
    //             let output = {};
    //             resolved.forEach((data, i) => {
    //                 let count = data['numInstances'];
    //                 if (count > RESULT_LIMIT) {
    //                     output[SEARCH_PATHS[i]] = data["list"].slice(0, RESULT_LIMIT - 1);
    //                     let extraResults = [{eor: true, amount: count - RESULT_LIMIT}];
    //                     output[SEARCH_PATHS[i]] = output[SEARCH_PATHS[i]].concat(extraResults);
    //                 } else {
    //                     output[SEARCH_PATHS[i]] = data["list"].slice(0, RESULT_LIMIT);
    //                 }
    //             });
    //             setResults(output);
    //         } catch (err) {
    //             console.error(err)
    //         }
    //     }
    //     getData();
    // }, [params, searchParams]);

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



            {/* <Container className="last-spacer">
                <h1 className="title-wrapper">Restaurant Results</h1>
                <Stack direction="row" flexWrap="wrap" className="center-row">
                    {results["restaurants"].map((r) => (
                        r["eor"] ? 
                        <Button className="search-button" variant="outlined" component={RouterLink} to={`/restaurants?search=${searchParams.get("search") ? searchParams.get("search") : ""}`}>
                                <Typography className="cardTitle"> View {r["amount"]} more results in restaurants</Typography>
                        </Button> : null // : Search Card goes here
                    ))}
                </Stack> 

                <h1 className="title-wrapper">Recipe Results</h1>
                <Stack direction="row" flexWrap="wrap" className="center-row">
                    {results["restaurants"].map((r) => (
                        r["eor"] ? 
                        <Button className="search-button" variant="outlined" component={RouterLink} to={`/recipes?search=${searchParams.get("search") ? searchParams.get("search") : ""}`}>
                                <Typography className="cardTitle"> View {r["amount"]} more results in recipes</Typography>
                        </Button> : null // : Search Card goes here
                    ))}
                </Stack> 

                <h1 className="title-wrapper">Culture Results</h1>
                <Stack direction="row" flexWrap="wrap" className="center-row">
                    {results["restaurants"].map((c) => (
                        c["eor"] ? 
                        <Button className="search-button" variant="outlined" component={RouterLink} to={`/cultures?search=${searchParams.get("search") ? searchParams.get("search") : ""}`}>
                                <Typography className="cardTitle"> View {c["amount"]} more results in cultures</Typography>
                        </Button> : null // : Search Card goes here
                    ))}
                </Stack> 
            </Container> */}
    </> 
  )


}

export default Search;