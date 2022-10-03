import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import restaurants from '../../temp-backend/restaurants.json';
import './Instances.css'

function CommaSeparate(array, index) {
  return array.map(function(val) {
    if (index) {
      return val[index];
    }
    return val;
  }).join(', ');
}

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
    
    return (
      <>
        <div className='cultureTopDownContainer'>
          <div className='instanceTitle'> Restaurant </div>
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
        </div>
      </>
    );
  }
  
  export default Restaurant;
  