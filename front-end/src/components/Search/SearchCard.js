import { Card, CardContent, CardMedia, CardActionArea } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import "../../styles/Search.css";
import "../../styles/Models.css";
import Highlight from "../Highlight/Highlight";

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
    return (<Card className="whatever_search_card">
        <CardActionArea className="whatever_search_action" component={RouterLink} to={"/restaurants/" + props.data.id}>
            <CardContent>
                <p className="card-content-wrap"><strong><Highlight by={props.highlight}>{props.data.name}</Highlight></strong></p>
                <p className="cardContent"><strong>Text: </strong>
                <Highlight by={props.highlight}>{props.data.text}</Highlight></p>
            </CardContent>
        </CardActionArea>
    </Card>)
}


