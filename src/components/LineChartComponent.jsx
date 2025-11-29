// components/LineChartComponent.jsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: 'Jan', created: 30, solved: 25 },
  { month: 'Feb', created: 45, solved: 40 },
  { month: 'Mar', created: 50, solved: 45 },
  { month: 'Apr', created: 55, solved: 50 },
  { month: 'May', created: 68, solved: 60 },
  { month: 'Jun', created: 60, solved: 55 },
  { month: 'Jul', created: 70, solved: 65 },
];

const LineChartComponent = () => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
    <h3 className="mb-4 font-medium">Tickets Created vs Solved</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="month" stroke="#8884d8"/>
        <YAxis stroke="#8884d8"/>
        <Tooltip />
        <Line type="monotone" dataKey="created" stroke="#8884d8" strokeWidth={2} />
        <Line type="monotone" dataKey="solved" stroke="#82ca9d" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default LineChartComponent;
