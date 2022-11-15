import React from 'react';
import FormControl from '@mui/material/FormControl';
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import { InputLabel } from '@mui/material';

function InputField(props) {
    const [value, setValue] = React.useState(props.text ? props.text : '');

    const handleChange = (event) => {
      const {
        target: { value },
      } = event;
      setValue(event.target.value);

      // Callback
      if (props.onChange) props.onChange(value);
    };

    // Probably a better way to do this..
    const startAdorn = props.unitPosition == 'start' ? <InputAdornment position="start">{props.unit || props.icon}</InputAdornment> : null
    const endAdorn = props.unitPosition != 'start' ? <InputAdornment position="end">{props.unit || props.icon}</InputAdornment> : null

    const inputLabel = props.label ? <InputLabel htmlFor="component-filled">{props.label}</InputLabel> : null
    
    const width = props.fullWidth ? null : (props.width || '25ch');

    return (
      <FormControl sx={{ m: 1, width: width, minWidth: '10ch' }} variant="filled" fullWidth={props.fullWidth == true}>
        {inputLabel}
        <FilledInput
          id="input-field"
          label="filled"
          value={value}
          onChange={handleChange}
          onBlur={() => {
            if (props.onBlur) props.onBlur(value);
          }}
          startAdornment={startAdorn}
          endAdornment={endAdorn}
        />
        <FormHelperText id="input-field-help-text">{props.helpText}</FormHelperText>
      </FormControl>
    )
}

export default InputField;