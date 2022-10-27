import React from 'react';
import FormControl from '@mui/material/FormControl';
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';

function InputField(props) {
    const [value, setValue] = React.useState(props.text ? props.text : '');

    const handleChange = (event) => {
      const {
        target: { value },
      } = event;
      setValue(event.target.value);
      console.log(value);
    };

    // Probably a better way to do this..
    const startAdorn = props.unitPosition == 'start' ? <InputAdornment position="start">{props.unit}</InputAdornment> : null
    const endAdorn = props.unitPosition != 'start' ? <InputAdornment position="end">{props.unit}</InputAdornment> : null

    return (
      <FormControl sx={{ m: 1, width: '25ch', minWidth: '10ch' }} variant="filled">
        <FilledInput
          id="input-field"
          value={value}
          onChange={handleChange}
          startAdornment={startAdorn}
          endAdornment={endAdorn}
        />
        <FormHelperText id="input-field-help-text">{props.helpText}</FormHelperText>
      </FormControl>
    )
}

export default InputField;