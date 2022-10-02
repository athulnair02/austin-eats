import React from 'react';
import Recipes from '../Models/Recipes';
import { useParams } from 'react-router-dom';
//import './Instances.css'

function Recipe() {
    let { id } = useParams();
    
    return (
      <div className="recipe">Recipe</div>
    );
  }
  
  export default Recipe;
  