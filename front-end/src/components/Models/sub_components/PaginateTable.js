import React from "react";
import { useTable, usePagination } from "react-table";
import { propTypes } from "react-bootstrap/esm/Image";
import { Stack } from '@mui/system';
import { Button, IconButton } from "@mui/material";
import Selection from "./Selection";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import '../../../styles/Models.css'

function PaginateTable({ columns, data, create_cell }) {
    const INIT_PAGE_SIZE = 25;
    const SIZE_CHOICES = [10, INIT_PAGE_SIZE, 50];

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      footerGroups,
      prepareRow,
      page,
      canPreviousPage,
      canNextPage,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      state: { pageIndex, pageSize }
    } = useTable(
      {
        columns,
        data,
        initialState: { pageSize: INIT_PAGE_SIZE }
      },
      usePagination
    );

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
          <IconButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            <SkipPreviousIcon/>
          </IconButton>
          <IconButton onClick={() => previousPage()} disabled={!canPreviousPage}>
            <NavigateBeforeIcon/>
          </IconButton>
          <div className='paginationText'> {'Page '} <b>{`${pageIndex + 1}`}</b> {'of '} <b>{`${pageCount}`}</b></div>
          <IconButton onClick={() => nextPage()} disabled={!canNextPage}>
            <NavigateNextIcon/>
          </IconButton>
          <IconButton onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            <SkipNextIcon/>
          </IconButton>
          <Selection 
            text='Show'
            removeNone={true}
            defaultValue={ SIZE_CHOICES.indexOf(pageSize) }
            choices={SIZE_CHOICES}
            onChange={(_, pageSize) => {
              setPageSize(pageSize);
          }}></Selection>
        </Stack>
        <div className='modelGrid'>
          {page.map((row, i) => { // Create model cells
            return create_cell(row.original.id);
          })}
        </div>
      </>
    )
}

export default PaginateTable;