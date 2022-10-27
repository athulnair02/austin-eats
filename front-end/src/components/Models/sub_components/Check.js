import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function Check(props) {
    const handleChange = (event) => {
      console.log(event.target.checked);
    }

    return (
      <FormControlLabel control={ <Checkbox defaultChecked={props.defaultChecked} onChange={handleChange} /> } label={props.text} />
    );
}

export default Check;