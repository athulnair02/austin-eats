import { useEffect, useState, useCallback } from "react";
import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { Get_Data } from "../../SharedFunctions";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        fill,
        payload,
        percent,
        value
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
        <g>
        <Sector
            cx={cx}
            cy={cy}
            isAnimationActive={true}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
        />
        <Sector
            cx={cx}
            cy={cy}
            isAnimationActive={true}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={outerRadius + 6}
            outerRadius={outerRadius + 10}
            fill={fill}
        />
        <path
            d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
            stroke={fill}
            fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
            x={ex + (cos >= 0 ? 1 : -1) * 12}
            y={ey}
            textAnchor={textAnchor}
            fill="#333"
        >{payload.name}</text>
        <text
            x={ex + (cos >= 0 ? 1 : -1) * 12}
            y={ey}
            dy={18}
            textAnchor={textAnchor}
            fill="#999"
        >
            {value + ' restaurants'}
        </text>
        <text
            x={ex + (cos >= 0 ? 1 : -1) * 12}
            y={ey}
            dy={36}
            textAnchor={textAnchor}
            fill="#999"
        >
            {`${(percent * 100).toFixed(2)}%`}
        </text>
        </g>
    );
};

function RestaurantPrices() {
    let [data, setData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        Get_Data('restaurants').then(data => {
            const pieData = Array.from(Array(4).keys(), x => {
                    return {
                        name: '$'.repeat(x+1),
                        value: 0,
                    }
                }
            );
            for (const restaurant of data.relations) {
                if (restaurant.price) {
                    pieData[restaurant.price.length - 1].value += 1;
                }
            }
            setData(pieData);
        });
    }, []);
    
    const onPieEnter = useCallback((_, index) => {
        setActiveIndex(index);
    }, [setActiveIndex]);

    return (
        <div style={{width: 'fitContent', height: 'fitContent', margin: 'auto'}}>
            <PieChart width={650} height={400}>
                <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={data}
                    cx={325}
                    cy={200}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </div>
    );
}

export default RestaurantPrices;