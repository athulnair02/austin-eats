import React from "react";
import { Stack } from '@mui/system';
import { Get_Data } from "../../../SharedFunctions";
import { Button, IconButton } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { Get_User_Coordinates, Get_Query_Data, Get_Elements_From_Data } from "../../../SharedFunctions";
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
    const [loading, setLoading] = React.useState(false);

    const userCoords = React.useRef(false);
    const renderPage = React.useRef(page); // page state will only update after the useEffect hooks, using Ref to get a more up-to-date value reading of the page
    const controller = React.useRef();
    function updatePagination() {
      if (controller.current) controller.current.abort();
      controller.current = new AbortController();

      // Apply filters to be queried
      console.log('page update: ' + renderPage.current);
      let query = `&page=${renderPage.current}&per_page=${perPage}`;

      // Get query data
      setLoading(true);
      Get_Query_Data(model, query, pageQueryParams, userCoords.current, controller.current).then(([data, searchWords]) => {
        if (!data) return; // Request aborted or query failed
        //if (use_location && (userCoords.current && data.relations[0] && !data.relations[0].distance)) return; // Ensure that query without coords doesn't replace query with coords
        setLoading(false);

        // Create elements from query
        const elements = Get_Elements_From_Data(data.relations, searchWords, create_cell);
        setPageElements(elements);
        setNumPages(data.num_pages);
      });
    }

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

    // Update page when user coordinates are received (if needed)
    React.useEffect(() => {
      if (use_location) Get_User_Coordinates().then(coords => {
        userCoords.current = coords;
        console.log("coords effect");
        updatePagination();
      });
    }, []);


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
        {loading ? (
          <Box sx={{ width: '100%', marginBottom: '15px' }}>
            <LinearProgress/>
          </Box>
        ) : null}
        <div className='modelGrid'>
          {pageElements}
        </div>
      </>
    )
}