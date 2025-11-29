// components/BarChartComponent.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const barData = [
  { day: 'Mon', tickets: 40 },
  { day: 'Tue', tickets: 20 },
  { day: 'Wed', tickets: 50 },
  { day: 'Thu', tickets: 30 },
  { day: 'Fri', tickets: 70 },
  { day: 'Sat', tickets: 40 },
];

const BarChartComponent = () => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
    <h3 className="mb-4 font-medium">Tickets / Week Day</h3>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={barData}>
        <XAxis dataKey="day" stroke="#8884d8"/>
        <YAxis stroke="#8884d8"/>
        <Tooltip />
        <Bar dataKey="tickets" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default BarChartComponent;
