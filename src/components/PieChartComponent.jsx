// components/PieChartComponent.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const pieData = [
  { name: "Sales", value: 25 },
  { name: "Setup", value: 12 },
  { name: "Bug", value: 19 },
  { name: "Features", value: 44 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PieChartComponent = () => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
    <h3 className="mb-4 font-medium">Tickets by Type</h3>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} fill="#8884d8" label>
          {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default PieChartComponent;
