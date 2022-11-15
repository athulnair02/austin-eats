import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function Selection(props) {
  const MULTIPLE = props.multiple;
  let defaultValue = MULTIPLE && props.defaultValue ? [...props.defaultValue] : props.defaultValue;
  if (defaultValue == null) {
    defaultValue = MULTIPLE ? [] : (props.removeNone ? 0 : -1);
  }

  const [value, setValue] = React.useState(defaultValue);

    const handleChange = (event) => {
      const {
        target: { value },
      } = event;
      setValue(event.target.value);

      // Callback
      if (props.onChange) {
        if (MULTIPLE) {
          props.onChange(value, value.map(i => props.choices[i]));
        } else {
          props.onChange(value, props.choices[value]);
        }
      }
    };

    let choices = [];
    if (props.choices) {
      choices = props.choices.map((choice, index) => 
        <MenuItem key={index} value={index}>{choice}</MenuItem>
      )
    }

    let helpText = props.helpText ? <FormHelperText>{props.helpText}</FormHelperText> : null
    let none = !MULTIPLE && !props.removeNone ? <MenuItem key={-1} value={-1}><em>None</em></MenuItem> : null
    return (
      <FormControl variant = 'filled' sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="selection-label">{props.text}</InputLabel>
          <Select
            labelId="selection-label"
            id="selection"
            multiple={MULTIPLE}
            value={value}
            label={props.text}
            onChange={handleChange}
          >
            {none}
            {choices}
          </Select>
        {helpText}
      </FormControl>
    )
}

export default Selection;