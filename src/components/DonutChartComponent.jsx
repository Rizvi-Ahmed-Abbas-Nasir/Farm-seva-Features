// components/DonutChartComponent.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const donutData = [
  { name: "New Tickets", value: 38.2 },
  { name: "Returned Tickets", value: 62.8 },
];

const DONUT_COLORS = ["#FF69B4", "#6a0dad"];

const DonutChartComponent = () => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
    <h3 className="mb-4 font-medium">New vs Returned Tickets</h3>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={donutData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {donutData.map((entry, index) => <Cell key={index} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default DonutChartComponent;
