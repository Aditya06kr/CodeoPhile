import React from "react";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#8884d8",
  "#8dd1e1",
  "#82ca9d",
  "#a4de6c",
  "#d0ed57",
  "#ffc658",
  "#ff9f89",
  "#a2d2ff",
  "#f6d6ad",
  "#f7c6d8",
  "#bde0fe",
  "#caffbf",
  "#ffd6a5",
  "#ffadad",
  "#ffec99",
  "#d4a5a5",
  "#a5a58d",
  "#f4a261",
];

const PieChartForTags = ({ data }) => {
  return (
      <PieChart width={1000} height={500}>
        <Pie
          dataKey="value"
          isAnimationActive={true}
          data={data}
          cx={200}
          cy={200}
          outerRadius={150}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          layout="vertical"
            align="right"
          verticalAlign="middle"
          wrapperStyle={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
          content={(props) => {
            const { payload } = props;
            const half = Math.ceil(payload.length / 2);
            const firstHalf = payload.slice(0, half);
            const secondHalf = payload.slice(half);

            return (
              <div style={{ display: "flex" }}>
                <div style={{ marginRight: 20 }}>
                  {firstHalf.map((entry, index) => (
                    <div key={`item-${index}`} style={{ marginBottom: 4 }}>
                      <span style={{ color: entry.color }}>{entry.value}</span>
                    </div>
                  ))}
                </div>
                <div>
                  {secondHalf.map((entry, index) => (
                    <div key={`item-${index}`} style={{ marginBottom: 4 }}>
                      <span style={{ color: entry.color }}>{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }}
        />
      </PieChart>
  );
};

export default PieChartForTags;
