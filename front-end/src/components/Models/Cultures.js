import React from 'react';
import cultures from '../../temp-backend/cultures.json'
import ModelListItem from './sub_components/ModelListItem';
import './Models.css'

function Cultures() {
    const cultureElements = cultures.map((culture, index) => 
      <ModelListItem name={culture.name} image={culture.flags.png} link={index} />
    )

    return (
      <>
        <div className='recipesTitle'>Cultures</div>
        <div className='recipesList'>{cultureElements}</div>
      </>
    );
  }
  
  export default Cultures;
  