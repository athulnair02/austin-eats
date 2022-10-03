import React from 'react';
import cultures from '../../temp-backend/cultures.json';
import { Images, Container } from "react-bootstrap";
import { useParams, Navigate } from 'react-router-dom';
import './Instances.css'

function CommaSeparate(array, index) {
  return array.map(function(val) {
    if (index) {
      return val[index];
    }
    return val;
  }).join(', ');
}

function Culture(props) {
    let { id } = useParams();
    let culture = cultures[id];

    // Redirect to home page, invalid culture
    if (culture == null) {
      return <Navigate to="../../" />
    }

    
    let population = culture.population;
    let populationFormatted = population.toLocaleString("en-US");

    let multipleLanguages = Object.keys(culture.languages).length > 1
    let languages = CommaSeparate(culture.languages);

    let multipleCurrencies = Object.keys(culture.currencies).length > 1
    let currencies = CommaSeparate(culture.currencies, "name")

    let regionalBlocs = null
    if (culture.regional_blocs) {
      regionalBlocs = CommaSeparate(culture.regional_blocs, "name")
    }

    console.log(culture);
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
            {culture.demonym} Culture
          </div>
          <div className='instanceSubTitle' style={{fontSize:`35px`}}>
            A closer look at {culture.name}
          </div>
          <div className='cultureContainer'>
            <div title={`Flag of ${culture.name}`} className='cultureFlag' style={{backgroundImage:`url(${culture.flags.png})`}}> </div>
            <div className='instanceText' style={{textAlign:'left'}}>
              <span className="tab"></span> {culture.summary}
            </div>
          </div>
          <div className='cultureContainer' style={{height:`200px`, display:`flex`, alignItems:'center', marginTop:'50px'}}>
            <iframe align="top" className='googleMap' src={`https://maps.google.com/maps?q=${culture.name}&output=embed`}></iframe>
          </div>
          <div className='instanceText'>
            The country's region is {culture.region}, specifically in {culture.subregion}.
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
              <td>{culture.capital}</td>
            </tr>
            <tr>
              <td className='tdLeft'>Population</td>
              <td>Roughly {populationFormatted} inhabitants.</td>
            </tr>
            <tr>
              <td className='tdLeft'>Independence</td>
              <td>{culture.independent ? "The country is recognized as independent." : "The country is not independent."}</td>
            </tr>
            <tr>
              <td className='tdLeft'>Primary Languages</td>
              <td>{languages}</td>
            </tr>
            <tr>
              <td className='tdLeft'>Currencies</td>
              <td>{currencies}</td>
            </tr>
            <tr>
              <td className='tdLeft'>Regional Blocs</td>
              <td>{regionalBlocs == null ? "No regional blocs." : regionalBlocs}</td>
            </tr>
          </tbody>
        </div>
      </>
    );
  }
  
  export default Culture;
  