// Just a file containing shared helper functions to clean up code and stop copy-pasting
import React from "react";
import ModelListItem from "./components/Models/sub_components/ModelListItem";
import haversine from 'haversine-distance';

// Separate array into string with each element separated by a comma
export function CommaSeparate(array, index) {
    if (!array) return null;
    return array.map(function(val) {
        if (index) {
        return val[index];
        }
        return val;
    }).join(', ');
}

// Format minutes into a neat string displaying hours and minutes
export function Format_Time(mins) {
  const hours = Math.floor(mins/60);
  const minutes = (mins % 60);
  return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
}

export function Get_User_Coordinates() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => resolve(position.coords),
            error => reject(error)
        )
    })
}

// // Get distance to restaurant in miles (note: will return failure case of -1 if user rejects usage of their location)
// export async function Get_Distance_To_Restaurant(restaurant) {
//     if (!("geolocation" in navigator)) return -1; // Unable to get user location

//     try {
//         const METERS_IN_MILE = 1609.34;
//         const userPosition = await Get_User_Coordinates();
//         return haversine(userPosition.coords, restaurant.coordinates)/METERS_IN_MILE;
//     } catch(err) {
//         console.log(err);
//     }

//     return -1;
// }

// export function Get_Distance_To_Restaurant(userCoords, restaurant) {
//     if (!("geolocation" in navigator)) return -1;

//     const METERS_IN_MILE = 1609.34;
//     return (haversine(userCoords, restaurant.coordinates))/METERS_IN_MILE;
// }

// Fetch model/instance data from api
export async function Get_Data(model, id) {
    let URL = "http://127.0.0.1:5000/api/" + model; //"https://api.austineats.me/" + model;
    if (id != null) {
        URL += ("/" + id);
    }
    const response = await fetch(URL);
    const json = await response.json();
    return json;
}

export function Create_Restaurant_Cell(restaurant, link, style) {
    const badges = {
        [restaurant.open_now ? 'Open' : 'Closed']: {
            backgroundColor: restaurant.open_now ? '#5fe368' : '#f26b6b',
        },
        ['⭐ ' + restaurant.rating]: {
            backgroundColor: '#f0de59',
        },
    }
    if (restaurant.price) {
        badges[restaurant.price] = {
            backgroundColor: '#d4d4d4',
        }
    }

    const attributes = [restaurant.review_count + ' reviews'];
    if (restaurant.distance) attributes.push(restaurant.distance + ' miles');

    return <ModelListItem name={restaurant.highlightedName || restaurant.name} image={restaurant.image_url} link={link} style={style}
        attributes={attributes}
        badges = {
            badges
    }/>
}

export function Create_Recipe_Cell(recipe, link, style) {
    const formattedTotalTime = Format_Time(recipe.ready_in_minutes);
    const badges = {}
    if (recipe.cuisine_type) {
        for (const cuisine of recipe.cuisine_type) {
            badges['🌎 ' + cuisine] = {
                backgroundColor: '#8bdae8'
            }
        }
    }
    badges['🕒 ' + formattedTotalTime] = {
        backgroundColor: '#cccccc'
    }

    const attributes = [];
    if (recipe.dish_types.length > 0) attributes.push(CommaSeparate(recipe.dish_types)); // Dish type is not specified in all
    attributes.push(`${recipe.health_score}/100 healthiness`);
    if (recipe.num_ingredients) attributes.push(recipe.num_ingredients + " ingredients");

    return <ModelListItem name={recipe.highlightedName || recipe.name} image={recipe.image_url} link={link} style={style}
        attributes={attributes}
        badges = {
            badges
    }/>
}

export function Create_Culture_Cell(culture, link, style) {
    const badges = {}
    if (culture.region) {
        badges['🌎 ' + culture.region] = {
            backgroundColor: '#8bdae8'
        }
    }
    if (culture.languages) {
        for (const language of culture.languages) {
            badges[language] = {
                backgroundColor: '#cccccc'
            }
        }
    }

    return <ModelListItem name={culture.highlightedName || culture.name} image={culture.flag_url} link={link} style={style}
        attributes={[
            culture.subregion,
            culture.population ? culture.population.toLocaleString("en-US") + ' inhabitants' : '',
            culture.independent ? 'Independent' : 'Not independent',
        ]}
        badges = {
            badges
    }/>
}