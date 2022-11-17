import React from 'react';
import cultures from '../../temp-backend/cultures.json';
import restaurants from '../../temp-backend/restaurants.json'
import recipes from '../../temp-backend/recipes.json'
import { Create_Restaurant_Cell, Create_Recipe_Cell, Get_Data } from '../../SharedFunctions';
import { Images, Container } from "react-bootstrap";
import { CommaSeparate } from '../../SharedFunctions';
import { useParams, Navigate } from 'react-router-dom';
import '../../styles/Instances.css'

function Culture(props) {
    let { id } = useParams();
    
    const [instanceData, setInstanceData] = React.useState([]);
    React.useEffect(() => {
      Get_Data('cultures', id).then(data => setInstanceData(data));
    }, [])

    // // Redirect to home page, invalid culture
    // if (culture == null) {
    //   return <Navigate to="../../" />
    // }

    
    let population = instanceData.population;
    let populationFormatted = population ? population.toLocaleString("en-US") : '';

    let languages = CommaSeparate(instanceData.languages);
    let currency = instanceData.currency;

    let regionalBlocs;
    if (instanceData.regional_blocs && instanceData.regional_blocs.length > 0) {
      regionalBlocs = CommaSeparate(instanceData.regional_blocs);
    } else {
      regionalBlocs = 'No regional blocs';
    }

    const related_restaurants = instanceData.restaurants ? instanceData.restaurants : [];
    const related_recipes = instanceData.recipes ? instanceData.recipes : [];

    // return (
    //   <>
    //     <div className='cultureWideContainer'>
    //       test
    //     </div>
    //   </>
    // )
    return (
      <>
        <div className='cultureTopDownContainer'>
          <div className='instanceTitle'>
            {instanceData.demonym} Culture
          </div>
          <div className='instanceSubTitle' style={{fontSize:`35px`}}>
            A closer look at {instanceData.name}
          </div>
          <div className='cultureContainer'>
            <div title={`Flag of ${instanceData.name}`} className='cultureFlag' style={{backgroundImage:`url(${instanceData.flag_url})`}}> </div>
            <div className='instanceText' style={{textAlign:'left'}}>
              <span className="tab"></span> {instanceData.summary}
            </div>
          </div>
          <div className='cultureContainer' style={{height:`200px`, display:`flex`, alignItems:'center', marginTop:'50px'}}>
            <iframe align="top" className='googleMap' src={`https://maps.google.com/maps?q=${instanceData.name}&output=embed`}></iframe>
          </div>
          <div className='instanceText'>
            The country's region is {instanceData.region}, specifically in {instanceData.subregion}.
          </div>
          <div className='instanceSubTitle' style={{fontSize:`35px`}}>
            Quick Facts
          </div>
          {/* <div className='cultureContainer'>
            <ul>
              <li className='instanceText' style={{textAlign:'left'}}>{culture.capital} is the capital city.</li>
              <li className='instanceText' style={{textAlign:'left'}}>{culture.name} has a population of roughly {populationFormatted} inhabitants.</li>
              <li className='instanceText' style={{textAlign:'left'}}>{culture.independent ? "The country is recognized as independent." : "The country is not independent."}</li>
              <li className='instanceText' style={{textAlign:'left'}}>The country's primary language{multipleLanguages ? "s are" : " is"} {languages}.</li>
              <li className='instanceText' style={{textAlign:'left'}}>The country's primary currenc{multipleCurrencies ? "ies are the" : "y is the"} {currencies}.</li>
            </ul>
          </div> */}
          <tbody align="center">
            <tr>
              <td className='tdLeft'>Capital City</td>
              <td>{instanceData.capital}</td>
            </tr>
            <tr>
              <td className='tdLeft'>Population</td>
              <td>Roughly {populationFormatted} inhabitants.</td>
            </tr>
            <tr>
              <td className='tdLeft'>Independence</td>
              <td>{instanceData.independent ? "The country is recognized as independent." : "The country is not independent."}</td>
            </tr>
            <tr>
              <td className='tdLeft'>Primary Languages</td>
              <td>{languages}</td>
            </tr>
            <tr>
              <td className='tdLeft'>Currency</td>
              <td>{currency}</td>
            </tr>
            <tr>
              <td className='tdLeft'>Regional Blocs</td>
              <td>{regionalBlocs == null ? "No regional blocs." : regionalBlocs}</td>
            </tr>
          </tbody>
          <div className='instanceSubTitle'>{instanceData.demonym} Restaurants</div>
          <ul className='scrollContainer'>
            {related_restaurants.map((restaurant) => <li>{Create_Restaurant_Cell(restaurant, `/restaurants/${restaurant.id}`)}</li>)}
          </ul>
          <div className='instanceSubTitle'>{instanceData.demonym} Recipes</div>
          <ul className='scrollContainer'>
            {related_recipes.map((recipe) => <li>{Create_Recipe_Cell(recipe, `/recipes/${recipe.id}`)}</li>)}
          </ul>
        </div>
      </>
    );
  }
  
  export default Culture;
  