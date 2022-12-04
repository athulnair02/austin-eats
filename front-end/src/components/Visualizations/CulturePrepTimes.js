import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Label,
} from "recharts";
import { Box } from "@mui/material";
import LoadingWidget from "./LoadingWidget";

// i think we need to somehow grab all the cultures first; put them in a dictionary

function CulturePrepTimes(props) {
    let [data, setData] = useState({});
    let API_URL = "https://api.austineats.me/recipes?per_page=260";

    useEffect(() => {
        // if (data.length === 0) {
        //     const getData = async () => {
        //         let recipeResponse = await axios.get(
        //             "https://api.austineats.me/recipes?per_page=260"
        //         );
        //         let recipes = recipeResponse.data["relations"];
        //         console.log(recipes);
        //         let data = process_data(recipes);
        //         console.log(data);
        //         setData(data);
        //     };
        //     getData().then(() => console.log("data loaded"));
        // }
        const getData = async () => {
            let recipeResponse = await axios.get(
                "https://api.austineats.me/recipes?per_page=260"
            );
            let recipes = recipeResponse.data["relations"];
            console.log(recipes);
            let data = process_data(recipes);
            console.log(data);
            setData(data);
        };
        getData().then(() => console.log("data loaded"));
    }, [API_URL, data]);
    let visualization = <LoadingWidget height="300px"/>;
    if (data.length > 0) visualization = bar_chart(data);
    return (
        <Box display="flex" justifyContent="center">
            {visualization}
        </Box>
    );
}

const process_data = (recipes) => {
    var ret = [];
    var cultures = new Map();
    for (const recipe of recipes) {
        ret.push({
            // i dont think this works well
            culture: recipe["cuisine_type"][0],
            time: recipe["ready_in_minutes"],
            name: recipe["name"],
        });
    }
    // for (const recipe of recipes) {
    //     var culture = recipe["cuisine_type"][0];
    //     // culture_prep_times = {culture : list of recipe_times, "American" : [20, 40, 200]}
    //     var culture_prep_times = cultures.get(culture);
    //     if (culture_prep_times.length > 0) {

    //     } else {
    //         const recipe_time = recipe["ready_in_minutes"];
    //         var prep_times = 
    //         culture_prep_times.set()
    //     }
    // }
    return ret;
};

const bar_chart = (data) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
            data = {data}
            margin={{
                top: 20,
                right: 30,
                left: 40,
                bottom: 5,
            }}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="culture" tick={true}>
                <Label
                value="Cultures"
                position="insideBottom"
                style={{textAnchor: "middle"}}/>
            </XAxis>
            <YAxis tick={false}>
                <Label
                angle={-90}
                value="Average prep time in minutes"
                position="insideLeft"
                style={{ textAnchor: "middle" }}
                />
            </YAxis>
            <Bar dataKey="time"/>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default CulturePrepTimes;