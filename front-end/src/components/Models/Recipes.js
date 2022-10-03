import React from 'react';
import { Badge } from 'react-bootstrap';
import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom';
import './Models.css'

function RecipeListItem(props) {
  const location = useLocation();
  console.log(location);

  // <Badge style={{backgroundColor: '#c990f0', color: 'black'}} bg=''>🐟 Seafood</Badge>{' '}
  return (
    <div className='modelListItem'>
      <div className='modelListImage'></div>
      <div className='modalListBadges'>
        <Badge style={{backgroundColor: '#f58c8c', color: 'black'}} bg=''>🌎 American</Badge>{' '}
        <Badge style={{backgroundColor: '#ffaa2b', color: 'black'}} bg=''> 🔥 Spicy</Badge>{' '}
        <Badge style={{backgroundColor: '#cccccc', color: 'black'}} bg=''> ⌛ Quick</Badge>{' '}
      </div>
      <div className='modelListHeader'>{props.name}</div>
      <Link to={location.pathname + '/' + props.link}>
        <button className='modelListButton'></button>
      </Link>
    </div>
  )
}

function Recipes() {
    const recipes = Array(5).fill('Fish Filet');

    const recipeElements = recipes.map((item, index) => 
      <RecipeListItem name={item} link={index} />
    )

    return (
      <>
        <div className='recipesTitle'>Recipes</div>
        <div className='recipesList'>{recipeElements}</div>
      </>
    );
  }
  
  export default Recipes;
  