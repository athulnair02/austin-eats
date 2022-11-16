/* eslint-disable no-template-curly-in-string */
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import { TextField, Typography, Stack, Button, Input } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Create_Culture_Cell, Create_Recipe_Cell, Create_Restaurant_Cell} from "../../SharedFunctions";
import { API_URL } from "../../Global";
import '../../styles/Search.css'
import '../../styles/Models.css'
import SearchCard from "./SearchCard";
import SearchIcon from '@mui/icons-material/Search'

const SEARCH_PATHS = ["cultures", "restaurants", "recipes"];
const RESULT_LIMIT = 25;

function Search(props) {

    let [searchParams] = useSearchParams();
    let [params, setParams] = useState("");
    const [searchQ, setSearch] = useState("");

    const [results, setResults] = useState({
        cultures: [],
        recipes: [],
        restaurants: [],
    });

    let navigate = useNavigate();

    const updateSearch = (search) => {
        let path = `?search=${search}`;
        navigate(path);
        setParams(search);
    };

    useEffect(() => {
        if (searchParams.get("search")) {
            setParams(searchParams.get("search"));
            setSearch(searchParams.get("search"));
        }

        const constructParams = (params) => {
            let p = "";
            if (params) {
                p = "search=" + params;
            }
            return p;
        }

        const getResults = async ( { model, params} ) => {
            let url = API_URL + `/${model}?page=1&per_page=${RESULT_LIMIT}`;
            if (params) {
                url = `${url}&${constructParams(params)}`;
            }
            let data = await fetch(url);
            data = await data.json();
            return data;
        }

        const getData = async () => {
            try {
                let promises = SEARCH_PATHS.map((model) => {
                    return getResults({
                        model: model,
                        params: searchParams.get("search"),
                    });
                });
                let resolved = await Promise.all(promises);
                let output = {};
                resolved.forEach((data, i) => {
                    let count = data['numInstances'];
                    if (count > RESULT_LIMIT) {
                        output[SEARCH_PATHS[i]] = data["list"].slice(0, RESULT_LIMIT - 1);
                        let extraResults = [{eor: true, amount: count - RESULT_LIMIT}];
                        output[SEARCH_PATHS[i]] = output[SEARCH_PATHS[i]].concat(extraResults);
                    } else {
                        output[SEARCH_PATHS[i]] = data["list"].slice(0, RESULT_LIMIT);
                    }
                });
                setResults(output);
            } catch (err) {
                console.error(err)
            }
        }
        getData();
    }, [params, searchParams]);

    return (
        <div>
            <div className="searchTitle">Search</div>
            <div className="bar-box">
                <h1 className="title-wrapper">
                    {searchParams.get("search") ? `Results for ${searchParams.get("search")}` : "Search for a restaurant, recipe, or culture here"}
                </h1>
                <TextField className="searchbar" onKeyPress={(ev) => {
                        if(ev.key === "Enter"){
                            ev.preventDefault();
                            updateSearch(ev.target.value)
                        }
                    }}
                    icon={<SearchIcon/>}
                    label="Search"
                    placeholder="Enter sitewide search here"
                    value={searchQ}
                    onChange={event => setSearch(event.target.value)}
                />
            </div>

            <Container className="last-spacer">
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
            </Container>
        </div> 


    )


}

export default Search;