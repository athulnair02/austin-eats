import React from 'react';
import Recipes from '../Models/Recipes';
import recipes from '../../temp-backend/recipes.json'
import restaurants from '../../temp-backend/restaurants.json'
import cultures from '../../temp-backend/cultures.json'
import { Create_Restaurant_Cell, Create_Culture_Cell, Get_Data } from '../../SharedFunctions';
import { CommaSeparate, Format_Time } from '../../SharedFunctions';
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

function Recipe() {
    let { id } = useParams();
    
    const [instanceData, setInstanceData] = React.useState([]);
    React.useEffect(() => {
      Get_Data('recipes', id).then(data => setInstanceData(data));
    }, [])

    // // Redirect to home page, invalid recipe
    // if (recipe == null) {
    //   return <Navigate to="../../" />
    // }
    

    // Get recipe metrics
    const metrics = {
      'TOTAL TIME': Format_Time(instanceData.ready_in_minutes),
      'SERVINGS': instanceData.servings,
      //'HEALTHINESS': `${recipe.health_score}/100`,
      'CALORIES': instanceData.total_nutrients ? `${Math.floor(instanceData.total_nutrients[0].amount)} ${instanceData.total_nutrients[0].unit}` : '',
      'CUISINE': instanceData.cultures ? CommaSeparate([instanceData.cultures[0].demonym]) : '',
      'DISH': CommaSeparate(instanceData.dish_types),
    };

    const infoCells = [];
    for (const metric in metrics) {
      infoCells.push(<RecipeInfoCell metric={metric.toUpperCase()} value={metrics[metric]}/>)
    }

    // Get ingredient list items
    const ingredients = [];
    if (instanceData.ingredients) {
      for (const ingredient of instanceData.ingredients) {
        ingredients.push(<li>{ingredient}</li>)
      }
    }

    // Get instruction list items
    const instructions = [];
    if (instanceData.instructions) {
      for (const instruction of instanceData.instructions) {
        instructions.push(<li>{instruction}</li>);
      }
    }

    // Get nutrient table rows & nutrient data
    const nutrientRows = [];
    if (instanceData.total_nutrients) {
      for (const nutrient of instanceData.total_nutrients) {
        nutrientRows.push(<tr>
          <td>{nutrient.percentOfDailyNeeds + '%'}</td>
          <td>{nutrient.name}</td>
          <td>{nutrient.amount + ' ' + nutrient.unit}</td>
        </tr>)
      }
    }

    const related_restaurants = instanceData.restaurants ? instanceData.restaurants : [];
    const related_cultures = instanceData.cultures ? instanceData.cultures : [];

    return (
      <>
        <div className='cultureTopDownContainer' style={{width: '80%'}}>
          <div className='instanceTitle'>{instanceData.name}</div>
          <div className='recipeImage' style={{backgroundImage: `url(${instanceData.image_url})`}}></div>
          <div style={{marginLeft: '50px', marginRight: '50px'}}>
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
          <div className='instanceSubTitle'>Restaurants serving {instanceData.name}</div>
          <ul className='scrollContainer'>
            {related_restaurants.map((restaurant) => <li>{Create_Restaurant_Cell(restaurant, `/restaurants/${restaurant.id}`)}</li>)}
          </ul>
          <div className='instanceSubTitle'>Cultures related to {instanceData.name}</div>
          <ul className='scrollContainer'>
            {related_cultures.map((culture) => <li>{Create_Culture_Cell(culture, `/cultures/${id}`)}</li>)}
          </ul>
        </div>
      </>
    );
  }
  
  export default Recipe;
  