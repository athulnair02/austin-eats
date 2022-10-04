import React from 'react';
import recipes from '../../temp-backend/recipes.json'
import ModelListItem from './sub_components/ModelListItem';
import './Models.css'

function Recipes() {
    const recipeElements = recipes.map((recipe, index) => 
      <ModelListItem name={recipe.name} image={recipe.image} link={index} />
    )

    return (
      <>
        <div className='recipesTitle'>Recipes</div>
        <div className='recipesList'>{recipeElements}</div>
      </>
    );
  }
  
  export default Recipes;
  