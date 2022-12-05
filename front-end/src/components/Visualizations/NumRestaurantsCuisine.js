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
import Culture_Lookup from "./CultureLookup";

const barColors = ["#422b18", "#c63936", "#46551b", "#0dc331", "#9a7a75", "#0301de", "#9f7733", "#609c5b", "#b57241", "#f5f2cf", "#9d04cf", "#ecbc37"];

function NumRestaurantsCuisine(props) {
    let [data, setData] = useState({});
    let API_URL = "https://api.austineats.me/restaurants?per_page=100";

    useEffect(() => {
        const getData = async () => {
            let restaurantResponse = await axios.get(
                API_URL
            );
            let restaurants = restaurantResponse.data["relations"];
            console.log(restaurants);
            let data = process_data(restaurants);
            console.log(data);
            setData(data);
        };
        getData().then(() => console.log("data loaded"));
    }, [API_URL]);
    let visualization = <LoadingWidget height="300px"/>;
    if (data.length > 0) visualization = bar_chart(data);
    return (
        <Box display="flex" justifyContent="center">
            {visualization}
        </Box>
    );
};

const process_data = (restaurants) => {
    var ret = [];
    var rest_categories = new Map();
    // rest_categories = {Category: Num Restaurants, "Korean" : 10, "Sports Bars" : 2, ...}
    for (const restaurant of restaurants) {
        let category = restaurant["categories"]; // should be a list of cats, each cat should be in map
        for (const cat of category) {
            let num_rests = rest_categories.get(cat);
            if (num_rests) {
                rest_categories.set(cat, num_rests++);
            } else {
                rest_categories.set(cat, 1);
            }
        }
    }
    // convert restaurant categories to countries with lookup table
    var rest_cultures = new Map();
    for (let [key, value] of rest_categories) {
        let lookup = Culture_Lookup[key];
        if (lookup) {
            for (const c of lookup) {
                let curr = rest_cultures.get(c);
                // rest_cultures.set(c, curr + value);
                if (curr) {
                    rest_cultures.set(c, curr + value);
                } else {
                    rest_cultures.set(c, value); // doesn't work
                }
            }
        }
    }
    for (let [key, value] of rest_cultures) { 
        ret.push({
            category: key,
            num: value,
        })
    }
    return ret;
};

const bar_chart = (data) => {
    return(
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
            <XAxis dataKey="category" tick={false}>
                <Label
                value="Restaurant Type"
                position="insideBottom"
                dy={0}
                style={{textAnchor: "middle"}}/>
            </XAxis>
            <YAxis tick={true}>
                <Label
                angle={-90}
                value="Number of restaurants"
                position="insideLeft"
                dx={0}
                style={{ textAnchor: "middle" }}/>
            </YAxis>
            <Tooltip payload={data} formatter = {(value) => value && value.toLocaleString("en-US", {style:"decimal", maximumFractionDigits:"0"}) + " restaurants"} />
            <Bar dataKey="num" fill="#ba6ebe">
                {
                    data.map((entry, index) => {
                        return <Cell key={`cell-${index}`} fill={barColors[index % 12]}/>;
                    })
                }
            </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
};

export default NumRestaurantsCuisine;