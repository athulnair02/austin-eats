import "../../styles/Search.css";
import "../../styles/Models.css";
import Highlight from "../Highlight/Highlight";
import React from 'react';
import { Create_Restaurant_Cell, Create_Recipe_Cell, Create_Culture_Cell, Get_Data } from "../../SharedFunctions";

export default function SearchCard(props) {

    const [modelData, setModelData] = React.useState([]);

    React.useEffect(() => {
        if (props.model === "restaurants") {
            Get_Data('restaurants').then(data => setModelData(data));
        } else if (props.model === "recipes") {
            Get_Data('recipes').then(data => setModelData(data));
        } else if (props.model === "cultures") {
            Get_Data('cultures').then(data => setModelData(data));
        }
    }, [props.model])
    
    const data = React.useMemo(() => {
        const t = [];
        for (const [i, model] of Object.entries(modelData)) {
          t.push({
            id: model.id,
            name: model.name,
          });
        }
        return t;
      }, [modelData])

    if(props.model === "restaurants"){
        return <RestaurantSCard modelData={modelData} data={data} highlight={props.highlight}/>
    } else if (props.model === "recipes"){
        return <RecipeSCard modelData={modelData} data={data} highlight={props.highlight}/>
    } else {
        return <CultureSCard modelData={modelData} data={data} highlight={props.highlight}/>
    }
}

function RestaurantSCard (props) {
    return (Create_Restaurant_Cell(props.modelData[props.data.t.id], props.data.t.id));
}

function RecipeSCard (props) {
    return (Create_Recipe_Cell(props.modelData[props.data.t.id], props.data.t.id));
}

function CultureSCard (props) {
    return (Create_Culture_Cell(props.modelData[props.data.t.id], props.data.t.id));
}


