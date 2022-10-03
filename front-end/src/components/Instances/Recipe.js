import React from 'react';
import Recipes from '../Models/Recipes';
import { useParams } from 'react-router-dom';
import './Instances.css'

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
    
    const metrics = {
      ['prep time']: '45 mins',
      ['servings']: '3 servings',
    }

    const infoCells = [];
    for (const metric in metrics) {
      infoCells.push(<RecipeInfoCell metric={metric.toUpperCase()} value={metrics[metric]}/>)
    }

    return (
      <>
        <div className='recipeTitle'>Fish Filet</div>
        <div className='recipeImage'></div>
        <div style={{paddingLeft: '50px', paddingRight: '50px'}}>
          <div className='headerFrame'>
            <div className='recipeSubtitle'>Recipe</div>
            <div className='recipeInfoList'>
              {infoCells}
            </div>
          </div>
        </div>
        <div className='recipeSubtitle'>Ingredients</div>
        <ul className='horizontalBulletList'>
          <li>2 Eggs</li>
          <li>1 Quart Milk</li>
          <li>2 Cups Flour</li>
        </ul>
        <div className='recipeSubtitle'>Preparation</div>
        <ul className='horizontalNumberList'>
          <li>Some super long and detailed step about preparing the ingredients for the dish</li>
          <li>1 Quart Milk</li>
        </ul>
        <div className='recipeSubtitle'>Nutrition</div>
        <table className='recipeTable'>
          <tr>
            <th>test</th>
            <th>test2</th>
            <th>test3</th>
          </tr>
          <tr>
            <td>testasdsads</td>
            <td>test</td>
            <td>test</td>
          </tr>
          <tr>
            <td>testasdsads</td>
            <td>test</td>
            <td>test</td>
          </tr>
          <tr>
            <td>testasdsads</td>
            <td>test</td>
            <td>test</td>
          </tr>
        </table>
      </>
    );
  }
  
  export default Recipe;
  