import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const AreaChartForRatings = ({ data }) => {
  return (
    <>
      <AreaChart
        width={1250}
        height={430}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="id"
          label={{ value: "Contest ID", position: "insideBottom" }}
        />
        <YAxis
          label={{ value: "Ratings", angle: -90, position: "insideLeft" }}
        />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="rating"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </>
  );
};

export default AreaChartForRatings;
