import React from "react";
import { Stack } from '@mui/system';
import { Get_Data } from "../../../SharedFunctions";
import { Button, IconButton } from "@mui/material";
import { Get_User_Coordinates } from "../../../SharedFunctions";
import Selection from "./Selection";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import '../../../styles/Models.css'

export const INIT_PAGE_SIZE = 25;
export const SIZE_CHOICES = [10, INIT_PAGE_SIZE, 50];

export function PaginateTable({ model, pageQueryParams, create_cell, use_location }) {
    // When query params are updated, request data from backend and trigger page re-render (updates setPageElements state)
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(INIT_PAGE_SIZE);
    const [numPages, setNumPages] = React.useState(1);
    const [pageElements, setPageElements] = React.useState([]);

    const userCoords = React.useRef(false);
    const renderPage = React.useRef(page); // page state will only update after the useEffect hooks, using Ref to get a more up-to-date value reading of the page
    function updatePagination() {
      // Apply filters to be queried
      console.log('page update: ' + renderPage.current);
      let searchWords = [];
      let query = `&page=${renderPage.current}&per_page=${perPage}`;
      for (const [filter, value] of Object.entries(pageQueryParams)) {
        // Add to query
        if (Array.isArray(value)) {
          value.forEach(v => (query += `&${filter}=${v}`));
        } else {
          query += `&${filter}=${value}`;
        }

        // If search field, get search words
        if (filter == 'search') searchWords = value.toLowerCase().split(' ');
        console.log(searchWords);
      }
      if (userCoords.current) query += `&user_loc=${userCoords.current.latitude}, ${userCoords.current.longitude}`;
      if (query != '') query = '?' + query.substring(1);
      console.log(query);

      // Create elements from query
      const elements = [];
      Get_Data(model + query).then(data => {
        if (use_location && (userCoords.current && data.relations[0] && !data.relations[0].distance)) return; // Ensure that query without coords doesn't replace query with coords
        for (const instance of data.relations) {
          if (searchWords.length > 0) {
            let matchRegex = '';
            searchWords.map(word => matchRegex += ('|' + word));
            matchRegex = matchRegex.substring(1);

            // Divide name into parts where the matching terms are alone
            const nameParts = instance.name.split(new RegExp(`(${matchRegex})`, "gi"));
            console.log(nameParts);

            // Iterate through parts, if a match is found, highlight the text
            // Credit to nlopezm for the codesandbox example "React Highlight Text"
            instance.highlightedName = nameParts.map((part, index) => <React.Fragment key={index}>
              {searchWords.includes(part.toLowerCase()) ? (
                <b style={{ backgroundColor: 'rgba(112, 215, 255, .7)' }}>{part}</b>
              ) : part}
            </React.Fragment>);
          }

          elements.push(create_cell(instance, instance.id));
        }
        setPageElements(elements);
        setNumPages(data.num_pages);
      });
    }

    // Update page when user coordinates are received (if needed)
    React.useEffect(() => {
      console.log("coords effect");
      if (use_location) Get_User_Coordinates().then(coords => {
        userCoords.current = coords;
        updatePagination();
      });
    }, []);

    // Query params change
    React.useEffect(() => {
      console.log("param hook");
      console.log(pageQueryParams);
      renderPage.current = 1; // Easy way to prevent page from going over max, reset page when per page preference changes
      setPage(1);
      updatePagination();
    }, [perPage, pageQueryParams]);

    // Current page changes
    React.useEffect(() => {
      console.log("page hook");
      if (page != renderPage.current) { // No need to re-render the page if it's the same (can happen when a query param changes and page state != 1)
        renderPage.current = page;
        updatePagination();
      }
    }, [page]);


    function canPreviousPage() {
      return page > 1;
    }

    function canNextPage() {
      return page < numPages;
    }

    // Render UI
    return (
      <>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          className='modelFilterBar'
          style = {{height: '70px'}}
        >
          <IconButton onClick={() => setPage(1)} disabled={!canPreviousPage()}>
            <SkipPreviousIcon/>
          </IconButton>
          <IconButton onClick={() => setPage(page-1)} disabled={!canPreviousPage()}>
            <NavigateBeforeIcon/>
          </IconButton>
          <div className='paginationText'> {'Page '} <b>{`${page}`}</b> {'of '} <b>{numPages}</b></div>
          <IconButton onClick={() => setPage(page+1)} disabled={!canNextPage()}>
            <NavigateNextIcon/>
          </IconButton>
          <IconButton onClick={() => setPage(numPages)} disabled={!canNextPage()}>
            <SkipNextIcon/>
          </IconButton>
          <Selection 
            text='Show'
            removeNone={true}
            defaultValue={ SIZE_CHOICES.indexOf(perPage) }
            choices={SIZE_CHOICES}
            onChange={(_, pageSize) => setPerPage(pageSize)}>
          </Selection>
        </Stack>
        <div className='modelGrid'>
          {pageElements}
        </div>
      </>
    )
}