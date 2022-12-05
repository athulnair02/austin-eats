import { Box } from "@mui/material";
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
import LoadingWidget from "../Visualizations/LoadingWidget";

const barColors = ["#422b18", "#c63936", "#46551b", "#0dc331", "#9a7a75", "#0301de", "#9f7733", "#609c5b", "#b57241", "#f5f2cf", "#9d04cf", "#ecbc37"];

function ChampionshipsByState(props) {
    let [data, setData] = useState({});
    let API_URL = "https://api.low-ball.me/teams"
    useEffect(() => {
        const getData = async () => {
            let teamsResponse = await axios.get(API_URL);
            let teams = teamsResponse.data["data"];
            let data = process_data(teams);
            setData(data);
        }
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

const process_data = (teams) => {
    var ret = [];
    var state_wins = new Map();
    for (const team of teams) {
        let state = team["state"];
        let wins = team["championships"];
        let curr_wins = state_wins.get(state);
        if (curr_wins) {
            state_wins.set(state, curr_wins + wins);
        } else {
            state_wins.set(state, wins);
        }
    }
    console.log(state_wins);
    for (let [key, value] of state_wins) {
        ret.push({
            state: key,
            wins: value,
        });
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
            <XAxis dataKey="state" tick={false}>
                <Label
                value="Team State"
                position="insideBottom"
                dy={0}
                style={{textAnchor: "middle"}}/>
            </XAxis>
            <YAxis tick={true}>
                <Label
                angle={-90}
                value="Number of championships"
                position="insideLeft"
                dx={0}
                style={{ textAnchor: "middle" }}/>
            </YAxis>
            <Tooltip payload={data} formatter = {(value) => value && value.toLocaleString("en-US", {style:"decimal", maximumFractionDigits:"0"}) + " wins"} />
            <Bar dataKey="wins" fill="#ba6ebe">
                {
                    data.map((entry, index) => {
                        return <Cell key={`cell-${index}`} fill={barColors[index % 12]}/>;
                    })
                }
            </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default ChampionshipsByState;
