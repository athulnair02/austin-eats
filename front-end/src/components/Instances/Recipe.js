import React from 'react';
import Recipes from '../Models/Recipes';
import recipes from '../../temp-backend/recipes.json'
import restaurants from '../../temp-backend/restaurants.json'
import cultures from '../../temp-backend/cultures.json'
import ModelListItem from '../Models/sub_components/ModelListItem';
import { useParams, Navigate } from 'react-router-dom';
import '../../styles/Instances.css'

function RecipeInfoCell(props) {
  return (
    <div className='recipeInfoCell'>
      <div className='recipeInfoTitle'>
        {props.metric}
      </div>
      <div className='recipeInfoText'>
        {props.value}
      </div>
    </div>
  )
}

function CommaSeparate(array, index) {
  return array.map(function(val) {
    if (index) {
      return val[index];
    }
    return val;
  }).join(', ');
}

// Format minutes into a neat string displaying hours and minutes
function format_time(mins) {
  const hours = Math.floor(mins/60);
  const minutes = (mins % 60);
  return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
}

function Recipe() {
    let { id } = useParams();
    let recipe = recipes[id];
    
    // Redirect to home page, invalid recipe
    if (recipe == null) {
      return <Navigate to="../../" />
    }
    

    // Get recipe metrics
    const metrics = {
      ['TOTAL TIME']: format_time(recipe.instructions_minutes < 0 ? recipe.ready_in_minutes : recipe.instructions_minutes),
      ['SERVINGS']: recipe.servings,
      ['HEALTHINESS']: `${recipe.health_score}/100`,
      ['CALORIES']: `${Math.floor(recipe.nutrition.nutrients[0].amount)} ${recipe.nutrition.nutrients[0].unit}`,
      ['CUISINE']: CommaSeparate(recipe.cuisines),
      ['DISH']: CommaSeparate(recipe.dish_types),
    };

    const infoCells = [];
    for (const metric in metrics) {
      infoCells.push(<RecipeInfoCell metric={metric.toUpperCase()} value={metrics[metric]}/>)
    }

    // Get ingredient list items
    const ingredients = [];
    for (const ingredient of recipe.ingredients) {
      const ingredientStr = ingredient.amount + ' ' + ingredient.unit + ' ' + ingredient.name_clean;
      ingredients.push(<li>{ingredientStr}</li>)
    }

    // Get instruction list items
    const instructions = [];
    for (const instruction of recipe.instructions) {
      instructions.push(<li>{instruction}</li>);
    }

    // Get nutrient table rows & nutrient data
    const nutrientRows = [];
    for (const nutrient of recipe.nutrition.nutrients) {
      nutrientRows.push(<tr>
        <td>{nutrient.percent_daily + '%'}</td>
        <td>{nutrient.name}</td>
        <td>{nutrient.amount + ' ' + nutrient.unit}</td>
      </tr>)
    }

    const relatedRestaurant = restaurants[id];
    const relatedCulture = cultures[id];

    return (
      <>
        <div className='cultureTopDownContainer' style={{width: '80%'}}>
          <div className='instanceTitle'>{recipe.name}</div>
          <div className='recipeImage' style={{backgroundImage: `url(${recipe.image})`}}></div>
          <div style={{paddingLeft: '50px', paddingRight: '50px'}}>
            <div className='headerFrame'>
              <div className='instanceSubTitle'>Recipe</div>
              <div className='recipeInfoList'>
                {infoCells}
              </div>
            </div>
          </div>
          <div className='instanceSubTitle'>Ingredients</div>
          <ul className='horizontalBulletList'>
            {ingredients}
          </ul>
          <div className='instanceSubTitle'>Preparation</div>
          <ul className='horizontalNumberList'>
            {instructions}
          </ul>
          <div className='instanceSubTitle'>Nutrition</div>
          <table className='recipeTable'>
            <tr>
              <th>% DV</th>
              <th>Nutrient</th>
              <th>Amount</th>
            </tr>
            {nutrientRows}
          </table>
          <div className='instanceSubTitle'>Restaurants serving {recipe.name}</div>
          <div className='scrollContainer'>
            <ModelListItem name={relatedRestaurant.name} image={relatedRestaurant.image_url} link={`/restaurants/${id}`} redirect={true}/>
          </div>
          <div className='instanceSubTitle'>Cultures related to {recipe.name}</div>
          <div className='scrollContainer'>
            <ModelListItem name={relatedCulture.name} image={relatedCulture.flags.png} link={`/cultures/${id}`} redirect={true}/>
          </div>
        </div>
      </>
    );
  }
  
  export default Recipe;
  