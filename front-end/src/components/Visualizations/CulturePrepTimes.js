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
  Tooltip,
  Cell
} from "recharts";
import { Box } from "@mui/material";
import LoadingWidget from "./LoadingWidget";

const barColors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#a83256", "#a89832"]

function CulturePrepTimes(props) {
    let [data, setData] = useState({});
    let API_URL = "https://api.austineats.me/recipes?per_page=260";

    useEffect(() => {
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
    // cultures = {Culture: Prep Time, "American" : [20, 40, 200], ...}
    for (const recipe of recipes) {
        var culture = recipe["cuisine_type"][0];
        var prep_time = recipe["ready_in_minutes"];
        var culture_prep_times = cultures.get(culture); // this should be the list of prep times for that culture
        if (culture_prep_times) {
            culture_prep_times.push(prep_time);
        } else {    
            // empty; create new list
            var prep_times = [];
            prep_times.push(prep_time);
            cultures.set(culture, prep_times);
        }
    }
    // console.log(cultures);
    // now have to get all the averages and push into ret
    for (let [key, value] of cultures) {
        ret.push({
            culture: key,
            time: value.reduce((a, b) => a + b, 0) / value.length,
        })
    }
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
                bottom: 15,
            }}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="culture" tick={false}>
                <Label
                value="Cultures"
                position="insideBottom"
                dy={15}
                style={{textAnchor: "middle"}}/>
            </XAxis>
            <YAxis tick={true}>
                <Label
                angle={-90}
                value="Average prep time in minutes"
                position="insideLeft"
                dx={0}
                style={{ textAnchor: "middle" }}
                />
            </YAxis>
            <Tooltip payload={data} formatter = {(value) => value && value.toLocaleString("en-US", {style:"decimal", maximumFractionDigits:"0"}) + " mins"} />
            <Bar dataKey="time" fill="#ba6ebe">
                {
                    data.map((entry, index) => {
                        return <Cell key={`cell-${index}`} fill={barColors[index % 5]}/>;
                    })
                }
            </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default CulturePrepTimes;