// Just a file containing shared helper functions to clean up code and stop copy-pasting
import ModelListItem from "./components/Models/sub_components/ModelListItem";

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

export function Create_Restaurant_Cell(restaurant, link) {
    return <ModelListItem name={restaurant.name} image={restaurant.image_url} link={link}
    attributes={[
        0 + ' miles',
        restaurant.review_count + ' reviews',
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

export function Create_Recipe_Cell(recipe, link) {
    const formattedTotalTime = Format_Time(recipe.instructions_minutes < 0 ? recipe.ready_in_minutes : recipe.instructions_minutes)
    const badges = {}
    for (const cuisine of recipe.cuisines) {
        badges['🌎 ' + cuisine] = {
            backgroundColor: '#8bdae8'
        }
    }
    badges['🕒 ' + formattedTotalTime] = {
        backgroundColor: '#cccccc'
    }

    return <ModelListItem name={recipe.name} image={recipe.image} link={link}
    attributes={[
        CommaSeparate(recipe.dish_types),
        `${recipe.health_score}/100 healthiness`,
        recipe.ingredients.length + " ingredients",
    ]}
    badges = {
        badges
    }/>
}

export function Create_Culture_Cell(culture, link) {
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

    return <ModelListItem name={culture.name} image={culture.flags.png} link={link}
    attributes={[
        culture.subregion,
        culture.population.toLocaleString("en-US") + ' inhabitants',
        culture.independent ? 'Independent' : 'Not independent',
    ]}
    badges = {
        badges
    }/>
}