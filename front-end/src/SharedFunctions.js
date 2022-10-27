// Just a file containing shared helper functions to clean up code and stop copy-pasting
import React from "react";
import ModelListItem from "./components/Models/sub_components/ModelListItem";
import haversine from 'haversine-distance';

// Separate array into string with each element separated by a comma
export function CommaSeparate(array, index) {
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

export function Create_Restaurant_Cell(restaurant, link, style) {
    return <ModelListItem name={restaurant.name} image={restaurant.image_url} link={link} style={style}
    attributes={[
        restaurant.review_count + ' reviews',
        0 + ' miles', // todo: Actual value based off of user coordinates
    ]}
    badges = {{
        [!restaurant.is_closed ? 'Open' : 'Closed']: {
            backgroundColor: !restaurant.is_closed ? '#5fe368' : '#f26b6b',
        },
        ['⭐ ' + restaurant.rating]: {
            backgroundColor: '#f0de59',
        },
        [restaurant.price]: {
            backgroundColor: '#d4d4d4',
        },
    }}/>
}

export function Create_Recipe_Cell(recipe, link, style) {
    const formattedTotalTime = Format_Time(recipe.instructions_minutes < 0 ? recipe.ready_in_minutes : recipe.instructions_minutes)
    const badges = {}
    for (const cuisine of recipe.cuisines) { // todo: Change this to cuisine_type when backend is actually queried
        badges['🌎 ' + cuisine] = {
            backgroundColor: '#8bdae8'
        }
    }
    badges['🕒 ' + formattedTotalTime] = {
        backgroundColor: '#cccccc'
    }

    return <ModelListItem name={recipe.name} image={recipe.image} link={link} style={style}
    attributes={[
        CommaSeparate(recipe.dish_types),
        //`${recipe.health_score}/100 healthiness`, // todo: replace with another recipe attribute
        recipe.ingredients.length + " ingredients", // Only ingredient number is passed from PaginateTable
    ]}
    badges = {
        badges
    }/>
}

export function Create_Culture_Cell(culture, link, style) {
    const badges = {
        ['🌎 ' + culture.region]: {
            backgroundColor: '#8bdae8'
        }
    }
    if (culture.regional_blocs) {
        for (const bloc of culture.regional_blocs) {
            badges[bloc.acronym] = {
                backgroundColor: '#cccccc'
            }
        }
    }

    return <ModelListItem name={culture.name} image={culture.flags.png} link={link} style={style}
    attributes={[
        culture.subregion,
        culture.population.toLocaleString("en-US") + ' inhabitants',
        culture.independent ? 'Independent' : 'Not independent',
    ]}
    badges = {
        badges
    }/>
}