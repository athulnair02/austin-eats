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

function SalaryByPos(props) {
    let [data, setData] = useState({});
    let API_URL = "https://api.low-ball.me/players"
    useEffect(() => {
        const getData = async () => {
            let playersResponse = await axios.get(API_URL);
            let players = playersResponse.data["data"];
            let data = process_data(players);
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

const process_data = (players) => {
    var ret = [];
    var pos_salaries = new Map();
    for (const player of players) {
        var pos = player["pos"];
        var salary = player["salary_int"];
        var pos_salary = pos_salaries.get(pos);
        if (pos_salary) {
            pos_salary.push(salary);
        } else {
            var salaries = [];
            salaries.push(salary);
            pos_salaries.set(pos, salaries);
        }
    }
    console.log(pos_salaries);
    for (let [key, value] of pos_salaries) {
        value.sort();
        ret.push({
            pos: key,
            salary: value.reduce((a, b) => a + b, 0) / value.length,
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
            <XAxis dataKey="pos" tick={false}>
                <Label
                value="Position"
                position="insideBottom"
                dy={0}
                style={{textAnchor: "middle"}}/>
            </XAxis>
            <YAxis tick={false}>
                <Label
                angle={-90}
                value="Average salary in USD"
                position="insideLeft"
                dx={0}
                style={{ textAnchor: "middle" }}/>
            </YAxis>
            <Tooltip payload={data} formatter = {(value) => value && value.toLocaleString("en-US", {style:"currency", currency:"USD"})} />
            <Bar dataKey="salary" fill="#ba6ebe">
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

export default SalaryByPos;
