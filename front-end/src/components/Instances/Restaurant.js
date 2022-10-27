import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import restaurants from '../../temp-backend/restaurants.json';
import recipes from '../../temp-backend/recipes.json'
import cultures from '../../temp-backend/cultures.json'
import { Create_Recipe_Cell, Create_Culture_Cell } from '../../SharedFunctions';
import { CommaSeparate } from '../../SharedFunctions';
import '../../styles/Instances.css'

function Restaurant(props) {
    let { id } = useParams();
    let restaurant = restaurants[id];

    // redirect to home page, invalid culture
    if(restaurant == null) {
      return <Navigate to="../../" />
    }

    let name = restaurant.name;
    let rating = restaurant.rating;
    let phoneNumber = restaurant.display_phone;
    let price = restaurant.price;
    let coordinates = restaurant.latlng;
    let address = restaurant.location.display_address;
    let categories = CommaSeparate(restaurant.categories, "title");
    let open = restaurant.is_closed ? "closed" : "open";
  
    console.log(restaurant);
    
    const relatedRecipe = recipes[id];
    const relatedCulture = cultures[id];

    return (
      <>
        <div className='cultureTopDownContainer'>
          <div className='instanceTitle'> {name} </div>
          <div className='instanceSubTitle' style={{fontSize:`35px`}}>
            A closer look at {name}
          </div>
          <div> <img src={restaurant.image_url} alt="restaurant image"/> </div>
          <div className='cultureContainer' style={{height:`200px`, display:`flex`, alignItems:'center', marginTop:'50px'}}>
            <iframe align="top" className='googleMap' src={`https://maps.google.com/maps?q=${restaurant.name}&output=embed`}></iframe>
          </div>
          <div className='instanceText'>
            The categories of this restaurant are: {categories}.
          </div>
          <div className='instanceSubTitle' style={{fontSize:`35px`}}>
            Quick Facts
          </div>
          <tbody align="center">
            <tr>
              <td className='tdLeft'>Address</td>
              <td>{address}</td>
            </tr>
            <tr>
              <td className='tdLeft'>Price</td>
              <td>{price}</td>
            </tr>
            <tr>
              <td className='tdLeft'>Rating</td>
              <td>{rating}</td>
            </tr>
            <tr>
              <td className='tdLeft'>Number of reviews</td>
              <td>{restaurant.review_count}</td>
            </tr>
            <tr>
              <td className='tdLeft'>Contact info</td>
              <td>{phoneNumber}</td>
            </tr>
            <tr>
              <td className='tdLeft'>Distance</td>
              <td>{restaurant.distance}</td>
            </tr>
            <tr>
              <td className='tdLeft'>Open?</td>
              <td>{open}</td>
            </tr>
          </tbody>
          <div className='instanceSubTitle'>Recipes similar to {restaurant.name}</div>
          <ul className='scrollContainer'>
            <li>{Create_Recipe_Cell(relatedRecipe, `/recipes/${id}`)}</li>
          </ul>
          <div className='instanceSubTitle'>Cultures related to {restaurant.name}</div>
          <ul className='scrollContainer'>
            <li>{Create_Culture_Cell(relatedCulture, `/cultures/${id}`)}</li>
          </ul>
        </div>
      </>
    );
  }
  
  export default Restaurant;
  