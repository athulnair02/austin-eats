import "../../styles/Search.css";
import "../../styles/Models.css";
import Highlight from "../Highlight/Highlight";
import { Create_Restaurant_Cell, Create_Recipe_Cell, Create_Culture_Cell } from "../../SharedFunctions";

export default function SearchCard(props) {
    if(props.model === "restaurants"){
        return <RestaurantSCard data={props.data} highlight={props.highlight}/>
    } else if (props.model === "recipes"){
        return <RecipeSCard data={props.data} highlight={props.highlight}/>
    } else {
        return <CultureSCard data={props.data} highlight={props.highlight}/>
    }
}

function RestaurantSCard (props) {
    return (Create_Restaurant_Cell(props.data.id, props.data.link));
}

function RecipeSCard (props) {
    return (Create_Recipe_Cell(props.data.id, props.data.link));
}

function CultureSCard (props) {
    return (Create_Culture_Cell(props.data.id, props.data.link));
}


