import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import restaurants from '../../temp-backend/restaurants.json';
import recipes from '../../temp-backend/recipes.json'
import cultures from '../../temp-backend/cultures.json'
import { Create_Recipe_Cell, Create_Culture_Cell, Get_Data } from '../../SharedFunctions';
import { CommaSeparate } from '../../SharedFunctions';
import '../../styles/Instances.css'

function Restaurant(props) {
    let { id } = useParams();

    const [instanceData, setInstanceData] = React.useState([]);
    React.useEffect(() => {
      Get_Data('restaurants', id).then(data => setInstanceData(data));
    }, [])

    // // redirect to home page, invalid culture
    // if(restaurant == null) {
    //   return <Navigate to="../../" />
    // }

    let name = instanceData.name;
    let rating = instanceData.rating;
    let phoneNumber = instanceData.display_phone;
    let price = instanceData.price;
    let coordinates = instanceData.latlng;
    let address = instanceData.display_address;
    let categories = CommaSeparate(instanceData.categories, "title");
    let open = instanceData.is_closed ? "closed" : "open";
    
    const related_recipes = instanceData.recipes ? instanceData.recipes : [];
    const related_cultures = instanceData.cultures ? instanceData.cultures : [];

    return (
      <>
        <div className='cultureTopDownContainer'>
          <div className='instanceTitle'> {name} </div>
          <div className='instanceSubTitle' style={{fontSize:`35px`}}>
            A closer look at {name}
          </div>
          <div> <img src={instanceData.image_url} alt="restaurant image"/> </div>
          <div className='cultureContainer' style={{height:`200px`, display:`flex`, alignItems:'center', marginTop:'50px'}}>
            <iframe align="top" className='googleMap' src={`https://maps.google.com/maps?q=${instanceData.name}&output=embed`}></iframe>
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
              <td>{instanceData.review_count}</td>
            </tr>
            <tr>
              <td className='tdLeft'>Contact info</td>
              <td>{phoneNumber}</td>
            </tr>
            <tr>
              <td className='tdLeft'>Distance</td>
              <td>{0 + ' miles'}</td>
            </tr>
            <tr>
              <td className='tdLeft'>Open?</td>
              <td>{open}</td>
            </tr>
          </tbody>
          <div className='instanceSubTitle'>Recipes similar to {instanceData.name}</div>
          <ul className='scrollContainer'>
            {related_recipes.map((recipe) => <li>{Create_Recipe_Cell(recipe, `/recipes/${recipe.id}`)}</li>)}
          </ul>
          <div className='instanceSubTitle'>Cultures related to {instanceData.name}</div>
          <ul className='scrollContainer'>
            {related_cultures.map((culture) => <li>{Create_Culture_Cell(culture, `/cultures/${id}`)}</li>)}
          </ul>
        </div>
      </>
    );
  }
  
  export default Restaurant;
  